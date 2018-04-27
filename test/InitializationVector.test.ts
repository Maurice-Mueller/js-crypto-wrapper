import {InitializationVector} from '../src/InitializationVector'
import {WebCryptoConfig} from '../src/config/WebCryptoConfig'

describe('test initialization vector', () => {
   it('random with default', () => {
      const vector = InitializationVector.random()
      expect(vector).toBeDefined()
      expect(vector.asArray().byteLength)
         .toEqual(WebCryptoConfig.DEFAULT.initializationVectorLength)
   })

   it('random with custom', () => {
      const vector = InitializationVector.random({length: 20})
      expect(vector).toBeDefined()
      expect(vector.asArray().byteLength).toEqual(20)
   })
})
