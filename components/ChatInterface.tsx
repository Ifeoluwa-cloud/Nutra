'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Phone, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VoiceConversation } from '@/components/VoiceConversation'
import { useChat } from '@/contexts/ChatContext'
import { useRouter } from 'next/navigation'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  compact?: boolean
  className?: string
}

export function ChatInterface({ compact = false, className = '' }: ChatInterfaceProps) {
  const { messages, isLoading, isSpeaking, sendMessage, clearMessages, playAudioResponse, stopAudio } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const [preferTextMode, setPreferTextMode] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const processedMessagesRef = useRef<Set<string>>(new Set())

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }, 0)
    }
  }, [messages])

  // Auto-play AI responses
  useEffect(() => {
    if (autoPlayEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && !processedMessagesRef.current.has(lastMessage.id)) {
        processedMessagesRef.current.add(lastMessage.id)
        // Delay slightly to allow UI to update
        setTimeout(() => {
          playAudioResponse(lastMessage.content)
        }, 500)
      }
    }
  }, [messages, autoPlayEnabled, playAudioResponse])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const message = inputValue
    setInputValue('')
    console.log('[ChatInterface] Sending with preferTextMode:', preferTextMode)
    await sendMessage(message, preferTextMode ? { mode: 'text', provider: 'github' } : undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEndChat = () => {
    clearMessages()
    stopAudio()
    router.push('/')
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Nutra AI Nutritionist</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              {isSpeaking ? 'Talking now...' : 'Online now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={preferTextMode ? 'default' : 'ghost'}
            onClick={() => setPreferTextMode(!preferTextMode)}
            title={preferTextMode ? 'Switch to audio mode' : 'Switch to text-only mode'}
            className="h-9 w-9"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v2m-6-2a2 2 0 11-4 0 2 2 0 014 0zM20 20a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
            title={autoPlayEnabled ? 'Disable voice' : 'Enable voice'}
            className="h-9 w-9"
          >
            {autoPlayEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEndChat}
            className="h-9 w-9 hover:text-destructive"
            title="End chat"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className={`flex-1 px-4 ${compact ? 'py-3' : 'py-4'}`}>
        <div ref={scrollAreaRef} className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-muted-foreground">Start a conversation with your AI nutritionist</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex gap-3 max-w-xs lg:max-w-md ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-border/50 bg-card">
        <div className="flex items-center gap-2">
          <VoiceConversation />
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or click mic to talk..."
              className="pr-12 rounded-full border-border/50 bg-secondary/50 focus:bg-background"
              disabled={isLoading}
              aria-label="Message input"
            />
          </div>

          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          🎤 Click mic to have a live conversation • Type for text • End chat with ☎️ button
        </p>
      </div>
    </div>
  )
}
