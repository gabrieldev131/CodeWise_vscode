# codewise

automated solution that uses Artificial Intelligence to review programmers' code, identifying and suggesting improvements for performance and code smells. With Code Wise, you can efficiently optimize your code, receiving real-time feedback directly in your workflow.

## Features

One-click N8N startup directly from VSCode.

Ngrok integration for secure public URLs without manual setup.

Automatic Ngrok token configuration, if not already set.

Docker container orchestration with fallback to local or public access.

Health check logic ensures N8N is fully ready before proceeding.

Workflow auto-deployment by copying predefined workflows to user’s N8N data directory.

Cross-platform support for Windows, macOS, and Linux.

Fully integrated with VSCode command palette.

## Requirements

To run this extension properly, make sure you have the following installed on your system:

    Docker — Required to run the N8N container.

    Ngrok — Must be downloaded and placed somewhere accessible (e.g., in your Documents folder).

    Ngrok Authtoken — You’ll need a free account on ngrok.com.

    VSCode — This extension runs inside Visual Studio Code.

    Github Oauth2 — You’ll need a free account on github.com

    Github Webhook — You'll need to make a webhook in your github repository

    Telegram Webhook — You’ll need a free account on telegram

    Internet connection — Required for pulling Docker images and establishing Ngrok tunnels.

    ℹ️ The extension automatically detects your Ngrok binary and sets the token if it's missing.

## Extension Settings

This extension contributes the following commands to the VSCode Command Palette:

    n8nExecutor.startLocal (Start n8n localhost) — Starts N8N in a Docker container on http://localhost:5678.

    n8nExecutor.startWithNgrok (Start n8n with ngrok) — Starts N8N with Ngrok tunneling, exposing it via a public URL.

No additional settings or configuration files are required. All environment variables and paths are handled automatically.

    🛠️ The extension detects whether the Ngrok authtoken has been configured. If not, it prompts you to enter it the first time you start with Ngrok.

## Known Issues

C❗ Ngrok binary not found: If Ngrok is not installed or not placed in a known location (like Documents, Downloads, or Home), the extension won't be able to start Ngrok tunnels.
→ Fix: Download Ngrok and place it in one of the default directories or add it to your system’s PATH.

❗ Workflow not loading immediately: Sometimes, the N8N service may take longer to become fully ready, leading to failed attempts to deploy the workflow.
→ Fix: The extension includes retry logic, but you may need to manually restart if delays persist.

❗ Docker must be running: The extension assumes Docker is running on your system.
→ Fix: Ensure Docker Desktop (or your Docker daemon) is up and running before using the commands.

❗ Ngrok requires an authtoken: Users must enter their Ngrok authtoken on first use.
→ Fix: The extension prompts automatically, but if skipped, Ngrok won’t start.

## Release Notes

Initial release of the N8N Executor VSCode Extension.

Launch N8N locally via Docker.

Launch N8N with public access using Ngrok.

Automatically prompt for Ngrok authtoken if not configured.

Wait for N8N to be ready before importing workflows.

Automatically copy a preconfigured workflow JSON into the container directory.

## Following extension guidelines
This project follows the Visual Studio Code Extension Guidelines to ensure compatibility, stability, and proper usage of the VSCode API.

Best practices observed include:

    Proper use of the vscode API for input prompts and command registration.

    Clean activation and deactivation lifecycle management.

    Commands are registered with clear identifiers and grouped for discoverability.

    Asynchronous operations handled with error management and user feedback.

    Minimal dependencies and clean resource management to reduce overhead.

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [Code Reference](https://github.com/gabrieldev131/CodeWise.git)

