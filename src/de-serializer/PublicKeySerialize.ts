import {Serialize} from '@esentri/de-serializer'
import {PublicKey} from '../PublicKey'
import {PublicKeySerialized} from './PublicKeySerialized'

export const PublicKeySerialize: Serialize = (element: PublicKey): Promise<PublicKeySerialized> => {
   return element.extractKey().then(keyString => {
      return new PublicKeySerialized(keyString, element.keyConfig())
   })
}
