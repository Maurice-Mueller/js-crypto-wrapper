export class PublicKey {
   private readonly key: CryptoKey

   constructor (key: CryptoKey) {
      this.key = key
   }
}
