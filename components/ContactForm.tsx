'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    setMessage(result.message)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        name="name"
        placeholder="Your Name"
        className="px-4 py-3 bg-background border border-border rounded-lg w-full"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="px-4 py-3 bg-background border border-border rounded-lg w-full"
        required
      />
      <input
        name="subject"
        placeholder="Subject"
        className="px-4 py-3 bg-background border border-border rounded-lg w-full"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        rows={5}
        className="px-4 py-3 bg-background border border-border rounded-lg w-full resize-none"
        required
      />
      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
      {message && <p className="text-sm mt-2 text-foreground">{message}</p>}
    </form>
  )
}
