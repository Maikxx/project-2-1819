const CACHE_NAME = 'project-2-core-cache'
const CORE_ASSETS = [
    '/scripts/index.js',
    '/scripts/polyfill.js',
    '/css/index.css',
    '/offline',
    '/assets/fonts/BrandoSans-SemiBold.woff2',
    '/assets/fonts/BrandoSans-Light.woff2',
    '/favicon.ico'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(CORE_ASSETS))
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate'
        || (event.request.method === 'GET'
            && event.request.headers.get('accept').includes('text/html')
        )
    ) {
        event.respondWith(fetch(event.request.url)
            .then(async response => {
                const cache = await caches.open('html-cache')
                await cache.put(event.request.url, response.clone())
                return response
            })
            .catch(async () => {
                await caches.open('html-cache')
                const response = await caches.match(event.request.url)

                if (response) {
                    return response
                } else {
                    const cache = await caches.open(CACHE_NAME)
                    const cacheResponse = await cache.match('/offline')
                    return cacheResponse
                }
            })
        )
    } else {
        event.respondWith(
            caches
            .match(event.request)
            .then(response => response
                ? response
                : fetch(event.request)
            )
        )
    }
})