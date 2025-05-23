// src/extension.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const pythonPath = 'python'; // ou 'python3', conforme o sistema
  const serverScript = path.join(context.extensionPath, 'src','python', 'server.py');

  // Iniciar servidor Flask
  const server = exec(`${pythonPath} ${serverScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao iniciar servidor: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  server.stdout?.on('data', (data) => {
    console.log(`Python: ${data}`);
  });

  // Esperar o servidor subir (espera fixa simples)
  setTimeout(() => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Nenhuma pasta aberta no workspace.');
      return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    axios.post('http://127.0.0.1:5000/iniciar', { caminho: rootPath })
      .then(() => vscode.window.showInformationMessage('Servidor Python iniciado e caminho enviado.'))
      .catch(err => vscode.window.showErrorMessage(`Erro ao enviar caminho: ${err.message}`));
  }, 5000); // espera 5 segundos
}
