# Description

This is a simple static site generator. It generates a static site from markdown files. Using with a VPS, it can be used to host a simple blog / doc / notes. It use prismjs for code highlighting. Because it use github actions to deploy over shh/rsync, you can write your content in markdown and push to github on main branch, the site will be updated automatically. Directly edit the content in github web interface will also work.

# Install dependencies

```bash
npm install
```

# Create your own content

Content has to be written in markdown format and placed in the `content` directory. or other CONTENT_DIR defined in .env file.

It's mandatory to include the following frontmatter at the beginning of the file:

```markdown
---
title: Some title
description: Some description
date: YYYY-MM-DD
tags: some, tags
---
```

They are used to generate the metadata of the page and to display the content in the home page.

Content support code highlighting, just use the following syntax:

```markdown
```javascript
console.log('Hello, world!');
\```
```

# Generate static site
```bash
npm run generate
```

# Development
```bash
npm run dev
```

# Deploy

Used pipeline to deploy to a VPS using rsync. Read the article [here](https://doc-notes.arbona.dev/github-actions-deploy-ssh-rsync.html)

```bash
git push origin main
```