import { LLMFactory } from '../factory/LLMFactory';
import { registerFactory } from '../factory/FactoryRegistry';

@registerFactory('ollama')
export class OllamaLLMFactory implements LLMFactory {
  async createLLM(_: string, model: string) {
    const { ChatOllama } = await import('@langchain/community/chat_models/ollama');
    return new ChatOllama({ model });
  }
}
