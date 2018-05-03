import {SymmetricKey} from '../src/SymmetricKey'
import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {extractable} from './CryptoKeyAssertions'
import {SymmetricKeyConfigBuilder} from '../src/config/SymmetricKeyConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'

describe('test symmetric key', () => {

   const helloWorldString = 'hello world'
   const numberForEncryption = 12345678

   it('random with default', done => {
      SymmetricKey.random().then(symmetricKey => {
         const cryptoKey = symmetricKey['cryptoKey']
         expect(cryptoKey).toBeDefined()
         extractable(cryptoKey)
         expect(cryptoKey.algorithm).toBe(WebCryptoConfig.DEFAULT.symmetricKeyConfig.keyParams)
         expect(cryptoKey.usages).toBe(WebCryptoConfig.DEFAULT.symmetricKeyConfig.keyUsage)
         done()
      })
   })

   it('random with custom config', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .keyAlgorithm(KeyAlgorithm.AES_CTR)
         .build())
         .then(key => {
            expect(key['cryptoKey'].algorithm.name).toEqual(KeyAlgorithm.AES_CTR)
            done()
         })
   })

   it('encrypt string with default settings', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               expect(encrypted.decryptionParameters().name).toEqual(WebCryptoConfig.DEFAULT.symmetricKeyConfig.keyAlgorithm)
               done()
            })
         })
   })

   it('decrypt string with default settings', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               encrypted.decrypt(key, String).then(decrypted => {
                  expect(decrypted).toEqual(helloWorldString)
                  done()
               })
            })
         })
   })

   it('decrypt string with default settings without prototype', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               key.decrypt(encrypted.decryptionParameters(), encrypted['content'])
                  .then(decrypted => {
                     console.log('de: ', decrypted)
                     expect(String.fromCharCode.apply(null, new Uint8Array(decrypted)))
                        .toEqual(helloWorldString)
                     done()
                  })
            })
         })
   })

   it('decrypt number with default settings', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(numberForEncryption).then(encrypted => {
               encrypted.decrypt(key, Number).then(decrypted => {
                  expect(decrypted).toEqual(numberForEncryption)
                  done()
               })
            })
         })
   })

})
