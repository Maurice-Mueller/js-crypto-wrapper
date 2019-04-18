import {HashAlgorithm} from './HashAlgorithm'
import {KeyAlgorithm} from './KeyAlgorithm'
import {PublicExponent} from './PublicExponent'
import {ModulusLength} from './ModulusLength'
import {KeyUsage} from './KeyUsage'

export class KeyPairConfig {
   public readonly keyAlgorithm: string
   public readonly modulusLength: number
   public readonly publicExponent: Uint8Array
   public readonly hashAlgorithm: string
   public readonly extractable: boolean
   public readonly keyUsage: Array<string>
   public readonly keyParams: any

   constructor (keyAlgorithm: string = KeyAlgorithm.RSA_OAEP,
                modulusLength: number = ModulusLength._2048,
                publicExponent: Uint8Array = PublicExponent.DEFAULT,
                hashAlgorithm: string = HashAlgorithm.SHA_512,
                extractable: boolean = true,
                keyUsage: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT, KeyUsage.WRAP_KEY,
                   KeyUsage.UNWRAP_KEY]) {
      this.keyAlgorithm = keyAlgorithm
      this.modulusLength = modulusLength
      this.publicExponent = publicExponent
      this.hashAlgorithm = hashAlgorithm
      this.extractable = extractable
      this.keyUsage = keyUsage
      this.keyParams = {
         name: this.keyAlgorithm,
         modulusLength: this.modulusLength,
         publicExponent: this.publicExponent,
         hash: {name: this.hashAlgorithm}
      }
   }

   public static readonly DEFAULT: KeyPairConfig = new KeyPairConfig()
}

export class KeyPairConfigBuilder {
   private _keyAlgorithm: string = KeyAlgorithm.RSA_OAEP
   private _modulusLength: number = ModulusLength._2048
   private _publicExponent: Uint8Array = PublicExponent.DEFAULT
   private _hashAlgorithm: string = HashAlgorithm.SHA_512
   private _extractable: boolean = true
   private _keyUsage: Array<string> = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]

   public keyAlgorithm (value: string): KeyPairConfigBuilder {
      this._keyAlgorithm = value
      return this
   }

   public modulusLength (value: number): KeyPairConfigBuilder {
      this._modulusLength = value
      return this
   }

   public publicExponent (value: Uint8Array): KeyPairConfigBuilder {
      this._publicExponent = value
      return this
   }

   public hashAlgorithm (value: string): KeyPairConfigBuilder {
      this._hashAlgorithm = value
      return this
   }

   public extractable (value: boolean): KeyPairConfigBuilder {
      this._extractable = value
      return this
   }

   public keyUsage (values: Array<string>): KeyPairConfigBuilder {
      this._keyUsage = values
      return this
   }

   public build (): KeyPairConfig {
      return new KeyPairConfig(this._keyAlgorithm,
         this._modulusLength,
         this._publicExponent,
         this._hashAlgorithm,
         this._extractable,
         this._keyUsage)
   }
}
