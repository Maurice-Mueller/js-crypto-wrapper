import {publicKeyBase64} from '../testData/Keys'
import {PublicKey} from '../../src/PublicKey'
import {PublicKeySerialize} from '../../src/de-serializer/PublicKeySerialize'
import {KeyPairConfig} from '../../src/crypto-wrapper'
import {PublicKeyDeserializer} from '../../src/de-serializer/PublicKeyDeserializer'

describe('de-serialize keys', () => {
   it('serialize PublicKey', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         PublicKeySerialize(publicKey).then(serialized => {
            expect(serialized.keyConfig.keyAlgorithm).toEqual(KeyPairConfig.DEFAULT.keyParams.name)
            expect(serialized.key).toEqual(publicKeyBase64)
            done()
         })
      })
   })

   it('deserialize PublicKeySerialized', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         PublicKeySerialize(publicKey).then(serialized => {
            PublicKeyDeserializer.deserialize(serialized).then(deserialized => {
               deserialized.extractKey().then(extractedKey => {
                  expect(extractedKey).toEqual(publicKeyBase64)
                  done()
               })
            })
         })
      })
   })
})
