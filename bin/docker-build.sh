#!/bin/bash

script_dir=`dirname $0`
docker_dir=${script_dir}/../docker

docker build -t walter ${docker_dir}
