import {DeSerializeParameter, Serialize, SerializedType, SimpleSerialize} from '@esentri/de-serializer'
import {EncryptedObject, PrivateKeySerialized} from '../crypto-wrapper'
import {ArrayBufferToBase64} from '@esentri/transformer-functions'

export const EncryptedObjectSerialize: Serialize = (element: EncryptedObject): Promise<any> => {
   return new Promise<any>(resolve => resolve({
      content: ArrayBufferToBase64(element['content']),
      keyParams: element['keyParams'],
      vector: element['vector']['vector']
   }))
}
