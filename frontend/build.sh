#!/bin/bash

npm run build
rm -r ../backend/wwwroot/*
mv build/* ../backend/wwwroot/