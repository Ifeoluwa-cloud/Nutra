# Nutri5 - HealthyChat

> Equal access to nutrition guidance. No fees. No queues. Fair treatment for all.

A fullstack web application providing instant 24/7 nutrition guidance to underserved and vulnerable communities using AI expertise, ensuring equal and easy access to healthcare resources without barriers or high costs.

## 🌟 Overview

**Nutri5 - HealthyChat** harnesses AI to deliver personalized dietary advice through conversational chat. Our mission is simple: make nutrition guidance accessible to everyone.

### The Problem
- Malnutrition is a major health issue, especially in underserved areas
- Limited access to nutrition experts
- High medical consultation fees
- Long waiting times
- Healthcare inequality

### The Solution
- 24/7 AI nutritionist available anytime
- Zero consultation fees
- No waiting queues
- Personalized guidance based on your needs
- Audio and text options
- Dark mode for accessibility
- Secure and private

---

## ✨ Key Features

### 💬 AI Nutritionist Chat
- Real-time streaming responses powered by GPT-4o-mini
- Personalized nutrition guidance
- Support for diverse health conditions
- Evidence-based recommendations

### 🎙️ Audio Support
- **Speech-to-Text**: Speak your questions (Whisper)
- **Text-to-Speech**: Listen to AI responses (ElevenLabs)
- Transcription always displayed for accessibility
- Perfect for hands-free consultation

### 🔐 Secure & Private
- Email/password authentication
- Row Level Security on all data
- HTTPS encrypted
- Audio never stored
- Health data protected

### 🌙 Dark Mode
- Automatic system preference detection
- Manual toggle available
- Full theme support
- Accessibility focused

### 📱 Responsive Design
- Works on mobile and desktop
- Touch-friendly interface
- Optimized performance
- Accessible navigation

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16.8+
- Supabase account
- OpenAI API key
- ElevenLabs API key

### 2. Installation (5 minutes)

```bash
# Clone repository
git clone <repo>
cd nutri5-healthychat

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API keys
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# OPENAI_API_KEY=...
# ELEVENLABS_API_KEY=...
```

### 3. Database Setup

1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Copy contents from `scripts/init-db.sql`
4. Run Query

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test Features

1. **Sign Up** - Create test account
2. **Login** - Access chat interface
3. **Chat** - Ask nutrition questions
4. **Audio** - Toggle audio mode
5. **Dark Mode** - Click moon icon

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

---

## 📁 Project Structure

