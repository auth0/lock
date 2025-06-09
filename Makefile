#!/usr/bin/env make

# SHELL := /bin/bash
# .SHELLFLAGS = -ec

.PHONY: install lint test build publish

# Define a local cache directory for Puppeteer to avoid permission issues
PUPPETEER_CACHE_DIR := $(CURDIR)/.puppeteer-cache

install:
	@echo "Running install with Puppeteer cache dir: $(PUPPETEER_CACHE_DIR)"
	PUPPETEER_CACHE_DIR=$(PUPPETEER_CACHE_DIR) npm install

test:
	@echo "Running test..."
	npm run test

build:
	@echo "Running build..."
	rm -rf dist && rm -rf build && npm run build

publish:
	@echo "Running cdn-publish..."
	npm run publish:cdn
