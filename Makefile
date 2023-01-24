#!/usr/bin/env make

#SHELL := /bin/bash
#.SHELLFLAGS = -ec

.PHONY: install lint test build cdn-publish

install:
	@echo "Running install..."
	yarn install

test:
	@echo "Running test..."
	yarn test

build:
	@echo "Running build..."
	rm -rf dist && rm -rf build && yarn dist build

publish:
	@echo "Running cdn-publish..."
	yarn publish:cdn