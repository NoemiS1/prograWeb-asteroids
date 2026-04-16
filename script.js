const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

let x = canvas.width / 2
let y = canvas.height / 2
let angle = 0
let keys = {}
let bullets = []
let vx = 0
let vy = 0
let asteroids = []

document.addEventListener('keydown', (e) => {
  keys[e.key] = true

  if (e.key === ' ') {
    shoot()
  }
})

document.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

function drawShip() {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  if (keys['ArrowUp']) {
    ctx.beginPath()
    ctx.moveTo(-10, 5)
    ctx.lineTo(-18, 0 + (Math.random() * 6 - 3))
    ctx.lineTo(-10, -5)
    ctx.strokeStyle = 'orange'
    ctx.stroke()
  }

  // nave
  ctx.beginPath()
  ctx.moveTo(15, 0)
  ctx.lineTo(-10, 10)
  ctx.lineTo(-10, -10)
  ctx.closePath()
  ctx.strokeStyle = 'white'
  ctx.stroke()

  ctx.restore()
}

function shoot() {
  bullets.push({
    x: x + Math.cos(angle) * 15,
    y: y + Math.sin(angle) * 15,
    angle: angle,
    speed: 6
  })
}

function drawBullets() {
  bullets.forEach((bullet) => {
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  })
}

function updateBullets() {
  bullets.forEach((bullet) => {
    bullet.x += Math.cos(bullet.angle) * bullet.speed
    bullet.y += Math.sin(bullet.angle) * bullet.speed
  })

  bullets = bullets.filter(
    (bullet) =>
      bullet.x >= 0 && bullet.x <= canvas.width && bullet.y >= 0 && bullet.y <= canvas.height
  )
}

function createAsteroid(x, y, size) {
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 1 + 0.3 // más lento

  const points = []
  const vertices = 8

  for (let i = 0; i < vertices; i++) {
    const ang = ((Math.PI * 2) / vertices) * i
    const radius = size + (Math.random() * 10 - 5) // irregularidad
    points.push({ angle: ang, radius: radius })
  }

  asteroids.push({
    x: x,
    y: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: size,
    shape: points
  })
}

function splitAsteroid(asteroid) {
  if (asteroid.size === 35) {
    createAsteroid(asteroid.x, asteroid.y, 20)
    createAsteroid(asteroid.x, asteroid.y, 20)
  } else if (asteroid.size === 20) {
    createAsteroid(asteroid.x, asteroid.y, 10)
    createAsteroid(asteroid.x, asteroid.y, 10)
  }
}

function update() {
  //rotacion
  if (keys['ArrowLeft']) angle -= 0.05
  if (keys['ArrowRight']) angle += 0.05

  //aceleracion
  if (keys['ArrowUp']) {
    vx += Math.cos(angle) * 0.1
    vy += Math.sin(angle) * 0.1
  }

  //limitar lavelocidad
  const maxSpeed = 5

  if (vx > maxSpeed) vx = maxSpeed
  if (vx < -maxSpeed) vx = -maxSpeed
  if (vy > maxSpeed) vy = maxSpeed
  if (vy < -maxSpeed) vy = -maxSpeed

  //aplicar movimiento
  x += vx
  y += vy

  // friccion ligera
  vx *= 0.99
  vy *= 0.99

  //wrap de pantalla
  if (x > canvas.width) x = 0
  if (x < 0) x = canvas.width
  if (y > canvas.height) y = 0
  if (y < 0) y = canvas.height

  updateBullets()
  updateAsteroids()
  checkBulletAsteroidCollisions()

  if (asteroids.length === 0) {
    for (let i = 0; i < 4; i++) {
      createAsteroid(Math.random() * canvas.width, Math.random() * canvas.height, 35)
    }
  }
}

function drawAsteroids() {
  asteroids.forEach((a) => {
    ctx.beginPath()

    a.shape.forEach((p, i) => {
      const px = a.x + Math.cos(p.angle) * p.radius
      const py = a.y + Math.sin(p.angle) * p.radius

      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    })

    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.stroke()
  })
}

function checkBulletAsteroidCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const dx = bullets[i].x - asteroids[j].x
      const dy = bullets[i].y - asteroids[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < asteroids[j].size) {
        splitAsteroid(asteroids[j])
        bullets.splice(i, 1)
        asteroids.splice(j, 1)
        break
      }
    }
  }
}

function updateAsteroids() {
  asteroids.forEach((a) => {
    a.x += a.vx
    a.y += a.vy

    // wrap de pantalla
    if (a.x > canvas.width) a.x = 0
    if (a.x < 0) a.x = canvas.width
    if (a.y > canvas.height) a.y = 0
    if (a.y < 0) a.y = canvas.height
  })
}

for (let i = 0; i < 4; i++) {
  createAsteroid(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    35 //para el tamaño grande
  )
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  update()
  drawShip()
  drawBullets()
  drawAsteroids()
  requestAnimationFrame(loop)
}

loop()
