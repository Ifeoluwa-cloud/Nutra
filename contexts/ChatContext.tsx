 'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useConversation } from '@11labs/react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isAudio?: boolean
}

interface ChatContextType {
  messages: Message[]
  isLoading: boolean
  isSpeaking: boolean
  sendMessage: (content: string, options?: any) => Promise<void>
  sendAudioMessage: (content: string) => Promise<void>
  clearMessages: () => void
  playAudioResponse: (text: string) => Promise<void>
  stopAudio: () => void
  addMessage: (role: 'user' | 'assistant', content: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting-nora',
      role: 'assistant',
      content: "Hey there… I'm Nora, your 24/7 AI nutritionist with Nutra. I'm so glad you're here. How can I help you today?",
      timestamp: new Date(),
      isAudio: false,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const conversation = useConversation()

  // Sync messages from ElevenLabs client-side conversation when available
  React.useEffect(() => {
    const conv: any = conversation as any
    if (!conv) return

    let pollingInterval: number | undefined

    const addFromConv = (convMsg: any) => {
      try {
        const role = convMsg.role === 'assistant' || convMsg.author === 'assistant' ? 'assistant' : 'user'
        const content = convMsg.content ?? convMsg.text ?? ''
        const id = convMsg.id ?? `conv-${Date.parse(convMsg.timestamp || new Date().toISOString())}-${Math.random()}`
        // Avoid adding duplicates
        setMessages((prev) => {
          if (prev.some((m) => m.id === id || (m.content === content && m.role === role))) return prev
          const msg: Message = { id, role, content, timestamp: new Date(convMsg.timestamp || Date.now()) }
          return [...prev, msg]
        })
      } catch (e) {
        // ignore malformed conv message
      }
    }

    // If the SDK exposes an event API, use it
    if (typeof conv.on === 'function') {
      try {
        conv.on('message', addFromConv)
      } catch {}
    }

    // If SDK exposes a messages array, poll for changes as a fallback
    if (Array.isArray(conv.messages)) {
      let lastLen = conv.messages.length
      pollingInterval = window.setInterval(() => {
        try {
          const msgs = conv.messages as any[]
          if (msgs.length > lastLen) {
            for (let i = lastLen; i < msgs.length; i++) {
              addFromConv(msgs[i])
            }
            lastLen = msgs.length
          }
        } catch (e) {}
      }, 500)
    }

    return () => {
      try {
        if (typeof conv.off === 'function') conv.off('message', addFromConv)
      } catch {}
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [conversation])

  const sendMessage = useCallback(async (content: string, options?: any) => {
    if (!content.trim()) return

    console.log('[CLIENT] sendMessage called with:', { content: content.substring(0, 50), options })

    // If an ElevenLabs conversation is active, prefer sending via the agent
    try {
      const conv: any = conversation as any
      if (conv && conv.status === 'connected' && typeof conv.sendUserMessage === 'function') {
        // add user message locally and send via ElevenLabs agent
        addMessage('user', content)
        // conv.sendUserMessage will trigger agent responses which are synced elsewhere
        conv.sendUserMessage(content)
        return
      }
    } catch (e) {
      console.error('ElevenLabs conversation send failed, falling back to server:', e)
    }

    // Fallback: server-side chat route
    // Add user message locally
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const requestBody = {
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        ...(options || {}),  // spread any provider or mode options
      }
      console.log('[CLIENT] Sending request body:', JSON.stringify(requestBody).substring(0, 200))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const raw = await response.text().catch(() => '')
        let parsed: any = null
        try {
          parsed = JSON.parse(raw)
        } catch {}
        const detail = (parsed && (parsed.detail || parsed.error)) || raw || response.statusText
        console.error('Chat API responded with error:', response.status, detail)

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Error from chat API: ${detail}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        return
      }

      const text = await response.text()
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, conversation])

  const sendAudioMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Add the user's audio message as a transcribed text message and mark as audio
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      isAudio: true,
    }
    setMessages((prev) => [...prev, userMessage])

    // Then request assistant response (same as sendMessage fallback)
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        const raw = await response.text().catch(() => '')
        let parsed: any = null
        try {
          parsed = JSON.parse(raw)
        } catch {}
        const detail = (parsed && (parsed.detail || parsed.error)) || raw || response.statusText
        console.error('Chat API responded with error for audio message:', response.status, detail)

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `Error from chat API: ${detail}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        return
      }

      const text = await response.text()
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        isAudio: false,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send audio message:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your audio. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'greeting-nora',
        role: 'assistant',
        content: "Hey there… I'm Nora, your 24/7 AI nutritionist with Nutra. I'm so glad you're here. How can I help you today?",
        timestamp: new Date(),
        isAudio: false,
      },
    ])
  }, [])

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    if (!content.trim()) return
    
    const message: Message = {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => {
      // Avoid duplicate messages
      if (prev.some(m => m.id === message.id || (m.role === role && m.content === content && m.timestamp.getTime() === message.timestamp.getTime()))) {
        return prev
      }
      return [...prev, message]
    })
  }, [])

  const playAudioResponse = useCallback(async (text: string) => {
    console.log('[AUDIO] playAudioResponse called with text length:', text.length)
    if (!text || !text.trim()) {
      console.log('[AUDIO] Text is empty, skipping')
      return
    }

    try {
      // Check if browser supports speech synthesis
      if (!window.speechSynthesis) {
        console.error('[AUDIO] Speech Synthesis API not supported in this browser')
        setIsSpeaking(false)
        return
      }

      // Don't interrupt if already speaking - just do nothing
      if (window.speechSynthesis.speaking) {
        console.log('[AUDIO] Speech already in progress, ignoring request')
        return
      }

      console.log('[AUDIO] Using browser SpeechSynthesis API')
      console.log('[AUDIO] Browser voice support:', window.speechSynthesis.getVoices().length, 'voices available')
      
      setIsSpeaking(true)

      // Clean text - remove extra whitespace
      const cleanText = text.trim()
        .replace(/[\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 1000) // Limit to 1000 chars for better stability

      console.log('[AUDIO] Clean text length:', cleanText.length)
      console.log('[AUDIO] Text preview:', cleanText.substring(0, 100))

      // Detect language from text
      const detectedLang = text.includes('¡') || text.includes('é') ? 'es-ES' : 'en-US'
      console.log('[AUDIO] Detected language:', detectedLang)

      const utter = new SpeechSynthesisUtterance(cleanText)
      utter.rate = 0.9
      utter.pitch = 1.0
      utter.volume = 1.0
      utter.lang = detectedLang
      
      // Get voices that match the language
      const voices = window.speechSynthesis.getVoices()
      const langVoices = voices.filter(v => v.lang.startsWith(detectedLang.split('-')[0]))
      if (langVoices.length > 0) {
        utter.voice = langVoices[0]
        console.log('[AUDIO] Using voice:', langVoices[0].name, 'for language:', detectedLang)
      } else if (voices.length > 0) {
        utter.voice = voices[0]
        console.log('[AUDIO] No matching language voice, using default:', voices[0].name)
      }
      
      console.log('[AUDIO] Starting speech synthesis')
      const spoke = window.speechSynthesis.speak(utter)
      console.log('[AUDIO] Speak called, returned:', spoke)
      
      utter.onstart = () => {
        console.log('[AUDIO] Speech started')
        setIsSpeaking(true)
      }
      utter.onend = () => {
        console.log('[AUDIO] Speech ended normally')
        setIsSpeaking(false)
      }
      utter.onerror = (e) => {
        console.error('[AUDIO] Speech synthesis error event triggered')
        console.error('[AUDIO] Error details:', e?.error || 'unknown error')
        console.error('[AUDIO] Text was:', cleanText.slice(0, 100))
        console.log('[AUDIO] Continuing anyway...')
        setIsSpeaking(false)
      }
    } catch (error) {
      console.error('[AUDIO] Error in playAudioResponse:', error)
      setIsSpeaking(false)
    }
  }, [])

  const stopAudio = useCallback(() => {
    console.log('[AUDIO] stopAudio called')
    // Stop audio file playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    // Stop speech synthesis
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        isLoading, 
        isSpeaking,
        sendMessage, 
        sendAudioMessage, 
        clearMessages,
        playAudioResponse,
        stopAudio,
        addMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
