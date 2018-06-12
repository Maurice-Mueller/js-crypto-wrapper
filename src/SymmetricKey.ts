import {SymmetricKeyConfig, SymmetricKeyConfigBuilder} from './config/SymmetricKeyConfig'
import {WebCryptoConfig} from './config/WebCryptoConfig'
import {EncryptedObject} from './EncryptedObject'
import {InitializationVector} from './InitializationVector'
import {DeSerializeParameter, DeSerializeParameterBuilder, SerializedType, SimpleDeserialize, SimpleSerialize} from '@esentri/de-serializer'
import {ArrayBufferToBase64, Base64ToArrayBuffer} from '@esentri/transformer-functions'

export class SymmetricKey {

   private cryptoKey: CryptoKey

   constructor (cryptoKey: CryptoKey) {
      this.cryptoKey = cryptoKey
   }

   public encrypt (encryptee: any,
                   vector: InitializationVector = InitializationVector.random(),
                   parameters: DeSerializeParameter = new DeSerializeParameterBuilder()
                      .withFunctions(true)
                      .serializedType(SerializedType.ARRAY_BUFFER)
                      .build())
      : Promise<EncryptedObject> {
      return SimpleSerialize(encryptee, parameters).then(encryptee => {
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
            return SimpleDeserialize(decrypted, prototype)
         }) as Promise<any>
   }

   public extractKey (): Promise<string> {
      return window.crypto.subtle.exportKey('raw', this.cryptoKey).then(rawKey => {
         return ArrayBufferToBase64(rawKey)
      }) as Promise<string>
   }

   public keyConfig (): SymmetricKeyConfig {
      return new SymmetricKeyConfigBuilder()
         .keyAlgorithm(this.cryptoKey.algorithm.name)
         .extractable(this.cryptoKey.extractable)
         .keyUsage(this.cryptoKey.usages)
         .length((this.cryptoKey.algorithm as any)['length'])
         .build()
   }

   public decryptionParameters (vector: InitializationVector | Uint8Array): any {
      if (vector instanceof InitializationVector) vector = vector.asArray()
      return {name: this.cryptoKey.algorithm.name, iv: vector}
   }

   public static fromBase64 (base64: string, config = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      return this.fromRaw(Base64ToArrayBuffer(base64), config)
   }

   public static fromRaw (rawKey: ArrayBuffer, config = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      // saving the keyParams in an extra variable is necessary because of a bug in one of the test
      // libraries
      const keyParams = {} as any
      Object.assign(keyParams, config.keyParams)
      return window.crypto.subtle.importKey('raw',
         rawKey,
         keyParams,
         config.extractable,
         config.keyUsage).then(key => {
            console.log('par>: ', keyParams)
         return new SymmetricKey(key)
      }) as Promise<SymmetricKey>
   }

   static random (config: SymmetricKeyConfig = WebCryptoConfig.DEFAULT.symmetricKeyConfig)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then((key) => {
            return new SymmetricKey(key as CryptoKey)
         }) as Promise<SymmetricKey>
   }
}
