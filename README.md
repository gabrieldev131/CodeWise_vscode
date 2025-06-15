# codewise

automated solution that uses Artificial Intelligence to review programmers' code, identifying and suggesting improvements for performance and code smells. With Code Wise, you can efficiently optimize your code, receiving real-time feedback directly in your workflow.

## Features

Real-time Git commit monitoring
Automatically observes changes and analyzes new commits pushed to the repository.

Automatic .env detection and injection
Detects when a .env file is created or modified and automatically copies it to the required workflow directory.

Agent-based code analysis using CrewAI
Uses multiple AI agents to analyze code architecture, design patterns, integrations, and SOLID principles.

Built-in error detection for environment variables
Detects incorrect or missing environment variables and alerts the user with clear error messages.

.env dependency validation
Ensures all required .env variables are valid before running the analysis.

## Requirements
    Node.js and npm installed on your system

    VS Code with the extension loaded from the source folder

    .env file with the following environment variables:

        MODEL – the model name for the LLM (e.g., gemini-2.0-flash)

        CODEWISE_AGENT_API_KEY – your API key for the model provider

    Internet connection to run LLM-based agents

## Extension Settings
This extension does not require any custom user configuration. However, ensure the following are properly set up:

    A .env file must be present in the root of your workspace, containing the required environment variables:

        MODEL: The AI model to be used (e.g., gemini-pro).

        GEMINI_API_KEY: Your valid API key for the selected model.

    A Git repository must be initialized in your workspace.

Once these are in place, the extension will automatically observe changes and trigger the analysis pipeline when appropriate.
    

## Known Issues

API-related errors (e.g., invalid MODEL or CODEWISE_AGENT_API_KEY) are written to API_ERROR.txt and shown in VS Code as an error message.

The extension assumes the workspace root contains the .env file. If it is placed elsewhere, the environment variables will not be loaded.

Currently, only one workspace folder is supported at a time.

## Release Notes

v1.0.1
    fix some bugs about A.I analysis

    all python code was replaced by typescript
    
v1.0.0

    Initial release of CodeWise.

    Automatically detects the .env file and copies it to the proper directory.

    Launches a Python process that observes Git commits and analyzes project architecture using CrewAI agents.

    Displays real-time error messages in VS Code for common configuration issues.

    Stores Git repository path to a JSON file used by the Python backend.

## Following extension guidelines
This project follows the Visual Studio Code Extension Guidelines to ensure compatibility, stability, and proper usage of the VSCode API.

Best practices observed include:

    Proper use of the vscode API for input prompts and command registration.

    Clean activation and deactivation lifecycle management.

    Commands are registered with clear identifiers and grouped for discoverability.

    Asynchronous operations handled with error management and user feedback.

    Minimal dependencies and clean resource management to reduce overhead.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [Code Reference](https://github.com/gabrieldev131/CodeWise.git)
