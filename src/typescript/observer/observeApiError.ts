import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let debounceTimer: NodeJS.Timeout | null = null;

export function observeApiError(context: vscode.ExtensionContext) {
  const errorFilePath = path.join(context.extensionPath, 'src', 'API_ERROR.txt');

  // Observa o diretório onde o arquivo pode ser criado
  fs.watch(path.dirname(errorFilePath), (eventType, filename) => {
    if (filename === 'API_ERROR.txt') {
      if (debounceTimer) {clearTimeout(debounceTimer);}
      debounceTimer = setTimeout(() => {
        handleApiError(errorFilePath);
      }, 200);
    }
  });

  // Checa imediatamente se o arquivo já existe
  if (fs.existsSync(errorFilePath)) {
    handleApiError(errorFilePath);
  }
}

function handleApiError(filePath: string) {
  if (fs.existsSync(filePath)) {
    vscode.window.showErrorMessage("Variável MODEL ou CODEWISE_AGENT_API_KEY está incorreta.");
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
    }
  }
}
