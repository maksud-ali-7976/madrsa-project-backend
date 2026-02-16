#!/bin/bash

echo "Starting deployment..."
sudo -u root whoami
sudo -u root su
# Reload the application using pm2
sudo -u root /root/.bun/bin/pm2 restart ecosystem.config.js
echo "Deployment completed successfully."