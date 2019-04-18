import {PublicKey, KeyPair, SymmetricKey} from '../src/crypto-wrapper'
import {publicKeyBase64, symKeyBase64} from './testData/Keys'

describe('public key', () => {
   it('import/export from/to base64 string', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         publicKey.extractKey().then(base64String => {
            expect(base64String).toEqual(publicKeyBase64)
            done()
         })
      })
   })

   it('wraps symmetric key', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         SymmetricKey.fromBase64(symKeyBase64).then(symKey => {
            publicKey.wrapKey(symKey).then(wrappedKey => {
               console.log('here wrap')
               console.log(wrappedKey.base64)
               done()
            })
         })
      })
   })
})
