#!/usr/bin/env make

# SHELL := /bin/bash
# .SHELLFLAGS = -ec

.PHONY: install lint test build cdn-publish

# Puppeteer and config/cache directories
PUPPETEER_CACHE_DIR := $(CURDIR)/.puppeteer-cache
XDG_CONFIG_HOME := $(WORKSPACE)@tmp/.chromium
XDG_CACHE_HOME := $(WORKSPACE)@tmp/.chromium

install:
	@echo "Running install..."
	mkdir -p $(PUPPETEER_CACHE_DIR)
	mkdir -p $(XDG_CONFIG_HOME)
	mkdir -p $(XDG_CACHE_HOME)
	XDG_CONFIG_HOME=$(XDG_CONFIG_HOME) \
	XDG_CACHE_HOME=$(XDG_CACHE_HOME) \
	PUPPETEER_CACHE_DIR=$(PUPPETEER_CACHE_DIR) \
	PUPPETEER_SKIP_DOWNLOAD=true \
	npm install

test:
	@echo "Running test..."
	npm run test

build:
	@echo "Running build..."
	rm -rf dist && rm -rf build && npm run build

cdn-publish:
	@echo "Running cdn-publish..."
	npm run publish:cdn
