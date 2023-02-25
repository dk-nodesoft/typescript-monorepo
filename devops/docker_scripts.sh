#!/bin/bash
# git update-index --chmod=+x docker_scripts.sh

# Get passed arguments
ACTION=$1
APP_LOCATION=$2
# --

# Resolve package.json to get the application name
if [ -z "$APPLICATION" ]; then
  pushd ./${APP_LOCATION}
  APPLICATION=`cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]'`
  popd  
fi
# --

# Get environment variables
NODE_ENV=${NODE_ENV:=development}
LOCAL_REPO=${LOCAL_REPO}
NODE_VERSION=${NODE_VERSION:=18.14.1}
# --

# Get the git branchname for docker container name
BRANCH_NAME=${BRANCH_NAME:=$(git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9]/-/g')} 
# --

# Identify the home directory of this script file - SCRIPT_DIR 
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
# --

# Setup home directory - root
HOME_DIR=$SCRIPT_DIR/..
# --

# Check if Jenkins IMG_VERSION is available if so use it - if not set IMG_VERSION defaults to 0 (zero)
JENKINS=0
IMG_VERSION="${IMG_VERSION:-0}"
# -- 

# Get the VERSION number from the VERSION file only if jenkins IMG_VERSION is not supplied
if [ $IMG_VERSION -eq 0 ]; then
  # Get current docker image version
  if [[ ! -e $HOME_DIR/VERSION ]]; then
    echo 1 >$HOME_DIR/VERSION
  fi
  VERSION=`cat $HOME_DIR/VERSION`
else
  JENKINS=1
  VERSION=$IMG_VERSION
fi
# --

# Load configuration
DOCKER_CONTAINER_NAME=$APPLICATION
DOCKER_IMAGE_NAME=$APPLICATION
VERBOSE=1
# --

# Report setting if verbose
if [ $VERBOSE -eq 1 ]
then
    echo "ACTION.......: $ACTION"
    echo "APP_LOCATION.: ./$APP_LOCATION"
    echo "APPLICATION..: $APPLICATION"
    echo "NODE_ENV.....: $NODE_ENV"
    echo "SCRIPT_DIR...: $SCRIPT_DIR"
    echo "HOME_DIR.....: $HOME_DIR"
    echo "VERSION......: $VERSION"
    echo "JENKINS......: $JENKINS"
    echo "BRANCH_NAME..: $BRANCH_NAME"
    echo "DOCKER_PORTS.: $DOCKER_PORTS"
    echo "NODE_VERSION.: $NODE_VERSION"
    echo "LOCAL_REPO...: $LOCAL_REPO"
    echo "DOCKER_IMAGE_NAME: $DOCKER_IMAGE_NAME"
    echo "DOCKER_CONTAINER_NAME: $DOCKER_CONTAINER_NAME"
fi

# Ensure HOME_DIR is the current folder (location of Dockerfile)
pushd $HOME_DIR > /dev/null
# --

TAG_BUILD=${LOCAL_REPO}$DOCKER_IMAGE_NAME-${BRANCH_NAME}:build
TAG_DEPLOY=${LOCAL_REPO}$DOCKER_IMAGE_NAME-${BRANCH_NAME}:${VERSION}
TAG_DEPLOY_LATEST=${LOCAL_REPO}$DOCKER_IMAGE_NAME-${BRANCH_NAME}:latest

case $ACTION in
    "build") 
        # If JENKINS is 0 we will increment the VERSION number and store it in the VERSIONs file
        # otherwise the VERSION will include the IMG_VERSION as supplied by Jenkins
        if [ $JENKINS -eq 0 ]; then
          VERSION=$(($VERSION +1))
          echo $VERSION >$HOME_DIR/VERSION
        fi

        if [ $VERBOSE -eq 1 ]; then
          echo "Building docker image for build ${DOCKER_IMAGE_NAME} version ${VERSION}"
        fi

        # Build docker image
        DOCKER_BUILDKIT=1 docker build \
          --target build \
          --build-arg NODE_VERSION=${NODE_VERSION} \
          --build-arg LOCAL_REPO=${LOCAL_REPO} \
          --build-arg APPLICATION=${APPLICATION} \
          --build-arg APP_LOCATION=${APP_LOCATION} \
          -t ${TAG_BUILD} \
          -f ./${APP_LOCATION}/Dockerfile .

        exitCode=$?;;

    "test") 
        if [ $VERBOSE -eq 1 ]; then
          echo "Get test results from docker image ${DOCKER_IMAGE_NAME} version ${VERSION}"
        fi

        # Ensure the reports folder is available for the dockerfile to provide reports
        pwd
        mkdir -p ./.reports

        # Build docker image
        DOCKER_BUILDKIT=1 docker build \
          --target test \
          --output type=local,dest=./.reports \
          --build-arg NODE_VERSION=${NODE_VERSION} \
          --build-arg LOCAL_REPO=${LOCAL_REPO} \
          --build-arg APPLICATION=${APPLICATION} \
          --build-arg APP_LOCATION=${APP_LOCATION} \
          -t ${TAG_BUILD} \
          -f ./${APP_LOCATION}/Dockerfile .

        exitCode=$?;;

    "build-prod") 
        if [ $VERBOSE -eq 1 ]; then
          echo "Building docker image ${DOCKER_IMAGE_NAME} version ${VERSION}"
          echo "NODE_ENV..........: $NODE_ENV"
        fi

        # Build docker image
        docker build \
          --build-arg NODE_VERSION=${NODE_VERSION} \
          --build-arg LOCAL_REPO=${LOCAL_REPO} \
          --build-arg APPLICATION=${APPLICATION} \
          --build-arg APP_LOCATION=${APP_LOCATION} \
          -t ${TAG_DEPLOY_LATEST} \
          -t ${TAG_DEPLOY} \
          -f ./${APP_LOCATION}/Dockerfile .

        exitCode=$?;;

    "repo-push")
        docker image push --quiet --all-tags ${LOCAL_REPO}$DOCKER_IMAGE_NAME-${BRANCH_NAME}
        exitCode=$?;;

    "repo-pull")
        docker image pull ${TAG_DEPLOY}
        exitCode=$?;;

    "deploy")
      docker run \
        --name ${DOCKER_CONTAINER_NAME} \
        -d \
        --restart unless-stopped \
        --network=nodejs \
        --dns-option=ndots:1 \
        --env NODE_ENV=$NODE_ENV \
        ${DOCKER_PORTS} \
        ${TAG_DEPLOY}
        
        exitCode=$?;;

    "start")
      docker start ${DOCKER_CONTAINER_NAME}
      exitCode=$?;;

    "stop")
      docker stop ${DOCKER_CONTAINER_NAME}
      exitCode=$?;;

    "remove")
      docker rm ${DOCKER_CONTAINER_NAME}
      exitCode=$?;;

    "shell")
      docker exec -it ${DOCKER_CONTAINER_NAME} sh
      exitCode=$?;;

    *)
      echo "Unknown action provided supported actions are run, start, stop or remove!"
      exitCode=999;;
esac

popd > /dev/null

exit $exitCode