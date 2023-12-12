// Import the necessary modules
import 'dotenv/config'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import OpenAI from 'openai'

// Initialize OpenAI with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Set a default question if no argument is provided
const question = process.argv[2] || 'hi'
// Define a YouTube video URL
const video = `https://youtu.be/zR_iuq2evXo?si=cG8rODgRgXOx9_Cn`

// Function to create a memory vector store from documents
const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())

// Function to load and split documents from a YouTube video
const docsFromYTVideo = (video) => {
  const loader = YoutubeLoader.createFromUrl(video, {
    language: 'en',
    addVideoInfo: true,
  })
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 100,
    })
  )
}

// Function to load and split documents from a PDF file
const docsFromPDF = () => {
  const loader = new PDFLoader('./src/xbox.pdf')
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 200,
    })
  )
}

// Function to load documents from both YouTube video and PDF file into the memory vector store
const loadStore = async () => {
  const videoDocs = await docsFromYTVideo(video)
  const pdfDocs = await docsFromPDF()

  return createStore([...videoDocs, ...pdfDocs])
}

// Function to query the OpenAI model with the question and the loaded documents
const query = async () => {
  const store = await loadStore()
  const results = await store.similaritySearch(question, 2)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0, // For a QA system, it's recommended to use 0 temperature
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. Answer questions to your best ability.',
      },
      {
        role: 'user',
        content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
      Question: ${question}

      Context: ${results.map((r) => r.pageContent).join('\n')}`,
      },
    ],
  })

  // Print the AI's answer and the sources of the context
  console.log(
    `Answer: ${response.choices[0].message.content}\n\nSources: ${results
      .map((r) => r.metadata.source)
      .join(', ')}`
  )
}

// Execute the query function
query()
