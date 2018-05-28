import {PublicKeySerialized} from './PublicKeySerialized'
import {PrivateKeySerialized} from './PrivateKeySerialized'

export const KeyPairSerializedKeyPath = 'publicKey.key'

export class KeyPairSerialized {
   public publicKey: PublicKeySerialized
   public privateKey: PrivateKeySerialized

   constructor (publicKey: PublicKeySerialized, privateKey: PrivateKeySerialized) {
      this.publicKey = publicKey
      this.privateKey = privateKey
   }
}
