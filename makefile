# Ensuring user can access docker do this:
# $ sudo groupadd docker
# $ sudo usermod -aG docker $USER

# Uncomment and set value of LOCAL_REPO to your local docker registry
# export LOCAL_REPO=dockerrepo.softdesign.dk:5000/

# Define node version to use
export NODE_VERSION=18.14.1

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
mkfile_dir := $(dir $(mkfile_path))
home_dir := ${HOME}
node_env := $(NODE_ENV)

network:
	-@docker network create nodejs 2>/dev/null

docker-build-posts: network
	@./devops/docker_scripts.sh build-prod udemy-microservices-with-nodejs-and-react/posts

docker-build-comments: network
	@./devops/docker_scripts.sh build-prod udemy-microservices-with-nodejs-and-react/comments

docker-build: docker-build-posts docker-build-comments

# Dependencies and local registry
build-dependencies:
	docker build --build-arg NODE_VERSION=${NODE_VERSION} -t ${LOCAL_REPO}nodebuild:${NODE_VERSION} -t ${LOCAL_REPO}nodebuild:latest -f devops/dependencies/Dockerfile.NodeBuild .
	docker build --build-arg NODE_VERSION=${NODE_VERSION} -t ${LOCAL_REPO}nodeprod:${NODE_VERSION} -f devops/dependencies/Dockerfile.NodeProd .
#	docker build --build-arg NODE_VERSION=${NODE_VERSION} -t ${LOCAL_REPO}jenkinsagent:${NODE_VERSION} -t ${LOCAL_REPO}jenkinsagent:latest -f devops/dependencies/Dockerfile.JenkinsAgent .
#	docker image push --all-tags ${LOCAL_REPO}nodebuild
#	docker image push --all-tags ${LOCAL_REPO}nodeprod
#	docker image push --all-tags ${LOCAL_REPO}jenkinsagent


# REDIS
redis:
	-@docker stop local-redis
	-@docker rm local-redis
	-@docker run -d --name local-redis -p 6379:6379 redis
	-@docker start local-redis

# MONGO
mongo-clean:
	-@docker stop local-mongo
	-@docker rm local-mongo
	-@docker run -d --name local-mongo -p 27017:27017 mongo
	-@docker start local-mongo

mongo:
	-@docker stop local-mongo
	-@docker start local-mongo


# KRAKEND
krakend:
	-@docker stop local-krakend
	-@docker rm local-krakend
	-@docker run -d -e FC_ENABLE=1 -e FC_SETTINGS=/etc/krakend/settings/$(node_env) -e FC_TEMPLATES=/etc/krakend/templates -e FC_OUT=/etc/krakend/out/krakend.json --add-host mylocalhost:172.25.161.165 --name local-krakend -p 1080:8080 -v /${mkfile_dir}/config/krakend/:/etc/krakend/ devopsfaith/krakend krakend run -c /etc/krakend/krakend.go.tmpl
	-@docker start local-krakend

# KEYCLOAK
keycloak:
	-@docker stop local-keycloak
	-@docker rm local-keycloak
	-@docker run --name local-keycloak -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -v /${mkfile_dir}/config/keycloak/conf:/opt/keycloak/conf -v /${mkfile_dir}/config/keycloak/themes:/opt/keycloak/themes -v /${mkfile_dir}/config/keycloak/data:/opt/keycloak/data -p 8080:8080 -d quay.io/keycloak/keycloak start-dev
	-@docker start local-keycloak

# Eventstore DB
eventstore:
	-@docker stop local-eventstore
	-@docker rm local-eventstore
	-@docker run -it --name local-eventstore -p 2113:2113 -p 1113:1113 eventstore/eventstore:latest --insecure --run-projections=All
	-@docker start local-eventstore

nodered:
	-@mkdir -p -m=777 ${home_dir}/.nodered/config
	-@docker stop local-nodered
	-@docker rm local-nodered
	-@docker run -d -p 1880:1880 -v ${home_dir}/.nodered/config:/data --name local-nodered nodered/node-red
	-@docker start local-nodered

n8n:
	-@mkdir -p -m=777 ${home_dir}/.n8n
	-@docker stop local-n8n
	-@docker rm local-n8n
	-@docker run -d -p 5678:5678 -v ${home_dir}/.n8n:/home/node/.n8n --name local-n8n n8nio/n8n
	-@docker start local-n8n


# HELPERS
docker-cleanup:
	-@docker image prune --all --force
	-@docker container prune --force
	-@docker system prune --force
	-@docker volume prune --force

