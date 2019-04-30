import {PublicKey} from '../../src/crypto-wrapper'

describe('test public key with stuff from production', () => {

   it('public key from base 64 from production', done => {
      let base64 = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk9Qnk67zh6zSre5n7qx+55q1plaTKgwZMLo00gE6gTf4n1jJPBCmifIqdCAxSVP1bQK4LTcHwsERDki1LWsk76bGKna73PFxkSO6AqOlggPxaMHc5B/zVaY4zDfPokRfui6Cy4/2k2WtOwnk2Jr0dMt/x15521EP7MNmRreobfTKt69dshkbhmU3WNrIrV/qYqVYjqj1dsDdHL6Cj4Euv5uA31y1VY/cMuEtOoq/POQ+SNYddgIP3ThPvFmNF/cHdpqN/E9OsXrctCettTvPXhD6J8OCM9ft2dlQle/dcuz+RY7mVynts4+ksMnICT5aHsaRX5TSEaEjGbAUi3WZUwIDAQAB'
      PublicKey.fromBase64(base64).then(_ => {
         done()
      })
   })

})
