# Nutri5 - HealthyChat Project Summary

## Project Overview

**Nutri5 - HealthyChat** is a comprehensive fullstack web application providing instant, 24/7 nutrition guidance to underserved and vulnerable communities. Built with Next.js, Supabase, and AI integration, Nutri5 ensures equal and easy access to healthcare resources without barriers or high costs.

## Vision & Mission

### The Problem
Malnutrition is a major health issue, particularly in areas without adequate healthcare infrastructure. People face:
- Limited access to nutrition experts
- High medical consultation fees
- Long waiting times
- Healthcare inequality and VIP treatment

### The Solution
Nutri5 provides:
- **Equal Access**: Fair treatment for all, no VIP overriding common people
- **24/7 Availability**: Nutrition guidance anytime, anywhere
- **Zero Barriers**: No exuberant fees, no queues
- **AI-Powered**: Expert nutritionist advice powered by AI
- **Multi-Modal**: Audio and text communication options
- **Accessible**: Dark mode, transcription for all users

## Key Features

### 1. User Authentication
- Secure email/password authentication via Supabase
- Email confirmation required
- Session management
- Protected routes

### 2. AI Nutritionist Chat
- Real-time streaming responses from GPT-4o-mini
- Personalized nutrition guidance based on user context
- Support for diverse health conditions and dietary preferences
- Evidence-based recommendations

### 3. Audio Support
**Speech-to-Text (Whisper)**
- Record voice questions
- Automatic transcription
- Real-time input capture

**Text-to-Speech (ElevenLabs)**
- AI responses can be heard
- Accessibility for deaf/hard of hearing
- Transcription always displayed
- Professional voice quality

### 4. Dark Mode
- System preference detection
- Manual toggle in chat interface
- Persisted in user preferences
- Optimized for accessibility

### 5. Security & Privacy
- Row Level Security on all database tables
- Authentication required for all APIs
- Audio files never stored (transcribed immediately)
- Sensitive data encrypted
- HTTPS required in production

## Technical Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4 with design tokens
- **State Management**: React hooks + AI SDK
- **HTTP Client**: Built-in fetch API

### Backend
- **API Layer**: Next.js Route Handlers
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **External APIs**:
  - OpenAI (GPT-4o-mini for chat, Whisper for transcription)
  - ElevenLabs (Text-to-speech)

### Database
- **chat_sessions**: User consultation sessions
- **chat_messages**: Chat history (user and AI messages)
- **user_preferences**: User settings (dark mode, audio preferences)
- Row Level Security ensures data isolation

### APIs
1. **POST /api/chat** - Stream nutrition guidance
2. **POST /api/transcribe** - Convert audio to text
3. **POST /api/speak** - Convert text to audio

## Project Structure

```
nutri5-healthychat/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Design system & colors
│   ├── not-found.tsx            # 404 error page
│   ├── auth/
│   │   ├── login/page.tsx       # User login
│   │   ├── sign-up/page.tsx     # User registration
│   │   └── error/page.tsx       # Auth error page
│   ├── chat/
│   │   └── page.tsx             # Main chat interface
│   └── api/
│       ├── chat/route.ts        # AI chat endpoint
│       ├── transcribe/route.ts  # Speech-to-text
│       └── speak/route.ts       # Text-to-speech
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server Supabase client
│       └── proxy.ts             # Session management
├── components/
│   └── ui/                      # shadcn UI components
├── public/
│   └── nutri5-ai-hero.jpg       # Landing page image
├── scripts/
│   └── init-db.sql              # Database initialization
├── middleware.ts                # Next.js middleware (proxy)
├── SETUP.md                     # Setup & installation guide
├── API.md                       # API documentation
├── USER_GUIDE.md                # User documentation
└── PROJECT_SUMMARY.md           # This file
```

## Color System (Nutri5 Design)

### Light Mode
- **Primary**: Teal (`oklch(0.60 0.20 173.3)`) - Health & trust
- **Background**: Off-white (`oklch(0.985 0)`)
- **Foreground**: Dark navy (`oklch(0.15 0.02 252.56)`)
- **Accent**: Emerald green - Growth & vitality
- **Muted**: Light gray for secondary elements

### Dark Mode
- **Primary**: Bright teal (`oklch(0.65 0.22 173.3)`)
- **Background**: Dark navy (`oklch(0.15 0.02 252.56)`)
- **Foreground**: Off-white (`oklch(0.95 0.01 273)`)
- **Accent**: Bright emerald
- **Muted**: Dark gray for secondary elements

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (Chat & Transcription)
OPENAI_API_KEY=sk-...

