function mineBlock() {
  return fetch('http://localhost:3010/api/mine', {
    method: 'POST',
  })
}

function mine() {
  return setInterval(() => {
    window.mineBlock()
  }, 60 * 100)
}

function init() {
  const miningButton = document.getElementById('mining-button')
  const start = "Start mining"
  const stop = "Stop mining"
  miningButton.onclick = (function (init) {
    let state = init
    let interval
    return function (event) {
      miningButton.querySelector('span').textContent = !state ? stop : start
      if (state) {
        clearInterval(interval)
      } else {
        interval = window.mine()
      }
        state = !state
        event.preventDefault()
    }
  }(false))
}

window.mine = mine
window.mineBlock = mineBlock
window.init = init