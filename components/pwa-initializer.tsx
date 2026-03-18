"use client"

import { useEffect } from "react"

export default function PWAInitializer() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("Service Worker registration failed:", error)
      })
    }

    // Handle install prompt
    let deferredPrompt: any

    const onBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      deferredPrompt = e
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    }
  }, [])

  return null
}
