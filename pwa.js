const staticCalcSite = "calc-site-v1"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/assets/chevron-down.svg",
  "/assets/plus.svg",
  "/assets/house.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCalcSite).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
