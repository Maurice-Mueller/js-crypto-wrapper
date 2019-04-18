import {KeyAlgorithm} from './KeyAlgorithm'
import {SymmetricKeyLength} from './SymmetricKeyLength'
import {KeyUsage} from './KeyUsage'

export class SymmetricKeyConfig {
   public readonly keyAlgorithm: string
   public readonly length: number
   public readonly extractable: boolean
   public readonly keyUsage: Array<string>
   public readonly keyParams: any

   constructor (keyAlgorithm: string = KeyAlgorithm.AES_CBC,
                length: number = SymmetricKeyLength._256,
                extractable: boolean = true,
                keyUsage: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]) {
      this.keyAlgorithm = keyAlgorithm
      this.length = length
      this.extractable = extractable
      this.keyUsage = keyUsage
      this.keyParams = {name: this.keyAlgorithm, length: this.length}
   }

   public static readonly DEFAULT: SymmetricKeyConfig = new SymmetricKeyConfig()
}

export class SymmetricKeyConfigBuilder {
   private _keyAlgorithm: string = KeyAlgorithm.AES_CBC
   private _length: number = SymmetricKeyLength._256
   private _extractable: boolean = true
   private _keyUsage: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]

   public keyAlgorithm (value: string): SymmetricKeyConfigBuilder {
      this._keyAlgorithm = value
      return this
   }

   public length (value: number): SymmetricKeyConfigBuilder {
      this._length = value
      return this
   }

   public extractable (value: boolean): SymmetricKeyConfigBuilder {
      this._extractable = value
      return this
   }

   public keyUsage (values: Array<string>): SymmetricKeyConfigBuilder {
      this._keyUsage = values
      return this
   }

   public build (): SymmetricKeyConfig {
      return new SymmetricKeyConfig(this._keyAlgorithm,
         this._length,
         this._extractable,
         this._keyUsage)
   }

}
