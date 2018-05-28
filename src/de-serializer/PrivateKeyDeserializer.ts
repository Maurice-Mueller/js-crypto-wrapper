import {Deserializer} from '@esentri/de-serializer'
import {PrivateKey} from '../PrivateKey'
import {PrivateKeySerialized} from './PrivateKeySerialized'
import {KeyPairConfigBuilder} from '../config/KeyPairConfig'
import {FilterPrivateKeyUsage} from '../config/KeyUsage'

export const PrivateKeyDeserializer: Deserializer<PrivateKey> = {
   deserialize: (dataStructure: PrivateKeySerialized): Promise<PrivateKey> => {
      let config = new KeyPairConfigBuilder()
         .keyUsage(FilterPrivateKeyUsage(dataStructure.keyConfig.keyUsage))
         .keyAlgorithm(dataStructure.keyConfig.keyAlgorithm)
         .extractable(dataStructure.keyConfig.extractable)
         .build()
      return PrivateKey.fromBase64(dataStructure.key, config)
   }
}
