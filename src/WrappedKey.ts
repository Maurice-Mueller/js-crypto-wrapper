import {SymmetricKeyConfig} from './crypto-wrapper'

export class WrappedKey {
   public readonly base64: string
   public readonly config: SymmetricKeyConfig

   constructor (base64: string, config: SymmetricKeyConfig) {
      this.base64 = base64
      this.config = config
   }
}
