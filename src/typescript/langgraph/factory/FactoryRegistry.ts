import { LLMFactory } from './LLMFactory';

export const factoryRegistry: Map<string, new () => LLMFactory> = new Map();

export function registerFactory(provider: string) {
  return function <T extends new (...args: any[]) => LLMFactory>(constructor: T) {
    factoryRegistry.set(provider.toLowerCase(), constructor);
  };
}


