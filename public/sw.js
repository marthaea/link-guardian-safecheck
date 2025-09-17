
const CACHE_NAME = 'link-guardian-v8';
const STATIC_CACHE_NAME = 'link-guardian-static-v8';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Resources to cache as they're requested
const RUNTIME_CACHE_URLS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif)$/
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Supabase API calls and other external APIs
  if (url.hostname.includes('supabase') || 
      url.hostname.includes('ipqualityscore') ||
      url.pathname.includes('/functions/')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Check if this should be cached at runtime
        const shouldCache = RUNTIME_CACHE_URLS.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(request.url);
          }
          return request.url.includes(pattern);
        });
        
        if (shouldCache) {
          return fetch(request)
            .then((response) => {
              // Don't cache if not a successful response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('Caching runtime resource:', request.url);
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch((error) => {
              console.error('Fetch failed for:', request.url, error);
              // Return a custom offline page or fallback
              if (request.destination === 'document') {
                return caches.match('/');
              }
            });
        }
        
        // For other requests, just fetch normally
        return fetch(request).catch((error) => {
          console.error('Fetch failed:', error);
          if (request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Handle background sync for offline link checks (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-link-check') {
    console.log('Background sync triggered for link checking');
    // Future: implement offline link checking queue
  }
});

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('Push notification received:', data);
    
    const options = {
      body: data.body || 'Link Guardian notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'link-guardian-notification',
      renotify: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Link Guardian', options)
    );
  }
});
