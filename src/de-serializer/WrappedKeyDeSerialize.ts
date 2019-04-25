import {Deserialize, Serialize} from '@esentri/de-serializer'
import {InitializationVector, WrappedKey} from '../crypto-wrapper'
import {Base64ToUint8Array, Uint8ArrayToBase64} from '@esentri/transformer-functions'

export const WrappedKeySerialize: Serialize = (element: WrappedKey): Promise<WrappedKeySerialized> => {
   return Promise.resolve(new WrappedKeySerialized(element.base64, element.config,
      element.vector ? Uint8ArrayToBase64(element.vector.asArray()) : null))
}

export class WrappedKeySerialized {

   public readonly base64: string
   public readonly config: any
   public readonly vectorBase64: string | null

   constructor (base64: string, config: any, vectorBase64: string | null) {
      this.base64 = base64
      this.config = config
      this.vectorBase64 = vectorBase64
   }
}

export const WrappedKeyDeserialize: Deserialize<WrappedKey> = (element: WrappedKeySerialized): Promise<WrappedKey> => {
   return Promise.resolve(
      new WrappedKey(element.base64,
         element.config,
         element.vectorBase64 ? new InitializationVector(Base64ToUint8Array(element.vectorBase64)) : null))
}
