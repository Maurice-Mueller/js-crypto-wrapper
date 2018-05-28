import {SymmetricKeyConfig} from '../crypto-wrapper'

export class SymmetricKeySerialized {
   public key: string
   public keyConfig: SymmetricKeyConfig

   constructor (key: string, keyConfig: SymmetricKeyConfig) {
      this.key = key
      this.keyConfig = keyConfig
   }
}

export const SymmetricKeySerializedKeyPath = 'key'
