import {Deserialize} from '@esentri/de-serializer'
import {EncryptedObject} from '../EncryptedObject'
import {InitializationVector} from '../InitializationVector'
import {Base64ToArrayBuffer} from '@esentri/transformer-functions'

export const EncryptedObjectDeserialize: Deserialize<EncryptedObject> =
   (serialized: any): Promise<EncryptedObject> => {
      return new Promise<EncryptedObject>(resolve => {
         resolve(new EncryptedObject(Base64ToArrayBuffer(serialized.content), serialized.keyParams,
            new InitializationVector(serialized.vector)))
      })
   }
