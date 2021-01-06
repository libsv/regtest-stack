function mineBlock(n) {
  return fetch('http://localhost:3010/api/mine', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n: n || 2 })
  }).then(response => response.json())
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

window.mineBlock = mineBlock
window.setInfoTip = setInfoTip