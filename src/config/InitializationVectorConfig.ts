export class InitializationVectorConfig {
   public length: number

   constructor (length: number = 16) {
      this.length = length
   }

   public static DEFAULT: InitializationVectorConfig = new InitializationVectorConfig()
}
