import {SymmetricKeyConfig} from './config/SymmetricKeyConfig'
import {WebCryptoConfig} from './config/WebCryptoConfig'
import {EncryptedObject} from './EncryptedObject'
import {InitializationVector} from './InitializationVector'

export class SymmetricKey {

   private cryptoKey: CryptoKey

   constructor (cryptoKey: CryptoKey) {
      this.cryptoKey = cryptoKey
   }

   public encrypt (arrayBuffer: ArrayBuffer): Promise<EncryptedObject> {
      let vector = InitializationVector.random()
      return window.crypto.subtle.encrypt(
         {name: this.cryptoKey.algorithm.name!, iv: vector.asArray()},
         this.cryptoKey,
         arrayBuffer)
         .then(encryptedData => {
            return new EncryptedObject(encryptedData, this.cryptoKey.algorithm, vector)
         }) as Promise<EncryptedObject>
   }

   public decrypt (decryptionParameters: any, content: ArrayBuffer): Promise<ArrayBuffer> {
      return window.crypto.subtle
         .decrypt(decryptionParameters, this.cryptoKey, content) as Promise<ArrayBuffer>
   }

   static random (config: SymmetricKeyConfig = WebCryptoConfig.DEFAULT.symmetricKeyConfig)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then((key) => {
            return new SymmetricKey(key as CryptoKey)
         }) as Promise<SymmetricKey>
   }
}
