import {WebCryptoConfig} from '../src/config/WebCryptoConfig'
import {KeyPair} from '../src/KeyPair'
import {algorithmDefaultKeyPair, extractable} from './CryptoKeyAssertions'
import {KeyPairConfigBuilder} from '../src/config/KeyPairConfig'
import {KeyAlgorithm} from '../src/config/KeyAlgorithm'
import {KeyUsage} from '../src/config/KeyUsage'

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
})
