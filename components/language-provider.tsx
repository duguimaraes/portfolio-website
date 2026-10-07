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
    role: "Analista de Dados e Sistemas",
    workingFor: "Working for Agro Locks",
    intro:
      "Atuo com Business Intelligence, análise de dados e sistemas corporativos, desde a construção de consultas e consolidação de dados em diferentes bancos (SQL Server, PostgreSQL, SAP HANA e Firebird) até o desenvolvimento de dashboards completos em Power BI com SQL, DAX e Power Query. Também atuo na análise e sustentação de sistemas, acompanhando integrações, investigando falhas, validando dados e apoiando a resolução de problemas junto a usuários e fornecedores. Meu trabalho conecta dados, sistemas e processos das áreas de operações, finanças, logística e tecnologia da informação, transformando informações em soluções que aumentam a confiabilidade dos dados, a eficiência operacional e a qualidade das decisões.",
    viewProjects: "Ver projetos",
    copyEmail: "Copiar e-mail",
    emailCopied: "E-mail copiado",
    openResume: "Abrir currículo",
    galleryKicker: "Trabalhos Selecionados",
    galleryTitle: "Dashboards & Dados",
    gallerySubtitle: "Projetos que conectam dashboards e consultas em cada análise.",
  },
  en: {
    role: "Data & Systems Analyst",
    workingFor: "Working for Agro Locks",
    intro:
      "I work with Business Intelligence, data analysis, and enterprise systems, handling everything from building queries and consolidating data across various databases (SQL Server, PostgreSQL, SAP HANA, and Firebird) to developing comprehensive Power BI dashboards using SQL, DAX, and Power Query. I also work with systems analysis and support, overseeing integrations, investigating issues, validating data, and coordinating issue resolution with users and vendors. My work connects data, systems, and processes across operations, finance, logistics, and IT, transforming information into solutions that improve data reliability, operational efficiency, and decision-making.",
    viewProjects: "View projects",
    copyEmail: "Copy e-mail",
    emailCopied: "E-mail copied",
    openResume: "Open curriculum",
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
