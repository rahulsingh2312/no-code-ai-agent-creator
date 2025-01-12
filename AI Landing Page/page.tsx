'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bot, Layout, FileText, BarChart3, Terminal } from 'lucide-react'
import { link } from 'fs'
import { useRouter } from 'next/navigation'

export default function AICrypticLanding() {
  const router = useRouter()

  const [glitchText, setGlitchText] = useState("What ai agent you want to build?")
  const [inputText, setInputText] = useState("")
  const handleNavigate = () => {
    if (inputText.trim()) {
      router.push(`/${inputText.trim()}`)
    }
  }

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const characters = "!@#$%^&*<>[]{}|;:,./?`~"
      const randomChar = characters[Math.floor(Math.random() * characters.length)]
      const position = Math.floor(Math.random() * glitchText.length)
      const newText = glitchText.substring(0, position) + randomChar + glitchText.substring(position + 1)
      setGlitchText(newText)
      
      // Reset after brief delay
      setTimeout(() => {
        setGlitchText("What ai agent can i build for you?")
      }, 100)
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [glitchText])

  return (
    <div className="min-h-screen pt-32 bg-black text-white p-8">
      {/* Matrix-like rain effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 overflow-hidden matrix-rain" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Hero section with glitch effect */}
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-mono tracking-tight glitch-text relative">
            {glitchText}
            <span className="absolute inset-0 glow-effect" aria-hidden="true">
              {glitchText}
            </span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
          <Input
              type="text"
              placeholder="Create an ai agent..."
              className="w-full bg-black/50 border-cyan-500/50 text-cyan-300 placeholder:text-cyan-700 h-14 pr-32 font-mono"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate()
                }
              }}
            />
            <Button
              className="absolute right-2 top-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/50"
              onClick={handleNavigate}
            >
              Project
            </Button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-4 justify-center text-sm font-mono">
          {[" An Anime girl ", "Ryan gosling ", "Jeffrey dahmer " , "Donald trump" , "Elon musk"].map((action) => (
            <a href={`/${action}`} target='_blank'>
            <Button
              key={action}
              variant="ghost" 
              className="border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 hover:text-black"
            >
              {action} →
            </Button>
            </a>
          ))}
        </div>

        {/* Template sections */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-mono text-cyan-300">Popular Agents</h2>
            {/* <Button variant="ghost" className="text-cyan-500 hover:text-cyan-300">
              Request Template
            </Button> */}
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "data:image/jpeg;base64,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", title: "Goat", desc: "quite literally a goat " , link : "/goat an literal goat animal" },
              { icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlz-0gZGjxoAp2wa6pbtGIR_9nsVwQZMHbOQ&s", title: "Taylor swift ", desc: "A singer." , link:"/taylor swift " },
              { icon: "https://coin-images.coingecko.com/coins/images/53443/large/ai160kg.png?1736482326", title: "LLM ", desc: "A fat girl ai agent" , link: "/a fat girl llm" }
            ].map((template) => (
            <a key={template.title} href={template.link} target='_blank' >
            <Card key={template.title}  className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 p-6 group">
                <img src={template.icon} className="w-8 h-8 rounded-full text-cyan-500 mb-4" />
                <h3 className="font-mono text-lg text-cyan-300 mb-2">{template.title}</h3>
                <p className="text-cyan-600 text-sm">{template.desc}</p>
                <div className="h-0.5 w-0 group-hover:w-full bg-cyan-500/30 transition-all duration-500 mt-4" />
              </Card>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .matrix-rain {
          background: linear-gradient(180deg, 
            transparent 0%,
            rgba(0, 255, 255, 0.03) 50%,
            transparent 100%
          );
          animation: rain 20s linear infinite;
          background-size: 100% 1000%;
        }

        @keyframes rain {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 1000%; }
        }

        .glitch-text {
          text-shadow: 
            0 0 10px rgba(0, 255, 255, 0.5),
            0 0 20px rgba(0, 255, 255, 0.3),
            0 0 30px rgba(0, 255, 255, 0.1);
        }

        .glow-effect {
          filter: blur(4px);
          opacity: 0.5;
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  )
}

