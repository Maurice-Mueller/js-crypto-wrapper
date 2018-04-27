import {WebCryptoConfig} from '../src/config/WebCryptoConfig'

export function extractable (key: CryptoKey) {
   expect(key.extractable).toBeTruthy()
}

export function algorithmDefaultKeyPair (key: CryptoKey) {
   expect(key.algorithm).toBe(WebCryptoConfig.DEFAULT.keyPairConfig.keyParams)
}
