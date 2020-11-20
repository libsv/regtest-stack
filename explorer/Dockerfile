FROM node:10
EXPOSE 8080/tcp
RUN apt update \
 && apt install curl tar unzip -y \
 && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/whatsonchain/ \
 && curl -L "https://github.com/waqas64/woc-explorer/archive/master.zip" -o /opt/whatsonchain/woc.zip \
 && cd /opt/whatsonchain/ \
 && unzip woc.zip \
 && rm /opt/whatsonchain/woc.zip \
 && cd /opt/whatsonchain/woc-explorer-master \
 && npm install
COPY *.js /opt/whatsonchain/woc-explorer-master/app/
WORKDIR /opt/whatsonchain/woc-explorer-master
CMD ["npm", "start"]
