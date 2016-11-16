#!/bin/bash

script_dir=$(dirname $0)
base_dir=$(cd ${script_dir}/..; pwd)

docker run -d \
    -v ${base_dir}/mongo:/data/db \
    -v ${base_dir}:/app \
    -p 127.0.0.1:14567:4567 \
    walter \
    bash /app/bin/_docker-main.sh
