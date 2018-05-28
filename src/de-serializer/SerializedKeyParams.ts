export class SerializedKeyParams {
   public readonly algorithm: string
   public readonly usage: Array<string>

   constructor (algorithm: string, usage: Array<string>) {
      this.algorithm = algorithm
      this.usage = usage
   }
}
