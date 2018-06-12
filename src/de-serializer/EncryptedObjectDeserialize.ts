import {Deserialize} from '@esentri/de-serializer'
import {EncryptedObject, InitializationVector} from '../crypto-wrapper'
import {Base64ToArrayBuffer} from '@esentri/transformer-functions'

export const EncryptedObjectDeserialize: Deserialize<EncryptedObject> =
   (serialized: any): Promise<EncryptedObject> => {
      return new Promise<EncryptedObject>(resolve => {
         resolve(new EncryptedObject(Base64ToArrayBuffer(serialized.content), serialized.keyParams,
            new InitializationVector(serialized.vector)))
      })
   }
