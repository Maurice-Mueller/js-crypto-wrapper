import {KeyAlgorithm} from './KeyAlgorithm'
import {SymmetricKeyLength} from './SymmetricKeyLength'
import {KeyUsage} from './KeyUsage'
import {HashAlgorithm} from './HashAlgorithm'

export class SymmetricKeyDerivationConfig {
   public readonly keyAlgorithmDerivation: string
   public readonly keyAlgorithmResultingKey: string
   public readonly keyLengthResultingKey: number
   public readonly iterationsForDerivation: number
   public readonly extractableResultingKey: boolean
   public readonly keyUsageResultingKey: Array<string>
   public readonly keyParamsResultingKey: any
   public readonly hashFunction: string

   constructor (keyAlgorithmDerivation: string = KeyAlgorithm.PBKDF2,
                keyAlgorithmResultingKey: string = KeyAlgorithm.AES_CBC,
                keyLengthResultingKey: number = SymmetricKeyLength._256,
                iterationsForDerivation: number = 1000,
                extractableResultingKey: boolean = true,
                keyUsageResultingKey: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
                hashFunction: string = HashAlgorithm.SHA_256) {
      this.keyAlgorithmDerivation = keyAlgorithmDerivation
      this.keyAlgorithmResultingKey = keyAlgorithmResultingKey
      this.keyLengthResultingKey = keyLengthResultingKey
      this.iterationsForDerivation = iterationsForDerivation
      this.extractableResultingKey = extractableResultingKey
      this.keyUsageResultingKey = keyUsageResultingKey
      this.keyParamsResultingKey = {name: this.keyAlgorithmResultingKey, length: this.keyLengthResultingKey}
      this.hashFunction = hashFunction
   }

   public static readonly DEFAULT: SymmetricKeyDerivationConfig = new SymmetricKeyDerivationConfig()
}

export class SymmetricKeyDerivationConfigBuilder {
   private _keyAlgorithmDerivation: string = KeyAlgorithm.PBKDF2
   private _keyAlgorithmResultingKey: string = KeyAlgorithm.AES_CBC
   private _keyLengthResultingKey: number = SymmetricKeyLength._256
   private _extractableResultingKey: boolean = true
   private _keyUsageResultingKey: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]
   private _iterationsForDerivation: number = 1000
   private _hashFunction: string = HashAlgorithm.SHA_256

   public keyAlgorithmDerivation (value: string): SymmetricKeyDerivationConfigBuilder {
      this._keyAlgorithmDerivation = value
      return this
   }

   public keyAlgorithmResultingKey (value: string): SymmetricKeyDerivationConfigBuilder {
      this._keyAlgorithmResultingKey = value
      return this
   }

   public keyLengthResultingKey (value: number): SymmetricKeyDerivationConfigBuilder {
      this._keyLengthResultingKey = value
      return this
   }

   public extractableResultingKey (value: boolean): SymmetricKeyDerivationConfigBuilder {
      this._extractableResultingKey = value
      return this
   }

   public keyUsageResultingKey (values: Array<string>): SymmetricKeyDerivationConfigBuilder {
      this._keyUsageResultingKey = values
      return this
   }

   public iterationsForDerivation (value: number): SymmetricKeyDerivationConfigBuilder {
      this._iterationsForDerivation = value
      return this
   }

   public hashFunction (value: string): SymmetricKeyDerivationConfigBuilder {
      this._hashFunction = value
      return this
   }

   public build (): SymmetricKeyDerivationConfig {
      return new SymmetricKeyDerivationConfig(this._keyAlgorithmDerivation,
         this._keyAlgorithmResultingKey,
         this._keyLengthResultingKey,
         this._iterationsForDerivation,
         this._extractableResultingKey,
         this._keyUsageResultingKey)
   }

}
