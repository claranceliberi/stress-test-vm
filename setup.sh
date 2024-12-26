#!/bin/bash

# Check NVM
if ! command -v nvm &> /dev/null; then
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node 20
nvm install 20
nvm use 20

# Initialize npm project if package.json doesn't exist
if [ ! -f "package.json" ]; then
   npm init -y
fi

# Install dependencies
npm install express cors crypto

# Run server
node server.js
