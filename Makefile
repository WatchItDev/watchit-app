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
	rm -rf node_modules
	npm cache clean -f
	npm install --legacy-peer-deps

.PHONY: lint ## lint standard js
lint:
	npx standard "src/{main,render}/**/*.{js,jsx}" $(filter-out $@,$(MAKECMDGOALS))

.PHONY: format ## auto-format js source files
format:
	@$(MAKE) lint -- --fix

.PHONY: run-web ## run dev mode
run-web:
	npx vite

.PHONY: run-electron ## run electron dev mode
run-electron:
	npx electron-vite

.PHONY: build-web ## build web app
build-web:
	npx vite build
	
.PHONY: build-electron ## build app
build-electron:
	npx electron-vite build
	
.PHONY: preview-web ## preview app
preview-web: 
	npx vite preview --host

.PHONY: release ## generate a new release version
release:
	npx standard-version

.PHONY: package ## generate a new electron package
package: build-electron
	npx electron-builder build $(filter-out $@,$(MAKECMDGOALS))

.PHONY: package-mac ## generate a new electron mac package
package-mac:
	@$(MAKE) package -- --mac $(filter-out $@,$(MAKECMDGOALS))

.PHONY: package-linux ## generate a new electron linux package
package-linux:
	@$(MAKE) package -- --linux $(filter-out $@,$(MAKECMDGOALS))

.PHONY: package-win ## generate a new electron win package
package-win:
	@$(MAKE) package -- --win --x64 --ia32 $(filter-out $@,$(MAKECMDGOALS))

.PHONY: publish-mac ## publish a new electron mac package
publish-mac:
	@$(MAKE) package-mac -- --publish always

.PHONY: publish-linux ## publish a new electron linux package
publish-linux:
	@$(MAKE) package-linux -- --publish always

.PHONY: publish-win ## publish a new electron win package
publish-win:
	@$(MAKE) package-win -- --publish always

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
