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
      className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-white/16 px-2.5 py-2.5 text-[0.62rem] font-bold text-white/78 transition hover:border-white/34 hover:text-white sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
      aria-label="Copiar e-mail"
    >
      <Mail className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      {copied ? "E-mail copiado" : "Copiar e-mail"}
    </button>
  )
}
