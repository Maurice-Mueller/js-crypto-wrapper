import {DeSerializeParameter, DeSerializeParameterBuilder, SerializedType, SimpleDeserialize, SimpleSerialize} from '@esentri/de-serializer'
import {
   ArrayBufferWithBinaryDataToBase64,
   Base64WithBinaryDataToArrayBuffer, StringToArrayBuffer
} from '@esentri/transformer-functions'
import {
   WrappedKey,
   SymmetricKeyConfig,
   SymmetricKeyConfigBuilder,
   SymmetricKeyDerivationConfig,
   WebCryptoConfig,
   EncryptedObject,
   InitializationVector, PublicKey, PrivateKey, KeyPairConfig
} from './crypto-wrapper'

export class SymmetricKey {

   private key: CryptoKey

   constructor (cryptoKey: CryptoKey) {
      this.key = cryptoKey
   }

   public encrypt (encryptee: any,
                   vector: InitializationVector = InitializationVector.random(),
                   parameters: DeSerializeParameter = new DeSerializeParameterBuilder()
                      .withFunctions(true)
                      .serializedType(SerializedType.ARRAY_BUFFER)
                      .build())
      : Promise<EncryptedObject> {
      return SimpleSerialize(encryptee, parameters).then(encryptee => {
         return window.crypto.subtle.encrypt(
            {name: this.key.algorithm.name!, iv: vector.asArray()},
            this.key,
            encryptee)
            .then(encryptedData => {
               return new EncryptedObject(encryptedData, this.key.algorithm, vector)
            }) as Promise<EncryptedObject>
      })
   }

   public decrypt (decryptionParameters: any, content: ArrayBuffer, prototype: any = null)
      : Promise<any> {
      return window.crypto.subtle
         .decrypt(decryptionParameters, this.key, content).then(decrypted => {
            if (prototype == null) return decrypted
            return SimpleDeserialize(decrypted, prototype)
         }) as Promise<any>
   }

   public extractKey (): Promise<string> {
      return window.crypto.subtle.exportKey('raw', this.key).then(rawKey => {
         return ArrayBufferWithBinaryDataToBase64(rawKey)
      }) as Promise<string>
   }

   public wrapKey (key: SymmetricKey | PublicKey | PrivateKey): Promise<WrappedKey> {
      let format = 'raw'
      if (key instanceof PublicKey) format = 'spki'
      if (key instanceof PrivateKey) format = 'pkcs8'
      let initializationVector = InitializationVector.random()
      return window.crypto.subtle
         .wrapKey(format,
            (key as any)['key'],
            this.key,
            this.decryptionParameters(initializationVector)
         )
         .then(rawKey =>
            new WrappedKey(
               ArrayBufferWithBinaryDataToBase64(rawKey),
               key.keyConfig(),
               initializationVector)) as Promise<WrappedKey>
   }

   public unwrapSymmetricKey (base64: string, vector: InitializationVector, config: SymmetricKeyConfig = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.unwrapKey('raw',
         Base64WithBinaryDataToArrayBuffer(base64),
         this.key,
         this.decryptionParameters(vector),
         config.keyAlgorithm,
         config.extractable,
         config.keyUsage)
         .then((key: CryptoKey) => new SymmetricKey(key)) as Promise<SymmetricKey>
   }

   public unwrapPublicKey (base64: string, vector: InitializationVector, config: KeyPairConfig = KeyPairConfig.DEFAULT)
      : Promise<PublicKey> {
      return window.crypto.subtle.unwrapKey('spki',
         Base64WithBinaryDataToArrayBuffer(base64),
         this.key,
         this.decryptionParameters(vector),
         config.keyParams,
         config.extractable,
         config.keyUsage)
         .then((key: CryptoKey) => new PublicKey(key)) as Promise<PublicKey>
   }

   public unwrapPrivateKey (base64: string, vector: InitializationVector, config: KeyPairConfig = KeyPairConfig.DEFAULT)
      : Promise<PrivateKey> {
      return window.crypto.subtle.unwrapKey('pkcs8',
         Base64WithBinaryDataToArrayBuffer(base64),
         this.key,
         this.decryptionParameters(vector),
         config.keyParams,
         config.extractable,
         config.keyUsage)
         .then((key: CryptoKey) => new PrivateKey(key)) as Promise<PrivateKey>
   }

   public keyConfig (): SymmetricKeyConfig {
      return new SymmetricKeyConfigBuilder()
         .keyAlgorithm(this.key.algorithm.name!)
         .extractable(this.key.extractable)
         .keyUsage(this.key.usages)
         .length((this.key.algorithm as any)['length'])
         .build()
   }

   public decryptionParameters (vector: InitializationVector | Uint8Array): any {
      if (vector instanceof InitializationVector) vector = vector.asArray()
      return {name: this.key.algorithm.name, iv: vector}
   }

   public static fromBase64 (base64: string, config = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      return this.fromRaw(Base64WithBinaryDataToArrayBuffer(base64), config)
   }

   public static fromRaw (rawKey: ArrayBuffer, config = SymmetricKeyConfig.DEFAULT)
      : Promise<SymmetricKey> {
      // saving the keyParams in an extra variable is necessary because of a bug in one of the test
      // libraries
      const keyParams = {} as any
      Object.assign(keyParams, config.keyParams)
      return window.crypto.subtle.importKey('raw',
         rawKey,
         keyParams,
         config.extractable,
         config.keyUsage).then(key => {
         return new SymmetricKey(key)
      }) as Promise<SymmetricKey>
   }

   public static fromPassword (password: string, salt: string = 'adapt this to your own salt',
                               config = SymmetricKeyDerivationConfig.DEFAULT): Promise<SymmetricKey> {
      return window.crypto.subtle.importKey('raw',
         StringToArrayBuffer(password),
         config.keyAlgorithmDerivation,
         false,
         ['deriveKey'])
         .then(baseKey => window.crypto.subtle.deriveKey({
               name: config.keyAlgorithmDerivation,
               salt: StringToArrayBuffer(salt),
               iterations: config.iterationsForDerivation,
               hash: config.hashFunction
            },
            baseKey,
            config.keyParamsResultingKey,
            config.extractableResultingKey,
            config.keyUsageResultingKey))
         .then(cryptoKey => new SymmetricKey(cryptoKey)) as Promise<SymmetricKey>
   }

   static random (config: SymmetricKeyConfig = WebCryptoConfig.DEFAULT.symmetricKeyConfig)
      : Promise<SymmetricKey> {
      return window.crypto.subtle.generateKey(config.keyParams, config.extractable, config.keyUsage)
         .then((key) => {
            return new SymmetricKey(key as CryptoKey)
         }) as Promise<SymmetricKey>
   }
}
