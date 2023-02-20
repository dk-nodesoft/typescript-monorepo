#!/bin/bash
# git update-index --chmod=+x docker_scripts.sh

# Get passed arguments
ACTION=$1
APPLICATION=$2
# --

# Get environment variables
NODE_ENV=${NODE_ENV:=development}
LOCAL_REPO=${LOCAL_REPO:=dockerrepo.softdesign.dk:5000/}
NODE_VERSION=${NODE_VERSION:=16.13.0}
# --

# Get the git branchname for docker container name
BRANCH_NAME=${BRANCH_NAME:=$(git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9]/-/g')} 
# --

# Identify the hostname
HOST_NAME=`hostname`
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

# Setup location for devops config files - application specific
CONFIG_DIR=$HOME_DIR/servers/$APPLICATION/devops
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
. $CONFIG_DIR/default.config
. $CONFIG_DIR/$NODE_ENV.config
# --

# Report setting if verbose
if [ $VERBOSE -eq 1 ]
then
    echo "ACTION.......: $ACTION"
    echo "APPLICATION..: $APPLICATION"
    echo "HOST_NAME....: $HOST_NAME"
    echo "NODE_ENV.....: $NODE_ENV"
    echo "SCRIPT_DIR...: $SCRIPT_DIR"
    echo "HOME_DIR.....: $HOME_DIR"
    echo "CONFIG_DIR...: $CONFIG_DIR"
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
          -t ${TAG_BUILD} \
          -f servers/${APPLICATION}/Dockerfile .

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
          -t ${TAG_BUILD} \
          -f servers/${APPLICATION}/Dockerfile .

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
          -t ${TAG_DEPLOY_LATEST} \
          -t ${TAG_DEPLOY} \
          -f servers/${APPLICATION}/Dockerfile .

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
        --cpus 2 \
        --restart unless-stopped \
        --network=odin \
        --dns-option=ndots:1 \
        --env NODE_ENV=$NODE_ENV \
        --log-driver none \
		    -v ${LOG_LOCATION}:/app/logs \
		    -v ${TMP_LOCATION}:/app/temp \
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