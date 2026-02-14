import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { text } = await request.json()

  // TTS is allowed without authentication for accessibility
  // Users may be using text-only mode with GitHub API and should still get audio
  
  try {
    const ELEVEN_KEY = process.env.ELEVEN_API_KEY
    const VOICE_ID = process.env.ELEVEN_VOICE_ID || 'alloy'

    if (!ELEVEN_KEY) {
      console.log('[TTS] No ElevenLabs API key configured, using browser fallback')
      // Return empty audio blob - client will fall back to browser speech synthesis
      const sampleRate = 8000
      const duration = 0.1 // minimal silent audio
      const samples = sampleRate * duration
      const audioBuffer = new ArrayBuffer(44 + samples * 2)
      const view = new DataView(audioBuffer)

      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }

      writeString(0, 'RIFF')
      view.setUint32(4, 36 + samples * 2, true)
      writeString(8, 'WAVE')
      writeString(12, 'fmt ')
      view.setUint32(16, 16, true)
      view.setUint16(20, 1, true)
      view.setUint16(22, 1, true)
      view.setUint32(24, sampleRate, true)
      view.setUint32(28, sampleRate * 2, true)
      view.setUint16(32, 2, true)
      view.setUint16(34, 16, true)
      writeString(36, 'data')
      view.setUint32(40, samples * 2, true)

      for (let i = 0; i < samples; i++) {
        view.setInt16(44 + i * 2, 0, true)
      }

      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
        },
      })
    }

    // Call ElevenLabs Text-to-Speech
    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`

    console.log('[TTS] Calling ElevenLabs with voice:', VOICE_ID)
    const elevenResp = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_KEY,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })

    if (!elevenResp.ok) {
      const errText = await elevenResp.text().catch(() => '')
      console.error('[TTS] ElevenLabs error:', elevenResp.status, errText)
      return new Response('TTS provider error', { status: 502 })
    }

    const arrayBuffer = await elevenResp.arrayBuffer()
    return new Response(arrayBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  } catch (error) {
    console.error('TTS Error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
