#!/bin/bash

if [ -z $1 ] ; then
  echo 'A directory path where the certificate and key are stored is required'
  exit 1
fi

docker run -d \
  -v $1:/etc/ssl \
  -p 1443:443 \
  -e DATABASE_URL=${DATABASE_URL} \
  aamadeo/pm-api:latest