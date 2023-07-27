const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'  
})

const fire = new Sprite({
    position: {
        x: 350,
        y: 422,
    },
    imageSrc: './img/fire_wood.png',
    scale: 2.5   
})

const flame = new Sprite({
    position: {
        x: 353,
        y: 328,
    },
    imageSrc: './img/fire_flame.png',
    scale: 2.5,
    framesMax: 19  
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0 
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Player1/idle.png',
    framesMax: 6,
    scale: 4.5,
    offset: {
        x: 0,
        y: 45
    },
    sprites : {
        idle : {
            imageSrc: './img/Player1/idle.png',
            framesMax: 6,
        },
        run : {
            imageSrc: './img/Player1/run.png',
            framesMax: 8,
        } 
    }

})

const enemy = new Fighter({
    position: {
    x: 400,
    y: 100 
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "green",
    offset: {
        x: -50,
        y: 0
    } 
})

enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }  
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    fire.update()
    flame.update()
    player.update()
    //enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    player.image = player.sprites.idle.image
    if (keys.a.pressed && player.lastKey === "a") {
       player.velocity.x = -5
       player.image = player.sprites.run.image
    }
    else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
    }
     else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
    }

    //detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + "%"
    }

    //end game on health 
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case "d":
        keys.d.pressed = true
        player.lastKey = "d"
        break
    case "a":
        keys.a.pressed = true
        player.lastKey = "a"
        break
    case "w":
        player.velocity.y = -20
        break
    case "s":
        player.attack()
        break

    case "ArrowRight":
        keys.ArrowRight.pressed = true
        enemy.lastKey = "ArrowRight"
        break
    case "ArrowLeft":
        keys.ArrowLeft.pressed = true
        enemy.lastKey = "ArrowLeft"
        break
    case "ArrowUp":
        enemy.velocity.y = -20
        break
    case "ArrowDown":
        enemy.attack()
        break          
  }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case "d":
          keys.d.pressed = false
          break
      case "a":
          keys.a.pressed = false
          break
      case "w":
          keys.w.pressed = false
          break          
    }

    //enemy keys
    switch (event.key) {
      case "ArrowRight":
          keys.ArrowRight.pressed = false
          break
      case "ArrowLeft":
          keys.ArrowLeft.pressed = false
          break      
    }
  })