// credits: https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

var width = window.innerWidth;
var height = 400;

var ASTEROID_TYPES = {
    small: {
        radius: 10
    },
    medium: {
        radius: 20
    },
    large: {
        radius: 30
    }
}

var state = {
    ship: {
        radius: 20,
        x: 0,
        y: 0,
        origo: {
            x: 20,
            y: 20
        },
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
    },
    asteroids: [{
        id: 1,
        radius: ASTEROID_TYPES.small.radius,
        x: 100,
        y: 100,
        origo: {
            x: 100 + ASTEROID_TYPES.small.radius,
            y: 100 + ASTEROID_TYPES.small.radius
        },
        movement: {
            x: 0.2,
            y: 0.1
        }
    }],
    collisions: []
}

function update(progress) {
    var p = progress / 16

    updateRotation(p)
    updateMovement(p)
    updatePosition(p)
    checkCollisions()
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
    const movingObjects = [
        state.ship,
        ...state.asteroids
    ]

    for (const object of movingObjects) {
        object.x += object.movement.x;
        object.y += object.movement.y;

        object.origo.x += object.movement.x;
        object.origo.y += object.movement.y;

        if (object.origo.x > width) {
            object.x -= width
            object.origo.x -= width
        }
        else if (object.origo.x < 0) {
            object.x += width
            object.origo.x += width
        }
        if (object.origo.y > height) {
            object.y -= height
            object.origo.y -= height
        }
        else if (object.origo.y < 0) {
            object.y += height
            object.origo.y += height
        }
    }

    document.getElementById('spaceship-x').innerText = state.ship.x.toFixed(2);
    document.getElementById('spaceship-y').innerText = state.ship.y.toFixed(2);
    document.getElementById('asteroid-x').innerText = state.asteroids[0].x.toFixed(2);
    document.getElementById('asteroid-y').innerText = state.asteroids[0].y.toFixed(2);

}

function checkCollisions() {
    for (const asteroid of state.asteroids) {
            const dx = state.ship.origo.x - asteroid.origo.x
            const dy = state.ship.origo.y - asteroid.origo.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < state.ship.radius + asteroid.radius) {
                state.collision = true
            }
            else {
                state.collision = false
            }
    }
}

var shipDomElement = document.getElementById('spaceship')
var asteroidDomElements = {
    1: document.getElementById('asteroid-1')
}

function draw() {
    shipDomElement.style.transform = `translate(${state.ship.x}px, ${state.ship.y}px) rotate(${state.ship.rotation}deg)`;
    document.getElementById('collision-status').innerText = state.collision.toString()

    for (const asteroid of state.asteroids) {
        const asteroidDomElement = asteroidDomElements[asteroid.id] || document.getElementById(`asteroid-${asteroid.id}`)
        asteroidDomElement.style.transform = `translate(${asteroid.x}px, ${asteroid.y}px)`
        if (!asteroidDomElements[asteroid.id]) {
            asteroidDomElements[asteroid.id] = asteroidDomElement
        }
    }

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

window.focus()