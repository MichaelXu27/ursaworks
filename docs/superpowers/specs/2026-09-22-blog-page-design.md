# Blog Page Design

## Goal

Give Ursaworks a `/blog` section: a card list of posts, and a dedicated page per post that renders a Markdown article written by a team member. The first post is Eason's "Intro to Communication in Robotics", already committed to `content/assets/blog/`.

The card-list layout is modelled on the author's personal site (`PersonalWebsite/src/pages/Blogs.jsx`), but that page is built on Tailwind and stops at summaries with optional outbound links. This repo has no Tailwind, and the post it needs to display is a full article. The structure is therefore ported and restyled in the existing Ursaworks idiom, and extended with on-site post rendering.

## Scope

- Add a `/blog` index listing every post as a card: title, date, author, tags, summary.
- Add `/blog/:slug` rendering the full Markdown article on-site.
- Store post metadata in `src/content.json`, consistent with the rest of the site's text.
- Extend the asset sync to carry the `blog` category so posts and their images reach the app.
- Render Markdown at runtime with `react-markdown`, including the raw `<img>` tags that Typora emits.
- Resolve post-local images through the existing `loadImages` resolver; leave externally hosted images as remote references.
- Replace the current placeholder `Blog.jsx`, which is a verbatim copy of `About.jsx` and renders About's content under About's DOM id.

## Design

### Content model

`src/content.json` gains a `blog` array. Each entry carries the metadata the index needs, so the list renders without parsing any Markdown:

- `slug` — URL segment, also the name of the post's asset folder.
- `title`, `date`, `author` — display fields. `date` is a human-readable string, matching how `events[]` already stores dates.
- `tags` — array of short strings, rendered as pills.
- `summary` — one-paragraph teaser shown on the card, written by hand.
- `file` — the Markdown filename inside the post's folder.

The Markdown files carry no frontmatter, and the existing post has none. Requiring frontmatter would mean editing contributors' exported files and adding a parser dependency; keeping metadata in `content.json` avoids both and follows the rule that `content.json` is the source of truth for site text.

`summary` for the first post is lifted by hand from the blockquote that opens the article.

### Asset folder convention

One folder per post under `content/assets/blog/`, named for the post's slug, holding the Markdown file and any images it references locally. `content/assets/blog/test/` is renamed to `content/assets/blog/intro-to-communication-in-robotics/` to establish this. Because the folder name and the slug are the same, entries need no separate folder field.

### Asset pipeline

`syncAssets.js` copies a fixed list of categories from `content/assets/` into `src/assets/`, then mirrors all of `src/assets/` into `public/assets/`. The list omits `blog`, so the post and its images currently never reach the app.

Adding `blog` to `assetCategories` is the whole change. The copy is a recursive `fs.copy` with no extension filter, so it carries the Markdown file alongside the images and preserves the per-post subfolder. The existing deletion pass keeps removed posts from lingering downstream.

### Loading Markdown

A new `src/configs/loadPost.js` mirrors `loadImages.js` so there is a single idiom for resolving content files. It builds an eager `import.meta.glob` over `../assets/blog/**/*.md` with `query: '?raw'`, keyed by `../assets/blog/<slug>/<file>`, and returns `null` with a `console.error` when a key is missing — the same failure behaviour as `loadImage`.

Eager loading inlines every post into the bundle. At the current scale that is cheaper than the machinery to avoid it; if the post count grows the glob can become lazy without changing callers.

### Routing

`GlobalController.jsx` keeps `/blog` for the index and adds `/blog/:slug` for a post. Both sit inside the existing `Layout` route so they inherit the navbar, footer, and background grid.

An unrecognised slug renders `<Navigate to="/blog" replace />`, echoing how the router already handles unmatched paths. Deep links need no further work: `vite.config.mjs` sets `base: '/'` and `public/404.html` carries the SPA redirect shim with `pathSegmentsToKeep = 0`, which already covers nested routes on GitHub Pages.

### Components

- `components/Blog.jsx` — rewritten. Renders the index: a `#blogBlock` container, a `.sectionTitle` heading, the card list, and the shared `NextPageLink` so the page hands off somewhere rather than dead-ending, as every other content page does.
- `components/BlogCard.jsx` — one card: title, date, author, tag pills, summary. The whole card is a `Link` to `/blog/<slug>`.
- `pages/BlogPostPage.jsx` and `components/BlogPost.jsx` — the post view. Reads `useParams()`, finds the matching `content.blog` entry, loads the Markdown through `loadPost`, and renders a header from the metadata followed by the article body. A back link returns to the index.
- `components/MarkdownImage.jsx` — the image override described below.

