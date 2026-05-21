"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

const email = "eduardoldrds@gmail.com"

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-white/16 px-5 py-3 text-sm font-bold text-white/78 transition hover:border-white/34 hover:text-white"
      aria-label="Copiar e-mail"
    >
      <Mail className="h-4 w-4" />
      {copied ? "E-mail copiado" : "Copiar e-mail"}
    </button>
  )
}
