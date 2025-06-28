export interface LLMFactory {
    createLLM(apiKey: string, model: string): Promise<any>;
  }
  