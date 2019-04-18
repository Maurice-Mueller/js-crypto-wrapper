import {Deserializer} from '@esentri/de-serializer'
import {SymmetricKey} from '../SymmetricKey'
import {SymmetricKeySerialized} from './SymmetricKeySerialized'
import {SymmetricKeyConfigBuilder} from '../config/SymmetricKeyConfig'

export const SymmetricKeyDeserializer: Deserializer<SymmetricKey> = {
   deserialize: (dataStructure: SymmetricKeySerialized): Promise<SymmetricKey> => {
      let config = new SymmetricKeyConfigBuilder()
         .keyAlgorithm(dataStructure.keyConfig.keyAlgorithm)
         .keyUsage(dataStructure.keyConfig.keyUsage)
         .length(dataStructure.keyConfig.length)
         .build()
      return SymmetricKey.fromBase64(dataStructure.key, config)
   }
}
