import {InitializationVectorConfig} from './config/InitializationVectorConfig'

export class InitializationVector {

   private vector: Uint8Array

   constructor (vector: Uint8Array) {
      this.vector = vector
   }

   public asArray (): Uint8Array {
      return this.vector
   }

   public static random (config: InitializationVectorConfig = InitializationVectorConfig.DEFAULT)
      : InitializationVector {
      let vector = new Uint8Array(config.length)
      window.crypto.getRandomValues(vector)
      return new InitializationVector(vector)
   }
}
