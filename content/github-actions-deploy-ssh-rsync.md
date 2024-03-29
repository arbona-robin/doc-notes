---
title: GitHub Actions Deploy SSH Rsync
description: Setup pipeline to deploy to a server using rsync over ssh
date: 2024-02-28
tags: github, actions, deploy, ssh, rsync
---

Create workflow file in `.github/workflows/deploy.yml`.

https://github.com/marketplace/actions/rsync-deployments-action

```yaml
name: DEPLOY
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: install dependencies
        run: npm install
      - name: build
        run: npm run build
      - name: rsync deployments
        uses: burnett01/rsync-deployments@6.0.0
        with:
          switches: -avzr --delete
          path: site/
          remote_path: ${{ secrets.DEPLOY_PATH }}
          remote_host: ${{ secrets.DEPLOY_HOST }}
          remote_port: ${{ secrets.DEPLOY_PORT }}
          remote_user: ${{ secrets.DEPLOY_USER }}
          remote_key: ${{ secrets.DEPLOY_KEY }}
```

Create a new ssh key pair.

```bash
ssh-keygen -t ed25519 -C "deploy-github-action-key-doc-notes"
```

Add the private key to the github repository secrets and key pass (passphrase if any). Add the host, port, user, and path. /USER_NAME/REPO/settings/secrets/actions

Add the public key to the server.

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub USER@HOST
```


Push the changes to the repository to trigger the deployment.

```bash
git add .
git commit -m "Add deploy action"
git push
```

Check deployment lot on github at USER_NAME/REPO/actions