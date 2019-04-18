import {Serialize} from '@esentri/de-serializer'
import {PrivateKey} from '../PrivateKey'
import {PrivateKeySerialized} from './PrivateKeySerialized'

export const PrivateKeySerialize: Serialize = (element: PrivateKey): Promise<PrivateKeySerialized> => {
   return element.extractKey().then(keyString => {
      return new PrivateKeySerialized(keyString, element.keyConfig())
   })
}
