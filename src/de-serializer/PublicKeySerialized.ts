import {KeyPairConfig} from '../config/KeyPairConfig'

export class PublicKeySerialized {
   public key: string
   public keyConfig: KeyPairConfig

   constructor (key: string, keyConfig: KeyPairConfig) {
      this.key = key
      this.keyConfig = keyConfig
   }
}

export const PublicKeySerializedKeyPath = 'key'
