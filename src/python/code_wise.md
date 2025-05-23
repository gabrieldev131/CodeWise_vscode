---
sidebar_position: 1
title: Code Wise
---
**Code Wise** is an automated solution that uses **Artificial Intelligence** to review programmers code, identifying and suggesting improvements for **performance** and **code smells**. With Code Wise, you can efficiently optimize your code, receiving real-time feedback directly in your workflow.

## Code Wise as GitHub Action

It is a GitHub Action that automatically analyzes code changes in your repository, identifies potential performance improvements, and detects code smells using OpenAI's GPT model. It is designed to review code files such as Python, JavaScript, TypeScript, Java, C, C++, Go, Ruby, PHP, and C#. The analysis results are sent to a specified Discord channel for easy review and creates a comment in a Pull Request.


### Installation

To use this action in your repository, follow the steps below:

1. Copy the YAML configuration into the .github/workflows directory of your project.
2. Ensure you have the following secrets added to your repository:
    * OPENAI_API_KEY: Your OpenAI API key to send requests for code analysis.
    * DISCORD_WEBHOOK_URL: A Discord webhook URL where the analysis results will be sent.
    * AGENTOPS_API_KEY: API KEY FROM AGENT OPS.
3. Ensure your project has the necessary dependencies:
    * Python 3.x
    * jq installed for JSON manipulation.

### How to Use

This action runs automatically on every push to the main branch. It analyzes code files changed in the commit and sends performance and code smell suggestions to a Discord channel. The following file types are supported: .py, .js, .ts, .java, .c, .cpp, .go, .rb, .php, and .cs.

### Workflow Breakdown

1. Checkout the repository: The action first checks out the repository to analyze the latest commit.
2. Set up Python: The Python environment is set up with the required version (3.x).
3. Install dependencies: Installs jq and the requests library for making HTTP requests.
4. Get committer's name: Retrieves the name of the person who made the commit.
5. Check for code files: The workflow identifies any code files that were changed and sends them to GPT for analysis.
6. Send suggestions to Discord: Suggestions for improving code quality and performance are sent to the configured Discord channel

## Code Wise as API 

This project is an API built with FastAPI that accepts code snippets in Python, C#, or Java and sends them to the OpenAI GPT-3 API for suggestions on how to improve the code. It allows developers to receive real-time feedback on their code for better practices, potential optimizations, or error handling.

The API provides endpoints to submit code, specify the programming language, and get back suggestions. The system is containerized with Docker for easy deployment.

### Features

* Code Analysis: Submit code snippets in Python, C#, or Java and receive feedback.
* Language Support: Python, C#, and Java.
* FastAPI: Built with FastAPI for quick, asynchronous API calls and automatic generation of interactive API documentation.
* OpenAI Integration: Leverages GPT-3 for code analysis and improvement suggestions.
* Dockerized: Fully containerized for easy setup and deployment.

### Requirements

* Python 3.10+
* FastAPI
* Uvicorn (ASGI server for FastAPI)
* OpenAI Python SDK
* Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/code-improvement-api.git
cd code-improvement-api
```
2. Install dependencies:

You can install the dependencies by running:

```bash
pip install -r requirements.txt
``` 

3. Set up your OpenAI API Key:

Make sure you have an OpenAI API key. Replace "YOUR_API_KEY_HERE" in the app.py file with your actual API key.

4. Running the API locally:

You can run the API locally using uvicorn:

```bash
uvicorn app:app --reload
```
This will start the FastAPI app, and you can access it at http://127.0.0.1:8000.

5. Run with Docker: If you want to run the app in a Docker container:

   1. Build the Docker image:
   ```bash
   docker build -t code-improvement-api .

   ```
   2. Run the container:
   ```bash
     docker run -p 8000:8000 code-improvement-api
   ```
   Now, the API should be available at http://127.0.0.1:8000.

### Usage

1. Submitting a Code Snippet

You can use curl to submit code and receive suggestions. The /improve_code endpoint expects two fields:

    * code: The code snippet you want to analyze.
    * language: The language of the code snippet (either "python", "c#", or "java").

Example Request for Python Code:

```bash
curl -X POST http://127.0.0.1:8000/improve_code \
    -H "Content-Type: application/json" \
    -d '{
        "code": "class Calculator:\n    def add(self, a, b):\n        return a + b\n", 
        "language": "python"
    }'

```
Example Request for C# Code:
```bash
curl -X POST http://127.0.0.1:8000/improve_code \
    -H "Content-Type: application/json" \
    -d '{
        "code": "public class Calculator {\n    public int Add(int a, int b) { return a + b; }\n}", 
        "language": "c#"
    }'

```

Example Request for Java Code:
```bash
curl -X POST http://127.0.0.1:8000/improve_code \
    -H "Content-Type: application/json" \
    -d '{
        "code": "public class Calculator {\n    public int add(int a, int b) { return a + b; }\n}", 
        "language": "java"
    }'

``` 
2. Response Format

The API will return a JSON response containing suggestions for improvements:
```bash
{
  "suggestion": "You could improve this class by adding type checks for the method parameters..."
}

```

3. Accessing API Documentation

FastAPI automatically generates interactive API documentation. You can access this by going to:

    Swagger UI: http://127.0.0.1:8000/docs
    ReDoc: http://127.0.0.1:8000/redoc

These interfaces allow you to test the API directly from your browser.

### Customization

* **OpenAI Model**: The current model used is gpt-4. You can customize the model by changing the engine parameter in the suggest_improvements function.
* **OpenIA Key**:  OpenIA Key