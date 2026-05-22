"use client"

import { useLanguage } from "@/components/language-provider"

const options = [
  { language: "pt" as const, label: "Portugues", flag: "br" as const },
  { language: "en" as const, label: "English", flag: "us" as const },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed right-4 top-[4.5rem] z-[55] flex items-center gap-1 rounded-full border border-white/10 bg-black/54 p-1 shadow-xl shadow-black/30 backdrop-blur-md md:right-6 md:top-6">
      {options.map((option) => {
        const isActive = language === option.language

        return (
          <button
            key={option.language}
            type="button"
            onClick={() => setLanguage(option.language)}
            className={`rounded-full px-2 py-1 transition ${
              isActive
                ? "bg-white text-[#0a0a2d] shadow-[0_0_16px_rgba(108,246,255,0.24)]"
                : "text-white/58 hover:bg-white/[0.08] hover:text-white"
            }`}
            aria-label={`Alterar idioma para ${option.label}`}
            title={option.label}
          >
            <FlagIcon country={option.flag} />
          </button>
        )
      })}
    </div>
  )
}

function FlagIcon({ country }: { country: "br" | "us" }) {
  if (country === "br") {
    return (
      <span className="relative block h-3.5 w-5 overflow-hidden rounded-[2px] bg-[#229e45] shadow-[0_0_0_1px_rgba(255,255,255,0.28)]">
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#f8df00]" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4fa3]" />
      </span>
    )
  }

  return (
    <span className="relative block h-3.5 w-5 overflow-hidden rounded-[2px] bg-[repeating-linear-gradient(to_bottom,#b22234_0_1.08px,#fff_1.08px_2.16px)] shadow-[0_0_0_1px_rgba(255,255,255,0.28)]">
      <span className="absolute left-0 top-0 h-[53%] w-[46%] bg-[#3c3b6e]" />
    </span>
  )
}
