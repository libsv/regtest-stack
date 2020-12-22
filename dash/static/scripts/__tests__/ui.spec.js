require('../mine')

jest.useFakeTimers()

const mockFetchResponse = {
  data: {
    balance: 100
  },
  tip: 'tipstring'
}

const fetchMock = () => Promise.resolve({
  json: () => mockFetchResponse
})

const start = 'Start mining'
const stop = 'Stop mining'

beforeAll(() => {
  miningButton = document.createElement('button')
  miningButton.id = 'mining-button'
  miningSpan = document.createElement('span')
  miningSpan.textContent = start
  miningButton.appendChild(miningSpan)
  document.body.appendChild(miningButton)  
  window.fetch = fetchMock
})

describe('mineBlock', () => {
  test('should return tip and height data', async () => {
    const result = await window.mineBlock()
    expect(result).toEqual(mockFetchResponse)
  })
})

describe('setInfoTip', () => {
  test('should not crash when tip element does not exist', () => {
    window.setInfoTip(mockFetchResponse)
    expect(document.getElementById('tip')).toBeFalsy()
  })

  test('should not crash when height element does not exist', () => {
    window.setInfoTip(mockFetchResponse)
    expect(document.getElementById('height')).toBeFalsy()
  })

  test('should set tip content', () => {
    tip = document.createElement('dd')
    tip.id = 'tip'
    document.body.appendChild(tip)
    const tipRef = document.getElementById('tip')
    expect(tipRef.textContent).toEqual('')
    window.setInfoTip(mockFetchResponse)
    expect(tipRef.textContent).toEqual(mockFetchResponse.tip)
  })

  test('should set height content', () => {
    height = document.createElement('dd')
    height.id = 'height'
    document.body.appendChild(height)
    const heightRef = document.getElementById('height')
    expect(heightRef.textContent).toEqual('')
    window.setInfoTip(mockFetchResponse)
    expect(heightRef.textContent).toEqual(String(mockFetchResponse.data.balance))
  })
})

describe('mining functions', () => {
  test('mine should call mineBlock', () => {
    const fetchSpy = jest.spyOn(window, 'fetch')
    const mineBlockSpy = jest.spyOn(window, 'mineBlock')
    const interval = mine()
    jest.runOnlyPendingTimers()

    expect(typeof interval).toEqual('number')
    expect(setInterval).toHaveBeenCalled()
    expect(fetchSpy).toHaveBeenCalled()
    expect(mineBlockSpy).toHaveBeenCalled()
  })
})

describe('button handler', () => {
  test('button init', () => {
    const mineSpy = jest.spyOn(window, 'mine')
    const buttonRef = document.getElementById('mining-button')
    expect(buttonRef.onclick).toBeNull()
    window.init()
    expect(typeof buttonRef.onclick).toEqual('function')
    expect(buttonRef.querySelector('span').textContent).toEqual(start)
    buttonRef.click()
    expect(buttonRef.querySelector('span').textContent).toEqual(stop)
    jest.runOnlyPendingTimers()
    expect(mineSpy).toHaveBeenCalled()
    buttonRef.click()
    expect(buttonRef.querySelector('span').textContent).toEqual(start)
  })
})