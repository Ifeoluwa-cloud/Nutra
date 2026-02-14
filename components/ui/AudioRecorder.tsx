import { useEffect, useRef, useState } from 'react';
import { Mic, Square, RotateCcw, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const { isRecording, audioBlob, duration, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const { sendAudioMessage, isLoading } = useChat();
  const recognitionRef = useRef<any | null>(null)
  const sentRef = useRef(false)
  const [finalTranscript, setFinalTranscript] = useState('')

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    sentRef.current = false
    setFinalTranscript('')
    await startRecording();

    // Start browser SpeechRecognition in parallel for live transcription
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = true
        recognition.maxAlternatives = 1

        let interim = ''

        recognition.onresult = (event: any) => {
          let interimLocal = ''
          let finalLocal = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i]
            if (res.isFinal) {
              finalLocal += res[0].transcript
            } else {
              interimLocal += res[0].transcript
            }
          }
          interim = interimLocal
          if (finalLocal) {
            setFinalTranscript((prev) => (prev ? prev + ' ' + finalLocal : finalLocal))
          }
        }

        recognition.onend = () => {
          recognitionRef.current = null
          // send when recognition ends
          if (!sentRef.current) {
            const textToSend = (finalTranscript && finalTranscript.trim()) ? finalTranscript : ''
            if (textToSend) {
              sendAudioMessage(textToSend)
              sentRef.current = true
            }
          }
        }

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error', e)
        }

        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (e) {
      console.warn('Speech recognition start failed', e)
    }
  };

  const handleStopRecording = async () => {
    stopRecording();
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSendRecording = async () => {
    if (audioBlob) {
      if (onRecordingComplete) {
        onRecordingComplete(audioBlob);
      } else {
        // If speech recognition produced a transcript, send that, otherwise send a generic placeholder
        const textToSend = finalTranscript && finalTranscript.trim() ? finalTranscript : '(Audio message sent)'
        await sendAudioMessage(textToSend)
        sentRef.current = true
      }
      resetRecording()
    }
  };

  const handleCancel = () => {
    resetRecording();
  };

  // Auto-send when recording stops and blob is available
  useEffect(() => {
    if (audioBlob && !isRecording && !onRecordingComplete && !sentRef.current) {
      const timer = setTimeout(() => {
        handleSendRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [audioBlob, isRecording]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Processing audio...</span>
      </div>
    );
  }

  if (audioBlob) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <div className="audio-wave">
            <div className="audio-wave-bar h-3" />
            <div className="audio-wave-bar h-5" />
            <div className="audio-wave-bar h-4" />
            <div className="audio-wave-bar h-6" />
            <div className="audio-wave-bar h-3" />
          </div>
          <span className="text-sm font-medium">Recording ready</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
          onClick={handleCancel}
          aria-label="Cancel recording"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full">
          <div className="relative">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-destructive rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-sm font-medium text-destructive">
            {formatDuration(duration)}
          </span>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleStopRecording}
          aria-label="Stop recording"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
      onClick={handleStartRecording}
      aria-label="Start voice recording"
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
}
