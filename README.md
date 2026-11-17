# Bansal — Visual Effects Portfolio

Responsive static portfolio for GitHub Pages. No build or dependencies required.

## Add your videos

Edit projects.js. Each project has a unique, stable string id, title, category, description, videoUrl, thumbnail, and tools array. The existing entries are upcoming placeholders. Replace or remove them when adding your real work. Categories automatically populate the filters.

Set videoUrl to a full HTTPS YouTube watch, youtu.be, shorts or live URL, or a Vimeo video link. For Vimeo unlisted videos, use the complete shared link with its privacy hash. The player preserves this hash. Videos must permit embedding; private YouTube videos cannot be publicly embedded. Provider restrictions may still prevent playback; a direct video link is available as a fallback.

Set thumbnail to an image path (images/project.jpg) or HTTPS image URL. Empty or failed thumbnails use abstract artwork. Empty video URLs show a coming-soon state; invalid links show an unavailable state. The gallery loads no video players. A project opens its player on video.html?id=0.

Set email to your public contact address to enable the contact button. Until then, contact details show as coming soon. Update the about and practice copy in index.html with your own biography and specialties.

## Preview and publish

Serve this folder with any static HTTP server. Upload the root HTML, CSS and JavaScript files and your images to your GitHub Pages publishing branch. Under Settings → Pages select that branch and / (root). Keep your existing GitHub Pages hosting.

## Checks

Run node --test tests/video-source.test.cjs and node --check script.js.
Before publishing your actual videos, verify embedding permission and playback on desktop and mobile.
