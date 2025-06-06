import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { observeApiError } from './typescript/observer/observeApiError';
import { observeEnvFile } from './typescript/observer/observerEnvFile';

function checkPythonVersion(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('python --version', (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage("Python não encontrado.");
        return resolve(false);
      }

      const versionOutput = stdout || stderr;
      const match = versionOutput.match(/Python (\d+)\.(\d+)\.(\d+)/);

      if (!match) {
        vscode.window.showErrorMessage("Não foi possível detectar a versão do Python.");
        return resolve(false);
      }

      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);

      const isValid = (major === 3 && minor >= 10 && minor < 13);

      if (!isValid) {
        vscode.window.showErrorMessage(`Versão do Python incompatível: ${major}.${minor}. Requerido: >=3.10 e <3.13`);
      }

      resolve(isValid);
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("Any folder is open.");
        return;
    }

    const repoPath = workspaceFolders[0].uri.fsPath;
    const outputPath = path.join(context.extensionPath, 'src', 'python', 'repo_path.json');
    const data = {
        repoPath: repoPath
    };

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    observeEnvFile(context);
    observeApiError(context);

    checkPythonVersion().then((valid) => {
      if (!valid) {
        return;
      }
    });

    const requirementsPath = path.join(context.extensionPath, 'src', 'python', 'requirements.txt');
    const cmd = `pip install -r "${requirementsPath}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Erro ao instalar dependências: ${error.message}`);
        return;
      }
      if (stderr) {
        vscode.window.showWarningMessage(`Aviso ao instalar dependências: ${stderr}`);
      }
      vscode.window.showInformationMessage('Dependências Python instaladas com sucesso!');
    });

    const pythonPath = path.join(context.extensionPath, 'src', 'python', 'Aplication.py');
    const runCmd = `python ${pythonPath}`;

    exec(runCmd, (err) => {
      if (err) {
        vscode.window.showErrorMessage(`Error in python.` + (err as Error).message);
        return;
      }
    });

    
}

export function deactivate() {}
