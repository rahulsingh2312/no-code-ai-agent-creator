'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Paperclip, Mic, Copy, RefreshCw, Volume2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useParams } from 'next/navigation';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const ChatInterface = () => {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // Initialize chat with the prompt from URL
  useEffect(() => {
    const initializeChat = async () => {
      if (!params.prompt) return;
      
      const prompt = decodeURIComponent(params.prompt as string);
      setMessages([{
        id: 1,
        text: `Hello! I'm your ${prompt} AI assistant. How can I help you today?`,
        sender: 'bot'
      }]);

      try {
        // Initialize Gemini chat session
        const genAI = new GoogleGenerativeAI("AIzaSyD7Jqa2sVJ5uKg-wHc6FEh10d8Y8RGd9Kk");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        chatSessionRef.current = await model.startChat({
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          },
          history: [
            {
              role: "user",
              parts: [{ text: `imagine you are ${prompt} and respond to all messages in that character` }]
            }
          ]
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [params.prompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !chatSessionRef.current) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage(inputMessage);
      const response = await result.response;
      const botResponse: Message = {
        id: messages.length + 2,
        text: response.text(),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[600px] p-4">
      <Card className="h-full flex flex-col bg-slate-900 border-slate-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className={`w-8 h-8 ${
                message.sender === 'bot'
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-slate-700'
              }`}>
                {message.sender === 'bot' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-slate-500" />
                )}
              </Avatar>
              
              <div className={`group flex flex-col max-w-[80%] ${
                message.sender === 'user' ? 'items-end' : ''
              }`}>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-slate-800 text-slate-100'
                }`}>
                  {message.text}
                </div>
                
                {message.sender === 'bot' && (
                  <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Type a message"
              className="flex-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              className="bg-blue-700 hover:bg-blue-600 text-white"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;