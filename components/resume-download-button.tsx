"use client"

import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"

const resumes = [
  { label: "PT-BR", file: "/EduardoPTCV.docx" },
  { label: "ENGLISH", file: "/EduardoENCV.docx" },
]

export function ResumeDownloadButton() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/16 bg-white/[0.05] px-3.5 py-2.5 text-sm font-bold text-white/78 transition hover:border-white/34 hover:bg-white/10 hover:text-white"
      >
        <Download className="h-4 w-4" />
        Baixar
      </button>
      {isOpen && (
        <div
          role="menu"
          aria-label="Idioma do currículo"
          className="absolute right-0 top-full z-50 mt-2 w-[230px] rounded-lg border border-[#6cf6ff]/36 bg-[#090d26] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
        >
          <p className="mb-2 text-xs font-semibold text-white/70">Escolha o idioma</p>
          <div className="grid grid-cols-2 gap-2">
            {resumes.map(({ label, file }) => (
              <a
                key={file}
                role="menuitem"
                href={file}
                download
                onClick={() => setIsOpen(false)}
                className="flex min-h-10 items-center justify-center rounded-md border border-[#6cf6ff]/35 bg-[#6cf6ff]/[0.08] px-2 text-xs font-bold text-white transition hover:border-[#6cf6ff]/75 hover:bg-[#6cf6ff]/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6cf6ff]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
