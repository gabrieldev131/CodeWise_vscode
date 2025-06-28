import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('anthropic')
export class AnthropicLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatAnthropic } = await import('@langchain/anthropic');
    return new ChatAnthropic({ apiKey, model });
  }
}
