import {isPrimitive} from 'util'

const ConstTextEncoder = new TextEncoder()

export function AnyToArrayBuffer (value: any): ArrayBuffer {
   if (isPrimitive(value)) return PrimitiveToArrayBuffer(value)
   return ObjectToArrayBuffer(value)
}

function PrimitiveToArrayBuffer (value: any): ArrayBuffer {
   switch (typeof value) {
      case 'string': {
         return StringToArrayBuffer(value)
      }
      default: {
         throw new Error('Cannot convert primitive type to ArrayBuffer. Unsupported type: '
            + typeof value)
      }
   }
}

function ObjectToArrayBuffer (value: object): ArrayBuffer {
   const className = value.constructor.name
   switch (className) {
      case 'Uint8Array': {
         return Uint8ArrayToArrayBuffer(value as Uint8Array)
      }
   }
   throw new Error('Cannot convert object type to ArrayBuffer. Unsupported type: '
      + className)
}

function Uint8ArrayToArrayBuffer (value: Uint8Array): ArrayBuffer {
   return value.buffer as ArrayBuffer
}

function StringToArrayBuffer (value: string): ArrayBuffer {
   return Uint8ArrayToArrayBuffer(ConstTextEncoder.encode(value))
}
