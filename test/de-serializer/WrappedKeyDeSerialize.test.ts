import {symKeyBase64} from '../testData/Keys'
import {InitializationVector, SymmetricKeyConfig, WrappedKey, WrappedKeyDeserialize, WrappedKeySerialize} from '../../src/crypto-wrapper'
import {Uint8ArrayToBase64} from '@esentri/transformer-functions'

describe('de-serialize WrappedKey', () => {

   it('de-serialize WrappedKey (without InitializationVector)', done => {
      let wrappedKey = new WrappedKey(symKeyBase64, SymmetricKeyConfig.DEFAULT)
      WrappedKeySerialize(wrappedKey).then(serializedWrappedKey => {
         expect(serializedWrappedKey.base64).toEqual(wrappedKey.base64)
         expect(serializedWrappedKey.config).toEqual(wrappedKey.config)
         expect(serializedWrappedKey.vectorBase64).toBeNull()
         WrappedKeyDeserialize(serializedWrappedKey).then(deserializedKey => {
            expect(deserializedKey.base64).toEqual(wrappedKey.base64)
            expect(deserializedKey.config).toEqual(wrappedKey.config)
            expect(deserializedKey.vector).toBeNull()
            done()
         })
      })
   })

   it('de-serialize WrappedKey (with InitializationVector)', done => {
      let wrappedKey = new WrappedKey(symKeyBase64, SymmetricKeyConfig.DEFAULT, InitializationVector.random())
      WrappedKeySerialize(wrappedKey).then(serializedWrappedKey => {
         expect(serializedWrappedKey.base64).toEqual(wrappedKey.base64)
         expect(serializedWrappedKey.config).toEqual(wrappedKey.config)
         expect(serializedWrappedKey.vectorBase64).toEqual(Uint8ArrayToBase64(wrappedKey.vector!.asArray()))
         WrappedKeyDeserialize(serializedWrappedKey).then(deserializedKey => {
            expect(deserializedKey.base64).toEqual(wrappedKey.base64)
            expect(deserializedKey.config).toEqual(wrappedKey.config)
            expect(deserializedKey.vector!.asArray()).toEqual(wrappedKey.vector!.asArray())
            done()
         })
      })
   })
})