# ElevenLabs (Text-to-Speech)
ELEVENLABS_API_KEY=...
```

## User Journey

1. **Landing Page**
   - Learn about Nutri5 mission
   - Understand features
   - Sign up or login

2. **Authentication**
   - Email registration
   - Email confirmation
   - Secure login

3. **Chat Interface**
   - Toggle audio on/off
   - Choose text or voice input
   - Get personalized nutrition advice
   - Listen to AI responses
   - Read transcriptions
   - Toggle dark mode

4. **Data Persistence**
   - Chat history saved to database
   - User preferences saved
   - Session management automatic

## Security Measures

### Authentication
- Supabase Auth with email/password
- Secure session cookies
- Protected routes with middleware
- Token refresh automatic

### Data Protection
- Row Level Security on all tables
- Users can only access their own data
- Audio not stored, only transcribed
- HTTPS required in production

### API Security
- All endpoints require authentication
- Rate limiting ready for implementation
- Input validation on all endpoints
- External API keys kept server-side

## Development Workflow

### Setup
1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`
3. Run database migration: `scripts/init-db.sql`
4. Start development: `npm run dev`
5. Open http://localhost:3000

### Building
```bash
npm run build  # Production build
npm start      # Run production server
```

### Deployment
Deploy to Vercel with one click:
1. Connect GitHub repository
2. Add environment variables
3. Deploy

## Testing Checklist

- [ ] User can sign up and verify email
- [ ] User can login with credentials
- [ ] Chat sends messages and gets responses
- [ ] Audio recording captures voice input
- [ ] Transcription works and displays text
- [ ] Text-to-speech plays AI response
- [ ] Dark mode toggles correctly
- [ ] Chat history persists
- [ ] Logout redirects to login
- [ ] Protected routes require auth
- [ ] Responsive design on mobile
- [ ] Accessibility features work

## Future Enhancements

### Phase 2
- Multi-language support
- Nutrition plan generation
- Meal plan templates
- Grocery list creation
- Progress tracking
- Health metrics logging

### Phase 3
- Video consultations
- Integration with health apps
- Nutrition challenges
- Community features
- Expert reviews
- Content library

### Phase 4
- Mobile native apps
- Offline mode
- Advanced analytics
- Subscription plans
- Professional nutritionist network
- Integration with healthcare systems

## Impact & Social Value

### For Individuals
- 24/7 access to nutrition expertise
- No financial barriers
- Personalized guidance
- Audio for accessibility
- Improved health outcomes

### For Communities
- Better nutrition education
- Reduced healthcare inequality
- Support for underserved populations
- Fair treatment for all
- Data-driven insights

### For Healthcare
- Early intervention support
- Prevention-focused approach
- Reduced burden on healthcare system
- Evidence-based recommendations
- Population health improvement

## Compliance & Standards

- GDPR compliant (user consent, data privacy)
- HIPAA considerations (health data protection)
- WCAG 2.1 accessible design
- Industry standard security practices
- Open and transparent AI usage

## Support & Documentation

### For Users
- USER_GUIDE.md - Complete user documentation
- In-app help system
- FAQ section
- Support contact

### For Developers
- SETUP.md - Installation and configuration
- API.md - API endpoint documentation
- Code comments throughout
- Database schema documentation

### For Operations
- Deployment guide
- Environment setup
- Monitoring recommendations
- Scaling considerations

## Key Metrics to Track

- User signups and retention
- Chat frequency and satisfaction
- Audio feature adoption
- Error rates and performance
- User feedback and improvements
- Health outcome improvements

## Team & Credits

Built with ❤️ for health equity.

**Technologies Used:**
- Next.js - Web framework
- Supabase - Backend & database
- OpenAI - AI & transcription
- ElevenLabs - Text-to-speech
- Tailwind CSS - Styling
- shadcn/ui - Components

**Mission Partners:**
Serving underserved communities globally.

---

## Quick Links

- **Landing**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Sign Up**: http://localhost:3000/auth/sign-up
- **Chat**: http://localhost:3000/chat

## Contact & Support

For questions, feedback, or partnership opportunities:
- Email: support@nutri5.app
- Website: www.nutri5.app
- GitHub: github.com/nutri5
- Social: @Nutri5Health

---

**Nutri5 - HealthyChat**
*Equal access to nutrition guidance. No fees. No queues. Fair treatment for all.*

v1.0.0 - January 2024
