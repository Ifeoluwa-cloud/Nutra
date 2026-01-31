# Nutri5 Authentication & Security Guide

Complete guide to Nutri5's authentication system and security practices.

## Authentication Overview

Nutri5 uses **Supabase Auth** with email and password authentication. All data is protected with Row Level Security (RLS) and authentication middleware.

## Authentication Flow

### User Registration (Sign Up)

```
User → Sign Up Page → Email Validation → Password Hashing 
    → Supabase Auth → Email Confirmation → Database Profile
```

**Steps:**
1. User enters full name, email, and password
2. Password validated (min 6 characters)
3. Passwords confirmed to match
4. Data sent to Supabase Auth API
5. Email confirmation link sent
6. User clicks confirmation link
7. Account activated and ready to login

**Endpoint:** `POST /auth/sign-up`

### User Login

```
User → Login Page → Email & Password → Supabase Auth 
    → Session Created → Redirect to Chat
```

**Steps:**
1. User enters email and password
2. Credentials sent to Supabase
3. Password verified against hash
4. Session created if valid
5. Session cookie set (HTTP-only, secure)
6. Redirect to chat interface
7. User authenticated for API calls

**Endpoint:** `POST /auth/login`

### Session Management

```
Middleware → Check Session → Validate Token 
    → Refresh if Needed → Allow/Deny Request
```

**Auto-refresh:** Sessions automatically refresh using middleware (`lib/supabase/proxy.ts`)

**Session Duration:** Configurable in Supabase Auth settings (default: 24 hours)

### Logout

```
User → Click Logout → Clear Session → Sign Out API 
    → Redirect to Login Page
```

## Security Architecture

### 1. Password Security

```typescript
// Supabase handles password hashing with bcrypt
// Passwords never stored in plain text
// Min 6 characters enforced in UI
// Password reset available

// Sign up
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123' // Hashed by Supabase
})
```

**Best Practices:**
- Minimum 6 characters (enforce stronger in production)
- Never log passwords
- HTTPS required in production
- Implement rate limiting on login attempts

### 2. Session Management

```typescript
// Session created after successful authentication
const { data: { session } } = await supabase.auth.getSession()

// Session contains:
// - user: User object
// - access_token: JWT token
// - refresh_token: For token refresh
// - expires_at: Session expiration timestamp
```

**Session Security:**
- HTTP-only cookies (prevent XSS attacks)
- Secure flag (HTTPS only)
- SameSite attribute (prevent CSRF)
- Automatic refresh with middleware

### 3. Row Level Security (RLS)

All tables protected with RLS policies:

```sql
-- Example: Users can only see their own chat sessions
CREATE POLICY "Users can view own sessions"
ON chat_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own sessions
CREATE POLICY "Users can create own sessions"
ON chat_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own sessions
CREATE POLICY "Users can update own sessions"
ON chat_sessions
FOR UPDATE
USING (auth.uid() = user_id);
```

**Database Security:**
- Each user isolated to own data
- No cross-user data access
- Enforced at database level
- Cannot be bypassed

### 4. API Authentication

All API routes require valid session:

```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // User is authenticated, proceed
  // ...
}
```

**API Security:**
- All endpoints verify authentication
- User context used in queries
- RLS enforced in database
- Audio files never persisted

## User Data Protection

### Data Encryption

- **In Transit:** HTTPS/TLS encryption
- **At Rest:** Supabase encryption
- **Database:** PostgreSQL encryption

### Data Minimization

Nutri5 only collects:
- Email (authentication)
- Full name (personalization)
- Chat messages (consultation history)
- User preferences (settings)

### Data Access

- **User:** Can access own data
- **Admin:** No direct access (audit logs available)
- **Third Parties:** Never shared or sold

### Data Retention

- Chat messages: Kept until user deletes
- Transcriptions: Not stored (converted to text)
- Audio files: Not stored
- Logs: Retained for security (90 days)

## Email Verification

### Why Email Verification?

1. Confirm user owns email
2. Prevent spam accounts
3. Account recovery method
4. Enable email notifications

### Email Confirmation Flow

```
Sign Up → Confirmation Email Sent 
       → User Clicks Link 
       → Email Verified 
       → Account Activated
```

**Important:** Users cannot access chat until email confirmed

### Custom Email Configuration

Currently uses Supabase default emails. To customize:

