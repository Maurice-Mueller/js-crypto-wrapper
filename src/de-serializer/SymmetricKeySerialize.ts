import {Serialize} from '@esentri/de-serializer'
import {SymmetricKey} from '../SymmetricKey'
import {SymmetricKeySerialized} from './SymmetricKeySerialized'

export const SymmetricKeySerialize: Serialize = (element: SymmetricKey): Promise<SymmetricKeySerialized> => {
   return element.extractKey().then(keyString => {
      return new SymmetricKeySerialized(keyString, element.keyConfig())
   })
}
