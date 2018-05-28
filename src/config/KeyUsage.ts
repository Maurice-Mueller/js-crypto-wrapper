export class KeyUsage {
   public static readonly ENCRYPT: string = 'encrypt'
   public static readonly DECRYPT: string = 'decrypt'
   public static readonly SIGN: string = 'sign'
   public static readonly VERIFY: string = 'verify'
   public static readonly DERIVE_KEY: string = 'deriveKey'
   public static readonly DERIVE_BITS: string = 'deriveBits'
   public static readonly WRAP_KEY: string = 'wrapKey'
   public static readonly UNWRAP_KEY: string = 'unwrapKey'
}

export function FilterPrivateKeyUsage(usage: Array<string>): Array<string> {
   return usage.filter(use => use === KeyUsage.UNWRAP_KEY || use === KeyUsage.DECRYPT)
}

export function FilterPublicKeyUsage(usage: Array<string>): Array<string> {
   return usage.filter(use => use === KeyUsage.ENCRYPT || use === KeyUsage.WRAP_KEY)
}
