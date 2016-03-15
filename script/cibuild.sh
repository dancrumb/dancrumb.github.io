#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build
bundle exec htmlproofer ./_site --empty-alt-ignore --allow-hash-href --disable-external      
