#!/usr/bin/env make

#SHELL := /bin/bash
#.SHELLFLAGS = -ec

.PHONY: install lint test build cdn-publish

install:
	@echo "Running install..."
	npm install

test:
	@echo "Running test..."
	npm run test

build:
	@echo "Running build..."
	rm -rf dist && rm -rf build && npm run build

publish:
	@echo "Running cdn-publish..."
	npm run publish:cdn