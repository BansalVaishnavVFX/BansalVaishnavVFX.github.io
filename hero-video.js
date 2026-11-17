/* Tales & Dragons: decorative homepage video, separate from project players. */
(() => {
  const host = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-video-toggle');
  if (!host || !toggle) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  function stop() {
    if (frame) frame.remove();
    frame = null;
    toggle.textContent = 'Play background video';
    toggle.setAttribute('aria-pressed', 'false');
  }
  function play() {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.src = 'https://player.vimeo.com/video/1247517909?transparent=0&autoplay=1&loop=1&muted=1&controls=0&playsinline=1&autopause=0&title=0&byline=0&portrait=0&dnt=1';
    frame.title = 'Tales & Dragons background video';
    frame.allow = 'autoplay; fullscreen';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    host.append(frame);
    toggle.textContent = 'Stop background video';
    toggle.setAttribute('aria-pressed', 'true');
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => frame ? stop() : play());
  reducedMotion.addEventListener('change', event => { if (event.matches) stop(); });
  if (!reducedMotion.matches && !navigator.connection?.saveData) play();
  else stop();
})();