```
nutri5-healthychat/
├── app/
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Design system
│   ├── auth/                   # Authentication
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── error/
│   ├── chat/                   # Chat interface
│   └── api/                    # API routes
│       ├── chat/
│       ├── transcribe/
│       └── speak/
├── lib/
│   └── supabase/              # Database clients
├── components/
│   └── ui/                    # UI components
├── scripts/
│   └── init-db.sql            # Database migration
├── public/
│   └── nutri5-ai-hero.jpg     # Landing image
└── Documentation files (see below)
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Get running in 5 minutes |
| [SETUP.md](./SETUP.md) | Detailed installation guide |
| [USER_GUIDE.md](./USER_GUIDE.md) | How to use Nutri5 |
| [API.md](./API.md) | API endpoint reference |
| [AUTH.md](./AUTH.md) | Authentication & security |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Full project overview |
| [BUILD_COMPLETE.md](./BUILD_COMPLETE.md) | Build completion summary |

**Start here:** [QUICKSTART.md](./QUICKSTART.md)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Components
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime
- **Supabase** - Database & Auth
- **PostgreSQL** - Data storage

### AI & APIs
- **OpenAI** - Chat & transcription
- **ElevenLabs** - Text-to-speech

---

## 🔐 Security

- ✅ Supabase authentication
- ✅ Row Level Security (RLS)
- ✅ HTTP-only session cookies
- ✅ HTTPS encryption
- ✅ Input validation
- ✅ CSRF protection
- ✅ XSS protection
- ✅ SQL injection prevention

See [AUTH.md](./AUTH.md) for security details.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Or Deploy Manually

```bash
npm run build
npm start
```

See [SETUP.md](./SETUP.md) for deployment options.

---

## 🎯 API Endpoints

### Chat
```
POST /api/chat
Streams nutrition guidance from AI nutritionist
```

### Transcription
```
POST /api/transcribe
Converts audio to text using Whisper
```

### Text-to-Speech
```
POST /api/speak
Converts text to audio using ElevenLabs
```

See [API.md](./API.md) for full documentation.

---

## 🌍 Mission & Values

### Our Commitment
- **Health Equity**: Equal access for everyone
- **No Barriers**: No excessive fees or waiting
- **Fair Treatment**: Common person gets same respect as VIP
- **Accessible**: Audio, text, dark mode for all
- **Private**: Your health data is secure
- **Sustainable**: Long-term impact focus

### Who We Serve
- Underserved communities
- People without healthcare access
- Individuals with budget constraints
- Non-English speakers (expandable)
- People with disabilities

---

## 📈 Key Metrics

Track these:
- User signups and retention
- Chat frequency
- Audio feature adoption
- User satisfaction
- Health outcome improvements
- Accessibility usage

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork repository
2. Create feature branch
3. Make improvements
4. Submit pull request

See [BUILD_COMPLETE.md](./BUILD_COMPLETE.md) for project status.

---

## ❓ FAQ

### Is this a substitute for a doctor?
No. Nutri5 provides nutrition guidance but cannot diagnose or prescribe. Always consult healthcare providers for serious concerns.

### Is my data private?
Yes. Data is encrypted, protected by Row Level Security, and never sold or shared.

### Can I use this offline?
No. Nutri5 requires internet for AI responses, transcription, and text-to-speech.

### How do I delete my account?
Contact support to request account deletion. Your data will be permanently removed.

### What languages are supported?
Currently English. Multi-language support planned for Phase 2.

See [USER_GUIDE.md](./USER_GUIDE.md) for more FAQs.

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
- Check environment variables in `.env.local`
- Verify API keys are correct
- Restart dev server

### Issue: Audio not working
- Check browser permissions
- Allow microphone access
- Try refreshing page

### Issue: Chat not responding
- Check OPENAI_API_KEY is set
- Verify API key is valid
- Check internet connection

See [SETUP.md](./SETUP.md) for more troubleshooting.

---

## 📞 Support

- **Installation Help**: See [SETUP.md](./SETUP.md)
- **Using Nutri5**: See [USER_GUIDE.md](./USER_GUIDE.md)
- **API Questions**: See [API.md](./API.md)
- **Security Questions**: See [AUTH.md](./AUTH.md)
- **Project Details**: See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

## 📄 License

[MIT License](./LICENSE)

Feel free to use, modify, and distribute this project.

---

## 🙏 Acknowledgments

Built with ❤️ for health equity.

**Technologies:**
- Next.js - Web framework
- Supabase - Backend
- OpenAI - AI
- ElevenLabs - Audio
- Tailwind CSS - Styling
- shadcn/ui - Components

**Mission Partners:**
Serving underserved communities globally.

---

## 🚀 Getting Started

1. **Read** [QUICKSTART.md](./QUICKSTART.md)
2. **Install** dependencies with `npm install`
3. **Configure** `.env.local` with API keys
4. **Setup** database with migration script
5. **Run** `npm run dev`
6. **Visit** http://localhost:3000
7. **Test** all features
8. **Deploy** to production

---

## 📊 Project Status

✅ **Complete** - Fully functional, production-ready

- Database & Authentication
- Landing Page
- Chat Interface
- Audio Features
- Dark Mode
- Security
- Documentation

---

## 🌟 Features Roadmap

### Phase 2 (Planned)
- Multi-language support
- Nutrition plan generation
- Meal planning tools
- Progress tracking
- Community features

### Phase 3 (Future)
- Video consultations
- Health app integrations
- Mobile apps
- Advanced analytics
- Professional reviews

### Phase 4 (Vision)
- Global healthcare network
- Certified nutritionists
- Subscription plans
- Enterprise solutions

---

## 💚 Join the Mission

Help us make nutrition guidance accessible to everyone.

**Actions you can take:**
- ⭐ Star this repository
- 📢 Share with others
- 🐛 Report issues
- 💡 Suggest features
- 🤝 Contribute code
- 📞 Spread the word

---

## 📧 Contact

- **Email**: support@nutri5.app
- **Website**: www.nutri5.app
- **GitHub**: github.com/nutri5
- **Twitter**: @Nutri5Health

---

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guide](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [ElevenLabs API](https://elevenlabs.io/docs)

---

**Nutri5 - HealthyChat**

*Equal access to nutrition guidance. No fees. No queues. Fair treatment for all.*

v1.0.0 - January 2024 - Production Ready
#   N u t r a  
 