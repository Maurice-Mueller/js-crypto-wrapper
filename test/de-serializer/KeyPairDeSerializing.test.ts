import {
   keyPairExtracted,
   PrivateKeyBase64,
   publicKeyBase64,
} from '../testData/Keys'
import {KeyPairDeserializer} from '../../src/de-serializer/KeyPairDeserializer'
import {KeyPair} from '../../src/KeyPair'
import {KeyPairSerialize} from '../../src/de-serializer/KeyPairSerialize'
import {KeyPairSerialized} from '../../src/de-serializer/KeyPairSerialized'
import {KeyPairConfig} from '../../src/config/KeyPairConfig'

describe('de-serialize keys', () => {

   it('serialize KeyPair', done => {
      KeyPair.fromExtracted(keyPairExtracted).then(keyPair => {
         KeyPairSerialize(keyPair).then((serialized: KeyPairSerialized) => {
            expect(serialized.publicKey.key).toEqual(keyPairExtracted.publicKey)
            expect(serialized.privateKey.key).toEqual(keyPairExtracted.privateKey)
            expect(serialized.privateKey.keyConfig.keyAlgorithm)
               .toEqual(KeyPairConfig.DEFAULT.keyAlgorithm)
            expect(serialized.publicKey.keyConfig.keyAlgorithm)
               .toEqual(KeyPairConfig.DEFAULT.keyAlgorithm)
            done()
         })
      })
   })

   it('deserialize KeyPair', done => {
      KeyPair.fromExtracted(keyPairExtracted).then(keyPair => {
         KeyPairSerialize(keyPair).then((serialized: KeyPairSerialized) => {
            KeyPairDeserializer.deserialize(serialized).then(deserialized => {
               deserialized.extract().then(extracted => {
                  expect(extracted.publicKey).toEqual(publicKeyBase64)
                  expect(extracted.privateKey).toEqual(PrivateKeyBase64)
                  done()
               })
            })
         })
      })
   })
})
