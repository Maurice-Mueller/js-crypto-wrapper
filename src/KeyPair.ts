import {PublicKey} from './PublicKey'
import {PrivateKey} from './PrivateKey'
import {KeyPairConfig} from './config/KeyPairConfig'
import {WebCryptoConfig} from './config/WebCryptoConfig'
import {KeyPairExtracted} from './KeyPairExtracted'
import {SymmetricKey} from './SymmetricKey'
import {WrappedKey} from './WrappedKey'

export class KeyPair {
   private readonly publicKey: PublicKey
   private readonly privateKey: PrivateKey

   constructor (cryptoKey: CryptoKeyPair) {
      this.publicKey = new PublicKey(cryptoKey.publicKey)
      this.privateKey = new PrivateKey(cryptoKey.privateKey)
   }

   public extractPublicKey (): Promise<string> {
      return this.publicKey.extractKey()
   }

   public extractPrivateKey (): Promise<string> {
      return this.privateKey.extractKey()
   }

   public extract (): Promise<KeyPairExtracted> {
      const publicKeyPromise = this.extractPublicKey()
      const privateKeyPromise = this.extractPrivateKey()
      return Promise.all([publicKeyPromise, privateKeyPromise])
         .then(extractedKeys => {
            return new KeyPairExtracted(extractedKeys[0], extractedKeys[1])
         })
   }

   public wrapKey (symmetricKey: SymmetricKey): Promise<WrappedKey> {
      return this.publicKey.wrapKey(symmetricKey)
   }

   public unwrapKey (wrappedKey: WrappedKey): Promise<SymmetricKey> {
      return this.privateKey.unwrapKey(wrappedKey.base64, wrappedKey.config)
   }

   public static random (config: KeyPairConfig = WebCryptoConfig.DEFAULT.keyPairConfig)
      : Promise<KeyPair> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then(keyPair => {
            return new KeyPair(keyPair as CryptoKeyPair)
         }) as Promise<KeyPair>
   }

   public static fromPrivatePublic (privateKeyBase64: string,
                                    publicKeyBase: string,
                                    config = WebCryptoConfig.DEFAULT.keyPairConfig)
      : Promise<KeyPair> {
      const privateKeyPromise = PrivateKey.fromBase64(privateKeyBase64, config)
      const publicKeyPromise = PublicKey.fromBase64(publicKeyBase, config)
      return new Promise<KeyPair>((resolve, reject) => {
         Promise.all([privateKeyPromise, publicKeyPromise]).then(keys => {
            resolve(new KeyPair({privateKey: keys[0]['key'], publicKey: keys[1]['key']}))
         }).catch(error => {
            console.error('error in creating a keypair: ', error)
            reject(error)
         })
      })
   }

   public static fromExtracted (keyPairExtracted: KeyPairExtracted,
                                config = WebCryptoConfig.DEFAULT.keyPairConfig): Promise<KeyPair> {
      return this.fromPrivatePublic(keyPairExtracted.privateKey, keyPairExtracted.publicKey, config)
   }
}
