# Include env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.DEFAULT_GOAL := all
MAKEFLAGS += --no-print-directory

# When --ci option is provided, Jest will assume it is running in a CI environment.
# This changes the behavior when a new snapshot is encountered. Instead of the regular behavior of storing a new snapshot automatically,
# it will fail the test and require Jest to be run with --updateSnapshot.
.PHONY: test ## run tests
test:
	npx jest --ci --verbose --coverage=false --passWithNoTests

.PHONY: testcov ## run test coverage
testcov:
	npx jest --ci --coverage --passWithNoTests | tee ./coverage.txt

.PHONY: install ## install dependencies
install:
	npm ci

.PHONY: lint ## lint standard js
lint:
	npx eslint "src/**/*.{js,jsx,ts,tsx}\""
