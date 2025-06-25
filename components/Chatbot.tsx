import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CARAMEL_AVATAR_URL } from '../constants';
import { Button } from './common/Button';
import { ChatMessage } from '../types'; // Using the defined ChatMessage type

interface ChatbotProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ chatHistory, onSendMessage, onClose, isLoading }) => {
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (userInput.trim()) {
      onSendMessage(userInput.trim());
      setUserInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      // setIsListening(false); // onend will handle this
      return;
    }
    
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript); 
      setIsListening(false); // Stop listening after a result for non-continuous
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      alert(`Speech recognition error: ${event.error}${event.message ? ` - ${event.message}` : ''}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false); // Ensure listening state is reset
    };

    recognitionRef.current.start();
  }, [isListening]);


  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 md:mb-6 md:mr-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-gray-800 shadow-2xl rounded-lg flex flex-col z-50 transform transition-all duration-300 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-secondary text-primary rounded-t-lg">
        <div className="flex items-center space-x-2">
          <img src={CARAMEL_AVATAR_URL} alt="Caramel AI Avatar" className="w-10 h-10 rounded-full border-2 border-primary" />
          <h3 className="text-lg font-semibold">Caramel AI Assistant</h3>
        </div>
        <button onClick={onClose} className="text-primary hover:text-yellow-300" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat Body */}
      <div ref={chatBodyRef} className="flex-grow p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-700">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-xl shadow ${
                msg.sender === 'user' 
                ? 'bg-primary text-secondary' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 rounded-xl shadow bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                 <span className="text-sm">Caramel is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Caramel AI..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isLoading}
          />
          <Button onClick={toggleVoiceInput} variant="icon" aria-label={isListening ? "Stop listening" : "Start voice input"} disabled={isLoading} className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-teal-700'} text-white`}>
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v.75a4.5 4.5 0 009 0v-.75a.75.75 0 011.5 0v.75a6 6 0 11-12 0v-.75A.75.75 0 016 10.5zM12 18.75a.75.75 0 00.75-.75V15.75a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 00.75-.75V6.75A.75.75 0 0012 6a.75.75 0 00-.75.75v11.25c0 .414.336.75.75.75zM8.25 15V9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 17.25h3M12 17.25a2.25 2.25 0 01-2.25-2.25V9A2.25 2.25 0 0112 6.75h0A2.25 2.25 0 0114.25 9v6.25A2.25 2.25 0 0112 17.25z" />
              </svg>
            )}
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-primary hover:bg-yellow-500 text-secondary">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
