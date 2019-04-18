import {PrivateKeyBase64} from '../testData/Keys'
import {KeyPairConfig, PrivateKey} from '../../src/crypto-wrapper'
import {PrivateKeySerialize} from '../../src/de-serializer/PrivateKeySerialize'
import {PrivateKeyDeserializer} from '../../src/de-serializer/PrivateKeyDeserializer'

describe('de-serialize keys', () => {
   it('serialize PrivateKey', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         PrivateKeySerialize(privateKey).then(serialized => {
            expect(serialized.keyConfig.keyAlgorithm).toEqual(KeyPairConfig.DEFAULT.keyParams.name)
            expect(serialized.key).toEqual(PrivateKeyBase64)
            done()
         })
      })
   })

   it('deserialize PrivateKeySerialized', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         PrivateKeySerialize(privateKey).then(serialized => {
            PrivateKeyDeserializer.deserialize(serialized).then(deserialized => {
               deserialized.extractKey().then(extractedKey => {
                  expect(extractedKey).toEqual(PrivateKeyBase64)
                  done()
               })
            })
         })
      })
   })
})
