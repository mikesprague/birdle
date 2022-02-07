import { manifest, version } from '@parcel/service-worker';

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
  // console.log('service worker installed');
}
addEventListener('install', (e) => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
  // console.log('service worker activated');
}
addEventListener('activate', (e) => e.waitUntil(activate()));
