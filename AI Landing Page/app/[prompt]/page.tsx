'use client'

import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, Key, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from 'next/navigation';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [open, setOpen] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const globalprompt = decodeURIComponent(params.prompt as string);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedKey = localStorage.getItem('pvt_key');
    if (savedKey) {
      setApiKey(savedKey);
      setHasStoredKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('pvt_key', apiKey);
      setHasStoredKey(true);
      setOpen(false); // Close the dialog after saving
    }
  };

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
        const key =  "AIzaSyD7Jqa2sVJ5uKg-wHc6FEh10d8Y8RGd9Kk";
        const genAI = new GoogleGenerativeAI(key);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-[#000000]">
      <div className="flex flex-col h-screen text-cyan-50">
        {/* Chat Header */}
        <div className="border-b border-cyan-900/50 p-4 bg-black">
          <div className="flex justify-between items-center">
            <div 
              className="md:text-2xl text-sm flex justify-center items-center space-x-4 md:space-x-8 font-bold text-center text-cyan-50"
              style={{
                textShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              <img src='/bm.png' className="w-10 md:w-16" alt="Bot Logo" />
              <span className="mx-4">{globalprompt?.toUpperCase()} AI Agent</span>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${
                    hasStoredKey 
                      ? 'bg-green-900/20 hover:bg-green-800/30 border-green-800/50' 
                      : 'bg-cyan-900/20 hover:bg-cyan-800/30 border-cyan-800/50'
                  } text-cyan-50`}
                >
                  {hasStoredKey ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Solana Key Added
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Add Solana Key
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border border-cyan-800/50">
                <DialogHeader>
                  <DialogTitle className="text-cyan-50">Enter Solana Private Key</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Solana wallet private key"
                    className="bg-cyan-950/30 border-cyan-800/50 text-cyan-50"
                    type="password"
                  />
                  <Button 
                    onClick={handleSaveApiKey}
                    className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-50 border border-cyan-800/50"
                  >
                    Save Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 space-y-6 bg-black">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <img 
                src={`https://image.pollinations.ai/prompt/${globalprompt}`}                  className="w-8 h-8 rounded-full object-cover"
                  alt="Bot Avatar"
                />
              )}
              <div
                className={`max-w-[80%] mt-3 p-4 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-cyan-900/20 border border-cyan-800/50'
                    : 'bg-cyan-950/30 border border-cyan-900/50'
                }`}
                style={{
                  boxShadow: message.sender === 'bot'
                    ? '0 0 10px rgba(6, 182, 212, 0.1)'
                    : 'none'
                }}
              >
                <p className="text-sm text-cyan-50">{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <img 
                  src="https://avatarfiles.alphacoders.com/340/thumb-1920-340439.png"
                  className="w-8 h-8 rounded-full object-cover"
                  alt="User Avatar"
                />
              )}
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-cyan-900/50 p-4 bg-black">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Get help from ${globalprompt} Agent`}
                className="flex-1 bg-cyan-950/30 border-cyan-800/50 text-cyan-50 placeholder:text-cyan-500/50"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-50 border border-cyan-800/50"
                style={{
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
                }}
              >
                {isLoading ? 'Sending...' : 'SENDIT'}
                <SendIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;