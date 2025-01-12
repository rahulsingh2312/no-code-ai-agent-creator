'use client'

import { useState } from 'react'
import { SendIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: 'user' | 'bot'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! How can I assist you today?' }
  ])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: input }])
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'This is a simulated response. Connect to an AI service for real responses.' 
      }])
    }, 1000)

    setInput('')
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="flex flex-col h-screen text-cyan-50">
        {/* Chat Header */}
        <div className="border-b border-cyan-900/50 p-4 bg-black">
          <h1 className="text-2xl font-bold text-center text-cyan-50" style={{
            textShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)'
          }}>
            What AI agent can I build for you?
          </h1>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 space-y-4 bg-black">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-cyan-900/20 border border-cyan-800/50'
                    : 'bg-cyan-950/30 border border-cyan-900/50'
                }`}
                style={{
                  boxShadow: message.role === 'bot' 
                    ? '0 0 10px rgba(6, 182, 212, 0.1)' 
                    : 'none'
                }}
              >
                <p className="text-sm text-cyan-50">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-cyan-900/50 p-4 bg-black">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Create an AI agent..."
                className="flex-1 bg-cyan-950/30 border-cyan-800/50 text-cyan-50 placeholder:text-cyan-500/50"
              />
              <Button 
                type="submit"
                className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-50 border border-cyan-800/50"
                style={{
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
                }}
              >
                Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

