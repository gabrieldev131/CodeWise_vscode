import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('groq')
export class GroqLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatGroq } = await import('@langchain/groq');
    return new ChatGroq({ apiKey, model });
  }
}
