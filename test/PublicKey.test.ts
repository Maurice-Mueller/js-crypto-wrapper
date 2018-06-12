import {PublicKey} from '../src/PublicKey'
import {publicKeyBase64} from './testData/Keys'

describe('public key', () => {

   it('import/export from/to base64 string', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         publicKey.extractKey().then(base64String => {
            expect(base64String).toEqual(publicKeyBase64)
            done()
         })
      })
   })
})
