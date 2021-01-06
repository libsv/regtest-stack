const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors')

const mine = require('./api/mine')
const mineChainInfo = require('./api/mine-chain-info')
const chainInfo = require('./api/chain-info')

const DASH_PORT = process.env.DASH_PORT || 3000;
const sv = require('./settings')

const app = express();
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'dash' 
}));
app.set('view engine', '.hbs');
app
  .use(express.static('static'))
  .use(cors())

const formDataParser = bodyParser.urlencoded({ extended: true });

app.get('/', async (_, res) => {
  let [infoResult, tipResult] = await chainInfo();
  res.render('home', {
    data: infoResult.data.result,
    tip: tipResult.data.result
  });
});

app.post('/api/mine', bodyParser.json(), async (req, res) => {
  try {
    const blockNumber = req.body.n || 1
    if (blockNumber === 1) {
      const [infoResult, tipResult] = await mineChainInfo(blockNumber)
      res.status(201).json({
        data: infoResult.data.result,
        tip: tipResult.data.result
      })
    } else {
      const result = await mine(blockNumber)
      res.status(201).json(result.data.result)
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post('/mine', formDataParser, async (req, res) => {
  try {
    let rpcResult = await mine(req.body.blocks || 1);
    if (rpcResult.data.result.length === 1) {
      res.redirect('/');
    } else {
      res.render('mining', { ...rpcResult.data });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post('/reset', async (req, res) => {
  let block1 = null;
  try {
    let result = await axios.post(
      sv.url,
      {
        jsonrpc: "1.0",
        id: "dash",
        method: "getblockhash",
        params: [1]
      },
      {
        auth: {
          username: sv.user,
          password: sv.pass
        }
      }
    );
    if (result.data.error) {
      return res.status(500).send(result.data.error).end();
    }
    block1 = result.data.result;
  } catch (e) {
    return res.status(500).send(e).end();
  }
  let result = await axios.post(
    sv.url,
    {
      jsonrpc: "1.0",
      id: "dash",
      method: "invalidateblock",
      params: [block1]
    },
    {
      auth: {
        username: sv.user,
        password: sv.pass
      }
    }
  );
  if (result.data.error) {
    return res.status(500).send(result.data.error).end();
  }
  res.redirect('/');
});

app.get('/wallet', async (req, res) => {
// listunspent
  let result = await axios.post(
    sv.url,
    {
      jsonrpc: "1.0",
      id: "dash",
      method: "listunspent",
      params: [0]
    },
    {
      auth: {
        username: sv.user,
        password: sv.pass
      }
    }
  );
  if (result.data.error) {
    return res.status(500).send(result.data.error).end();
  }
  let unspent = result.data.result
    .filter(x => x.spendable)
    .map(x => {
      return {
        txid: x.txid,
        vout: x.vout,
        amount: x.amount
      }
    });
  unspent.sort((a, b) => b.amount - a.amount);
  let balance = unspent.reduce((x, utxo) => x + utxo.amount, 0);
  res.render('wallet', { unspent, balance });
});

function autoMine () {
  console.log('mining 1 block every 10 minutes')
  setInterval(async () => {
    await mine(1)
    console.log('mined 1 block')
  }, 10 * 60 * 1000)
}
 
app.listen(DASH_PORT, () => {
  console.log('listening on', DASH_PORT)
  autoMine()
});
