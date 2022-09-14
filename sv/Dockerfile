FROM ubuntu:18.04
ARG VERSION
ENV VERSION=$VERSION
RUN apt update \
  && apt install wget tar libatomic1 -y \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /opt/bitcoin-sv/ \
  && cd /opt/bitcoin-sv \
  && wget -O /opt/bitcoin-sv/bsv.tar.gz "https://download.bitcoinsv.io/bitcoinsv/1.0.11/bitcoin-sv-1.0.11-x86_64-linux-gnu.tar.gz" \
  && tar -xvzf /opt/bitcoin-sv/bsv.tar.gz \
  && rm /opt/bitcoin-sv/bsv.tar.gz
EXPOSE 8332/tcp
EXPOSE 8333/tcp
EXPOSE 28332/tcp
WORKDIR /opt/bitcoin-sv/bitcoin-sv-$VERSION
VOLUME /root/.bitcoin/bitcoin.conf
CMD ./bin/bitcoind

