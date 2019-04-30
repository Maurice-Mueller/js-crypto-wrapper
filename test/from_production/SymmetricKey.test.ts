import {SymmetricKey} from '../../src/SymmetricKey'
import {WebCryptoConfig} from '../../src/config/WebCryptoConfig'
import {extractable} from './../CryptoKeyAssertions'
import {SymmetricKeyConfigBuilder} from '../../src/config/SymmetricKeyConfig'
import {SymmetricKeyDerivationConfigBuilder} from '../../src/config/SymmetricKeyDerivationConfig'
import {KeyAlgorithm} from '../../src/config/KeyAlgorithm'
import {PrivateKeyBase64, publicKeyBase64, symKeyBase64} from './../testData/Keys'
import {
   ArrayBufferWithBinaryDataToBase64, ArrayBufferWithBinaryDataToString, Base64WithBinaryDataToArrayBuffer
} from '@esentri/transformer-functions'
import {Array1000Byte, Array100Byte} from './../testData/ArraysForEncryption'
import {ArrayBufferEqual} from './../content/ArrayBufferFunctions'
import * as fs from 'fs'
import {InitializationVector, PrivateKey, PublicKey, WrappedKeyDeserialize, WrappedKeySerialize} from '../../src/crypto-wrapper'
import {test} from 'shelljs'

describe('test symmetric key with stuff from production', () => {

   it('private key (un)wrapping with symmetric key and (de)serialization', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         SymmetricKey.fromPassword('hello world').then(symKey => {
            symKey.wrapKey(privateKey).then(wrappedPrivateKey => {
               WrappedKeySerialize(wrappedPrivateKey).then(serializedWrappedPrivateKey => {
                  WrappedKeyDeserialize(serializedWrappedPrivateKey).then(deserializedWrappedPrivateKey => {
                     symKey.unwrapPrivateKey(
                        deserializedWrappedPrivateKey.base64,
                        deserializedWrappedPrivateKey.vector!!,
                        deserializedWrappedPrivateKey.config
                     ).then(unwrappedPrivateKey => {
                        unwrappedPrivateKey.extractKey().then(extractedUnwrappedPrivateKey => {
                           privateKey.extractKey().then(extractedPrivateKey => {
                              expect(extractedUnwrappedPrivateKey).toEqual(extractedPrivateKey)
                              expect(unwrappedPrivateKey.keyConfig()).toEqual(privateKey.keyConfig())
                              done()
                           })
                        })
                     })
                  })
               })
            })
         })
      })
   })

})
