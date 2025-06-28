import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('mistral')
export class MistralLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatMistralAI } = await import('@langchain/mistralai');
    return new ChatMistralAI({ apiKey, model });
  }
}