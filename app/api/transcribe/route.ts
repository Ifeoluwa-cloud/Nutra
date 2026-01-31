// This route is deprecated - the app now uses the browser's Web Speech API for transcription
// which is free and requires no API keys, aligning with Nutri5's mission of accessible healthcare

export async function POST(request: Request) {
  return new Response(
    JSON.stringify({
      error: 'Speech-to-text is now handled by the browser using Web Speech API',
      message: 'No server-side transcription is needed',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
