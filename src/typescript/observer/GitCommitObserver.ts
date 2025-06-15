import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

export class GitCommitObserver {
  private repoPath: string;
  private logsHeadFile: string;
  private lastCommitHash: string | null;
  private git: SimpleGit;
  private outputFilePath: string;

  constructor(gitDir: string, extensionPath: string) {
    this.repoPath = path.resolve(gitDir, '..');
    this.logsHeadFile = path.join(gitDir, 'logs', 'HEAD');
    this.git = simpleGit(this.repoPath);
    this.lastCommitHash = null;

    const destDir = path.join(extensionPath, 'src', 'typescript', 'langgraph');
    this.outputFilePath = path.join(destDir, 'gitInput.txt');

    fs.mkdirSync(destDir, { recursive: true });
  }

  public async initialize() {
    this.lastCommitHash = await this.getLastCommitHash();
  }

  private async getLastCommitHash(): Promise<string | null> {
    try {
      const log = await this.git.log({ maxCount: 1 });
      return log.latest?.hash ?? null;
    } catch (error) {
      console.error('Failed to get last commit hash:', error);
      return null;
    }
  }

  public async handleHeadChange() {
    setTimeout(async () => {
      const newCommitHash = await this.getLastCommitHash();
      if (newCommitHash && newCommitHash !== this.lastCommitHash) {
        this.lastCommitHash = newCommitHash;
        await this.showCommitDetails(newCommitHash);
      }
    }, 500);
  }

  private async showCommitDetails(commitHash: string) {
    try {
      const logInfo = await this.git.log({ from: `${commitHash}^`, to: commitHash });
      const commitDetails: string[] = [];

      commitDetails.push('\nNew commit detected:');
      commitDetails.push(`Hash: ${commitHash}`);

      if (logInfo.latest) {
        const latest = logInfo.latest;
        commitDetails.push(`Author: ${latest.author_name} <${latest.author_email}>`);
        commitDetails.push(`Date: ${latest.date}`);
        commitDetails.push(`Message: ${latest.message}`);
      }

      commitDetails.push('Changed files:');
      const diff = await this.git.diff([`${commitHash}^`, commitHash]);
      commitDetails.push(diff);

      fs.writeFileSync(this.outputFilePath, commitDetails.join('\n') + '\n' + '='.repeat(60) + '\n', { encoding: 'utf-8' });
    } catch (error) {
      console.error('Error writing commit details:', error);
    }
  }
}

export function findGitRepo(startPath: string): string | null {
  let currentPath = path.resolve(startPath);

  while (true) {
    const gitDir = path.join(currentPath, '.git');
    if (fs.existsSync(gitDir) && fs.lstatSync(gitDir).isDirectory()) {
      return gitDir;
    }
    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      break;
    }
    currentPath = parentPath;
  }

  return null;
}

export async function observeGitCommits(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('Nenhum workspace aberto.');
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const gitDir = findGitRepo(workspacePath);

  if (!gitDir) {
    vscode.window.showWarningMessage('Nenhum repositório Git encontrado nesta workspace.');
    return;
  }

  const observer = new GitCommitObserver(gitDir, context.extensionPath);
  await observer.initialize();

  const headFileRelativePath = path.relative(workspacePath, path.join(gitDir, 'logs', 'HEAD')).replace(/\\/g, '/');
  const watcher = vscode.workspace.createFileSystemWatcher(`**/${headFileRelativePath}`);

  watcher.onDidChange(() => observer.handleHeadChange());
  watcher.onDidCreate(() => observer.handleHeadChange());

  context.subscriptions.push(watcher);
  vscode.window.showInformationMessage('Observador de commits Git iniciado.');
}
