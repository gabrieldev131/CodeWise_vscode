import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function observeEnvFile(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("Any folder is open.");
    return;
  }

  const userEnvPath = path.join(workspaceFolders[0].uri.fsPath, '.env');
  const destDir = path.join(context.extensionPath, 'src', 'typescript', 'langgraph');
  const destEnvPath = path.join(destDir, '.env');

  function copyEnvFile() {
    if (!fs.existsSync(userEnvPath)) {
      vscode.window.showWarningMessage(".env not found.");
      return;
    }

    try {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(userEnvPath, destEnvPath);
    } catch (error) {
      vscode.window.showErrorMessage("Error to copy .env: " + (error as Error).message);
    }
  }

  // Executa uma cópia imediata se já existir
  copyEnvFile();

  // Observa criação/modificação do .env
  const watcher = vscode.workspace.createFileSystemWatcher('**/.env');
  watcher.onDidCreate(() => copyEnvFile());
  watcher.onDidChange(() => copyEnvFile());
}
