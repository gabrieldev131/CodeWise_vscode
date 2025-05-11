import * as vscode from 'vscode';
import { exec} from 'child_process';
import ngrok from '@ngrok/ngrok';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

async function configureNgrokTokenIfNeeded(): Promise<void> {
  const tokenInput = await vscode.window.showInputBox({
    prompt: 'Digite seu token do Ngrok (copie de https://dashboard.ngrok.com/get-started/your-authtoken)',
    ignoreFocusOut: true,
    password: false
  });

  if (!tokenInput) {
    throw new Error('Token do ngrok não informado!');
  }

  try {
    await ngrok.authtoken(tokenInput);
  } catch (err) {
    throw new Error('Falha ao configurar token do ngrok.');
  }
}

function getDefaultNgrokPaths(): string[] {
  const home = os.homedir();
  const isWindows = process.platform === 'win32';
  const filenames = isWindows ? ['ngrok.exe'] : ['ngrok'];

  const directories = [
    path.join(home, 'Documents'),
    path.join(home, 'Downloads'),
    path.join(home),
    path.join(home, 'ngrok'),
  ];

  const paths: string[] = [];
  for (const dir of directories) {
    for (const file of filenames) {
      paths.push(path.join(dir, file));
    }
  }

  return paths;
}

function trySetNgrokBinEnv(): void {
  const candidates = getDefaultNgrokPaths();
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      process.env.NGROK_BIN = candidate;
      break;
    }
  }
}

async function startNgrokAndGetUrl(): Promise<string> {
  try {
    trySetNgrokBinEnv(); // define NGROK_BIN se encontrar ngrok localmente

    const listener = await ngrok.connect({
      addr: 5678,
      proto: 'http',
    });

    const url = listener.url();
    if (!url) {
      throw new Error('URL retornada pelo ngrok é nula.');
    }

    return url;
  } catch (err) {
    throw new Error('Erro ao iniciar o ngrok: ' + (err as Error).message);
  }
}

async function copyWorkflowFile(extensionPath: string){
  try{
    const workflowPath = path.join(extensionPath, 'codeWise.json');
    const destDir = path.join(os.homedir(), 'n8n-workflows');
    
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const destPath = path.join(destDir, 'codeWise.json');

      // Copia o arquivo
      fs.copyFileSync(workflowPath, destPath);

      vscode.window.showInformationMessage(`Workflow copiado para ${destPath}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Erro ao copiar workflow: ${error.message}`);
  }
}

async function startN8nWithNgrok(extensionPath: string): Promise<void> {
  

  const tokenConfigured = await vscode.window.showQuickPick(['Sim', 'Não'], {
    placeHolder: 'Você já configurou seu token do ngrok neste computador?'
  });

  if (tokenConfigured === 'Não') {
    await configureNgrokTokenIfNeeded();
  }

  const url = await startNgrokAndGetUrl();
  const host = url.replace(/^https?:\/\//, '');

  // Verifica se container está rodando
  exec('docker rm -f codewise', (err, stdout) => {

    const runCmd = `docker run -d --name codewise -p 5678:5678 -v n8n_data:/home/node/.n8n -e N8N_HOST=${host} -e N8N_PROTOCOL=https -e WEBHOOK_URL=${url} n8nio/n8n`;

    exec(runCmd, (err) => {
      if (err) {
        vscode.window.showErrorMessage(`Erro ao iniciar n8n com ngrok.` + (err as Error).message);
        return;
      }
      vscode.window.showInformationMessage(`n8n iniciado com sucesso!\nURL pública: ${url}`);
    });
  });	

  copyWorkflowFile(extensionPath);

}

async function checkAndPullImageIfNeeded(): Promise<void> {
  const platform = os.platform();
  const redirect = platform === 'win32' ? '>nul 2>&1' : '>/dev/null 2>&1';

  return new Promise((resolve) => {
    exec(`docker image inspect n8nio/n8n ${redirect}`, (err) => {
      const terminal = vscode.window.createTerminal('Docker');

      if (err) {
        vscode.window.showWarningMessage('Imagem do n8n não encontrada. Baixando agora...');
        terminal.show();
        terminal.sendText('docker pull n8nio/n8n');
      } else {
        vscode.window.showInformationMessage('Imagem do n8n já está disponível localmente.');
      }

      resolve();
    });
  });
}

async function startBasicDocker(): Promise<void> {
  await checkAndPullImageIfNeeded();

  const stopPrevious = 'docker rm -f codewise';
  const dockerRun = 'docker run -d --name codewise -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n';

  exec(stopPrevious, () => {
    exec(dockerRun, (err) => {
      if (err) {
        vscode.window.showErrorMessage(`Erro ao iniciar n8n.`);
        return;
      }
      vscode.window.showInformationMessage('n8n iniciado localmente! Acesse: http://localhost:5678');
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  const cmdLocal = vscode.commands.registerCommand('n8nExecutor.startLocal', async () => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('Abra uma pasta no VSCode antes de iniciar o n8n.');
      return;
    }

    await startBasicDocker();
  });

  const cmdNgrok = vscode.commands.registerCommand('n8nExecutor.startWithNgrok', async () => {
    try {
      	await startN8nWithNgrok(context.extensionPath);
    } 	catch (err: any) {
      	vscode.window.showErrorMessage(err.message || String(err));
    }
  });

  context.subscriptions.push(cmdLocal, cmdNgrok);
}

export function deactivate() {}
