import {AnyToArrayBuffer} from './AnyToArrayBuffer'

export class EncryptableContent<CONTENT_TYPE> {
   private readonly content: CONTENT_TYPE

   constructor (content: CONTENT_TYPE) {
      this.content = content
   }

   static from<CONTENT_TYPE> (content: CONTENT_TYPE): EncryptableContent<CONTENT_TYPE> {
      return new EncryptableContent<CONTENT_TYPE>(content)
   }

   public arrayBuffer (): ArrayBuffer {
      return AnyToArrayBuffer(this.content)
   }
}
