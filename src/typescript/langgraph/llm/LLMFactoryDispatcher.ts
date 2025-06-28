import { factoryRegistry } from './FactoryRegistry';

import './OpenAILLMFactory';
import './GoogleLLMFactory';
import './OllamaLLMFactory';
import './AnthropicLLMFactory';
import './GroqLLMFactory';
import './TogetherLLMFactory';
import './MistralLLMFactory';
import './CohereLLMFactory';

export class LLMFactoryDispatcher {
  static async getLLM(provider: string, apiKey: string, model: string): Promise<any> {
    const FactoryClass = factoryRegistry.get(provider.toLowerCase());

    if (!FactoryClass) {
      throw new Error(`LLM provider not supported: ${provider}`);
    }

    const factory = new FactoryClass();
    return factory.createLLM(apiKey, model);
  }
}
