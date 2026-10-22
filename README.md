# City Atlas

A static, redesigned recovery of Andres Macias's 2018 D3 coursework in `Emerging-tech/dataVisualization`. Original map/state labels and proportional city circles are preserved. The refreshed cartographic layout adds city selection, accessible keyboard controls, search, rank filters, and a downloadable data table. This is a historical sample visualization, **not a current population dashboard**.

## Run

Node 22 or newer; Python 3 for the simple static preview server.

```
npm ci
npm test
npm run build
npm start
```

Open http://127.0.0.1:4344. `dist/` is fully static and can be served by GitHub Pages for free. All runtime code and data are local; no map subscription, analytics, API key, account, or backend is required. Live demo: https://grimsyntaxcloud.github.io/city-atlas/. GitHub Actions validates and deploys main to GitHub Pages; public standard runners and Pages are free.

## Provenance

Original coursework: https://github.com/GrimSyntaxCloud/Emerging-tech/tree/master/dataVisualization
Original example city CSV: https://gist.github.com/d3byex/65a128a9a499f7f0b37d (pinned source revision 176771c2f08dbd3431009ae27bef9b2f2fb56e36, the same URLs used by the original app). The original data combines historical values without a declared consistent census year; retain that disclosure and example attribution. Do not relabel it as current or as a specific census year. The city CSV retains the original 50 factual sample records and source attribution. Before publication, the old state outline file was replaced with U.S. Census Bureau cartographic boundaries from `us-atlas` 3.0.1 (ISC license in `data/US-ATLAS-LICENSE`), converted from TopoJSON to GeoJSON. See https://github.com/topojson/us-atlas. Only the 50 states and District of Columbia are included.

D3 7.9.0 (ISC license, included in `dist/vendor/D3-LICENSE`); official projection docs: https://d3js.org/d3-geo. Original D3 v3/queue loading replaced by current D3 and Promise.all, with local data, responsive SVG, failure messaging, visible keyboard focus, and reduced-motion support. No third-party fonts/images. The historical source remains untouched in its original repository.

## Tests and scope

Five tests cover source-record preservation, rankings/search/filter intersections, map projection of all cities, proportional marker area, and invalid records. Browser review verifies rendering and interaction. The site is published as an AI-assisted redesign of the original coursework. No Azure or database changes.

## Visual identity

The urban-observatory edition uses a full-width midnight cartographic workspace, cyan markers, chartreuse selection, a searchable directory rail and coordinate readouts. A decorative selection reticle follows the chosen city. The mobile layout brings the map before the directory. Native CSS handles short entrance/selection effects and respects reduced-motion preferences; no paid assets, additional libraries or live-data claims were introduced.
