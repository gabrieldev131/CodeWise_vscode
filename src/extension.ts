import * as vscode from 'vscode';
import { observeEnvFile } from './typescript/observer/observerEnvFile';
import { observeGitCommits } from './typescript/observer/GitCommitObserver';
import { LangWise } from './typescript/langgraph/LangWise'


export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("Any folder is open.");
        return;
    }

    observeEnvFile(context);
    observeGitCommits(context);

    (async () => {
      const test = new LangWise(context);
      await test.start(context);
    })();
}

export function deactivate() {}
