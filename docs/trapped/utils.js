// const PI = Math.PI
// const TWO_PI = Math.PI * 2
// const HALF_PI = Math.PI/2
// const QUARTER_PI = Math.PI/4
// const min = Math.min
// const max = Math.max
// const sin = Math.sin
// const cos = Math.cos
// const abs = Math.abs
// const atan2 = Math.atan2
// const dist = (x1, y1, x2, y2) => Math.sqrt(Math.abs(x1 - x2)**2 + Math.abs(y1 - y2)**2)



// let __randomSeed = int(tokenData.hash.slice(50, 58), 16)
// function rnd(mn, mx) {
//   __randomSeed ^= __randomSeed << 13
//   __randomSeed ^= __randomSeed >> 17
//   __randomSeed ^= __randomSeed << 5
//   const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
//   if (mx != null) return mn + out * (mx - mn)
//   else if (mn != null) return out * mn
//   else return out
// }

function random(mn, mx) {
  const out = Math.random()
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

const int = parseInt
const rndint = (mn, mx) => int(random(mn, mx))
const prb = x => random() < x
const sample = (a) => a[int(random(a.length))]
const posOrNeg = () => prb(0.5) ? 1 : -1
const exists = x => !!x
const last = a => a[a.length-1]
const noop = () => {}
const iden = x => x

const deepEquals = (a, b) => (
  Object.keys(a).length === Object.keys(b).length
  && Object.keys(a).every(aKey => a[aKey] === b[aKey])
)

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

function chance(...chances) {
  const total = chances.reduce((t, c) => t + c[0], 0)
  const seed = random()
  let sum = 0
  for (let i = 0; i < chances.length; i++) {
    const val =
      chances[i][0] === true ? 1
      : chances[i][0] === false ? 0
      : chances[i][0]
    sum += val / total
    if (seed <= sum && chances[i][0]) return chances[i][1]
  }
}


function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  return setInterval(run, ms)
}


function ellipse(txt, len=25) {
  return txt.length >= len
    ? txt.slice(0, len-3) + '...'
    : txt
}


function waitPromise(ms) {
  return new Promise(res => setTimeout(res, ms))
}


const group = (nodesInput, props) => {
  return Object.keys(nodesInput).reduce((nodesOutput, nodeName) => {
    const node = nodesInput[nodeName]
    const newNode = Array.isArray(node)
      ? node.map(n => ({ ...props, ...n }))
      : { ...props, ...nodesInput[nodeName] }

    return ({
      ...nodesOutput,
      [nodeName]: newNode
    })
  }, {})
}

const options = mapping => ({ur}) => mapping[ur]


function hsvToRGB({h, s, v}) {
  h /= 60
  const c = (v/100) * (s/100)
  const x = c * (1 - Math.abs(h % 2 - 1))
  const m = (v/100) - c

  let r, g, b;
  switch (Math.floor(h)) {
    case 0:
    case 6:
      r = c; g = x; b = 0; break;
    case 1:
      r = x; g = c; b = 0; break;
    case 2:
      r = 0; g = c; b = x; break;
    case 3:
      r = 0; g = x; b = c; break;
    case 4:
      r = x; g = 0; b = c; break;
    case 5:
      r = c; g = 0; b = x; break;
  }


  const round = (n, decimals=0) => +n.toFixed(decimals)

  return '#' + numToHex((r + m) * 255) + numToHex((g + m) * 255) + numToHex((b + m) * 255)
}

function numToHex(num) {
  let hex = Math.round( Math.min(num, 255) ).toString(16)
  return (hex.length === 1 ? '0' + hex : hex).toUpperCase()
}


function formatTime(timeLeft) {
  const with0 = x => x < 10 ? '0' + Math.floor(x) : Math.floor(x)

  const hours = Math.abs(timeLeft) / (60*60*1000)
  const minutes = 60 * (hours%1)
  const seconds = Math.floor(60 * (minutes%1) + 0.000001)


  return `${with0(hours)}:${with0(minutes)}:${with0(seconds)}`
}

  function triggerTimer(endTimestamp, $elem1, cb) {

    return setRunInterval(() => {
      let timeLeftCounter = Math.max(endTimestamp - Date.now(), 0)
      const hours = timeLeftCounter / (60*60*1000)
      const minutes = 60 * (hours%1)
      const seconds = Math.floor(60 * (minutes%1))


      $elem1.innerHTML = `${with0(hours)}:${with0(minutes)}:${with0(seconds)}`

      if (timeLeftCounter <= 0) {
        timeLeftCounter = endTimestamp - Date.now()
      }

      if (cb) cb()

    }, 1000)
  }




// const lineStats = (x1, y1, x2, y2) => ({
//   d: dist(x1, y1, x2, y2),
//   angle: atan2(x2 - x1, y2 - y1)
// })

// function getXYRotation (deg, radius, cx=0, cy=0) {
//   return [
//     sin(deg) * radius + cx,
//     cos(deg) * radius + cy,
//   ]
// }

// const rndChar = () => sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))