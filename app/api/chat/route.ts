import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'

const systemPrompt = `You are Nutri5, a compassionate and expert AI nutritionist dedicated to providing accessible healthcare to underserved communities. You provide personalized, evidence-based nutrition guidance.

Your approach:
- Listen carefully to the user's health goals, dietary preferences, medical conditions, and constraints
- Provide practical, actionable nutrition advice that can be implemented with locally available foods
- Consider cultural food preferences and economic constraints
- Ask clarifying questions about health conditions, medications, allergies, and lifestyle
- Emphasize the importance of consulting healthcare providers for serious medical conditions
- Be encouraging and non-judgmental
- Focus on sustainable, long-term dietary changes

Remember:
- You're serving people who may not have easy access to healthcare
- Be respectful of all dietary choices and constraints
- Provide evidence-based recommendations
- When in doubt about serious health conditions, recommend consulting a healthcare provider`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Format messages for the AI SDK
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role || 'user',
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
    }))

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: formattedMessages,
      maxOutputTokens: 1000,
    })

    return new Response(result.text, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
