# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website and blog hosted on GitHub Pages (`pranjalpokharel.com.np`). Pure HTML + CSS — no JavaScript, no build tools, no frameworks.

## Adding a Blog Post

New posts are written in Markdown and converted using a Python script that requires [Pandoc](https://pandoc.org/) installed:

```sh
python md-to-post.py <path/to/post.md>
```

This converts the Markdown file and injects the HTML into `boilerplate.html` (replacing the `CONTENTS GO HERE` placeholder), writing the result to `posts/<filename>.html`.

After generating a post, manually add a link to it in `posts.html`.

## Pre-commit Hooks

Install hooks before committing:

```sh
pip install pre-commit
pre-commit install
```

Hooks run: YAML validation, end-of-file fixer, trailing whitespace removal, and spell checking (`codespell`).

## Link Preview Feature

Internal links can show a 400×500px preview card on click by adding the `preview-link` class:

```html
<a href="/posts/some-post.html" class="preview-link">Some Post</a>
```

Clicking the link opens a card to the right of the link showing the target page's `<main>` content. Clicking the same link again or clicking outside closes it. On screens narrower than 768px the card is disabled and the link navigates normally (also the natural fallback when JS is disabled).

The feature lives in `scripts/preview.js` and card styles in `stylesheets/preview-card.css`. All HTML pages include both; root pages use `scripts/preview.js` and `stylesheets/preview-card.css`, posts use `../scripts/preview.js` and `../stylesheets/preview-card.css`. The `boilerplate.html` template already has the correct paths, so new posts generated via `md-to-post.py` will include them automatically.

## Architecture

- `index.html` — homepage
- `posts.html` — blog index with links to all posts by year
- `resume.html` — resume page
- `posts/` — generated HTML blog posts
- `boilerplate.html` — template wrapper for blog posts (the `CONTENTS GO HERE` marker is where post body is injected)
- `stylesheets/style.css` — main site styles; uses Google Sans Code, responsive breakpoints at 768px / 1024px / 1200px / 1440px / 1600px
- `stylesheets/style-image.css` — responsive image styles
- `stylesheets/preview-card.css` — link preview card styles
- `scripts/preview.js` — link preview card logic
- `static/` — PDFs, images, and other assets
