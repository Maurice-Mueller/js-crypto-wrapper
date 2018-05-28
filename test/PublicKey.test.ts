import {PublicKey} from '../src/PublicKey'
import {publicKeyBase64} from './testData/Keys'

describe('public key', () => {

   it('import/export from/to hex string', done => {
      PublicKey.fromBase64(publicKeyBase64).then(publicKey => {
         publicKey.extractKey().then(hexString => {
            expect(hexString).toEqual(publicKeyBase64)
            done()
         })
      })
   })
})
