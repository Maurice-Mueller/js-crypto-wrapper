import {EncryptableContent} from './content/EncryptableContent'
import {SymmetricKey} from './SymmetricKey'
import {EncryptedObject} from './EncryptedObject'

export abstract class Encryptable<CONTENT_TYPE> {
   private encryptableContent: EncryptableContent<CONTENT_TYPE>

   constructor (content: CONTENT_TYPE) {
      this.encryptableContent = EncryptableContent.from(content)
   }

   public encrypt (key: SymmetricKey | Promise<SymmetricKey>): Promise<EncryptedObject> {
      if (key instanceof SymmetricKey) return this.__encrypt(key)
      return key.then(resolvedKey => this.__encrypt(resolvedKey))
   }

   private __encrypt (key: SymmetricKey) {
      return key.encrypt(this.encryptableContent.arrayBuffer())
   }

}
