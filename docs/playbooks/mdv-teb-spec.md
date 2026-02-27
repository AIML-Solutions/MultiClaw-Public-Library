# MDV + TEB Specification

## Overview
`MDV` (MultiClaw Docs Viewer) and `TEB` (Tracked Execution Board) provide a lightweight operations front-end for MultiClaw-Public-Library.

Target outcome: browse high-value markdown docs across repos and track execution work in one interface.

## Deployment model
- Static site under `site/`
- Deployed through GitHub Pages workflow (`.github/workflows/deploy-pages.yml`)
- Zero build dependencies (HTML/CSS/vanilla JS)

## MDV (Docs Viewer)

### Core features
1. **Document catalog**
   - Source: `site/data/docs-catalog.json`
   - Includes title, repo, lane, tags, GitHub URL, and raw markdown URL.

2. **Search + repo filtering**
   - Text search across title/repo/lane/tags.
   - Repo dropdown for focused browsing.

3. **Markdown rendering**
   - Fetches raw markdown dynamically.
   - Renders using `marked` and sanitizes with `DOMPurify`.

4. **Action toolbar**
   - Open on GitHub
   - Open raw source
   - Copy direct link

### Extension points
- Add lane filters and tag chips.
- Add version/date metadata from git history.
- Add favoriting and pinned docs.

## TEB (Tracked Execution Board)

### Core features
1. **Task catalog**
   - Source: `site/data/teb-tasks.json`
   - Fields: id, lane, status, priority, owner, description, links.

2. **Status/lane filtering**
   - Filter by status (`todo`, `in-progress`, `blocked`, `done`) and lane.

3. **Task interaction controls**
   - Checkbox to mark done
   - Status dropdown
   - Per-task notes
   - Link buttons to source repos/docs

4. **Persistence**
   - Local browser persistence via `localStorage` (`multiclaw-teb-state-v1`).

5. **Summary output generator**
   - Produces meeting-minutes-ready markdown block in a result box.
   - Copy-to-clipboard action for fast reporting.

### Extension points
- Sync state to JSON backend or GitHub issue labels.
- Add due dates and owner filters.
- Add lane-level burnup charts.

## Security notes
- Markdown HTML is sanitized before insertion.
- No secrets or private keys should appear in `site/data/*`.
- Private repo docs may not be fetchable in public browser contexts without authentication.

## Operational usage
1. Open MDV/TEB page.
2. Read relevant docs in MDV.
3. Update execution state in TEB.
4. Generate summary output.
5. Paste summary into formal meeting minutes file.
