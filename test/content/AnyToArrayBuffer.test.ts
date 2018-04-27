import {AnyToArrayBuffer} from '../../src/content/AnyToArrayBuffer'
import {ArrayBufferEqual} from './ArrayBufferFunctions'

class UnsupportedType {}

describe('test any to array buffer transformation', () => {

   it('string to ArrayBuffer', () => {
      const testString = 'hello world'
      const arrayBuffer: ArrayBuffer = AnyToArrayBuffer(testString)
      expect(arrayBuffer).toBeInstanceOf(ArrayBuffer)
      expect(arrayBuffer.byteLength).toBe(11)
      const expectedBuffer = new Uint8Array(
         [104,101,108,108,111,32,119,111,114,108,100]).buffer as ArrayBuffer
      expect(ArrayBufferEqual(arrayBuffer, expectedBuffer)).toBeTruthy()
   })

   it('Uint8Array to ArrayBuffer', () => {
      const testArray = new Uint8Array([104,101,108,108,111,32,119,111,114,108,100])
      const arrayBuffer: ArrayBuffer = AnyToArrayBuffer(testArray)
      expect(ArrayBufferEqual(arrayBuffer, testArray.buffer as ArrayBuffer)).toBeTruthy()
   })

   it('unsupported primitive type', () => {
      expect(() => AnyToArrayBuffer(123)).toThrow()
   })

   it('unsupported object type', () => {
      expect(() => AnyToArrayBuffer(new UnsupportedType())).toThrow()
   })
})
