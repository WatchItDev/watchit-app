# Include env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.DEFAULT_GOAL := all
MAKEFLAGS += --no-print-directory

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
	npx jest --ci --coverage | tee ./coverage.txt

.PHONY: clean ## clean installation and dist files
clean:
	rm -rf coverage
	rm -rf dist
	rm -rf out
	rm -rf node_modules
	npm cache clean -f

.PHONY: install ## install dependencies
install:
	npm ci 

.PHONY: lint ## lint standard js
lint:
	npx standard "src/{main,render}/**/*.{js,jsx}" $(filter-out $@,$(MAKECMDGOALS))

.PHONY: format ## auto-format js source files
format:
	@$(MAKE) lint -- --fix

.PHONY: runweb ## run dev mode
runweb:
	npx vite

.PHONY: runelectron ## run electron dev mode
runelectron:
	npx electron-vite

.PHONY: buildweb ## build web app
buildweb:
	npx vite build
	
.PHONY: buildelectron ## build app
buildelectron:
	npx electron-vite build

.PHONY: buildicons ## generate a new icon bundle from tpl1024
buildicons: 
	npx electron-icon-maker --input ./tpl1024.png --output ./icons


.PHONY: package ## generate a new electron package
package: buildelectron
	npx electron-builder build $(filter-out $@,$(MAKECMDGOALS))

.PHONY: packagemac ## generate a new electron mac package
packagemac:
	@$(MAKE) package -- --mac $(filter-out $@,$(MAKECMDGOALS))

.PHONY: packagelinux ## generate a new electron linux package
packagelinux:
	@$(MAKE) package -- --linux $(filter-out $@,$(MAKECMDGOALS))

.PHONY: packagewin ## generate a new electron win package
packagewin:
	@$(MAKE) package -- --win --x64 --ia32 $(filter-out $@,$(MAKECMDGOALS))

.PHONY: publishmac ## publish a new electron mac package
publishmac:
	@$(MAKE) packagemac -- --publish always

.PHONY: publishlinux ## publish a new electron linux package
publishlinux:
	@$(MAKE) packagelinux -- --publish always

.PHONY: publishwin ## publish a new electron win package
publishwin:
	@$(MAKE) packagewin -- --publish always

.PHONY: release ## generate a new release version
release:
	npx standard-version

.PHONY: syncenv ## pull environments to dotenv vault
syncenv:
	npx dotenv-vault@latest pull $(stage) -y

.PHONY: pushenv ## push environments to dotenv vault
pushenv:
	npx dotenv-vault@latest push $(stage) -y

rebuild: clean 
all: publish-win publish-mac publish-linux

.PHONY: help  ## display this message
help:
	@grep -E \
		'^.PHONY: .*?## .*$$' $(MAKEFILE_LIST) | \
		sort | \
		awk 'BEGIN {FS = ".PHONY: |## "}; {printf "\033[36m%-19s\033[0m %s\n", $$2, $$3}'

# Prevent Make from trying to interpret `--` as a target
%:
	@:
