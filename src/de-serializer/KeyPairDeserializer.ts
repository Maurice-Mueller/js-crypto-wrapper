import {Deserializer} from '@esentri/de-serializer'
import {KeyPair} from '../KeyPair'
import {KeyPairSerialized} from './KeyPairSerialized'
import {KeyPairExtracted} from '../KeyPairExtracted'
import {KeyPairConfigBuilder} from '../config/KeyPairConfig'

function keyPairSerializedToKeyPairExtracted (keyPairSerialized: KeyPairSerialized)
   : KeyPairExtracted {
   return new KeyPairExtracted(keyPairSerialized.publicKey.key, keyPairSerialized.privateKey.key)
}

export const KeyPairDeserializer: Deserializer<KeyPair> = {
   deserialize: (serialized: KeyPairSerialized): Promise<KeyPair> => {
      const config = new KeyPairConfigBuilder()
         .keyAlgorithm(serialized.publicKey.keyConfig.keyAlgorithm)
         .keyUsage(serialized.publicKey.keyConfig.keyUsage.concat(serialized.privateKey.keyConfig.keyUsage))
         .extractable(serialized.publicKey.keyConfig.extractable)
         .build()
      return KeyPair.fromExtracted(keyPairSerializedToKeyPairExtracted(serialized), config)
   }
}
