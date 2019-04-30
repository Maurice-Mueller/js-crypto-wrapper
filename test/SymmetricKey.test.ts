import {SymmetricKey} from '../src/SymmetricKey'
import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {extractable} from './CryptoKeyAssertions'
import {SymmetricKeyConfigBuilder} from '../src/config/SymmetricKeyConfig'
import {SymmetricKeyDerivationConfigBuilder} from '../src/config/SymmetricKeyDerivationConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'
import {PrivateKeyBase64, publicKeyBase64, symKeyBase64} from './testData/Keys'
import {
   ArrayBufferWithBinaryDataToBase64, ArrayBufferWithBinaryDataToString, Base64WithBinaryDataToArrayBuffer
} from '@esentri/transformer-functions'
import {Array1000Byte, Array100Byte} from './testData/ArraysForEncryption'
import {ArrayBufferEqual} from './content/ArrayBufferFunctions'
import * as fs from 'fs'
import {PrivateKey, PublicKey} from '../src/crypto-wrapper'

describe('test symmetric key', () => {

   const helloWorldString = 'hello world'
   const numberForEncryption = 12345678
   let arrayBufferForEncryption = new Uint8Array(fs.readFileSync(__dirname + '/testData/text.txt')).buffer
   let base64ForEncryption = ArrayBufferWithBinaryDataToBase64(arrayBufferForEncryption)

   it('random with default', done => {
      SymmetricKey.random().then(symmetricKey => {
         const cryptoKey = symmetricKey['key']
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
            expect(key['key'].algorithm.name).toEqual(KeyAlgorithm.AES_CTR)
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
                     expect(ArrayBufferWithBinaryDataToString(new Uint8Array(decrypted)))
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
      SymmetricKey.fromRaw(Base64WithBinaryDataToArrayBuffer(symKeyBase64)).then(symmetricKey => {
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
            console.debug(arrayBufferForEncryption)
            key.encrypt(Base64WithBinaryDataToArrayBuffer(base64ForEncryption)).then(encrypted => {
               encrypted.decrypt(key, ArrayBuffer).then(decrypted => {
                  expect(decrypted).toEqual(Base64WithBinaryDataToArrayBuffer(base64ForEncryption))
                  done()
               })
            })
         })
   })

   it('derive a key from a password (with default salt + config)', done => {
      let password = 'test-pw'
      SymmetricKey.fromPassword(password)
         .then(symmetricKey => symmetricKey.extractKey())
         .then(extracted => {
            expect(extracted).toEqual('ehaoqvWlCh7nCG4LEtEihwawq2x+iaetxyfbNO4gCgI=')
            done()
         })
   })

   it('derive a key from a password (with default config)', done => {
      let password = 'test-pw'
      let salt = 'salt'
      SymmetricKey.fromPassword(password, salt)
         .then(symmetricKey => symmetricKey.extractKey())
         .then(extracted => {
            expect(extracted).toEqual('IdNcf7yLYfQ6of3eV3t5nZfKwdwmo0Hc0r/ejn6U6Ak=')
            done()
         })
   })

   it('derive a key from a password (with custom config)', done => {
      let password = 'test-pw'
      let salt = 'salt'
      SymmetricKey.fromPassword(password, salt, new SymmetricKeyDerivationConfigBuilder()
         .iterationsForDerivation(10).build())
         .then(symmetricKey => symmetricKey.extractKey())
         .then(extracted => {
            expect(extracted).toEqual('jdGGK6evbbnYUX9ISt60FywXsScBD5gMrgd+fM4yqj4=')
            done()
         })
   })

   it('derive two keys from different passwords', done => {
      let password1 = 'test-pw1'
      let password2 = 'test-pw2'
      let salt = 'salt'
      SymmetricKey.fromPassword(password1, salt)
         .then(symmetricKey1 => symmetricKey1.extractKey())
         .then(extracted1 => {
            SymmetricKey.fromPassword(password2, salt).then(symmetricKey2 => {
               symmetricKey2.extractKey().then(extracted2 => {
                  expect(extracted1).not.toEqual(extracted2)
                  done()
               })
            })
         })
   })

   it('derive two keys from different salts', done => {
      let password = 'test-pw'
      let salt1 = 'salt1'
      let salt2 = 'salt2'
      SymmetricKey.fromPassword(password, salt1)
         .then(symmetricKey1 => symmetricKey1.extractKey())
         .then(extracted1 => {
            SymmetricKey.fromPassword(password, salt2).then(symmetricKey2 => {
               symmetricKey2.extractKey().then(extracted2 => {
                  expect(extracted1).not.toEqual(extracted2)
                  done()
               })
            })
         })
   })

   it('(un)wrap private key', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         SymmetricKey.random().then(symKey => {
            symKey.wrapKey(privateKey).then(wrappedKey => {
               symKey.unwrapPrivateKey(wrappedKey.base64, wrappedKey.vector!)
                  .then(unwrappedPrivateKey => {
                     unwrappedPrivateKey.extractKey().then(extractedUnwrapped => {
                        expect(extractedUnwrapped).toEqual(PrivateKeyBase64)
                        done()
                     })
                  })
            })
         })
      })
   })

   it('(un)wrap private key with Uint8Array initialization vector', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         SymmetricKey.random().then(symKey => {
            symKey.wrapKey(privateKey).then(wrappedKey => {
               symKey.unwrapPrivateKey(wrappedKey.base64, (wrappedKey.vector! as any).vector)
                  .then(unwrappedPrivateKey => {
                     unwrappedPrivateKey.extractKey().then(extractedUnwrapped => {
                        expect(extractedUnwrapped).toEqual(PrivateKeyBase64)
                        done()
                     })
                  })
            })
         })
      })
   })

   it('(un)wrap private key with sym key from password', done => {
      let password = 'test-pw'
      let salt = 'salt'
      SymmetricKey.fromPassword(password, salt).then(symKey => {
         PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
            symKey.wrapKey(privateKey).then(wrappedKey => {
               symKey.unwrapPrivateKey(wrappedKey.base64, wrappedKey.vector!)
                  .then(unwrappedPrivateKey => {
                     unwrappedPrivateKey.extractKey().then(extractedUnwrapped => {
                        expect(extractedUnwrapped).toEqual(PrivateKeyBase64)
                        done()
                     })
                  })
            })
         })
      })

   })

   it('(un)wrap public key', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         SymmetricKey.random().then(symKey => {
            symKey.wrapKey(publicKey).then(wrappedKey => {
               symKey.unwrapPublicKey(wrappedKey.base64, wrappedKey.vector!)
                  .then(unwrappedPublicKey => {
                     unwrappedPublicKey.extractKey().then(extractedUnwrapped => {
                        expect(extractedUnwrapped).toEqual(publicKeyBase64)
                        done()
                     })
                  })
            })
         })
      })
   })

   it('(un)wrap symmetric key', done => {
      SymmetricKey.fromBase64(symKeyBase64).then(symKeyForWrapping => {
         SymmetricKey.random().then(symKey => {
            symKey.wrapKey(symKeyForWrapping).then(wrappedKey => {
               symKey.unwrapSymmetricKey(wrappedKey.base64, wrappedKey.vector!)
                  .then(unwrappedSymKey => {
                     unwrappedSymKey.extractKey().then(extractedUnwrapped => {
                        expect(extractedUnwrapped).toEqual(symKeyBase64)
                        done()
                     })
                  })
            })
         })
      })
   })

})
