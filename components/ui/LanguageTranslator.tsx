"use client"

import React, { useState, useEffect } from "react"
// 1. Import the Next.js translation engine
import GoogleTranslate from "next-google-translate-widget"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // Adjust this import based on your project structure
import FormSelect from "./FormSelect"

const supportedLanguages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish (Español)" },
  { value: "fr", label: "French (Français)" },
  { value: "de", label: "German (Deutsch)" },
  { value: "zh-CN", label: "Chinese (简体中文)" },
  { value: "hi", label: "Hindi (हिन्दी)" },
]

export function LanguageTranslator() {
  const [currentLang, setCurrentLang] = useState("en")

  // Read existing google cookie on component mount to keep state synced
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }

    const googTrans = getCookie("googtrans")
    if (googTrans) {
      const lang = googTrans.split("/").pop()
      if (lang) setCurrentLang(lang)
    }
  }, [])

  const handleLanguageChange = (langCode: string | null) => {
    if (!langCode) return
    setCurrentLang(langCode)

    // The library expects cookie configuration like: /auto/langCode
    const cookieValue = `/auto/${langCode}`

    // Write cookies for paths and domain scopes
    document.cookie = `googtrans=${cookieValue}; path=/;`
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`

    // Hard reload triggers the library script to cleanly translate the site DOM
    window.location.reload()
  }

  return (
    <div className="w-[200px]">
      {/* 2. Hidden background script instance handled by the library */}
      <div style={{ display: "none" }}>
        <GoogleTranslate pageLanguage="en" />
      </div>

      <FormSelect
        id="language-translator"
        value={currentLang}
        onValueChange={handleLanguageChange}
        options={supportedLanguages}
      />
    </div>
  )
}
