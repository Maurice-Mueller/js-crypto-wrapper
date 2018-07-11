import {SymmetricKey} from '../src/SymmetricKey'
import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {extractable} from './CryptoKeyAssertions'
import {SymmetricKeyConfigBuilder} from '../src/config/SymmetricKeyConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'
import {symKeyBase64} from './testData/Keys'
import {Base64ToArrayBuffer} from '@esentri/transformer-functions'
import {Array1000Byte, Array100Byte} from './testData/ArraysForEncryption'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'
import fs from 'fs'

describe('test symmetric key', () => {

   const helloWorldString = 'hello world'
   const numberForEncryption = 12345678
   let arrayBufferForEncryption = new Uint8Array(fs.readFileSync(__dirname + '/testData/text.txt')).buffer

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

   it('decrypt string with decryption params from symmetric key', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               key.decrypt(key.decryptionParameters(encrypted['vector']), encrypted['content'], String).then(decrypted => {
                  expect(decrypted).toEqual(helloWorldString)
                  done()
               })
            })
         })
   })

   it('decrypt string with decryption params from symmetric key and Uint8Array', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder().build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               key.decrypt(key.decryptionParameters(encrypted['vector'].asArray()), encrypted['content'], String).then(decrypted => {
                  expect(decrypted).toEqual(helloWorldString)
                  done()
               })
            })
         })
   })

   it('decrypt string with default settings without prototype', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder().build())
         .then(key => {
            key.encrypt(helloWorldString).then(encrypted => {
               key.decrypt(encrypted.decryptionParameters(), encrypted['content'])
                  .then(decrypted => {
                     expect(String.fromCharCode.apply(null, new Uint8Array(decrypted)))
                        .toEqual(helloWorldString)
                     done()
                  })
            })
         })
   })

   it('decrypt number with default settings', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder().build())
         .then(key => {
            key.encrypt(numberForEncryption).then(encrypted => {
               encrypted.decrypt(key, Number).then(decrypted => {
                  expect(decrypted).toEqual(numberForEncryption)
                  done()
               })
            })
         })
   })

   it('export/import from/to base64 string', done => {
      SymmetricKey.fromBase64(symKeyBase64).then(symmetricKey => {
         symmetricKey.extractKey().then(extracted => {
            expect(extracted).toEqual(symKeyBase64)
            done()
         })
      })
   })

   it('import from raw', done => {
      SymmetricKey.fromRaw(Base64ToArrayBuffer(symKeyBase64)).then(symmetricKey => {
         symmetricKey.extractKey().then(extracted => {
            expect(extracted).toEqual(symKeyBase64)
            done()
         })
      })
   })

   it('de/encrypt Uint8Array', done => {
      const array = new Uint8Array([12, 13, 14])
      SymmetricKey.random().then(key => {
         key.encrypt(array).then(encrypted => {
            key.decrypt(encrypted.decryptionParameters(), encrypted['content'])
               .then(decrypted => {
                  expect(new Uint8Array(decrypted)).toEqual(array)
                  done()
               })
         })
      })
   })

   it('en/decrypt large data (100 byte)', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder().length(128).build()).then(key => {
         key.encrypt(Array100Byte).then(encryptedObject => {
            expect(new Uint8Array(encryptedObject['content']).length).toBeGreaterThan(100)
            key.decrypt(encryptedObject.decryptionParameters(), encryptedObject['content'])
               .then(decrypted => {
                  expect(ArrayBufferEqual(decrypted, Array100Byte.buffer as ArrayBuffer)).toBeTruthy()
                  done()
               })
         })
      })
   })

   // WARNING: THOSE TESTS MAY TAKE A LONG TIME
   it('en/decrypt large data (1000 byte)', done => {
      SymmetricKey.random().then(key => {
         key.encrypt(Array1000Byte).then(encryptedObject => {
            expect(new Uint8Array(encryptedObject['content']).length).toBeGreaterThan(1000)
            key.decrypt(encryptedObject.decryptionParameters(), encryptedObject['content'])
               .then(decrypted => {
                  expect(ArrayBufferEqual(decrypted, Array1000Byte.buffer as ArrayBuffer)).toBeTruthy()
                  done()
               })
         })
      })
   })

   // it('en/decrypt large data (10000 byte)', done => {
   //    SymmetricKey.random().then(key => {
   //       key.encrypt(Array10000Byte).then(encryptedObject => {
   //          key.decrypt(encryptedObject.decryptionParameters(), encryptedObject['content'])
   //             .then(decrypted => {
   //                expect(ArrayBufferEqual(decrypted, Array10000Byte.buffer as ArrayBuffer)).toBeTruthy()
   //                done()
   //             })
   //       })
   //    })
   // })

   it('decrypt base64 file with default settings', done => {
      SymmetricKey.random(new SymmetricKeyConfigBuilder()
         .build())
         .then(key => {
            key.encrypt(arrayBufferForEncryption).then(encrypted => {
               encrypted.decrypt(key, ArrayBuffer).then(decrypted => {
                  expect(ArrayBufferEqual(decrypted, arrayBufferForEncryption)).toBeTruthy()
                  done()
               })
            })
         })
   })
})

