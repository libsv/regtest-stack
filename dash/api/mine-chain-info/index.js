const mine = require('../mine')
const chainInfo = require('../chain-info')

module.exports = async blockCount => mine(blockCount).then(chainInfo)