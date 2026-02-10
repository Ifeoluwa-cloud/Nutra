import { Volume2, Square, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { isPlaying, speak, stop } = useTextToSpeech();
  
  const isAI = message.role === 'assistant';
  
  const handleSpeak = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(message.content);
    }
  };

  return (
    <div
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[85%] md:max-w-[75%]`}>
        <div
          className={`relative group px-4 py-3 rounded-2xl ${
            isAI
              ? 'bg-secondary text-foreground rounded-tl-sm'
              : 'bg-primary text-primary-foreground rounded-tr-sm'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
          
          {isAI && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                isPlaying ? 'opacity-100 bg-primary/10' : ''
              }`}
              onClick={handleSpeak}
              aria-label={isPlaying ? 'Stop speaking' : 'Listen to message'}
            >
              {isPlaying ? (
                <Square className="h-3 w-3 text-primary" />
              ) : (
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.isAudio && ' · Voice message'}
        </span>
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
