import {Serialize} from '@esentri/de-serializer'
import {KeyPair} from '../KeyPair'
import {PublicKeySerialize} from './PublicKeySerialize'
import {KeyPairSerialized} from './KeyPairSerialized'

export const KeyPairSerialize: Serialize = (element: KeyPair): Promise<KeyPairSerialized> => {
   const publicKeyPromise = PublicKeySerialize(element['publicKey'])
   const privateKeyPromise = PublicKeySerialize(element['privateKey'])
   return Promise.all([publicKeyPromise, privateKeyPromise]).then(results => {
      return new KeyPairSerialized(results[0], results[1])
   })
}
