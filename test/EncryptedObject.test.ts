import {SymmetricKey} from '../src/SymmetricKey'
import {SimpleEncryptable} from './mock/SimpleEncryptable'
import {AnyToArrayBuffer} from '../src/content/AnyToArrayBuffer'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'

describe('encrypted object test', () => {

   it('decrypts simple', done => {
      SymmetricKey.random().then(symmetricKey => {
         const simpleEncryptable = new SimpleEncryptable('hello world')
         simpleEncryptable.encrypt(symmetricKey).then(encryptedObject => {
            const expectedDecryptedArrayBuffer = AnyToArrayBuffer('hello world')
            expect(ArrayBufferEqual(encryptedObject['content'], expectedDecryptedArrayBuffer))
               .toBeFalsy()
            encryptedObject.decrypt(symmetricKey).then(decryptedArrayBuffer => {
               expect(ArrayBufferEqual(decryptedArrayBuffer, expectedDecryptedArrayBuffer))
                  .toBeTruthy()
               done()
            })
         })
      })
   })

   it('decrypts simple with key promise', done => {
      let symmetricKeyPromise = SymmetricKey.random()
      const simpleEncryptable = new SimpleEncryptable('hello world')
      simpleEncryptable.encrypt(symmetricKeyPromise).then(encryptedObject => {
         const expectedDecryptedArrayBuffer = AnyToArrayBuffer('hello world')
         expect(ArrayBufferEqual(encryptedObject['content'], expectedDecryptedArrayBuffer))
            .toBeFalsy()
         encryptedObject.decrypt(symmetricKeyPromise).then(decryptedArrayBuffer => {
            expect(ArrayBufferEqual(decryptedArrayBuffer, expectedDecryptedArrayBuffer))
               .toBeTruthy()
            done()
         })
      })
   })
})
