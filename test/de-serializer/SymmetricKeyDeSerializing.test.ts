import {SymmetricKey, SymmetricKeyConfig} from '../../src/crypto-wrapper'
import {publicKeyBase64} from '../testData/Keys'
import {SymmetricKeySerialize} from '../../src/de-serializer/SymmetricKeySerialize'
import {SymmetricKeyDeserializer} from '../../src/de-serializer/SymmetricKeyDeserializer'

describe('de-serialize keys', () => {
   it('serialize SymmetricKey', done => {
      SymmetricKey.fromBase64(publicKeyBase64).then(symKey => {
         SymmetricKeySerialize(symKey).then(serialized => {
            expect(serialized.keyConfig.keyAlgorithm).toEqual(SymmetricKeyConfig.DEFAULT.keyParams.name)
            expect(serialized.key).toEqual(publicKeyBase64)
            done()
         })
      })
   })

   it('deserialize SymmetricKey', done => {
      SymmetricKey.fromBase64(publicKeyBase64).then(symKey => {
         SymmetricKeySerialize(symKey).then(serialized => {
            SymmetricKeyDeserializer.deserialize(serialized).then(deserialized => {
               deserialized.extractKey().then(extractedKey => {
                  expect(extractedKey).toEqual(publicKeyBase64)
                  done()
               })
            })
         })
      })
   })
})
