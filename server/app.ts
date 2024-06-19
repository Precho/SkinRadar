import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import path from 'path'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000
console.log('Init')

dotenv.config({ path: path.join(__dirname, '.env.development') })

// Konfiguracja API
const API_URL = process.env.API_URL || ''
const API_KEY = process.env.API_KEY || ''

let lastResponse: any = null
let nextRequestTime: Date | null = null
let lastRequestTime: Date | null = null

async function getListedItems() {
  console.log('getListedItems----->')
  const params = new URLSearchParams({
    per_page: '50',
    page: '1',
    // has_stickers: "yes",
    search: 'Gut Knife | Freehand (Factory New)',
    // search: 'Gut Knife | Tiger Tooth (Factory New)',
  })

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })

  if (!response.ok) {
    console.error('Error:', response.statusText)
    return
  }

  lastResponse = await response.json()
  lastRequestTime = new Date()
  console.log('Listed Items:', lastResponse)
}

setInterval(() => {
  getListedItems()
  nextRequestTime = new Date(Date.now() + 1 * 60 * 1000)
}, 1 * 60 * 1000)

getListedItems()
nextRequestTime = new Date(Date.now() + 1 * 60 * 1000)

// Enable CORS
app.use(cors())

app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

app.get('/api/data', (_req, res) => {
  res.json({ lastResponse, lastRequestTime, nextRequestTime })
})

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
