const axios = require('axios')
const mine = require('..')
const { mineResponse } = require('../../__stubs__')

jest.mock('axios')

describe('mine', () => {
  test('should successfully mine 1 block', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: {
        result: mineResponse
      }
    }))
    const result = await mine(1)
    expect(result.data.result.length).toEqual(1)
  })

  test('should successfully mine 1 block', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({
      data: {
        result: [mineResponse, mineResponse]
      }
    }))
    const result = await mine(2)
    expect(result.data.result.length).toEqual(2)
  })
})