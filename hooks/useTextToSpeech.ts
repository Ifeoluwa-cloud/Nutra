import { useCallback } from 'react'
import { useChat } from '@/contexts/ChatContext'

export function useTextToSpeech() {
  const { isSpeaking, playAudioResponse, stopAudio } = useChat()

  const speak = useCallback(async (text: string) => {
    await playAudioResponse(text)
  }, [playAudioResponse])

  const stop = useCallback(() => {
    stopAudio()
  }, [stopAudio])

  return {
    isPlaying: isSpeaking,
    speak,
    stop,
  }
}

export default useTextToSpeech
