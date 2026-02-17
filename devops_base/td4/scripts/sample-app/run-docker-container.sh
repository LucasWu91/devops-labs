#!/usr/bin/env bash
set -e

name=$(npm pkg get name | tr -d '"')
version=$(npm pkg get version | tr -d '"')

# Build l'image (si tu as déjà build-docker-image.sh)
./build-docker-image.sh

# Stop & remove si un conteneur existe déjà
docker rm -f "$name" >/dev/null 2>&1 || true

# Run
docker run --name "$name" -p 8080:8080 "$name:$version"

