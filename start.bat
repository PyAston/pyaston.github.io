@echo off
rem Start jekyll serve
if exist _site rd /q /s _site
bundle exec jekyll serve --trace
pause