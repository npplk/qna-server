#!/bin/bash
# Stop all servers and start the server
forever stopall
forever start /home/ubuntu/npp-qna-server/app.js