import {EncryptedObjectSerialize} from '../../src/de-serializer/EncryptedObjectSerialize'
import {TestEncryptedObject} from '../testData/EncryptedObject'
import {ArrayBufferEqual} from '../content/ArrayBufferFunctions'
import {EncryptedObjectDeserialize} from '../../src/de-serializer/EncryptedObjectDeserialize'
import {ArrayBufferToBase64} from '@esentri/transformer-functions'

describe('encrypted object de-serializing', () => {
   it('serialize', done => {
      EncryptedObjectSerialize(TestEncryptedObject).then(serialized => {
         expect(serialized.keyParams).toEqual(TestEncryptedObject['keyParams'])
         expect(serialized.vector).toEqual(TestEncryptedObject['vector']['vector'])
         expect(serialized.content).toEqual(ArrayBufferToBase64(TestEncryptedObject['content']))
         done()
      })
   })

   it('deserialize', done => {
      EncryptedObjectSerialize(TestEncryptedObject).then(serialized => {
         EncryptedObjectDeserialize(serialized).then(deserialized => {
            expect(ArrayBufferEqual(deserialized['content'], TestEncryptedObject['content']))
               .toBeTruthy()
            expect(deserialized.decryptionParameters())
               .toEqual(TestEncryptedObject.decryptionParameters())
            done()
         })
      })
   })
})
