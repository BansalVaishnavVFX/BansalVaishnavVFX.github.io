/* Ask Vimeo for its highest actual rendition; retain playback if unsupported. */
(() => {
  let sdkPromise;
  function loadSdk() {
    if (window.Vimeo?.Player) return Promise.resolve(window.Vimeo);
    if (!sdkPromise) {
      sdkPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => window.Vimeo?.Player ? resolve(window.Vimeo) : reject(new Error('Vimeo SDK unavailable'));
        script.onerror = () => reject(new Error('Vimeo SDK could not load'));
        document.head.append(script);
      });
    }
    return sdkPromise;
  }
  window.preferHighestVimeoQuality = async frame => {
    try {
      const Vimeo = await loadSdk();
      if (!frame.isConnected) return;
      const player = new Vimeo.Player(frame);
      await player.ready();
      const qualities = await player.getQualities();
      if (!frame.isConnected) return;
      const rank = id => {
        const match = /^(\d+)(p|k)$/i.exec(id);
        return match ? Number(match[1]) * (match[2].toLowerCase() === 'k' ? 540 : 1) : 0;
      };
      const best = qualities.filter(quality => rank(quality.id) > 0)
        .sort((a, b) => rank(b.id) - rank(a.id))[0];
      if (best) {
        const selected = await player.setQuality(best.id);
        frame.dataset.selectedQuality = selected;
      }
    } catch {
      // Plans/devices may disallow quality selection; do not block the video.
      if (frame.isConnected) frame.dataset.selectedQuality = 'auto';
    }
  };
})();
