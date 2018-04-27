import {SymmetricKeyConfig} from './SymmetricKeyConfig'
import {KeyPairConfig} from './KeyPairConfig'

export class WebCryptoConfig {
   public readonly symmetricKeyConfig: SymmetricKeyConfig
   public readonly keyPairConfig: KeyPairConfig
   public readonly initializationVectorLength: number

   constructor (symmetricKeyConfig: SymmetricKeyConfig = SymmetricKeyConfig.DEFAULT,
                keyPairConfig: KeyPairConfig = KeyPairConfig.DEFAULT,
                initializationVectorLength: number = 16) {
      this.symmetricKeyConfig = symmetricKeyConfig
      this.keyPairConfig = keyPairConfig
      this.initializationVectorLength = initializationVectorLength
   }

   public static readonly DEFAULT: WebCryptoConfig = new WebCryptoConfig()
}
