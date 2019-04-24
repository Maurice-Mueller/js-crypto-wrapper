import {PrivateKey} from '../src/crypto-wrapper'
import {PrivateKeyBase64, symKeyBase64, WrappedDefaultSymKeyBase64} from './testData/Keys'

describe('private key', () => {

   it('import/export from/to base64', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         privateKey.extractKey().then(base64 => {
            expect(base64).toEqual(PrivateKeyBase64)
            done()
         })
      })
   })

   it('unwrap key', done => {
      PrivateKey.fromBase64(PrivateKeyBase64).then(privateKey => {
         privateKey.unwrapSymmetricKey(WrappedDefaultSymKeyBase64).then(unwrappedKey => {
            unwrappedKey.extractKey().then(extracted => {
               expect(extracted).toEqual(symKeyBase64)
               done()
            })
         })
      })
   })
})
