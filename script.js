'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const projects = window.portfolio.projects;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function projectHref(project) { return 'video.html?id=' + encodeURIComponent(project.id); }
function safeImage(value) {
  if (!value) return null;
  try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
const grid = document.getElementById('project-grid');
if (grid) {
  const filters = document.getElementById('filters');
  if (projects.some(project => videoSource(project.videoUrl))) document.querySelector('.collection-note').hidden = true;
  function render(category) {
    grid.replaceChildren();
    const shown = projects.filter(project => category === 'All' || project.category === category);
    shown.forEach(project => {
      const card = element('a', 'project-card'); card.href = projectHref(project);
      const visual = element('div', 'project-visual art-' + (projects.indexOf(project) % 6));
      const thumbnail = safeImage(project.thumbnail);
      if (thumbnail) {
        const img = element('img'); img.src = thumbnail; img.alt = ''; img.loading = 'lazy';
        img.addEventListener('error', () => img.remove()); visual.append(img);
      }
      visual.append(element('span', 'project-number', String(projects.indexOf(project) + 1).padStart(2, '0')));
      visual.append(element('span', 'project-state', videoSource(project.videoUrl) ? '▶ WATCH PROJECT' : 'COMING SOON'));
      const details = element('div', 'card-details');
      const copy = element('div'); copy.append(element('p', 'eyebrow', project.category), element('h3', '', project.title));
      details.append(copy, element('span', 'card-arrow', '↗')); card.append(visual, details); grid.append(card);
    });
    document.getElementById('result-count').textContent = shown.length + ' projects shown';
    for (const button of filters.children) button.setAttribute('aria-pressed', String(button.textContent === category));
  }
  ['All', ...new Set(projects.map(project => project.category))].forEach(category => {
    const button = element('button', 'filter', category); button.type = 'button';
    button.addEventListener('click', () => render(category)); filters.append(button);
  });
  render('All');
  const contact = document.getElementById('contact-links');
  if (window.portfolio.email) {
    const link = element('a', 'button', 'Say hello ↗'); link.href = 'mailto:' + window.portfolio.email; contact.append(link);
  } else contact.append(element('p', 'muted', 'Contact details coming soon.'));
}
const player = document.getElementById('video-player');
if (player) {
  const id = new URLSearchParams(location.search).get('id');
  const project = projects.find(item => item.id === id);
  if (!project) {
    document.getElementById('project-title').textContent = 'Project not found';
    player.append(element('p', '', 'This project is unavailable. Explore the collection to find another project.'));
    document.getElementById('project-description').textContent = 'Use All work to return to the portfolio.';
  } else {
    document.title = project.title + ' — Bansal';
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-category').textContent = project.category;
    document.getElementById('project-description').textContent = project.description;
    (project.tools || []).forEach(tool => document.getElementById('project-tools').append(element('span', 'tag', tool)));
    const source = videoSource(project.videoUrl);
    if (source) {
      const frame = element('iframe'); frame.src = source.src; frame.title = project.title + ' — ' + source.provider + ' video';
      frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin'; player.append(frame);
      const link = element('a', 'text-link', 'Watch on ' + source.provider + ' ↗');
      link.href = source.original; link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.getElementById('video-link').append(link, element('p', 'muted', 'Player unavailable? Open the video directly.'));
    } else {
      const empty = element('div', 'player-empty');
      empty.append(element('span', 'empty-symbol', '◌'), element('h2', '', project.videoUrl ? 'Video unavailable' : 'A work in the making.'), element('p', 'muted', project.videoUrl ? 'The video link needs updating. Please check back soon.' : 'The film will be available here soon.'));
      player.append(empty);
    }
    const index = projects.indexOf(project);
    for (const [label, item] of [['← Previous project', projects[index - 1]], ['Next project →', projects[index + 1]]]) {
      if (item) { const link = element('a', 'text-link', label + ': ' + item.title); link.href = projectHref(item); document.getElementById('project-navigation').append(link); }
    }
  }
}
