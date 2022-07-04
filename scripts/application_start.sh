#!/bin/bash

# Stop all servers and start the server
cd /home/ubuntu/npp-qna-server
echo $whoami
node -v
npm -v
pm2 stop npp-qna-server
pm2 start npm --name "npp-qna-server" -- start