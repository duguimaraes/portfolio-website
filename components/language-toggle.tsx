"use client"

import { useLanguage } from "@/components/language-provider"

const options = [
  { language: "pt" as const, label: "Portugues", flag: "br" as const },
  { language: "en" as const, label: "English", flag: "us" as const },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[26px] z-[60] md:left-auto md:right-6 md:top-6 md:flex md:w-auto md:items-center md:gap-1 md:rounded-full md:border md:border-white/10 md:bg-black/54 md:p-1 md:shadow-xl md:shadow-black/30 md:backdrop-blur-md">
      {options.map((option) => {
        const isActive = language === option.language

        return (
          <button
            key={option.language}
            type="button"
            onClick={() => setLanguage(option.language)}
            className={`pointer-events-auto absolute flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/44 shadow-2xl shadow-black/40 backdrop-blur transition md:static md:h-auto md:w-auto md:border-0 md:bg-transparent md:px-2 md:py-1 md:shadow-none ${
              isActive
                ? "bg-white text-[#0a0a2d] shadow-[0_0_16px_rgba(108,246,255,0.24)]"
                : "text-white/58 hover:bg-white/[0.08] hover:text-white"
            } ${option.language === "pt" ? "left-[calc(50%-178px)]" : "right-[calc(50%-178px)]"}`}
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
      <span className="relative block h-3 w-5 overflow-hidden rounded-[2px] bg-[#229e45] shadow-[0_0_0_1px_rgba(255,255,255,0.28)] md:h-3.5">
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#f8df00]" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4fa3]" />
      </span>
    )
  }

  return (
    <span className="relative block h-3 w-5 overflow-hidden rounded-[2px] bg-[repeating-linear-gradient(to_bottom,#b22234_0_1.08px,#fff_1.08px_2.16px)] shadow-[0_0_0_1px_rgba(255,255,255,0.28)] md:h-3.5">
      <span className="absolute left-0 top-0 h-[53%] w-[46%] bg-[#3c3b6e]" />
    </span>
  )
}
