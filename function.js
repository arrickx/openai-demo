// Importing the required modules
import math from 'advanced-calculator'
import 'dotenv/config'
import OpenAI from 'openai'

// Set a default question if no argument is provided
const QUESTION = process.argv[2] || 'hi'

// Initialize OpenAI with the API key from the environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define the initial message to be sent to OpenAI
const messages = [
  {
    role: 'user',
    content: QUESTION,
  },
]

// Define the functions that OpenAI can call
const functions = {
  calculate({ expression }) {
    // Evaluate the mathematical expression and return the result
    return math.evaluate(expression)
  },
  async generateImage({ prompt }) {
    // Generate an image based on the provided prompt and return its URL
    const result = await openai.images.generate({ prompt })
    console.log(result)
    return result.data[0].url;
  },
}

// Define a function to get a response from OpenAI
const getCompletion = async (messages) => {
  // Create a chat completion with OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages,
    functions: [
      // Define the functions that OpenAI can call
      {
        name: 'generateImage',
        description: 'Generates an image based on a provided description',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The description of the image to generate',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'calculate',
        description: 'Evaluates a mathematical expression',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'The mathematical expression to evaluate, e.g., "2 * 3 + (21 / 2) ^ 2"',
            },
          },
          required: ['expression'],
        },
      },
    ],
  })

  // Return the response from OpenAI
  return response
}

// Start a loop to continuously get responses from OpenAI
let response
while (true) {
  // Get a response from OpenAI
  response = await getCompletion(messages)

  // If the response indicates to stop, print the message and break the loop
  if (response.choices[0].finish_reason === 'stop') {
    console.log(response.choices[0].message.content)
    break
  // If the response indicates a function call, call the corresponding function
  } else if (response.choices[0].finish_reason === 'function_call') {
    // Get the name of the function to call and its arguments
    const fnName = response.choices[0].message.function_call.name
    const args = response.choices[0].message.function_call.arguments

    // Retrieve the function to call from the functions object
    const functionToCall = await functions[fnName]
    // Parse the arguments from JSON
    const params = JSON.parse(args)

    // Call the function and get the result
    const result = functionToCall(params)

    // Add the function call and its result to the messages
    messages.push({
      role: 'assistant',
      content: null,
      function_call: {
        name: fnName,
        arguments: args,
      },
    })

    messages.push({
      role: 'function',
      name: fnName,
      content: JSON.stringify({ result: result }),
    })
  }
}
