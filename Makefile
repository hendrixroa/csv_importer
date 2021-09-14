.PHONY: lint build clean build_docker dev run docs

################################################################################
# DEVELOP
#
# make dev_app APP=<app_name>
#
################################################################################
bunyan_log:
	yarn bunyan

dev_app:
	NODE_ENV=development \
    APP=$(APP) \
    TS_NODE_TRANSPILE_ONLY=true \
    yarn nodemon --exec \
    yarn env-cmd --no-override -f ./env/.env yarn env-cmd -f ./env/$(APP).env node --max_old_space_size=8192 -r ts-node/register -r tsconfig-paths/register src/apps/$(APP)/main.ts | $(MAKE) bunyan_log

dev_app_debug:
	NODE_ENV=development \
	APP=$(APP) \
	TS_NODE_TRANSPILE_ONLY=true \
	yarn nodemon --exec \
	yarn env-cmd --no-override -f ./env/.env yarn env-cmd -f ./env/$(APP).env node --inspect --max_old_space_size=8192 -r ts-node/register -r tsconfig-paths/register src/apps/$(APP)/main.ts | $(MAKE) bunyan_log

################################################################################
# BUILD
################################################################################
build: clean
	yarn run build && \
        cp package.json dist/ && \
        cp yarn.lock dist/ && \
        cp tsconfig.json dist/ && \
        for filename in $$(find . -iname '*.json' -a | grep -v '^./dist' | grep -v '^./node_modules' | sed 's/^..//'); do mkdir -p "./dist/$$(dirname $$filename)" && cp $$filename "./dist/$$filename"; done && \
        cd dist && \
        NODE_ENV=${NODE_ENV:-production} yarn

build_docker:
	docker build -t platform:latest --build-arg APP="$(APP)" --build-arg ACCOUNT_ID="$(ACCOUNT_ID)" --build-arg REGION="$(AWS_REGION)" . -q

build_docker_app:
	docker build -t platform:latest -f Dockerfile.local .
	APP=$(APP) docker-compose up --force-recreate


################################################################################
# TESTING
################################################################################
run_tests:
	NODE_ENV="test" yarn env-cmd --no-override -f ./env/.test.env mocha -t 10000 --exit --require ts-node/register -r tsconfig-paths/register "test/**/*.{ts,js}"

lint_formatting:
	npx prettier --write --loglevel silent "src/**/*.ts" "test/**/*.ts"
	npx eslint "{src,apps,libs,test}/**/*.ts" --fix --fix-type suggestion,layout,problem

install_dependencies:
	yarn
	git config --unset core.hooksPath

clean:
	rm -rf dist
