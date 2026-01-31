"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, MicOff, Volume2, VolumeX, Loader2, Keyboard, MessageCircle, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"

type ChatState = "idle" | "listening" | "processing" | "speaking"
type InputMode = "voice" | "text"

interface Message {
  id: string
  type: "user" | "ai"
  text: string
}

interface AudioChatProps {
  onTranscript?: (text: string) => void
  onResponse?: (text: string) => void
  className?: string
}

export function AudioChat({ onTranscript, onResponse, className }: AudioChatProps) {
  const [state, setState] = useState<ChatState>("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMode, setInputMode] = useState<InputMode>("voice")
  const [textInput, setTextInput] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textInputRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputMode === "text" && textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [inputMode])

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current && state === "listening") {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      setAudioLevel(average / 255)
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }
  }, [state])

  const processUserInput = (userText: string) => {
    setState("processing")
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: userText
    }
    setMessages(prev => [...prev, userMessage])
    onTranscript?.(userText)

    // Simulated AI response
    setTimeout(() => {
      const mockResponse = "For better energy, focus on complex carbohydrates like oats and quinoa, lean proteins, and iron-rich foods like spinach. Stay hydrated and consider nuts for healthy fats!"
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: mockResponse
      }
      setMessages(prev => [...prev, aiMessage])
      onResponse?.(mockResponse)
      setState("speaking")

      setTimeout(() => {
        setState("idle")
      }, 4000)
    }, 1500)
  }

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (textInput.trim() && state === "idle") {
      processUserInput(textInput.trim())
      setTextInput("")
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const mockTranscript = "What foods are good for improving energy levels?"
        processUserInput(mockTranscript)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setState("listening")
      updateAudioLevel()
    } catch (err) {
      console.error("Microphone access denied:", err)
      setHasPermission(false)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && state === "listening") {
      mediaRecorderRef.current.stop()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setAudioLevel(0)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleInputMode = () => {
    setInputMode(prev => prev === "voice" ? "text" : "voice")
  }

  const handleMainButton = () => {
    if (state === "idle") {
      startListening()
    } else if (state === "listening") {
      stopListening()
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const getStateText = () => {
    switch (state) {
      case "idle":
        return "Start Conversation"
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing..."
      case "speaking":
        return "Speaking..."
    }
  }

  const getStateIcon = () => {
    switch (state) {
      case "idle":
        return <Mic className="h-5 w-5" />
      case "listening":
        return <MicOff className="h-5 w-5" />
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin" />
      case "speaking":
        return <Volume2 className="h-5 w-5" />
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col max-h-full", className)}>
      {/* Accessibility Instructions */}
      <div className="mb-3 px-2">
        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground bg-secondary/50 rounded-xl py-2.5 px-4 border border-border">
          <Keyboard className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>
            {"Can't use voice? Tap the "}
            <span className="inline-flex items-center justify-center w-5 h-5 bg-primary/20 rounded mx-0.5 align-middle">
              <Keyboard className="h-3 w-3 text-primary" />
            </span>
            {" icon to type instead"}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">
              {inputMode === "voice" ? "Voice" : "Text"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Input Mode Toggle */}
            <button
              onClick={toggleInputMode}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "bg-secondary text-primary hover:bg-accent"
              )}
              aria-label={inputMode === "voice" ? "Switch to text input" : "Switch to voice input"}
              title={inputMode === "voice" ? "Switch to text input" : "Switch to voice input"}
            >
              {inputMode === "voice" ? <Keyboard className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </button>
            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isMuted 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-secondary text-primary hover:bg-accent"
              )}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-6 flex flex-col flex-1 min-h-0">
          {/* AI Avatar Section - Fixed */}
          <div className="flex flex-col items-center justify-center mb-4 flex-shrink-0">
            {/* AI Avatar with Name */}
            <div className="relative flex flex-col items-center">
              {/* Outer pulse rings */}
              {(state === "listening" || state === "speaking") && (
                <>
                  <div 
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 transition-all duration-300",
                      state === "listening" ? "animate-ping" : "animate-pulse"
                    )}
                    style={{
                      width: `${80 + audioLevel * 40}px`,
                      height: `${80 + audioLevel * 40}px`,
                      marginTop: "-12px"
                    }}
                  />
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 animate-pulse"
                    style={{
                      width: `${96 + audioLevel * 50}px`,
                      height: `${96 + audioLevel * 50}px`,
                      animationDelay: "150ms",
                      marginTop: "-12px"
                    }}
                  />
                </>
              )}
              
              {/* Avatar Circle */}
              <div 
                className={cn(
                  "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden",
                  state === "idle" && "bg-gradient-to-br from-primary/80 to-primary",
                  state === "listening" && "bg-gradient-to-br from-primary to-accent",
                  state === "processing" && "bg-gradient-to-br from-accent/80 to-primary/80",
                  state === "speaking" && "bg-gradient-to-br from-primary to-accent"
                )}
              >
                {/* AI Face/Icon */}
                {state === "idle" && (
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                    <div className="w-5 h-1.5 rounded-full bg-primary-foreground/80 mt-1" />
                  </div>
                )}
                {state === "listening" && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-primary-foreground rounded-full transition-all duration-75"
                        style={{
                          height: `${12 + Math.sin(Date.now() / 100 + i) * audioLevel * 20}px`,
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                )}
                {state === "speaking" && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-primary-foreground rounded-full animate-pulse"
                        style={{
                          height: `${8 + Math.random() * 16}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                )}
                {state === "processing" && (
                  <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
                )}
              </div>

              {/* AI Name */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-base font-semibold text-card-foreground">Nora</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  state === "idle" && "bg-muted text-muted-foreground",
                  state === "listening" && "bg-primary/20 text-primary",
                  state === "processing" && "bg-accent/30 text-accent-foreground",
                  state === "speaking" && "bg-primary/20 text-primary"
                )}>
                  {state === "idle" ? "Ready" : state === "listening" ? "Listening" : state === "processing" ? "Thinking" : "Speaking"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Your AI Nutrition Assistant</p>
            </div>
          </div>

          {/* Scrollable Messages Area */}
          {messages.length > 0 && (
            <div className="flex-1 min-h-0 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "rounded-2xl p-4",
                    message.type === "user" 
                      ? "bg-secondary/60 ml-4" 
                      : "bg-primary/10 border border-primary/20 mr-4"
                  )}
                >
                  <p className={cn(
                    "text-xs font-semibold mb-2 uppercase tracking-wide",
                    message.type === "user" ? "text-muted-foreground" : "text-primary"
                  )}>
                    {message.type === "user" ? "You" : "Nora"}
                  </p>
                  <p className="text-sm text-card-foreground leading-relaxed">{message.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Section */}
          {inputMode === "text" ? (
            /* Text Input Mode */
            <form onSubmit={handleTextSubmit} className="flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={textInputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={state !== "idle"}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                    state !== "idle" && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Type your message to Nora"
                />
                <button
                  type="submit"
                  disabled={state !== "idle" || !textInput.trim()}
                  className={cn(
                    "p-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300",
                    state === "idle" && textInput.trim()
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  {state === "processing" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Type your nutrition questions and read Nora's responses above
              </p>
            </form>
          ) : (
            /* Voice Input Mode */
            <>
              <button
                onClick={handleMainButton}
                disabled={state === "processing" || state === "speaking"}
                className={cn(
                  "w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 flex-shrink-0",
                  state === "idle" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
                  state === "listening" && "bg-destructive/10 text-destructive border-2 border-destructive hover:bg-destructive/20",
                  (state === "processing" || state === "speaking") && "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {getStateIcon()}
                <span>{getStateText()}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Permission Notice - Only for voice mode */}
      {inputMode === "voice" && hasPermission === false && (
        <p className="mt-3 text-center text-sm text-destructive">
          Microphone access was denied. Please enable it in your browser settings or use text mode.
        </p>
      )}
      
      {inputMode === "voice" && hasPermission === null && state === "idle" && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Please allow microphone access to start your healthy eating journey.
        </p>
      )}

      {/* Accessibility Notice */}
      {inputMode === "text" && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Text mode enabled - type your questions and read responses in the chat.
        </p>
      )}
    </div>
  )
}
