const axios = require('axios')
const mineResponse = require('..')
const { tip, height } = require('../../__stubs__')

jest.mock('axios')

describe('mineResponse', () => {
  test('should mine 1 block and return tip and height', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({}))
    axios.post.mockImplementationOnce(() => Promise.resolve(tip))
    axios.post.mockImplementationOnce(() => Promise.resolve(height))
    const response = await mineResponse(1)
    expect(response).toEqual([tip, height])
  })

})