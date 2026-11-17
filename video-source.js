(function (root) {
  'use strict';
  function videoSource(value) {
    if (!value) return null;
    let url;
    try { url = new URL(value); } catch { return null; }
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.replace(/^www\./, '');
    const parts = url.pathname.split('/').filter(Boolean);
    let id;
    if (host === 'youtu.be') id = parts[0];
    if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') :
        ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null;
    }
    if (id && /^[\w-]{11}$/.test(id)) return { provider: 'YouTube', src: 'https://www.youtube-nocookie.com/embed/' + id, original: url.href };
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const index = parts[0] === 'video' ? 1 : 0;
      id = parts[index];
      if (!/^\d+$/.test(id || '')) return null;
      const hash = url.searchParams.get('h') || parts[index + 1];
      const embed = new URL('https://player.vimeo.com/video/' + id);
      if (hash && /^[a-zA-Z0-9]+$/.test(hash)) embed.searchParams.set('h', hash);
      return { provider: 'Vimeo', src: embed.href, original: url.href };
    }
    return null;
  }
  root.videoSource = videoSource;
  if (typeof module !== 'undefined') module.exports = videoSource;
})(typeof window !== 'undefined' ? window : globalThis);
