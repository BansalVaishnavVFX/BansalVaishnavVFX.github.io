const test = require('node:test');
const assert = require('node:assert/strict');
const parse = require('../video-source.js');
test('YouTube share formats resolve to privacy enhanced embeds', () => {
  for (const url of ['https://youtu.be/AbCdEfGhI_1?si=abc', 'https://www.youtube.com/watch?v=AbCdEfGhI_1&feature=share', 'https://youtube.com/shorts/AbCdEfGhI_1', 'https://youtube.com/live/AbCdEfGhI_1', 'https://www.youtube-nocookie.com/embed/AbCdEfGhI_1']) {
    assert.equal(parse(url).src, 'https://www.youtube-nocookie.com/embed/AbCdEfGhI_1');
  }
});
test('Vimeo public and unlisted URLs retain playback information', () => {
  assert.equal(parse('https://vimeo.com/123456789').src, 'https://player.vimeo.com/video/123456789?transparent=0');
  assert.equal(parse('https://vimeo.com/123456789/abc123?share=copy').src, 'https://player.vimeo.com/video/123456789?h=abc123&transparent=0');
  assert.equal(parse('https://player.vimeo.com/video/123456789?h=abc123').src, 'https://player.vimeo.com/video/123456789?h=abc123&transparent=0');
});
test('Malformed, unsafe and lookalike URLs cannot create players', () => {
  for (const url of ['', null, 'bad url', 'javascript:alert(1)', 'http://vimeo.com/123', 'https://vimeo.com.evil.test/123', 'https://youtube.com.evil.test/watch?v=AbCdEfGhI_1', 'https://youtube.com/watch?v=short', 'https://vimeo.com/not-a-video']) assert.equal(parse(url), null);
});
