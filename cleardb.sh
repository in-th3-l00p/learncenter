#!/bin/bash

services=("auth" "orders" "institutions")
for service in "${services[@]}"
do
  docker-compose stop $service-service
  docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS $service"
  cd $service || exit
  npx prisma db push
  docker-compose exec $service-service npx prisma generate
  npx prisma generate
  cd ..
  docker-compose restart $service-service
done