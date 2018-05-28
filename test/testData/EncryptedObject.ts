import {EncryptedObject, InitializationVector} from '../../src/crypto-wrapper'

export const TestEncryptedObject = new EncryptedObject(
   new Uint8Array([10, 11, 12]).buffer as ArrayBuffer,
   {name: 'test'},
   new InitializationVector(new Uint8Array([12, 11, 10]))
)
