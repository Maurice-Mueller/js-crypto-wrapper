import {PrivateKey} from '../src/PrivateKey'
import {PrivateKeyBase64} from './testData/Keys'

describe('private key', () => {

   it('import/export from/to base64', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(publicKey => {
         publicKey.extractKey().then(hexString => {
            expect(hexString).toEqual(PrivateKeyBase64)
            done()
         })
      })
   })
})
