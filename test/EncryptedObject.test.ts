import {SymmetricKey} from '../src/SymmetricKey'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'
import {DeSerializeParameter, SerializedType, SimpleSerialize} from '@esentri/de-serializer'
import {NestedTestClass, SimpleTestClass} from './testData/SimpleTestClass'

describe('encrypted object test', () => {

   const testClass = new SimpleTestClass(new NestedTestClass('hello world'))
   const serializedTestClassPromise = SimpleSerialize(testClass,
      [DeSerializeParameter.WITH_FUNCTIONS],
      SerializedType.ARRAY_BUFFER)

   it('decrypts simple', done => {
      SymmetricKey.random().then(symmetricKey => {
         symmetricKey.encrypt(testClass).then(encryptedObject => {
            serializedTestClassPromise.then(serializedTestClass => {
               expect(ArrayBufferEqual(encryptedObject['content'], serializedTestClass)).toBeFalsy()
               encryptedObject.decrypt(symmetricKey).then(decryptedArrayBuffer => {
                  expect(ArrayBufferEqual(decryptedArrayBuffer, serializedTestClass)).toBeTruthy()
                  done()
               })
            })
         })
      })
   })

   it('decrypt to object', done => {
      SymmetricKey.random().then(symmetricKey => {
         symmetricKey.encrypt(testClass).then(encryptedObject => {
            serializedTestClassPromise.then(serializedTestClass => {
               expect(ArrayBufferEqual(encryptedObject['content'], serializedTestClass)).toBeFalsy()
               encryptedObject.decrypt(symmetricKey, SimpleTestClass)
                  .then((simpleTestClass: SimpleTestClass) => {
                     expect(simpleTestClass.getField()).toBe('hello world')
                     done()
                  })
            })
         })
      })
   })
})
