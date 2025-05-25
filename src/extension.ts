import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("Nenhuma pasta aberta.");
        return;
    }

    const repoPath = workspaceFolders[0].uri.fsPath;
    const outputPath = path.join(context.extensionPath, 'src', 'python', 'repo_path.json');
    const data = {
        repoPath: repoPath
    };

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    vscode.window.showInformationMessage(`Caminho salvo: ${outputPath}`);

    const pythonPath = path.join(context.extensionPath, 'src', 'python', 'controller.py');
    
    const runCmd = `python ${pythonPath}`;
    exec(runCmd, (err, stdout) => {
      if (err) {
        vscode.window.showErrorMessage(`Erro ao python.` + (err as Error).message);
        return;
      }
      vscode.window.showInformationMessage(`python iniciado com sucesso!`);
      console.log(stdout);
    });
    

}

export function deactivate() {}
