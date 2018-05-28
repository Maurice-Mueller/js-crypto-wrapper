import {Deserialize} from '@esentri/de-serializer'
import {EncryptedObject, InitializationVector} from '../crypto-wrapper'

export const EncryptedObjectDeserialize: Deserialize<EncryptedObject> =
   (serialized: any): Promise<EncryptedObject> => {
      return new Promise<EncryptedObject>(resolve => {
         resolve(new EncryptedObject(serialized.content, serialized.keyParams,
            new InitializationVector(serialized.vector)))
      })
   }