Post metadata renders from `content.json`, so the article's own leading `#` heading would duplicate the title. The renderer maps `h1` to nothing; posts supply their title through `content.json`, and section headings start at `h2`, which is how the existing post is already written.

### Markdown rendering

`react-markdown` with `remark-gfm` for tables and strikethrough, and `rehype-raw` so raw HTML in a post is rendered rather than dropped. The existing post embeds several images as Typora-style `<img src="..." style="zoom:50%">` tags, which would silently vanish without `rehype-raw`.

`rehype-raw` allows arbitrary HTML from a post file to reach the DOM. That is acceptable while posts are authored by team members and land through pull requests, and it is the condition under which this choice holds. Accepting posts from outside contributors would require sanitising instead.

Element overrides give the article Ursaworks styling and keep the Markdown itself portable, so a contributor can keep writing ordinary Markdown in Typora.

### Image handling in posts

A custom `img` component handles both kinds of reference the existing post contains:

- **Post-local** (`./image-20260901122114259.png`) — resolved via `loadImage('blog/' + slug, filename)`. The existing glob in `loadImages.js` is already recursive over `../assets/**`, so synced blog images resolve with no change to the resolver.
- **External** (absolute `http(s)` URLs) — passed through unchanged, with `loading="lazy"` and `referrerPolicy="no-referrer"`.

Typora's `style="zoom:…%"` attribute is discarded in favour of a CSS `max-width`, so an image cannot overflow the text column regardless of its intrinsic size.

Thirteen of the fifteen images in the first post are hotlinked to third-party sites, two of them to Google's thumbnail cache. Those references will break over time and carry an attribution question. This design renders them as authored; replacing or crediting them is content work, tracked separately.

### Styling

`src/styles/blogStyle.css` is currently empty and gains the rules for both views.

`#blogBlock` mirrors `#aboutBlock`'s geometry — centred on `--content-max`, `padding-top: 10rem` — so the section title sits at the same height as every other page's, below the fixed navbar. Note that `.infoBlock` carries no styling in this codebase; page geometry comes from the per-page id selector, and the new pages follow that pattern.

Cards use a restrained border on the dark surface, lifting to a `--main-grad` accent on hover. Tag pills take the same gradient language rather than the source site's sky-blue, which belongs to a different palette.

The post body gets scoped descendant rules for headings, paragraphs, lists, blockquotes, and images, including `img { max-width: 100% }`. The article is long and deeply nested, so list indentation and vertical rhythm matter more here than elsewhere on the site.

## Components and files

- `src/content.json`: new `blog` array.
- `content/assets/blog/test/` → `content/assets/blog/intro-to-communication-in-robotics/`: folder rename.
- `syncAssets.js`: add `blog` to `assetCategories`.
- `src/configs/loadPost.js`: new raw-Markdown resolver.
- `src/configs/GlobalController.jsx`: add the `/blog/:slug` route.
- `src/components/Blog.jsx`: rewritten as the index.
- `src/components/BlogCard.jsx`, `src/components/BlogPost.jsx`, `src/components/MarkdownImage.jsx`: new.
- `src/pages/BlogPostPage.jsx`: new.
- `src/styles/blogStyle.css`: index and post styling.
- `package.json`: `react-markdown`, `remark-gfm`, `rehype-raw`.
- `src/__tests__/contentBlog.test.js`: content integrity checks.
- `src/components/__tests__/Blog.test.jsx`, `src/components/__tests__/BlogPost.test.jsx`: render behaviour.

## Verification

- Content integrity tests, following `contentImages.test.js`: every `blog[].file` exists at `src/assets/blog/<slug>/<file>`; every post-local image referenced inside each Markdown file exists on disk; slugs are unique and URL-safe. The image check is the one that catches a renamed or missing figure before it ships as a broken image.
- Render tests: a card links to its post URL; a post renders its metadata header and a known section heading from the Markdown; an unknown slug redirects to `/blog`.
- `npm test -- --run`, `npm run lint`, and `npm run build` from `react-ursaworks/`.
- Inspect `/blog` and the post route in a browser at desktop and at a 430px-wide viewport, confirming images stay inside the column and the title does not render twice.

## Out of scope

- Pagination, tag filtering, search, and sorting controls. One post does not justify them.
- Per-post cover images on cards.
- RSS, sitemap, or per-post social preview metadata.
- A CMS or authoring UI. Posts are Markdown files added by pull request.
- Localising or re-crediting the third-party images in the first post.
- Sanitising post HTML, which the pull-request authoring model makes unnecessary for now.
- Draft or scheduled posts.
