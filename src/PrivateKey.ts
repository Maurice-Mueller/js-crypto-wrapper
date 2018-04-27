export class PrivateKey {
   private readonly key: CryptoKey

   constructor (key: CryptoKey) {
      this.key = key
   }
}
