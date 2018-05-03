import {InitializationVector} from './InitializationVector'
import {SymmetricKey} from './SymmetricKey'

export class EncryptedObject {
   private readonly content: ArrayBuffer
   private readonly keyParams: any
   private readonly vector: InitializationVector

   constructor (content: ArrayBuffer, keyParams: any, vector: InitializationVector) {
      this.content = content
      this.keyParams = keyParams
      this.vector = vector
   }

   public decryptionParameters (): any {
      return {name: this.keyParams.name, iv: this.vector.asArray()}
   }

   public decrypt (key: SymmetricKey, prototype: any = null): Promise<any> {
      return this.__decrypt(key, prototype)
   }

   private __decrypt (key: SymmetricKey, prototype: any): Promise<any> {
      return key.decrypt(this.decryptionParameters(), this.content, prototype)
   }
}
