import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ai Agent Creator',
  description: 'No code ai agent creator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
