module.exports = {
  url: `http://${process.env.SV_HOST || 'localhost'}:${process.env.SV_PORT || 8332}`,
  user: process.env.SV_USER || 'rpc',
  pass: process.env.SV_PASSWORD || 'rpc'
}