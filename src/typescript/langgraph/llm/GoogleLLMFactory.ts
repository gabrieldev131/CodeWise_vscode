import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('google')
@registerFactory('gemini')
export class GoogleLLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
    return new ChatGoogleGenerativeAI({ apiKey, model });
  }
}
