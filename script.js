const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

let x = canvas.width / 2
let y = canvas.height / 2
let angle = 0
let keys = {}

document.addEventListener('keydown', (e) => (keys[e.key] = true))
document.addEventListener('keyup', (e) => (keys[e.key] = false))

function drawShip() {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.beginPath()
  ctx.moveTo(15, 0)
  ctx.lineTo(-10, 10)
  ctx.lineTo(-10, -10)
  ctx.closePath()
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.restore()
}

function update() {
  if (keys['ArrowLeft']) angle -= 0.05
  if (keys['ArrowRight']) angle += 0.05
  if (keys['ArrowUp']) {
    x += Math.cos(angle) * 3
    y += Math.sin(angle) * 3
  }
  // Mantener nave dentro del canvas
  if (x > canvas.width) x = 0
  if (x < 0) x = canvas.width
  if (y > canvas.height) y = 0
  if (y < 0) y = canvas.height
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  update()
  drawShip()
  requestAnimationFrame(loop)
}

loop()
