import {persist} from './persist.js'

export const flightMap = persist('__STAIRWAY_GAME', {
  lastFlight: null
})


if (flightMap.lastFlight === null) {
  let currentFlight = 0
  times(20, i => {
    const nextFlight = selectFlight()
    flightMap[currentFlight] = nextFlight
    currentFlight = nextFlight

    if (i === 19) flightMap.lastFlight = nextFlight

  })
}

function selectFlight() {
  const f = rndint(-120, 120)
  if (f === 0 || flightMap[f]) {
    return selectFlight()
  } else {
    return f
  }
}
