import {SymmetricKey} from '../src/SymmetricKey'
import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {extractable} from './CryptoKeyAssertions'
import {SymmetricKeyConfigBuilder} from '../src/config/SymmetricKeyConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'

describe('test symmetric key', () => {

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
})
