import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('openai')
export class OpenAILLMFactory implements LLMFactory {
  async createLLM(apiKey: string, model: string) {
    const { ChatOpenAI } = await import('@langchain/openai');
    return new ChatOpenAI({ openAIApiKey: apiKey, modelName: model });
  }
}
