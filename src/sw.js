// サービスワーカー for 制服フォトフレームアプリ
const CACHE_NAME = 'uniform-camera-v1';
const urlsToCache = [
  '/',
  '/App.tsx',
  '/styles/globals.css',
  '/manifest.json'
];

// インストール時のキャッシュ設定
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', event => {
  // カメラアクセスやAPIコールはキャッシュしない
  if (event.request.url.includes('mediaDevices') || 
      event.request.url.includes('getUserMedia') ||
      event.request.url.includes('blob:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあれば返す、なければネットワークから取得
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// アクティベーション時の古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// バックグラウンド同期（オフライン対応）
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('バックグラウンド同期を実行');
  }
});

// プッシュ通知対応（将来の拡張用）
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    };
    
    event.waitUntil(
      self.registration.showNotification('制服フォトフレームアプリ', options)
    );
  }
});