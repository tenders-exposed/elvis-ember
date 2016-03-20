#!/usr/bin/env sh

ssh -i config/id_rsa vu2003@strix.umbra.xyz mv elvis/htdocs elvis/htdocs-$(date +%s)
ssh -i config/id_rsa vu2003@strix.umbra.xyz mkdir elvis/htdocs
rsync -a -e 'ssh -i config/id_rsa' build/* vu2003@strix.umbra.xyz:/var/www/virtual/tenders.exposed/elvis/htdocs/
