import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {KeyPair} from '../src/KeyPair'
import {algorithmDefaultKeyPair, extractable} from './CryptoKeyAssertions'
import {KeyPairConfigBuilder} from '../src/config/KeyPairConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'
import {KeyUsage} from '../src/config/KeyUsage'
import {keyPairExtracted, PrivateKeyBase64, publicKeyBase64, symKeyBase64} from './testData/Keys'
import {SymmetricKey} from '../src/SymmetricKey'

describe('test public key', () => {
   it('random with default', done => {
      KeyPair.random().then(keyPair => {
         const cryptoKeyPublic = keyPair['publicKey']['key']
         const cryptoKeyPrivate = keyPair['privateKey']['key']
         expect(cryptoKeyPublic).toBeDefined()
         expect(cryptoKeyPrivate).toBeDefined()
         extractable(cryptoKeyPublic)
         extractable(cryptoKeyPrivate)
         algorithmDefaultKeyPair(cryptoKeyPublic)
         algorithmDefaultKeyPair(cryptoKeyPrivate)
         expect(cryptoKeyPublic.type).toBe('public')
         expect(cryptoKeyPrivate.type).toBe('private')
         const unifiedKeyUsage: Array<string> = cryptoKeyPublic.usages
            .concat(cryptoKeyPrivate.usages).sort()
         expect(unifiedKeyUsage).toEqual(WebCryptoConfig.DEFAULT.keyPairConfig.keyUsage.sort())
         done()
      })
   })

   it('init with custom config', done => {
      KeyPair.random(new KeyPairConfigBuilder()
         .keyAlgorithm(KeyAlgorithm.RSASSA_PKCS1_V1_5)
         .keyUsage([KeyUsage.SIGN, KeyUsage.VERIFY])
         .build())
         .then(keyPair => {
            const cryptoKeyPublic = keyPair['publicKey']['key']
            const cryptoKeyPrivate = keyPair['privateKey']['key']
            expect(cryptoKeyPublic.algorithm.name).toEqual(KeyAlgorithm.RSASSA_PKCS1_V1_5)
            expect(cryptoKeyPrivate.algorithm.name).toEqual(KeyAlgorithm.RSASSA_PKCS1_V1_5)
            expect(cryptoKeyPublic.usages).toEqual([KeyUsage.VERIFY])
            expect(cryptoKeyPrivate.usages).toEqual([KeyUsage.SIGN])
            done()
         })
   })

   it('import/export from/to hex string (for private/public key)', done => {
      KeyPair.fromPrivatePublic(PrivateKeyBase64, publicKeyBase64).then(keyPair => {
         keyPair.extractPublicKey().then(extractedPublicKey => {
            expect(extractedPublicKey).toEqual(publicKeyBase64)
            keyPair.extractPrivateKey().then(extractedPrivateKey => {
               expect(extractedPrivateKey).toEqual(PrivateKeyBase64)
               done()
            })
         })
      })
   })

   it('import/export from/to KeyPairExtracted', done => {
      KeyPair.fromExtracted(keyPairExtracted).then(keyPair => {
         keyPair.extract().then(keyPairExtractedNew => {
            expect(keyPairExtractedNew.publicKey).toEqual(publicKeyBase64)
            expect(keyPairExtractedNew.privateKey).toEqual(PrivateKeyBase64)
            done()
         })
      })
   })

   it('wrap/unwrap key', done => {
      KeyPair.fromPrivatePublic(PrivateKeyBase64, publicKeyBase64).then(keyPair => {
         SymmetricKey.fromBase64(symKeyBase64).then(symKey => {
            keyPair.wrapKey(symKey).then(wrappedKey => {
               keyPair.unwrapKey(wrappedKey).then(unwrappedKey => {
                  unwrappedKey.extractKey().then(extracted => {
                     expect(extracted).toEqual(symKeyBase64)
                     done()
                  })
               })
            })
         })
      })
   })

   it('from private/public with error', done => {
      KeyPair.fromPrivatePublic(PrivateKeyBase64, publicKeyBase64,
         new KeyPairConfigBuilder()
            .keyAlgorithm(KeyAlgorithm.HMAC)
            .keyUsage([KeyUsage.VERIFY, KeyUsage.SIGN, KeyUsage.DERIVE_BITS, KeyUsage.DECRYPT, KeyUsage.ENCRYPT])
            .build())
         .catch(error => {
            done()
         })
   })
})
