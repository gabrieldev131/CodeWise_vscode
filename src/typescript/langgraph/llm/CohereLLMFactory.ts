import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('cohere')
export class CohereLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatCohere } = await import('@langchain/cohere');
    return new ChatCohere({ apiKey, model });
  }
}
