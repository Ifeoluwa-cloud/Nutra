# Nutri5 - Quick Start Guide

Get Nutri5 running in 5 minutes!

## 1. Install & Setup (2 minutes)

```bash
# Install dependencies
npm install

# Create .env.local with your keys
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
EOF
```

## 2. Database Setup (1 minute)

Run the migration SQL from `scripts/init-db.sql` in your Supabase SQL editor:
- Go to Supabase Dashboard
- SQL Editor → New Query
- Paste contents of `scripts/init-db.sql`
- Run Query

## 3. Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test the App (1 minute)

1. **Landing Page**: View features and mission
2. **Sign Up**: Create test account with fake email
3. **Login**: Log in with your credentials
4. **Chat**: Ask "What should I eat for breakfast?"
5. **Audio**: Toggle "Audio On" and try voice input
6. **Dark Mode**: Click moon icon

## 5. Deploy (Optional)

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Projects → Settings → Environment Variables
```

### Or Manual Deploy

```bash
npm run build
npm start
```

## Environment Setup

### Get Your API Keys

**Supabase:**
1. Create account at [supabase.com](https://supabase.com)
2. New Project → PostgreSQL
3. Settings → API Keys
4. Copy URL and anon key

**OpenAI:**
1. Create account at [openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Copy key (GPT-4o-mini available)

**ElevenLabs:**
1. Create account at [elevenlabs.io](https://elevenlabs.io)
2. Profile → API Key
3. Copy key

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start           # Run production build

# Database
# Run scripts/init-db.sql in Supabase

# Environment
# Edit .env.local with your API keys
```

## Troubleshooting

### "Unauthorized" Error
- Check environment variables in `.env.local`
- Verify API keys are correct
- Restart dev server

### Audio Not Working
- Check browser permissions
- Allow microphone access
- Check internet connection

### Chat Not Responding
- Verify OPENAI_API_KEY is set
- Check API key is valid
- Restart dev server

### Database Errors
- Run migration script again
- Check Supabase project is active
- Verify NEXT_PUBLIC_SUPABASE_URL

## File Structure

```
/
├── app/page.tsx          # Landing page
├── app/chat/page.tsx     # Chat interface
├── app/auth/             # Authentication pages
├── app/api/              # API routes
├── lib/supabase/         # Supabase clients
├── scripts/init-db.sql   # Database setup
├── SETUP.md              # Full setup guide
├── API.md                # API documentation
├── USER_GUIDE.md         # User documentation
└── .env.local            # Environment variables (CREATE THIS)
```

## Testing Checklist

- [ ] Home page loads
- [ ] Sign up works
- [ ] Email verification works
- [ ] Login successful
- [ ] Chat sends message
- [ ] AI responds
- [ ] Audio toggle works
- [ ] Dark mode works
- [ ] Logout works

## Next Steps

1. **Customize**: Edit landing page content
2. **Style**: Update colors in `app/globals.css`
3. **Features**: Add to AI system prompt in `app/api/chat/route.ts`
4. **Database**: Add new tables as needed
5. **Deploy**: Push to production

## Important Notes

- Never commit `.env.local` (add to `.gitignore`)
- Keep API keys secret
- Audio requires HTTPS in production
- Each user needs email confirmation
- Database migrations are one-time

## Getting Help

- **Setup Issues?** → See `SETUP.md`
- **Using Nutri5?** → See `USER_GUIDE.md`
- **API Questions?** → See `API.md`
- **Full Details?** → See `PROJECT_SUMMARY.md`

## Common Customizations

### Change AI Personality

Edit `app/api/chat/route.ts`:
```typescript
const systemPrompt = `Your custom instructions here...`
```

### Change Colors

Edit `app/globals.css`:
```css
:root {
  --primary: oklch(0.60 0.20 173.3);  /* Change teal to your color */
}
```

### Change TTS Voice

Edit `app/api/speak/route.ts`:
```typescript
const voiceId = '21m00Tcm4TlvDq8ikWAM'  // Change ElevenLabs voice ID
```

## Production Checklist

- [ ] Environment variables set in hosting
- [ ] Database backups configured
- [ ] HTTPS enabled
- [ ] Error monitoring setup
- [ ] Analytics installed
- [ ] Custom domain configured
- [ ] Email templates customized
- [ ] Terms of service drafted
- [ ] Privacy policy published
- [ ] Support system ready

---

**You're all set!** 🚀

Nutri5 is now running. Start helping people access nutrition guidance today.

For questions: Check the documentation files or review the code comments.
