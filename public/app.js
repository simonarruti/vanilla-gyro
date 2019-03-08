const element = document.querySelector('.container')
element.style.backgroundPositionX = "0px"
element.style.backgroundPositionY = "0px"

const log = document.querySelector('#gyro_info')

const speed = 1.5

let lastX = 0
let lastY = 0
let lastStepX = 0
let lastStepY = 0
let orientations = {alpha: 0, beta: 0, gamma: 0}

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    // console.log(event)
    log.innerHTML = `<pre>
Alpha: ${event.alpha} <br>
Beta: ${event.beta} <br>
Gamma: ${event.gamma} <br>
</pre>`
    orientations.alpha = event.alpha
    orientations.beta = event.beta
    orientations.gamma = event.gamma
  }, true)
} else {
  console.log('Not supported')
}


// functions
function getStepX (lastXPosition, currentXPosition, lastStep) {
  if (lastXPosition === currentXPosition) {
    return lastStep
  } else {
    return currentXPosition - lastXPosition
  }
}

function getStepY (lastYPosition, currentYPosition, lastStep) {
  if (lastYPosition === currentYPosition) {
    return lastStep
  } else {
    return currentYPosition - lastYPosition
  }
  // return currentYPosition - lastYPosition
}

function getOrientations () {
  return orientations
}

function parsedBG (domElement, axe, intType, valueReplace = 'px') {
  if (intType === 'int') {
    return parseInt(domElement.style[`backgroundPosition${axe}`].replace(valueReplace, ''))
  } else if (intType === 'float') {
    return parseFloat(domElement.style[`backgroundPosition${axe}`].replace(valueReplace, ''))
  }
}

function refresh () {
  const o = getOrientations()
  const stepX = getStepX(lastX, o.alpha, lastStepX)
  const stepY = getStepY(lastY, o.beta, lastStepY)
  console.log(stepY)

  if ((parsedBG(element, 'X', 'int') > ((window.innerWidth - element.offsetWidth) / 2) && stepX < 0) || (parsedBG(element, 'X', 'int') < ((element.offsetWidth - window.innerWidth) / 2) && stepX > 0)) {
    element.style.backgroundPositionX = Math.round(parsedBG(element, 'X', 'float') + stepX) + 'px'

    lastX = o.alpha
    lastStepX = stepX
    // console.log('X', element.style.backgroundPositionX)
  }

  if ((parsedBG(element, 'Y', 'int') > ((window.innerHeight - element.offsetHeight) / 2) && stepY < 0) || (parsedBG(element, 'Y', 'int') < ((element.offsetHeight - window.innerHeight) / 2)) && stepY > 0) {
    element.style.backgroundPositionY = Math.round(parsedBG(element, 'Y', 'float') + stepY) + 'px'

    lastY = o.beta
    lastStepY = stepY
  }

  window.requestAnimationFrame(refresh)
}
window.requestAnimationFrame(refresh)