1. Supabase Dashboard → Auth → Email Templates
2. Edit templates for:
   - Confirmation email
   - Password reset email
   - Invite email

## Password Reset

### How It Works

```
User Forgot Password → Enter Email 
                    → Reset Link Sent
                    → Click Reset Link
                    → Set New Password
                    → Password Updated
                    → User Logs In
```

### Implementation

```typescript
// Request password reset
const { error } = await supabase.auth.resetPasswordForEmail(email)

// User receives email with reset link
// After clicking link, they can set new password
const { error } = await supabase.auth.updateUser({
  password: 'newPassword123'
})
```

## Security Best Practices

### For Users

1. **Strong Passwords**
   - Use unique passwords
   - Mix uppercase, lowercase, numbers, symbols
   - Avoid common words
   - Min 12 characters recommended

2. **Account Security**
   - Don't share login credentials
   - Use password manager
   - Clear cookies after use (public devices)
   - Enable notifications

3. **Device Security**
   - Keep device updated
   - Use antivirus software
   - Secure Wi-Fi connections
   - Lock device when away

### For Developers

1. **Code Security**
   - Never hardcode secrets
   - Use environment variables
   - Validate all inputs
   - Implement rate limiting

2. **Database Security**
   - Always use RLS
   - Never bypass RLS in code
   - Use parameterized queries
   - Regular backups

3. **Deployment Security**
   - HTTPS required
   - Security headers configured
   - Environment secrets managed
   - Regular security audits

## Compliance & Standards

### GDPR Compliance

Nutri5 respects GDPR requirements:
- **Consent:** Users consent to data collection
- **Right to Access:** Users can download data
- **Right to Deletion:** Users can delete account
- **Data Minimization:** Only necessary data collected
- **Privacy By Design:** Privacy-first architecture

### HIPAA Considerations

While not HIPAA certified, we implement practices:
- Encryption of health data
- Access controls (RLS)
- Audit logging
- Data breach notification procedures

### Other Standards

- **WCAG 2.1:** Accessible design
- **OWASP:** Security guidelines
- **SOC 2:** When required

## Monitoring & Auditing

### Activity Logging

Log all:
- Authentication events (login/logout)
- Data access (queries)
- API calls
- Errors and exceptions

### Security Monitoring

Monitor for:
- Unusual login patterns
- Multiple failed attempts
- Data access anomalies
- External API errors

### Incident Response

1. **Detection:** Monitor alerts
2. **Investigation:** Review logs
3. **Containment:** Limit damage
4. **Eradication:** Remove threat
5. **Recovery:** Restore service
6. **Post-Incident:** Lessons learned

## Troubleshooting Auth Issues

### Email Not Received

1. Check spam/junk folder
2. Verify email address correct
3. Request new confirmation email
4. Check Supabase email settings

### Can't Login

1. Verify email confirmed
2. Check password correct
3. Try password reset
4. Clear browser cookies
5. Try incognito window

### Session Expired

1. Refresh page
2. Log out and log back in
3. Check browser cookies enabled
4. Clear cache and cookies

### API Returns 401

1. Check user is logged in
2. Verify session cookie exists
3. Check token not expired
4. Try logging out and in

## Environment Variables

```env
# Public (safe in client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# Secret (server only)
# SUPABASE_SERVICE_ROLE_KEY=...  # Use if needed
```

## Code Examples

### Check If User Is Logged In

```typescript
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  // Not logged in
  router.push('/auth/login')
} else {
  // Logged in
  console.log('Welcome', user.email)
}
```

### Create Protected Component

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProtectedPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [supabase, router])

  if (isLoading) return <div>Loading...</div>

  return <div>Protected content for {user?.email}</div>
}
```

### Handle Logout

```typescript
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    router.push('/auth/login')
  }
}
```

## Security Checklist

- [ ] HTTPS enabled in production
- [ ] Environment variables not committed
- [ ] RLS policies on all tables
- [ ] Rate limiting configured
- [ ] Email verification required
- [ ] Password reset available
- [ ] Security headers set
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Audit logging enabled
- [ ] Error messages don't leak info
- [ ] Session timeout configured
- [ ] Password policy enforced
- [ ] Suspicious activity monitored

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Security Docs](https://supabase.com/docs/guides/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance](https://gdpr-info.eu/)

---

**Remember:** Security is everyone's responsibility. Keep learning and stay vigilant.
