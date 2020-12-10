require('../mine')

jest.useFakeTimers()

const fetchMock = (url, config) => {
  return ({
    url, config
  })
}

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