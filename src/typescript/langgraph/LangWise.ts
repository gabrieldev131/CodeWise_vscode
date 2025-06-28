import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { LLMFactoryDispatcher } from './factory/LLMFactoryDispatcher'; 

export class LangWise {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly provider: string;

  private readonly providerEnvMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    google: 'GOOGLE_API_KEY',
    gemini: 'GEMINI_API_KEY',      
    groq: 'GROQ_API_KEY',
    ollama: 'OLLAMA_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    cohere: 'COHERE_API_KEY',
    together: 'TOGETHER_API_KEY',

  };
  
  constructor(context: vscode.ExtensionContext) {

    const envPath = path.resolve(context.extensionPath, 'src', 'typescript', 'langgraph', '.env');
    dotenv.config({ path: envPath });

    this.model = process.env.MODEL || '';
    this.provider = process.env.PROVIDER || '';
    this.apiKey = this.getApiKeyForProvider(this.provider);

    if (!this.model || !this.apiKey) {
        vscode.window.showErrorMessage("Environment variables 'MODEL' and 'GEMINI_API_KEY' are mandatory.");
    }

  }

  private getApiKeyForProvider(provider: string): any {
    const envKey = this.providerEnvMap[provider.toLowerCase()];
    if (!envKey) {
      vscode.window.showErrorMessage(`Unknown provider: ${provider}`);
    }
    
    const apiKey = process.env[envKey];
    if (!apiKey) {
      vscode.window.showErrorMessage(`API key not found for ${provider}. Check the variable ${envKey} in .env file`);
    }
  
    return apiKey;
  }
  
  private async buildAgent(promptInstruction: string, gitInput: string) {
    const { RunnableLambda } = await import('@langchain/core/runnables');
    const { HumanMessage } = await import('@langchain/core/messages');

    const llm = await LLMFactoryDispatcher.getLLM(this.provider, this.apiKey, this.model);

    const message = new HumanMessage(`${promptInstruction}\n\nConteúdo do gitInput.txt:\n${gitInput}`);

    const inputStep = new RunnableLambda({
      func: async () => [message],
    }); 

    const llmStep = new RunnableLambda({
      func: async (promptInstruction: any) => llm.invoke(promptInstruction),
    });

    return inputStep.pipe(llmStep);
  }

  public async start(context: vscode.ExtensionContext): Promise<void> {
    const scriptDir = path.resolve(context.extensionPath, 'src', 'typescript', 'langgraph');
    const inputPath = path.join(scriptDir, 'gitInput.txt');
    let gitInput: string;

    while(true){
      
      while (true) {
        if (fs.existsSync(inputPath)) {
          gitInput = fs.readFileSync(inputPath, 'utf-8');
          break;
        }
        await new Promise(r => setTimeout(r, 1000)); // espera 1 segundo
      }
      
      const architectAgent = await this.buildAgent(`
  Diga absolutamente nada sobre o arquivo gitInput.
  Você é um Arquiteto de Software com mais de 10 anos de experiência.
  Analise a estrutura de pastas do projeto descrito. Identifique se há um padrão arquitetural (ex: MVC, DDD, Clean).
  Retorne um relatório detalhado sobre como a estrutura poderia ser melhorada, 
  caso não seja identificada a arquitetura, indique uma.
      `, gitInput);

      const integrationAgent = await this.buildAgent(`
  Diga absolutamente nada sobre o arquivo gitInput.
  Você é um Analista de Integrações com mais de 10 anos de experiência.
  Avalie os fluxos de integração do projeto. Descreva como os módulos interagem, problemas de acoplamento ou falhas.
      `, gitInput);

      const solidAgent = await this.buildAgent(`
  Diga absolutamente nada sobre o arquivo gitInput.
  Você é um Guardião dos Princípios SOLID com mais de 10 anos de experiência.
  Revise as classes e métodos encontrados no código, identifique violações aos princípios SOLID e sugira correções.
      `, gitInput);

      const importAnalistAgent = await this.buildAgent(`
  Diga absolutamente nada sobre o arquivo gitInput.
  Você é um analista de frameworks com mais de 10 anos de experiência.
  Revise as classes e métodos encontrados no código, identifique melhorias que poderiam ser feitas com os frameworks
  dos quais estão sendo usados e caso não haja indique até 3 frame works que se encaixariam melhor ao projeto,
  focando em escalabilidade e código limpo.
      `, gitInput);

      const patternsAgent = await this.buildAgent(`
  Diga absolutamente nada sobre o arquivo gitInput.
  Você é um Consultor de Design Patterns com mais de 10 anos de experiência.
  Sugira até 3 padrões de projeto que poderiam melhorar o código, diminuindo a quantidade de código e tornando-o 
  mais escalavel e limpo. Explique como e onde aplicá-los.
      `, gitInput);

      const [architectResult, integrationResult, solidResult, importAnalistResult, patternsResult] = await Promise.all([
        architectAgent.invoke([]),
        integrationAgent.invoke([]),
        solidAgent.invoke([]),
        importAnalistAgent.invoke([]),
        patternsAgent.invoke([]),
      ]);

      const allOutputs = `
## Arquitetura do Projeto

      ${architectResult.content}

      ---

## Integração entre Módulos

      ${integrationResult.content}

      ---
## Análise de Frameworks

      ${importAnalistResult.content}

      ---
## Análise dos Princípios SOLID

      ${solidResult.content}

      ---

## Sugestão de Design Patterns

      ${patternsResult.content}
      `;


      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showWarningMessage('No open workspaces.');
      return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;
      const outputPath = path.join(workspacePath, 'commit_analysis_report.md');

      fs.writeFileSync(outputPath, allOutputs, { encoding: 'utf-8' });

      if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
      } 
    }
  }
}
