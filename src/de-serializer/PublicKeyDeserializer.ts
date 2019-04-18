import {Deserializer} from '@esentri/de-serializer'
import {PublicKey} from '../PublicKey'
import {PublicKeySerialized} from './PublicKeySerialized'
import {KeyPairConfigBuilder} from '../config/KeyPairConfig'
import {FilterPublicKeyUsage, KeyUsage} from '../config/KeyUsage'

export const PublicKeyDeserializer: Deserializer<PublicKey> = {
   deserialize: (dataStructure: PublicKeySerialized): Promise<PublicKey> => {
      let config = new KeyPairConfigBuilder()
         .keyUsage(FilterPublicKeyUsage(dataStructure.keyConfig.keyUsage))
         .extractable(dataStructure.keyConfig.extractable)
         .keyAlgorithm(dataStructure.keyConfig.keyAlgorithm)
         .build()
      return PublicKey.fromBase64(dataStructure.key, config)
   }
}
