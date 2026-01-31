# Nutri5 API Documentation

## Overview

Nutri5 provides RESTful APIs for nutrition guidance chat, text-to-speech, and speech-to-text functionality. All endpoints require authentication via Supabase session.

## Authentication

All API requests require a valid Supabase session. The session is automatically managed by the Supabase client and included in requests via secure cookies.

**Unauthorized Response:**
```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

## Endpoints

### 1. Chat API

Stream nutrition guidance from the AI nutritionist.

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What should I eat for breakfast?"
    },
    {
      "role": "assistant",
      "content": "For a healthy breakfast, I recommend..."
    }
  ]
}
```

**Response:** Text stream (Server-Sent Events)

**Example Response:**
```
For a nutritious breakfast, consider...
```

**Error Responses:**
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Missing or invalid messages
- `500 Internal Server Error` - Server error during generation

**Usage Example:**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What are healthy snacks?' }
    ]
  })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader?.read() || {}
  if (done) break
  console.log(decoder.decode(value))
}
```

---

### 2. Speech-to-Text API

Convert audio to text using OpenAI Whisper.

**Endpoint:** `POST /api/transcribe`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `audio` file (WAV, MP3, M4A, FLAC supported)

**Response:**
```json
{
  "text": "What should I eat for better health?"
}
```

**Error Responses:**
- `401 Unauthorized` - No valid session
- `400 Bad Request` - No audio file provided
- `500 Internal Server Error` - Transcription failed

**Usage Example:**
```typescript
const mediaRecorder = new MediaRecorder(audioStream)
const chunks = []

mediaRecorder.ondataavailable = (e) => chunks.push(e.data)

mediaRecorder.onstop = async () => {
  const audioBlob = new Blob(chunks, { type: 'audio/wav' })
  const formData = new FormData()
  formData.append('audio', audioBlob)

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData
  })

  const { text } = await response.json()
  console.log('Transcribed:', text)
}
```

---

### 3. Text-to-Speech API

Convert text to speech using ElevenLabs.

**Endpoint:** `POST /api/speak`

**Request Body:**
```json
{
  "text": "For a healthy diet, include plenty of vegetables and whole grains."
}
```

**Response:** Audio stream (audio/mpeg)

**Error Responses:**
- `401 Unauthorized` - No valid session
- `400 Bad Request` - Missing text
- `500 Internal Server Error` - TTS generation failed

**Usage Example:**
```typescript
const response = await fetch('/api/speak', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'You need more calcium in your diet.'
  })
})

const audioBlob = await response.blob()
const audioUrl = URL.createObjectURL(audioBlob)
const audio = new Audio(audioUrl)
audio.play()
```

---

## Database Schema

### chat_sessions Table
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Row Level Security:** Users can only access their own sessions

### chat_messages Table
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Row Level Security:** Users can only access messages from their sessions

### user_preferences Table
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT FALSE,
  use_audio BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Row Level Security:** Users can only access their own preferences

---

## Error Handling

All errors follow a consistent pattern:

**Status Codes:**
- `200 OK` - Successful request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "status": 400,
  "message": "Error description"
}
```

---

## Rate Limiting

- Chat API: 60 requests per minute per user
- Transcribe API: 30 requests per minute per user
- Speak API: 60 requests per minute per user

Exceeding rate limits returns `429 Too Many Requests`.

---

## Security Considerations

1. **Authentication:** All endpoints require valid Supabase session
2. **Data Privacy:** Audio is never stored, only transcribed
3. **HTTPS Only:** All requests must use HTTPS in production
4. **Row Level Security:** Database policies enforce user isolation
5. **API Keys:** External API keys never exposed to client

---

## Best Practices

### Chat Implementation
```typescript
// Load messages from session
const messages = await fetchSessionMessages(sessionId)

// Add user message
messages.push({ role: 'user', content: userInput })

// Get AI response
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages })
})

// Stream and save response
let aiResponse = ''
const reader = response.body?.getReader()
while (true) {
  const { done, value } = await reader?.read() || {}
  if (done) break
  aiResponse += decoder.decode(value)
}

// Save to database
messages.push({ role: 'assistant', content: aiResponse })
```

### Audio Handling
```typescript
// Request microphone permission
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: true 
})

// Record audio
const mediaRecorder = new MediaRecorder(stream)
mediaRecorder.start()

// On stop, transcribe
mediaRecorder.onstop = async () => {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  
  const { text } = await (
    await fetch('/api/transcribe', { method: 'POST', body: formData })
  ).json()
}

// Play TTS response
const audioBlob = await (
  await fetch('/api/speak', {
    method: 'POST',
    body: JSON.stringify({ text: aiResponse })
  })
).blob()

const audio = new Audio(URL.createObjectURL(audioBlob))
audio.play()
```

---

## Support

For issues or questions:
- Check the SETUP.md file
- Review example usage in `/app/chat/page.tsx`
- Visit API provider documentation:
  - OpenAI: https://platform.openai.com/docs
  - ElevenLabs: https://elevenlabs.io/docs
  - Supabase: https://supabase.com/docs
