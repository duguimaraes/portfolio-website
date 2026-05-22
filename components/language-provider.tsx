"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

type Language = "pt" | "en"

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: {
    role: string
    workingFor: string
    intro: string
    viewProjects: string
    copyEmail: string
    emailCopied: string
    openResume: string
    galleryKicker: string
    galleryTitle: string
    gallerySubtitle: string
  }
}

const translations = {
  pt: {
    role: "Analista de Dados e BI",
    workingFor: "Working for Agro Locks",
    intro:
      "Atuo com Business Intelligence e análise de dados, desde a construção das consultas e consolidação dos dados em diferentes bancos (SQL Server, PostgreSQL, SAP HANA e Firebird) até o desenvolvimento de dashboards completos em Power BI com SQL, DAX e Power Query. Meu trabalho conecta operações, finanças, logística e tecnologia da informação por meio de indicadores que ajudam equipes a acompanhar desempenho, identificar desvios e tomar decisões com mais segurança.",
    viewProjects: "Ver projetos",
    copyEmail: "Copiar e-mail",
    emailCopied: "E-mail copiado",
    openResume: "Abrir currículo",
    galleryKicker: "Trabalhos Selecionados",
    galleryTitle: "Dashboards & Dados",
    gallerySubtitle: "Projetos que conectam dashboards e consultas em cada análise.",
  },
  en: {
    role: "Data & BI Analyst",
    workingFor: "Working for Agro Locks",
    intro:
      "I work with Business Intelligence and data analysis, from building queries and consolidating data across different databases (SQL Server, PostgreSQL, SAP HANA, and Firebird) to developing complete Power BI dashboards with SQL, DAX, and Power Query. My work connects operations, finance, logistics, and information technology through indicators that help teams monitor performance, identify deviations, and make safer decisions.",
    viewProjects: "View projects",
    copyEmail: "Copy e-mail",
    emailCopied: "E-mail copied",
    openResume: "Open resume",
    galleryKicker: "Selected Work",
    galleryTitle: "Dashboards & Data",
    gallerySubtitle: "Projects connecting dashboards and queries in each analysis.",
  },
} satisfies Record<Language, LanguageContextValue["t"]>

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("portfolio-language")

    if (savedLanguage === "pt" || savedLanguage === "en") {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem("portfolio-language", nextLanguage)
    document.documentElement.lang = nextLanguage === "pt" ? "pt-BR" : "en-US"
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  )

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en-US"
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
