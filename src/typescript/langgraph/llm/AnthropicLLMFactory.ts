import { LLMFactory } from './LLMFactory';
import { registerFactory } from './FactoryRegistry';

@registerFactory('anthropic')
export class AnthropicLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatAnthropic } = await import('@langchain/anthropic');
    return new ChatAnthropic({ apiKey, model });
  }
}
