import {SymmetricKey} from '../src/SymmetricKey'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'
import {SerializedType, SimpleSerialize, DeSerializeParameterBuilder} from '@esentri/de-serializer'
import {NestedTestClass, SimpleTestClass} from './testData/SimpleTestClass'

describe('encrypted object test', () => {

   const testClass = new SimpleTestClass(new NestedTestClass('hello world'))
   const serializedTestClassPromise = SimpleSerialize(testClass,
      new DeSerializeParameterBuilder()
         .serializedType(SerializedType.ARRAY_BUFFER)
         .withFunctions(true)
         .build())

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
