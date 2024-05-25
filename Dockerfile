FROM node:20.11.1-slim

WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD true
# RUN npm install -g npm@10.5.1
# RUN npm install -g @loopback/cli

RUN apt update -y && apt-get update && apt-get install -yq \
  wget
# RUN apt-get install -y chromium
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

CMD "tail" "-f" "/dev/null"
# CMD "yarn" "start"
