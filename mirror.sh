#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <docker-compose-service> <command>"
    exit 1
fi
service=$1
command=$2

$command

docker-compose exec $service $command
docker-compose restart $service