import {ArrayBufferToBase64, Base64ToArrayBuffer} from '@esentri/transformer-functions'
import {KeyPairConfig, KeyPairConfigBuilder} from './config/KeyPairConfig'
import {SymmetricKey} from './SymmetricKey'
import {SymmetricKeyConfig} from './config/SymmetricKeyConfig'
import {FilterPrivateKeyUsage} from './config/KeyUsage'

export class PrivateKey {
   private readonly key: CryptoKey

   constructor (key: CryptoKey) {
      this.key = key
   }

   public extractKey (): Promise<string> {
      return window.crypto.subtle.exportKey('pkcs8', this.key).then(rawKey => {
         return ArrayBufferToBase64(rawKey)
      }) as Promise<string>
   }

   public keyConfig(): KeyPairConfig {
      return new KeyPairConfigBuilder()
         .keyUsage(this.key.usages)
         .keyAlgorithm(this.key.algorithm.name!)
         .extractable(this.key.extractable)
         .build()
   }

   public unwrapKey (base64: string, config: SymmetricKeyConfig = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.unwrapKey('raw',
         Base64ToArrayBuffer(base64),
         this.key,
         this.key.algorithm.name!,
         config.keyAlgorithm,
         config.extractable,
         config.keyUsage)
         .then((key: CryptoKey) => new SymmetricKey(key)) as Promise<SymmetricKey>
   }

   public static fromBase64 (base64: string, config = KeyPairConfig.DEFAULT): Promise<PrivateKey> {
      return new Promise<PrivateKey>((resolve, reject) => {
         (window.crypto.subtle.importKey('pkcs8',
            Base64ToArrayBuffer(base64),
            config.keyParams,
            config.extractable,
            FilterPrivateKeyUsage(config.keyUsage)) as Promise<CryptoKey>)
            .then(key => resolve(new PrivateKey(key)))
            .catch(error => {
               console.error('couldn\'t create a private key from base64: ', error)
               reject(error)
            })
      })
   }
}
