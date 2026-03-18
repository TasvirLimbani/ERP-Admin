// Service Worker for offline support and caching

const CACHE_NAME = "yarn-factory-v1"
const ASSETS_TO_CACHE = [
  "/",
  "/login",
  "/admin",
  "/manifest.json",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Ignore errors for assets that don't exist yet
        return Promise.resolve()
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Don't cache API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline" }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        )
      })
    )
    return
  }

  // Cache-first strategy for other requests
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone())
            return fetchResponse
          })
        })
      )
    })
  )
})
