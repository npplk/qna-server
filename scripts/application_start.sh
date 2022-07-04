#!/bin/bash

# Stop all servers and start the server
cd /home/ubuntu/npp-qna-server
pm2 stop npp-qna-server
pm2 start npm --name "npp-qna-server" -- start