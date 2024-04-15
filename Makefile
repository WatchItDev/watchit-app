# Include env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.DEFAULT_GOAL := all
phase=beta # default

.PHONY: bootstrap ## setup dev environment
bootstrap: install
	npx husky install
	npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

# When --ci option is provided, Jest will assume it is running in a CI environment.
# This changes the behavior when a new snapshot is encountered. Instead of the regular behavior of storing a new snapshot automatically,
# it will fail the test and require Jest to be run with --updateSnapshot.
.PHONY: test ## run tests
test:
	npx jest --ci --verbose --coverage=false

.PHONY: testcov ## run test coverage
testcov:
	npx jest --ci --coverage | tee ./coverage.txt && exit ${PIPESTATUS[0]}

.PHONY: clean ## clean installation and dist files
clean:
	rm -rf coverage
	rm -rf dist
	rm -rf node_modules
	npm cache clean -f

.PHONY: install ## install dependencies
install:
	rm -rf node_modules
	npm cache clean -f
	npm install --legacy-peer-deps
# 	npm install --force

.PHONY: format ## auto-format js source files
format:
	npm run format

.PHONY: lint ## lint standard js
lint:
	npm run lint

rebuild: clean deps
all: test lint

.PHONY: syncenv ## pull environments to dotenv vault
syncenv:
	npx dotenv-vault@latest pull $(stage) -y

.PHONY: pushenv ## push environments to dotenv vault
pushenv:
	npx dotenv-vault@latest push $(stage) -y


.PHONY: help  ## display this message
help:
	@grep -E \
		'^.PHONY: .*?## .*$$' $(MAKEFILE_LIST) | \
		sort | \
		awk 'BEGIN {FS = ".PHONY: |## "}; {printf "\033[36m%-19s\033[0m %s\n", $$2, $$3}'
