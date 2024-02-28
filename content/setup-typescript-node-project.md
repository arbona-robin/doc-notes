---
title: Setup TypeScript Node Project
description: Setup TypeScript Node Project with ESLint, Prettier, Husky, Lint-Staged, and Jest
date: 2024-02-26
tags: node, typescript, eslint, prettier, husky, lint-staged, jest
---

## Introduction

Fast way to setup a new TypeScript Node project.

## Configuration

https://www.learnwithjason.dev/blog/modern-node-server-typescript-2024

```bash
# initialize npm
npm init -y

# install dev dependencies
npm i -D typescript ts-node @types/node

# initialize TypeScript
npx tsc --init
```

Add build and dev to scripts in `package.json`

```json
    "build": "tsc",
    "dev": "node --env-file=.env --watch -r ts-node/register src/index.ts"
```