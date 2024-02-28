---
title: VPS Configuration
description: VPS Configuration for a new server. Docker, UFW, SSH, Nginx, SSL, Git, Yarn
date: 2024-02-26
tags: vps, configuration, docker, ufw, ssh, nginx, ssl, git, yarn
---

## Introduction

Guide and links to configure a new VPS. The configuration is based on a Debian 11 server. We will install Docker, UFW, SSH, Nginx, SSL, Git, and Yarn.

## Configuration

Connect to the server with ssh

```bash
ssh root@your_server_ip
```

Create non root user https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04

```bash
adduser new_user
usermod -aG sudo new_user
```

Copy ssh key for user (or/and create new one https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)
```bash
rsync --archive --chown=new_user:new_user ~/.ssh /home/new_user
```

Try to connect with new user 
```bash
ssh new_user@your_server_ip
```

Disable password authentication and root login https://www.ionos.com/help/server-cloud-infrastructure/getting-started/important-security-information-for-your-server/deactivating-the-ssh-root-login/
Change port number for ssh https://linuxiac.com/ssh-to-port-other-than-22/
```bash
sudo nano /etc/ssh/sshd_config
```

Install firewall ufw  https://www.it-connect.fr/configurer-un-pare-feu-local-sous-debian-11-avec-ufw/

```bash
sudo apt-get update
sudo apt-get install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh # ! Warning if you have changed the ssh port you need to allow it: sudo ufw allow 1024/tcp

sudo ufw enable
sudo ufw status
```

Try to connect with ssh without closing the current session, indeed if you close the session and the firewall is not configured correctly you will not be able to reconnect to the server.


Check UFW Compatibility With Docker https://github.com/chaifeng/ufw-docker 

Install docker  https://docs.docker.com/engine/install/debian/

Install git https://www.digitalocean.com/community/tutorials/how-to-install-git-on-debian-10

Install yarn https://kifarunix.com/install-yarn-on-debian-11/

Reverse proxy with ssl https://linuxhandbook.com/nginx-reverse-proxy-docker/amp/

Install fail2ban https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-20-04

Connect fail2ban with ningx logs in dockers https://paranoiaque.fr/en/2023/01/01/nginx-docker-fail2ban/

Protect VPS https://contabo.com/blog/monitor-and-test-server-security/

Watch your logs https://www.strongdm.com/blog/view-ssh-logs

## Annexes

### Docker compose Reverse Proxy

Create a network for the reverse proxy

```bash
docker network create net
```

create a .env file at least with the email for letsencrypt

```env
EMAIL=youremail@yourdomain.com
```

```yaml
version: "3.7"

services:

  reverse-proxy:
    image: "jwilder/nginx-proxy:latest"
    container_name: "reverse-proxy"
    volumes:
      - "html:/usr/share/nginx/html"
      - "dhparam:/etc/nginx/dhparam"
      - "vhost:/etc/nginx/vhost.d"
      - "certs:/etc/nginx/certs"
      - "/run/docker.sock:/tmp/docker.sock:ro"
    restart: "always"
    networks: 
      - "net"
    ports:
      - "80:80"
      - "443:443"

  letsencrypt:
    image: "jrcs/letsencrypt-nginx-proxy-companion:latest"
    container_name: "letsencrypt-helper"
    volumes:
      - "html:/usr/share/nginx/html"
      - "dhparam:/etc/nginx/dhparam"
      - "vhost:/etc/nginx/vhost.d"
      - "certs:/etc/nginx/certs"
      - "/run/docker.sock:/var/run/docker.sock:ro"
    environment:
      NGINX_PROXY_CONTAINER: "reverse-proxy"
      DEFAULT_EMAIL: "${EMAIL}"
    restart: "always"
    depends_on:
      - "reverse-proxy"
    networks: 
      - "net"

volumes:
  certs:
  html:
  vhost:
  dhparam:

networks:
  net:

```

### Docker compose app using reverse proxy

Create a .env file at least with the email for letsencrypt

```env
HOST=yourdomain.com
EMAIL=youremail@yourdomain.com
```

```yaml
version: '3'
services:
  express:
    image: node:alpine
    container_name: express-loc
    volumes:
      - ./node_modules:/node_modules
      - ./package.json:/package.json
      - ./tsconfig.json:/tsconfig.json
      - ./public:/public
      - ./src:/src
    command: sh -c "yarn build && yarn start"
    restart: always
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/postgres
      - PORT=${PORT}
      - VIRTUAL_HOST=${HOST}
      - LETSENCRYPT_HOST=${HOST}
      - LETSENCRYPT_EMAIL=${EMAIL}
    networks:
      - 'net'

  db:
    image: postgres:13-alpine
    container_name: express-loc-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    networks:
      - 'net'

networks:
  net:
    external: true
```