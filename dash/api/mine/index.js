const axios = require('axios')
const sv = require('../../settings')

module.exports = async blockCount => axios.post(
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
)