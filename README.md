# Bansal Vaishnav — Lead Technical Artist

Static portfolio for GitHub Pages with game case studies and YouTube/Vimeo video galleries.

## Content
Edit projects.js. Each game has a stable string id, title, category, role, description, tools, contributions, thumbnail, storeUrl and videos array. Each video entry contains title and url. Add full HTTPS YouTube or Vimeo video links; Vimeo unlisted links must include the privacy hash. Folder URLs are not playable video URLs.

The current collection contains nine games from the supplied resume and ten videos from the two supplied YouTube playlists. Three unique Vimeo folder links were unavailable during preparation; no videos or game mappings were invented for those folders.

Contribution text is based on the supplied resume. Shared Merge 2 workflow achievements are explicitly described as portfolio-wide. Game images use the official Google Play listing images linked from the resume. No resume PDF or phone number is published.

## Preview
Serve this directory with any static HTTP server. No build or dependencies are required.

## Publish
Push the root HTML, JavaScript, CSS and optional local assets to the GitHub Pages publishing branch (main). Keep the existing root publishing configuration.

## Verification
Run node --test tests/video-source.test.cjs and node --check script.js.
Browser QA covers category filters, game navigation, video selection, actual YouTube playback and mobile project layout. New videos must permit public embedding.
