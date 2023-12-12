# OpenAI Exploration

This project demonstrates various functionalities of the OpenAI API, including chat, question-answering, function calling, and semantic search.

## Setup

1. Clone the repository.
2. Install the necessary dependencies by running `npm install` in the project directory.

## Environment Variables

This project uses environment variables to securely store the OpenAI API key. You need to create a `.env` file in the root directory of the project and add your OpenAI API key like so:

```
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your actual OpenAI API key.

## Running the Project

The project consists of several JavaScript files, each demonstrating a different functionality. You can run each file using Node.js. 

For example, to run the `chat.js` or `search.js` file, use the following command:

```
node chat.js
```

To run the `qa.js` or `function.js` file with a question, use the following command:

```
node qa.js "what is xbox warranty?"
```


## Files

- `chat.js`: Implements a chatbot using the OpenAI API.
- `qa.js`: Implements a question-answering system using the OpenAI API. You can provide a question as a command-line argument.
- `function.js`: Demonstrates how to call functions using the OpenAI API.
- `search.js`: Demonstrates how to perform a semantic search using the OpenAI API.

## Note

This project uses the OpenAI API, which is a paid service. Make sure to understand the cost of using the API before running the project.