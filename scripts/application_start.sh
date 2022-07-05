#!/bin/bash

# Stop all servers and start the server
cd /home/ubuntu/npp-qna-server
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads 
pm2 stop npp-qna-server
pm2 start npm --name "npp-qna-server" -- start