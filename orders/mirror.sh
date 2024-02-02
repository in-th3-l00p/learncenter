#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

command=$1

../mirror.sh orders-service "$command"
