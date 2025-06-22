import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export class LangWise {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly rootPath: string;

  constructor(context: vscode.ExtensionContext) {

    this.rootPath = context.extensionPath;

    const envPath = path.resolve(this.rootPath, 'src', 'typescript', 'langgraph', '.env');
    dotenv.config({ path: envPath });

    this.model = process.env.MODEL || '';
    this.apiKey = process.env.GEMINI_API_KEY || '';

    if (!this.model || !this.apiKey) {
        vscode.window.showErrorMessage("Environment variables 'MODEL' and 'GEMINI_API_KEY' are mandatory.");
    }

  }

  private async buildAgent(promptInstruction: string, gitInput: string) {
    const { RunnableLambda } = await import('@langchain/core/runnables');
    const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
    const { HumanMessage } = await import('@langchain/core/messages');

    const llm = new ChatGoogleGenerativeAI({
      apiKey: this.apiKey,
      model: this.model,
    });

    type HumanMsg = InstanceType<typeof HumanMessage>;
    const inputStep = new RunnableLambda<[], HumanMsg[]>({
      func: async () => {
        return [
          new HumanMessage(`${promptInstruction}\n\nConteúdo do gitInput.txt:\n${gitInput}`),
        ];
      },
    });

    const llmStep = new RunnableLambda<HumanMsg[], any>({
      func: async (input: HumanMsg[]) => {
        return llm.invoke(input);
      },
    });

    return inputStep.pipe(llmStep);
  }

  public async start(context: vscode.ExtensionContext): Promise<void> {
    const scriptDir = path.resolve(this.rootPath, 'src', 'typescript', 'langgraph');
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
  Você é um Arquiteto de Software.
  Analise a estrutura de pastas do projeto descrito. Identifique se há um padrão arquitetural (ex: MVC, DDD, Clean).
  Retorne um relatório detalhado.
      `, gitInput);

      const integrationAgent = await this.buildAgent(`
  Você é um Analista de Integrações.
  Avalie os fluxos de integração do projeto. Descreva como os módulos interagem, problemas de acoplamento ou falhas.
      `, gitInput);

      const solidAgent = await this.buildAgent(`
  Você é um Guardião dos Princípios SOLID.
  Revise as classes e métodos encontrados no código, identifique violações aos princípios SOLID e sugira correções.
      `, gitInput);

      const patternsAgent = await this.buildAgent(`
  Você é um Consultor de Design Patterns.
  Sugira até 3 padrões de projeto que poderiam melhorar o código. Explique como e onde aplicá-los.
      `, gitInput);

      const [architectResult, integrationResult, solidResult, patternsResult] = await Promise.all([
        architectAgent.invoke([]),
        integrationAgent.invoke([]),
        solidAgent.invoke([]),
        patternsAgent.invoke([]),
      ]);

      const allOutputs = `
      ## Arquitetura do Projeto

      ${architectResult.content}

      ---

      ## Integração entre Módulos

      ${integrationResult.content}

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

      const gitInputPath = path.join(this.rootPath, 'src', 'typescript', 'langgraph', 'gitInput.txt');

      if (fs.existsSync(gitInputPath)) {
          fs.unlinkSync(gitInputPath);
      } 
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
