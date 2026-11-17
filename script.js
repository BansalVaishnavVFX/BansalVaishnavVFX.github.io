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
function externalLink(label, url) {
  const link = element('a', 'text-link', label);
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  return link;
}
function videosFor(project) {
  return project.videos || (project.videoUrl ? [{title: project.title, url: project.videoUrl}] : []);
}
const grid = document.getElementById('project-grid');
if (grid) {
  const filters = document.getElementById('filters');
  function render(category) {
    grid.replaceChildren();
    const shown = projects.filter(project => category === 'All' || project.category === category);
    shown.forEach(project => {
      const card = element('a', 'project-card'); card.href = projectHref(project);
      const visual = element('div', 'project-visual art-' + (projects.indexOf(project) % 6));
      const thumbnail = safeImage(project.thumbnail);
      if (thumbnail) {
        const img = element('img'); img.src = thumbnail; img.alt = project.title + ' game artwork'; img.loading = 'lazy';
        img.addEventListener('error', () => img.remove()); visual.append(img);
      }
      const videos = videosFor(project);
      visual.append(element('span', 'project-state', videos.length ? videos.length + ' VIDEOS' : 'PROJECT DETAILS'));
      const details = element('div', 'card-details');
      const tags = element('div', 'tags');
      project.tools.forEach(tool => tags.append(element('span', 'tag', tool)));
      details.append(tags, element('h3', '', project.title), element('p', 'card-description', project.description), element('span', 'read-project', 'VIEW PROJECT →'));
      card.append(visual, details); grid.append(card);
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
  }
  if (window.portfolio.linkedin) contact.append(externalLink('LinkedIn ↗', window.portfolio.linkedin));
}
const player = document.getElementById('video-player');
if (player) {
  const requestedId = new URLSearchParams(location.search).get('id');
  const project = projects.find(item => item.id === requestedId || (item.aliases || []).includes(requestedId));
  if (!project) {
    document.getElementById('project-title').textContent = 'Project not found';
    player.append(element('p', '', 'This project is unavailable. Use All work to return to the portfolio.'));
  } else {
    document.title = project.title + ' — Bansal';
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-category').textContent = project.category;
    const role = document.getElementById('project-role');
    role.hidden = !project.role;
    if (project.role) role.textContent = project.role + ' · TheAppGuruz';
    document.getElementById('project-description').textContent = project.description;
    (project.tools || []).forEach(tool => document.getElementById('project-tools').append(element('span', 'tag', tool)));
    (project.contributions || []).forEach(text => document.getElementById('project-contributions').append(element('li', '', text)));
    document.getElementById('contributions-heading').hidden = !(project.contributions || []).length;
    const resources = document.getElementById('project-resources');
    if (project.storeUrl || project.playlistUrl) resources.append(element('h2', '', 'Explore the game'));
    if (project.storeUrl) {
      const store = externalLink('', project.storeUrl);
      store.className = 'store-button';
      store.setAttribute('aria-label', 'View ' + project.title + ' on Google Play (opens in a new tab)');
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 32 36');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      for (const [points, color] of [
        ['2,2 19,18 2,34', '#32bbff'],
        ['2,2 24,14 19,18', '#00d26a'],
        ['19,18 24,14 31,18 24,22', '#ffd447'],
        ['2,34 19,18 24,22', '#ff5454']
      ]) {
        const shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', points);
        shape.setAttribute('fill', color);
        icon.append(shape);
      }
      const label = element('span', 'store-label');
      label.append(element('span', 'store-caption', 'VIEW GAME ON'), element('span', 'store-name', 'Google Play'));
      const arrow = element('span', 'store-arrow', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      store.append(icon, label, arrow);
      resources.append(store);
    }
    if (project.playlistUrl) resources.append(externalLink('Full YouTube playlist ↗', project.playlistUrl));
    const videos = videosFor(project);
    const list = document.getElementById('video-list');
    function play(video, index) {
      player.replaceChildren(); document.getElementById('video-link').replaceChildren();
      const source = videoSource(video.url);
      document.getElementById('now-playing').textContent = 'SHOWCASE ' + (index + 1) + ' / ' + videos.length + ' — ' + video.title;
      for (const [i, button] of Array.from(list.children).entries()) button.setAttribute('aria-pressed', String(i === index));
      if (source) {
        const frame = element('iframe'); frame.src = source.src; frame.title = video.title + ' — ' + source.provider + ' video';
        frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin'; player.append(frame);
        if (source.provider === 'Vimeo') window.preferHighestVimeoQuality(frame);
        document.getElementById('video-link').append(externalLink('Watch on ' + source.provider + ' ↗', source.original), element('span', 'muted fallback-note', 'If the player is unavailable, open the video directly.'));
      } else player.append(element('p', 'muted', 'This video is currently unavailable.'));
    }
    videos.forEach((video, index) => {
      const button = element('button', 'video-choice', String(index + 1).padStart(2, '0') + ' / ' + video.title);
      button.type = 'button'; button.addEventListener('click', () => play(video, index)); list.append(button);
    });
    if (videos.length) play(videos[0], 0);
    else {
      for (const id of ['video-player', 'now-playing', 'video-list', 'video-link']) {
        document.getElementById(id).hidden = true;
      }
    }
    const article = document.getElementById('project-story');
    (project.story || []).forEach(part => {
      const section = element('section');
      section.append(element('h2', '', part.heading), element('p', '', part.text));
      article.append(section);
    });
    article.hidden = !(project.story || []).length;
    const index = projects.indexOf(project);
    for (const [label, item] of [['← Previous project', projects[index - 1]], ['Next project →', projects[index + 1]]]) {
      if (item) { const link = element('a', 'text-link', label + ': ' + item.title); link.href = projectHref(item); document.getElementById('project-navigation').append(link); }
    }
  }
}
