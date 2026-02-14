'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useConversation } from '@11labs/react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VoiceConversation() {
  const [hasPermission, setHasPermission] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [muted, setMuted] = useState(false)
  const isStartingRef = useRef(false)

  const conversation = useConversation()
  const { status } = conversation

  // Request microphone permission on mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)
        setErrorMessage('')
      } catch (error) {
        const message = (error as Error).message || 'Microphone access denied'
        setErrorMessage(message)
        console.error('Microphone permission error:', error)
      }
    }

    requestMicPermission()
  }, [])

  const handleStartConversation = async () => {
    if (!hasPermission) {
      setErrorMessage('Microphone permission required. Please enable microphone access.')
      return
    }

    if (isStartingRef.current) {
      console.log('Conversation already starting...')
      return
    }

    isStartingRef.current = true

    try {
      // Ensure audio input is ready before starting
      await new Promise(resolve => setTimeout(resolve, 100))

      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        connectionType: 'websocket',
      })
      console.log('Started conversation:', conversationId)
      setErrorMessage('')
    } catch (error) {
      const message = (error as Error).message || 'Failed to start conversation'
      console.error('Start conversation error:', error)
      setErrorMessage(message)
    } finally {
      isStartingRef.current = false
    }
  }

  const handleEndConversation = async () => {
    try {
      await conversation.endSession()
      setErrorMessage('')
    } catch (error) {
      console.error('End conversation error:', error)
      setErrorMessage('Failed to end conversation')
    }
  }

  const toggleMute = () => {
    try {
      const newMutedState = !muted
      conversation.setVolume({
        volume: newMutedState ? 0 : 1,
      })
      setMuted(newMutedState)
    } catch (error) {
      console.error('Mute toggle error:', error)
      setErrorMessage('Failed to toggle mute')
    }
  }

  const isConnected = status === 'connected'

  return (
    <Button
      variant={isConnected ? 'destructive' : 'ghost'}
      size="icon"
      className={`h-10 w-10 rounded-full transition-all ${
        isConnected
          ? 'bg-destructive hover:bg-destructive/90'
          : 'hover:bg-primary/10 hover:text-primary'
      }`}
      onClick={isConnected ? handleEndConversation : handleStartConversation}
      disabled={!hasPermission || status === 'connecting'}
      aria-label={isConnected ? 'End voice conversation' : 'Start voice conversation'}
      title={errorMessage || (isConnected ? 'End conversation' : 'Start voice conversation')}
    >
      {status === 'connecting' ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isConnected ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  )
}
