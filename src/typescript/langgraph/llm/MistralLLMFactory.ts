import { LLMFactory } from './LLMFactory';
import { registerFactory } from './FactoryRegistry';

@registerFactory('mistral')
export class MistralLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatMistralAI } = await import('@langchain/mistralai');
    return new ChatMistralAI({ apiKey, model });
  }
}