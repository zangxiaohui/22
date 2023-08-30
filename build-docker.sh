#!/bin/bash
set -xe

COMMAND=$1
VERSION=$2

PROJECT_NAME=$(echo 'console.log(require("./package.json").name)' | node -)

if [[ -z $VERSION ]]; then
VERSION=$(git describe --tag --dirty --long)
fi

if [[ -z $DOCKER_IMAGE_REPO ]]; then
DOCKER_IMAGE_REPO=d.artifactory.maxtropy.com/maxtropy
fi

IMAGE_NAME=$DOCKER_IMAGE_REPO/$PROJECT_NAME:$VERSION

case $COMMAND in
build)
  npm ci
  npm run build
  docker image build ./ -t "$IMAGE_NAME"
  ;;
push)
  docker push "$IMAGE_NAME"
  ;;
esac
