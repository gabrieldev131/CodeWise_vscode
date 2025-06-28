import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('together')
export class TogetherLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatTogetherAI } = await import('@langchain/community/chat_models/togetherai');
    return new ChatTogetherAI({ apiKey, model });
  }
}
