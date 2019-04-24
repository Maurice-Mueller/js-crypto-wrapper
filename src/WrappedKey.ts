import {InitializationVector} from './crypto-wrapper'

export class WrappedKey {
   public static DECRYPTED_KEY_CHUNK_BYTE_LENGTH = 120

   public readonly base64: string
   public readonly config: any
   public readonly vector?: InitializationVector | null

   constructor (base64: string, config: any, vector: InitializationVector | null = null) {
      this.base64 = base64
      this.config = config
      this.vector = vector
   }
}
