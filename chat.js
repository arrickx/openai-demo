import 'dotenv/config'
import readline from 'node:readline'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
  })

  return chatCompletion.choices[0].message
}

const formatMessage = (userInput) => ({ role: 'user', content: userInput })

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

console.log("Chatbot initialized. Type 'exit' to end the chat.")
chat()
