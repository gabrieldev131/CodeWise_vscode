import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export class LangWise {
  private readonly gitInput: string;
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
        vscode.window.showErrorMessage("Variáveis de ambiente 'MODEL' e 'GEMINI_API_KEY' são obrigatórias.");
    }

    const scriptDir = path.resolve(this.rootPath, 'src', 'typescript', 'langgraph');
    const inputPath = path.join(scriptDir, 'gitInput.txt');

    if (!fs.existsSync(inputPath)) {

      throw new Error('Arquivo gitInput.txt não encontrado.');
    }

    this.gitInput = fs.readFileSync(inputPath, 'utf-8');
  }

  private async buildAgent(promptInstruction: string) {
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
          new HumanMessage(`${promptInstruction}\n\nConteúdo do gitInput.txt:\n${this.gitInput}`),
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
    const { RunnableSequence } = await import('@langchain/core/runnables');

    const architectAgent = await this.buildAgent(`
Você é um Arquiteto de Software.
Analise a estrutura de pastas do projeto descrito. Identifique se há um padrão arquitetural (ex: MVC, DDD, Clean).
Retorne um relatório detalhado.
    `);

    const integrationAgent = await this.buildAgent(`
Você é um Analista de Integrações.
Avalie os fluxos de integração do projeto. Descreva como os módulos interagem, problemas de acoplamento ou falhas.
    `);

    const solidAgent = await this.buildAgent(`
Você é um Guardião dos Princípios SOLID.
Revise as classes e métodos encontrados no código, identifique violações aos princípios SOLID e sugira correções.
    `);

    const patternsAgent = await this.buildAgent(`
Você é um Consultor de Design Patterns.
Sugira até 3 padrões de projeto que poderiam melhorar o código. Explique como e onde aplicá-los.
    `);

    const crew = RunnableSequence.from([
      architectAgent,
      integrationAgent,
      solidAgent,
      patternsAgent,
    ]);

    const result = await crew.invoke([]);

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('Nenhum workspace aberto.');
    return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const outputPath = path.join(workspacePath, 'commit_analysis_report.md');

    const allOutputs = result.content;

    fs.writeFileSync(outputPath, allOutputs, { encoding: 'utf-8' });

    const gitInputPath = path.join(this.rootPath, 'src', 'typescript', 'langgraph', 'gitInput.txt');

    if (fs.existsSync(gitInputPath)) {
        fs.unlinkSync(gitInputPath);
    } 
  }
}
