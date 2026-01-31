'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Send, 
  Mic, 
  Volume2,
  Loader2,
  Square
} from 'lucide-react'

const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null

export default function ChatPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [useAudio, setUseAudio] = useState(true)
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<any>(null)
  const audioChunksRef = useRef<any>([])

  const [textInput, setTextInput] = useState('')
  const [localMessages, setLocalMessages] = useState<any[]>([])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
  })

  const handleSubmit = (event: any) => {
    event.preventDefault()
    aiHandleSubmit()
  }

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      } else {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [supabase, router])

  // Update local messages when AI messages change
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])



  const startRecording = async () => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        if (finalTranscript) {
          setTextInput(finalTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      alert('Could not start speech recognition')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSpeakMessage = async (text: string) => {
    if (isSpeaking) return

    try {
      setIsSpeaking(true)
      
      // Use browser's Web Speech API for text-to-speech (free, no API needed)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Speech error:', error)
      setIsSpeaking(false)
    }
  }



  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md text-center">
                  <CardContent className="pt-12 pb-12">
                    <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mic className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Start Your Consultation
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Welcome to Nutri5! I'm your personal AI nutritionist. You can ask me anything about nutrition, diet, and healthy eating.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use text or audio - I'll transcribe and respond to help you achieve your health goals.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {localMessages && localMessages.length > 0 && localMessages.map((message: any, index: number) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <Card className={`max-w-2xl ${
                      message.role === 'user'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-muted'
                    }`}>
                      <CardContent className="pt-4 pb-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                        </p>
                        {message.role === 'assistant' && useAudio && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSpeakMessage(typeof message.content === 'string' ? message.content : JSON.stringify(message.content))}
                            className={message.role === 'user' ? 'text-white hover:bg-teal-700' : ''}
                            disabled={isSpeaking}
                          >
                            <Volume2 className="w-4 h-4 mr-1" />
                            {isSpeaking ? 'Speaking...' : 'Hear'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="bg-muted">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={scrollRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex gap-2">
              <Button
                variant={useAudio ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseAudio(!useAudio)}
              >
                {useAudio ? 'Audio On' : 'Audio Off'}
              </Button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                if (!textInput.trim() || isLoading) return
                
                const userMessage = textInput
                setTextInput('')
                
                // Add user message to local messages
                const newMessages = [
                  ...localMessages,
                  { role: 'user', content: userMessage }
                ]
                setLocalMessages(newMessages)
                
                try {
                  // Send to API
                  const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      messages: newMessages
                    })
                  })
                  
                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    console.error('[v0] API error:', response.status, errorData)
                    throw new Error(`API error: ${response.status}`)
                  }
                  
                  const text = await response.text()
                  console.log('[v0] API response:', text)
                  
                  if (text) {
                    setLocalMessages(prev => [
                      ...prev,
                      { role: 'assistant', content: text }
                    ])
                  }
                } catch (error) {
                  console.error('[v0] Chat error:', error)
                  // Show error in chat
                  setLocalMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` }
                  ])
                }
              }} 
              className="flex gap-2"
            >
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Ask about nutrition, diets, health goals..."
                className="flex-1"
                disabled={isLoading || isRecording}
              />

              {useAudio && (
                <Button
                  type="button"
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'}
                >
                  {isRecording ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !textInput.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
  )
}
