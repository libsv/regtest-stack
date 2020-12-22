function mineBlock(n) {
  return fetch('http://localhost:3010/api/mine', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n: n || 2 })
  }).then(response => response.json())
}

function mine(updateDom) {
  return setInterval(async () => {
    updateDom(await window.mineBlock(1))
  }, 10 * 60 * 1000)
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
        interval = window.mine(window.setInfoTip)
      }
      state = !state
      event.preventDefault()
    }
  }(false))
}

function setInfoTip(data) {
  const tip = document.getElementById('tip')
  const height = document.getElementById('height')
  if (tip && data.tip) {
    tip.textContent = data.tip
  }
  if (height && data.data && data.data.balance) {
    height.textContent = data.data.balance
  }
}

window.mine = mine
window.mineBlock = mineBlock
window.init = init
window.setInfoTip = setInfoTip