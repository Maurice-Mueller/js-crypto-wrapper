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

   public decrypt (key: SymmetricKey | Promise<SymmetricKey>): Promise<ArrayBuffer> {
      if (key instanceof SymmetricKey) return this.__decrypt(key)
      return key.then(resolvedKey => this.__decrypt(resolvedKey))
   }

   private __decrypt (key: SymmetricKey): Promise<any> {
      return key.decrypt(this.decryptionParameters(), this.content)
   }
}
