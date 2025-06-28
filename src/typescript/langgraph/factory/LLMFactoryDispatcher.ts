import { factoryRegistry } from './FactoryRegistry';

import '../llm/OpenAILLMFactory';
import '../llm/GoogleLLMFactory';
import '../llm/OllamaLLMFactory';
import '../llm/AnthropicLLMFactory';
import '../llm/GroqLLMFactory';
import '../llm/TogetherLLMFactory';
import '../llm/MistralLLMFactory';
import '../llm/CohereLLMFactory';

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
