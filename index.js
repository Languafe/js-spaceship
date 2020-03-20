// credits: https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

var width = window.innerWidth;
var height = 400;

var state = {
    ship: {
        x: width / 2,
        y: height / 2,
        movement: {
            x: 0,
            y: 0
        },
        rotation: 0
    },
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

function update(progress) {
    var p = progress / 16

    updateRotation(p)
    updateMovement(p)
    updatePosition(p)
}

function updateRotation(p) {
    if (state.pressedKeys.left) {
        state.ship.rotation -= p * 5
    }
    else if (state.pressedKeys.right) {
        state.ship.rotation += p * 5
    }
}

function updateMovement(p) {
    // https://en.wikipedia.org/wiki/Radian#Conversion_between_radians_and_degrees
    
    var accelerationVector = {
        x: p * .3 * Math.cos((state.ship.rotation-90) * (Math.PI/180)),
        y: p * .3 * Math.sin((state.ship.rotation-90) * (Math.PI/180))
    }

    const MAX_MOVEMENT_SPEED = 40

    if (state.pressedKeys.up) {
        state.ship.movement.x += accelerationVector.x,
        state.ship.movement.y += accelerationVector.y
    }
    else if (state.pressedKeys.down) {
        state.ship.movement.x -= accelerationVector.x,
        state.ship.movement.y -= accelerationVector.y
    }

    state.ship.movement.x *= 0.99
    state.ship.movement.y *= 0.99

    // Limit movement speed
    if (state.ship.movement.x > MAX_MOVEMENT_SPEED) {
        state.ship.movement.x = MAX_MOVEMENT_SPEED
    }
    else if (state.ship.movement.x < -MAX_MOVEMENT_SPEED) {
        state.ship.movement.x = -MAX_MOVEMENT_SPEED
    }
    if (state.ship.movement.y > MAX_MOVEMENT_SPEED) {
        state.ship.movement.y = MAX_MOVEMENT_SPEED
    }
    else if (state.ship.movement.y < -MAX_MOVEMENT_SPEED) {
        state.ship.movement.y = -MAX_MOVEMENT_SPEED
    }
}

function updatePosition(p) {
    state.ship.x += state.ship.movement.x
    state.ship.y += state.ship.movement.y

    if (state.ship.x > width) {
        state.ship.x -= width
    }
    else if (state.ship.x < 0) {
        state.ship.x += width
    }
    if (state.ship.y > height) {
        state.ship.y -= height
    }
    else if (state.ship.y < 0) {
        state.ship.y += height
    }
}

var shipDomElement = document.getElementById('spaceship')

function draw() {
    shipDomElement.style.transform = `translate(${state.ship.x}px, ${state.ship.y}px) rotate(${state.ship.rotation}deg)`;
}

function loop(timestamp) {
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

var lastRender = 0;
window.requestAnimationFrame(loop)

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down'
  }

function handlekeydown(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}

function handlekeyup(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

window.addEventListener('keydown', handlekeydown, false)
window.addEventListener('keyup', handlekeyup, false)