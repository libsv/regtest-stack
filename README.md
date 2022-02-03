# Regtest Stack

This repository contains `dockerfile`s and a `docker-compose` configuration to run the following:

* Bitcoin SV in `regtest` mode
* What's On Chain
* A custom web dashboard for controlling the mining operations of the Bitcoin SV node
* mAPI
* MinerId

## Getting Started

1. Clone this repository
2. Check and modify `docker-compose.yaml` to set the desired SV Node version (`services/sv/args/VERSION` element). Also check the `sv/build` script if you manually build just that image
3. `docker-compose up`

You can also run the system in daemon mode using `docker-compose up -d` and then use the [regtest script file](regtest.sh) to easily execute bitcoin RPC commands, for example:

```
❯ ./regtest.sh getinfo
{
  "version": 101000800,
  "protocolversion": 70015,
  "walletversion": 160300,
  "balance": 14937.48993463,
  "blocks": 11720,
  "timeoffset": 0,
  "connections": 0,
  "proxy": "",
  "difficulty": 4.656542373906925e-10,
  "testnet": false,
  "stn": false,
  "keypoololdest": 1642815292,
  "keypoolsize": 1999,
  "paytxfee": 0.00000000,
  "relayfee": 0.00000250,
  "errors": "",
  "maxblocksize": 2000000000,
  "maxminedblocksize": 512000000,
  "maxstackmemoryusagepolicy": 100000000,
  "maxstackmemoryusageconsensus": 200000000
}
```

## Services

The following services are available:

### SV Node RPC

Host: `localhost`  
Port: `8332`  
User: `rpc`  
Pass: `rpc`  

### SV Node P2P

Host: `localhost`  
Port: `8333`  

### SV Node ZeroMQ

Host: `localhost`  
Port: `28332`  

### MinerId

Host: `localhost`  
Port: `9012`  

[Miner ID reference](https://github.com/bitcoin-sv/minerid-reference) contains commands.

To create a MinerId, run:

```
npm run cli -- generateminerid --name testMiner
```

### mAPI

Host: `localhost`  
Port: `9014`  

The [API reference](https://github.com/bitcoin-sv/merchantapi-reference) has more information as well as the [swagger documentation](https://bitcoin-sv.github.io/merchantapi-reference).

### What's On Chain

URL: `http://localhost:8080`

### Mining Dashboard

URL: `http://localhost:3010`

## Updating SV Node Configuration

The file `sv/bitcoin.conf` is volume-mounted into the SV Node container during `docker-compose up`. Modify it as required, then restart the node with `docker-compose down` and `docker-compose up`.
