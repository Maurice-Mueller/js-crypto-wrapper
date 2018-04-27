import {PublicKey} from './PublicKey'
import {PrivateKey} from './PrivateKey'
import {KeyPairConfig} from './config/KeyPairConfig'
import {WebCryptoConfig} from './config/WebCryptoConfig'

export class KeyPair {
   private readonly publicKey: PublicKey
   private readonly privateKey: PrivateKey

   constructor (cryptoKey: CryptoKeyPair) {
      this.publicKey = new PublicKey(cryptoKey.publicKey)
      this.privateKey = new PrivateKey(cryptoKey.privateKey)
   }

   public static random (config: KeyPairConfig = WebCryptoConfig.DEFAULT.keyPairConfig)
      : Promise<KeyPair> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then(keyPair => {
            return new KeyPair(keyPair as CryptoKeyPair)
         }) as Promise<KeyPair>
   }
}
