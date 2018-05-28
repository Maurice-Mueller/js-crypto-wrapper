import {DeSerializeParameter, Serialize, SerializedType, SimpleSerialize} from '@esentri/de-serializer'
import {EncryptedObject, PrivateKeySerialized} from '../crypto-wrapper'

export const EncryptedObjectSerialize: Serialize = (element: EncryptedObject): Promise<any> => {
   return new Promise<any>(resolve => resolve({
      content: element['content'],
      keyParams: element['keyParams'],
      vector: element['vector']['vector']
   }))
}
