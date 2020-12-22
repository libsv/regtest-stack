const axios = require('axios')
const mineChainInfo = require('..')
const { tip, height } = require('../../__stubs__')

jest.mock('axios')

describe('mineChainInfo', () => {
  test('should mine 1 block and return tip and height', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({}))
    axios.post.mockImplementationOnce(() => Promise.resolve(tip))
    axios.post.mockImplementationOnce(() => Promise.resolve(height))
    const response = await mineChainInfo(1)
    expect(response).toEqual([tip, height])
  })

})