#!/usr/bin/env make

.PHONY: install lint test build cdn-publish

# Puppeteer and config/cache directories
PUPPETEER_CACHE_DIR := $(CURDIR)/.puppeteer-cache
XDG_CONFIG_HOME := $(WORKSPACE)@tmp/.chromium
XDG_CACHE_HOME := $(WORKSPACE)@tmp/.chromium

install:
	mkdir -p $(PUPPETEER_CACHE_DIR)
	mkdir -p $(XDG_CONFIG_HOME)
	mkdir -p $(XDG_CACHE_HOME)
	XDG_CONFIG_HOME=$(XDG_CONFIG_HOME) \
	XDG_CACHE_HOME=$(XDG_CACHE_HOME) \
	PUPPETEER_CACHE_DIR=$(PUPPETEER_CACHE_DIR) \
	npm install

test:
	npm run test

build:
	rm -rf dist && rm -rf build && npm run build

cdn-publish:
	npm run publish:cdn
