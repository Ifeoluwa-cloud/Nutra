# Nutri5 - HealthyChat Setup Guide

Nutri5 is a fullstack AI-powered nutrition guidance application providing 24/7 accessible healthcare to underserved communities.

## Prerequisites

- Node.js 16.8+
- Supabase account
- OpenAI API key
- ElevenLabs API key (for text-to-speech)

## Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory with:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI API (for chat and transcription)
   OPENAI_API_KEY=your_openai_api_key

   # ElevenLabs API (for text-to-speech)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Supabase Setup:**

   - Create a new Supabase project
   - Go to SQL Editor and run the migration script from `scripts/init-db.sql`
   - This creates the necessary tables with Row Level Security

## Features

### 🌿 Core Features
- **AI Nutritionist**: 24/7 expert nutrition guidance powered by OpenAI GPT-4
- **Audio Support**: Users can speak with the AI using microphone input
- **Speech Recognition**: Real-time transcription of user audio using Whisper
- **Text-to-Speech**: AI responses can be heard through text-to-speech
- **Dark Mode**: Full dark mode support for comfortable usage
- **Secure Authentication**: Email/password authentication with Supabase

### 🎯 User Journey
1. **Landing Page** - Learn about Nutri5 and health equity mission
2. **Sign Up/Login** - Create account or log in
3. **Chat Interface** - Start nutrition consultation
4. **Audio or Text** - Choose communication method
5. **Personalized Advice** - Get AI-powered nutrition guidance

## Project Structure

```
/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Design system with dark mode
│   ├── auth/
│   │   ├── login/page.tsx    # Login page
│   │   └── sign-up/page.tsx  # Sign up page
│   ├── chat/
│   │   └── page.tsx          # Chat interface
│   └── api/
│       ├── chat/route.ts     # AI chat API
│       ├── speak/route.ts    # Text-to-speech API
│       └── transcribe/route.ts # Speech-to-text API
├── lib/
│   └── supabase/
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server client
│       └── proxy.ts          # Session proxy
├── components/
│   └── ui/                   # shadcn UI components
├── scripts/
│   └── init-db.sql          # Database migration
└── middleware.ts            # Next.js middleware
```

## API Endpoints

### Chat Endpoint
- **POST** `/api/chat`
- Streams nutrition guidance from AI nutritionist
- Requires authentication
- Body: `{ messages: Message[] }`

### Speech-to-Text
- **POST** `/api/transcribe`
- Converts audio to text using Whisper
- Body: FormData with `audio` file

### Text-to-Speech
- **POST** `/api/speak`
- Converts AI response text to audio
- Body: `{ text: string }`

## Database Schema

### Tables
- `auth.users` - Supabase auth users
- `public.chat_sessions` - User chat sessions
- `public.chat_messages` - Chat messages
- `public.user_preferences` - User settings (dark mode, audio preferences)

## Dark Mode

Dark mode is automatically enabled/disabled based on:
1. System preference detection
2. Manual toggle in chat interface (sun/moon icon)
3. Persisted in user preferences

## Security

- All API routes require authentication
- Row Level Security (RLS) enabled on all tables
- Sensitive data never exposed to client
- Audio files not stored, only transcribed
- All API calls use HTTPS

## Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel Settings
3. Deploy with one click

Or deploy manually:
```bash
npm run build
npm start
```

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- OpenAI API: https://platform.openai.com/docs
- ElevenLabs API: https://elevenlabs.io/docs
- Next.js: https://nextjs.org/docs

## Mission

Nutri5 is committed to:
- ✨ Fair treatment for all users
- 💚 Equal access to healthcare
- 🌍 Serving underserved communities
- 🚫 No excessive fees or barriers
- 🤖 Leveraging AI for good

---

Built with ❤️ for health equity
