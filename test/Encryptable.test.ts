import {SimpleEncryptable} from './mock/SimpleEncryptable'
import {SymmetricKey} from '../src/SymmetricKey'
import {AnyToArrayBuffer} from '../src/content/AnyToArrayBuffer'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'

describe('Encryptable test', () => {
   const simpleEncryptable = new SimpleEncryptable('hello world')

   it('simple encryption test with promise key', done => {
      simpleEncryptable.encrypt(SymmetricKey.random()).then(encrypted => {
         const expectedDecryptedArrayBuffer = AnyToArrayBuffer('hello world')
         expect(ArrayBufferEqual(encrypted['content'], expectedDecryptedArrayBuffer)).toBeFalsy()
         done()
      })
   })

   it('encrypts with default values', done => {
      SymmetricKey.random().then(symmetricKeyDefault => {
         simpleEncryptable.encrypt(symmetricKeyDefault).then(encrypted => {
            const expectedDecryptedArrayBuffer = AnyToArrayBuffer('hello world')
            expect(ArrayBufferEqual(encrypted['content'], expectedDecryptedArrayBuffer)).toBeFalsy()
            window.crypto.subtle.decrypt(encrypted.decryptionParameters(),
               symmetricKeyDefault['cryptoKey'], encrypted['content'])
               .then(decrypted => {
                  const expectedArrayBuffer = AnyToArrayBuffer('hello world')
                  expect(ArrayBufferEqual(decrypted, expectedArrayBuffer)).toBeTruthy()
                  done()
               })
         })
      })
   })

})
