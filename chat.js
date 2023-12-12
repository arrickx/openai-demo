// Import the necessary modules
import 'dotenv/config'
import readline from 'node:readline'
import OpenAI from 'openai'

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Create a readline interface for capturing user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define a function to generate a new message using OpenAI
const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
  })

  return chatCompletion.choices[0].message
}

// Define a function to format user input into the required message format
const formatMessage = (userInput) => ({ role: 'user', content: userInput })

// Define the main chat function
const chat = () => {
  const history = [
    {
      role: 'system',
      content: `You are a helpful AI assistant. Answer the user's questions to the best of you ability.`,
    },
  ]
  const start = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close()
        return
      }

      const userMessage = formatMessage(userInput)
      const response = await newMessage(history, userMessage)

      history.push(userMessage, response)

      console.log(`\nAI: ${response.content}\n`)
      start()
    })
  }

  start()
}

// Initialize the chatbot
console.log("Chatbot initialized. Type 'exit' to end the chat.")
chat()
