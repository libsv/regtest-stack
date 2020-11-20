const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const axios = require('axios');

const DASH_PORT = process.env.DASH_PORT || 3000;
const sv = {
  url: `http://${process.env.SV_HOST || 'localhost'}:${process.env.SV_PORT || 8332}`,
  user: process.env.SV_USER || 'rpc',
  pass: process.env.SV_PASSWORD || 'rpc'
};

const app = express();
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'dash' 
}));
app.set('view engine', '.hbs');
app.use(express.static('static'));
const formDataParser = bodyParser.urlencoded({ extended: false });
 
app.get('/', async (req, res) => {
  let infoResult = await axios.post(
    sv.url,
    {
      jsonrpc: "1.0",
      id: "dash",
      method: "getinfo",
      params: []
    },
    {
      auth: {
        username: sv.user,
        password: sv.pass
      }
    }
  );
  let tipResult = await axios.post(
    sv.url,
    {
      jsonrpc: "1.0",
      id: "dash",
      method: "getbestblockhash",
      params: []
    },
    {
      auth: {
        username: sv.user,
        password: sv.pass
      }
    }
  );
  res.render('home', {
    data: infoResult.data.result,
    tip: tipResult.data.result
  });
});

const mine = async blockCount => {
  console.log('mining', blockCount, 'blocks');
  return await axios.post(
    sv.url,
    {
      jsonrpc: "1.0",
      id: "dash",
      method: "generate",
      params: [+blockCount]
    },
    {
      auth: {
        username: sv.user,
        password: sv.pass
      }
    }
  );
};

app.post('/api/mine', bodyParser.json(), async (req, res) => {
  try {
    await mine(req.body.number || 1);
    res.sendStatus(201);
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
 
app.listen(DASH_PORT, () => console.log('listening on', DASH_PORT));
