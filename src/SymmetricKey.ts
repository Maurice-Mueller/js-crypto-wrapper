import {SymmetricKeyConfig} from './config/SymmetricKeyConfig'
import {WebCryptoConfig} from './config/WebCryptoConfig'
import {EncryptedObject} from './EncryptedObject'
import {InitializationVector} from './InitializationVector'
import {DeSerializeParameter, SerializedType, SimpleDeserialize, SimpleSerialize} from '@esentri/de-serializer'

export class SymmetricKey {

   private cryptoKey: CryptoKey

   constructor (cryptoKey: CryptoKey) {
      this.cryptoKey = cryptoKey
   }

   public encrypt (encryptee: any,
                   parameters: Array<DeSerializeParameter> = [DeSerializeParameter.WITH_FUNCTIONS])
      : Promise<EncryptedObject> {
      return SimpleSerialize(encryptee, parameters, SerializedType.ARRAY_BUFFER).then(encryptee => {
         let vector = InitializationVector.random()
         return window.crypto.subtle.encrypt(
            {name: this.cryptoKey.algorithm.name!, iv: vector.asArray()},
            this.cryptoKey,
            encryptee)
            .then(encryptedData => {
               return new EncryptedObject(encryptedData, this.cryptoKey.algorithm, vector)
            }) as Promise<EncryptedObject>
      })
   }

   public decrypt (decryptionParameters: any, content: ArrayBuffer, prototype: any = null)
      : Promise<any> {
      return window.crypto.subtle
         .decrypt(decryptionParameters, this.cryptoKey, content).then(decrypted => {
            if (prototype == null) return decrypted
            return SimpleDeserialize(decrypted, prototype, SerializedType.ARRAY_BUFFER)
         }) as Promise<any>
   }

   static random (config: SymmetricKeyConfig = WebCryptoConfig.DEFAULT.symmetricKeyConfig)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then((key) => {
            return new SymmetricKey(key as CryptoKey)
         }) as Promise<SymmetricKey>
   }
}
