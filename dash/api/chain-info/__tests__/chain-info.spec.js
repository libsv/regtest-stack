const axios = require('axios')
const chainInfo = require('..')
const { tip, height } = require('../../__stubs__')

jest.mock('axios')

describe('chainInfo', () => {
  test('should return tip and height', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve(tip))
    axios.post.mockImplementationOnce(() => Promise.resolve(height))
    const response = await chainInfo(1)
    expect(response).toEqual([tip, height])
  })

})