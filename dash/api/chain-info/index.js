const axios = require('axios')
const sv = require('../../settings')

module.exports = () => Promise.all([
  axios.post(
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
  ), axios.post(
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
  )
])