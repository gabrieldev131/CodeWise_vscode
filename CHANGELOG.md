# Change Log

* v1.0.6 - 2025-06-27

    add a new support for llm model

    add a new mandatory variable
    
* v1.0.5 - 2025-06-25

    Add a new agente analyst

* v1.0.2 - 2025-06-15

    Integrated typescript backend using langchain and langgraph

* v1.0.0 - 2025-06-05

    Initial stable release.

    Integrated Python backend using CrewAI.

    Implemented automatic .env detection and copy to backend directory.

    Git commit tracking with asynchronous execution of observers and CrewAI agents.

    Error handling for missing or invalid environment variables.

    Basic Python dependency installation via requirements.txt.

    Real-time error alerts in VS Code interface.

* Initial contents 0.0.1-beta
    First public version of the extension.

    Start n8n locally or with an Ngrok tunnel.

    Option to configure Ngrok auth token if not already set.

    Automatically open public URL for remote access via Ngrok.

    Automatically load a predefined n8n workflow from extension files.

    Docker integration to manage n8n container.

    Health check loop to wait for n8n readiness before importing workflows.

## [Unreleased]

- Improved environment variable validation and feedback system.

- Add support for additional AI models via configuration.

- Enable customization of agent roles and task descriptions from UI.

- Refactor extension startup to improve performance and reliability.

- Provide unit tests for Python and TypeScript modules.

- Add multilingual support for interface messages.

- Enhance logging and debugging options for developers.