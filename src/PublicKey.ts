import {
   ArrayBufferWithBinaryDataToBase64,
   ArrayBufferWithBinaryDataToString,
   Base64WithBinaryDataToArrayBuffer
} from '@esentri/transformer-functions'
import {KeyPairConfig, KeyPairConfigBuilder} from './config/KeyPairConfig'
import {SymmetricKey} from './SymmetricKey'
import {WrappedKey} from './WrappedKey'
import {FilterPublicKeyUsage} from './config/KeyUsage'

export class PublicKey {
   private readonly key: CryptoKey

   constructor (key: CryptoKey) {
      this.key = key
   }

   public extractKey (): Promise<string> {
      return window.crypto.subtle.exportKey('spki', this.key).then(rawKey => {
         return ArrayBufferWithBinaryDataToBase64(rawKey)
      }) as Promise<string>
   }

   public keyConfig (): KeyPairConfig {
      return new KeyPairConfigBuilder()
         .keyUsage(this.key.usages)
         .keyAlgorithm(this.key.algorithm.name!)
         .extractable(this.key.extractable)
         .build()
   }

   public wrapKey (symmetricKey: SymmetricKey): Promise<WrappedKey> {
      return window.crypto.subtle
         .wrapKey('raw',
            symmetricKey['cryptoKey'],
            this.key,
            this.key.algorithm.name!)
         .then(rawKey =>
            new WrappedKey(ArrayBufferWithBinaryDataToBase64(rawKey), symmetricKey.keyConfig())) as Promise<WrappedKey>
   }

   public static fromBase64 (base64: string, config = KeyPairConfig.DEFAULT): Promise<PublicKey> {
      return new Promise<PublicKey>(((resolve, reject) => {
         (window.crypto.subtle.importKey('spki',
            Base64WithBinaryDataToArrayBuffer(base64),
            config.keyParams,
            config.extractable,
            FilterPublicKeyUsage(config.keyUsage)) as Promise<CryptoKey>)
            .then(key => resolve(new PublicKey(key)))
            .catch(error => {
               console.error('couldn\'t create a public key from base64: ', error)
               reject(error)
            })
      }))
   }
}
