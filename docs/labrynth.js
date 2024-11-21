
const pen = {
  black: '#000',
  white: '#fff',
  red: '#e21432',
  orange: '#ff6d07',
  yellow: '#fdb603',
  lime: '#81c616',
  green: '#047b41',
  teal: '#00b1d3',
  blue: '#0303a7',
  purple: '#8729cc',
  magenta: '#d31479',
  pink: '#f92c88',
}

function penName(stroke, strokeWidth) {
  return (Object.keys(pen).find(c => stroke === pen[c]) || stroke) + '-' + Math.round(strokeWidth)
}


const __ns = 'http://www.w3.org/2000/svg'

class SVG {
  constructor(w, h, id = 'svg') {
    this.w = w
    this.h = h
    this.layers = {}
    this.svg = document.createElementNS(__ns, 'svg')
    this.svg.setAttribute('id', id)
    this.svg.setAttribute('viewBox', '0 0 ' + this. w + ' ' + this. h)
  }

  mount(mountTo=document.body) {
    Object
    .keys(this.layers)
    .sort((a, b) => a.includes('none') ? -1 : 1)
    .forEach(layerKey => {
      const g = this.drawG(this.layers[layerKey])
      if (!layerKey.includes('none')) g.setAttribute('id', layerKey)

    })
    mountTo.appendChild(this.svg)
  }

  addToLayer(el, stroke, strokeWidth, keyOverride=null) {
    const key = keyOverride || (
      stroke === 'none'
        ? 'none'
        : penName(stroke, strokeWidth)
    )
    if (this.layers[key]) this.layers[key].push(el)
    else this.layers[key] = [el]

  }

  appendChild(n) {
    this.svg.appendChild(n)
  }

  drawG(children) {
    const g = document.createElementNS(__ns, 'g')
    children.forEach(c => g.appendChild(c))
    this.svg.appendChild(g)

    return g
  }

  drawLine(x1, y1, x2, y2, args={}) {
    const strokeWidth = args.strokeWidth || 4
    const stroke = args.stroke || pen.black
    const opacity = args.opacity || 1
    const lineCap = args.lineCap || 'round'
    const dasharray = args.dasharray || 1

    const line = document.createElementNS(__ns, 'line')

    line.setAttribute('fill', 'none')
    line.setAttribute('stroke', stroke)
    line.setAttribute('stroke-linecap', lineCap)
    line.setAttribute('stroke-width', `${strokeWidth}px`)
    line.setAttribute('stroke-opacity', opacity)
    line.setAttribute('stroke-dasharray', dasharray)
    line.setAttribute('x1', x1)
    line.setAttribute('x2', x2)
    line.setAttribute('y1', y1)
    line.setAttribute('y2', y2)
    this.addToLayer(line, stroke, strokeWidth*2/3, args.opacity ? 'invisible' : undefined)
    return line
  }


  css(style) {
    const s = document.createElement('style')
    s.innerHTML = style
    this.svg.appendChild(s)
  }


  drawPath(x, y, d, args={}) {
    const isLetter = args.isLetter || false
    const fill = args.fill || 'none'
    const fillOpacity = args.fillOpacity || 0.65
    // const size = args.size || 1.5
    const stroke = args.stroke || pen.black
    const rotation = args.rotation || 0
    const strokeWidth = args.strokeWidth || 3 * 1.5/size
    const className = args.className || ''
    // const ignoreMount = args.ignoreMount || false
    const gClass = args.gClass || ''
    const gStyle = args.gStyle || ''
    const strokeOpacity = args.strokeOpacity || ''
    let path = document.createElementNS(__ns, 'path')

    path.setAttribute('stroke-opacity', strokeOpacity)
    path.setAttribute('fill', fill)
    path.setAttribute('fill-opacity', fillOpacity)
    path.setAttribute('stroke', stroke)
    path.setAttribute('stroke-linecap', `round`)
    path.setAttribute('stroke-linejoin', `round`)
    path.setAttribute('stroke-width', `${strokeWidth}px`)
    path.setAttribute('class', className)

    path.setAttribute('d', d)

    return path
  }
}


const SIZE = 2800

function storeLine(grid, x1, y1, x2, y2, metadata={}) {
  if (
    grid[x2][y2].length &&
    grid[x2][y2][0].x2 === x1 &&
    grid[x2][y2][0].y2 === y1
  ) return

  grid[x1][y1].push({ x1, y1, x2, y2, metadata })
}


function drawDivisorLine(grid, GRID_SIZE, xStart, yStart, i) {
  let x1 = xStart
  let y1 = yStart
  let progress = true
  let originX, originY

  while (progress) {
    const surroundingPoints = []
    if (x1 > 0) {
      surroundingPoints.push(
        { x: x1-1, y: y1, existing: !!grid[x1-1][y1].length}
      )
    }
    if (x1 < GRID_SIZE) {
      surroundingPoints.push(
        { x: x1+1, y: y1, existing: !!grid[x1+1][y1].length}
      )
    }
    if (y1 > 0) {
      surroundingPoints.push(
        { x: x1, y: y1-1, existing: !!grid[x1][y1-1].length}
      )
    }
    if (y1 < GRID_SIZE) {
      surroundingPoints.push(
        { x: x1, y: y1+1, existing: !!grid[x1][y1+1].length}
      )
    }

    const validPoints = surroundingPoints.filter(p => !(p.x === originX && p.y === originY))

    if (validPoints.some(p => !p.existing)) {
      const {x, y} = sample(validPoints.filter(p => !p.existing))

      storeLine(grid, x1, y1, x, y, {divisor: true, line: i})

      ;([originX, originY] = [x1, y1])
      ;([x1, y1] = [x, y])

    } else {
      if (!originX && !originY) return

      const edgePoint = chance(

        ...validPoints.filter(
          p =>
            p.x === 0 ||
            p.x === GRID_SIZE ||
            p.y === 0 ||
            p.y === GRID_SIZE
        )
      )


      const sampledValidPoint = sample(validPoints)
      const { x, y } = edgePoint || sampledValidPoint

      storeLine(grid, x1, y1, x, y, {end: true, divisor: true, line: i})

      progress = false
    }
  }
}


export function drawLabrynth(tokenData, mountTo) {

  console.log(tokenData)
  let __randomSeed = int(tokenData.hash.slice(50, 58), 16)
  function rnd(mn, mx) {
    __randomSeed ^= __randomSeed << 13
    __randomSeed ^= __randomSeed >> 17
    __randomSeed ^= __randomSeed << 5
    const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
    if (mx != null) return mn + out * (mx - mn)
    else if (mn != null) return out * mn
    else return out
  }

  const rndint = (mn, mx) => int(rnd(mn, mx))
  const prb = x => rnd() < x
  const sample = (a) => a[int(rnd(a.length))]

  function chance(...chances) {
    const total = chances.reduce((t, c) => t + c[0], 0)
    const seed = rnd()
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

  const GRID_SIZE = rndint(5, 26)
  const FILLER_RINGS = chance(
    [5, 0],
    [5, 1],
    [70, 2],
    [15, 3],
    [5, 4]
  )


  const thickProb =
    GRID_SIZE > 9 ? 0.25 :
    GRID_SIZE < 7 ? 1 :
    0.5

  const STROKE_WIDTH = prb(thickProb) ? 'thick' : 'normal'
  const STROKE_WIDTH_1 = 8
  const STROKE_WIDTH_2 = STROKE_WIDTH === 'thick' ? 8 : 5
  const HIDE_DIVISOR_LINE = FILLER_RINGS ? prb(0.25) : false

  const DENSE = prb(0.875)


  const COLOR_COUNT = chance(
    [1, 1],
    [5, 2],
    [4, 3],
  )


  const DARK_COLOR_SCHEME = prb(0.5)

  let BG_COLOR
  let COLOR_PALETTE
  if (DARK_COLOR_SCHEME) {
    BG_COLOR = '#000'
    COLOR_PALETTE = [
      pen.white,
      pen.red,
      pen.yellow,
      pen.teal,
      pen.orange,
      pen.magenta,
      pen.lime,
    ]
  } else {
    BG_COLOR = '#fff'
    COLOR_PALETTE = [
      pen.black,
      pen.blue,
      pen.red,
      pen.purple,
    ]
  }


  const DIVISOR_STROKE_COLOR = sample(COLOR_PALETTE)
  const FILLER_STROKE_COLOR = COLOR_COUNT === 1 || HIDE_DIVISOR_LINE
    ? DIVISOR_STROKE_COLOR
    : sample(COLOR_PALETTE)

  const FILLER_STROKE_ALT_COLOR = COLOR_COUNT < 3
    ? sample([DIVISOR_STROKE_COLOR, FILLER_STROKE_COLOR])
    : sample(COLOR_PALETTE)



  const FILLER_SPACING = rnd(0.125, 0.2) * (2 / (FILLER_RINGS||1))
  const PADDING = (FILLER_RINGS+1)*FILLER_SPACING*SIZE/GRID_SIZE
  let LINE_COUNT = GRID_SIZE

  const svg = new SVG(SIZE + PADDING*2, SIZE + PADDING*2)
  svg.svg.style.background = BG_COLOR




  const toCoord = p => (p * SIZE / GRID_SIZE) + PADDING


  const grid = times(GRID_SIZE + 1, x => times(GRID_SIZE + 1, y => []))


  times(GRID_SIZE, x => storeLine(grid, x, 0, x+1, 0, {edge: true}))
  times(GRID_SIZE, y => storeLine(grid, GRID_SIZE, y, GRID_SIZE, y+1, {edge: true}))
  times(GRID_SIZE, x => storeLine(grid, GRID_SIZE - x, GRID_SIZE, GRID_SIZE - (x+1), GRID_SIZE, {edge: true}))
  times(GRID_SIZE, y => storeLine(grid, 0, GRID_SIZE - y, 0, GRID_SIZE - (y+1), {edge: true}))




  times(GRID_SIZE, i => {
    const s1 = prb(0.5) ? 0 : GRID_SIZE
    const s2 = rndint(1, GRID_SIZE-1)

    const [xStart, yStart] = prb(0.5) ? [s1, s2] : [s2, s1]
    drawDivisorLine(grid, GRID_SIZE, xStart, yStart, i)
  })

  if (DENSE) {
    times(GRID_SIZE, x => drawDivisorLine(grid, GRID_SIZE, x, 0, LINE_COUNT++))
    times(GRID_SIZE, y => drawDivisorLine(grid, GRID_SIZE, GRID_SIZE, y, LINE_COUNT++))
    times(GRID_SIZE, x => drawDivisorLine(grid, GRID_SIZE, GRID_SIZE - x, GRID_SIZE, LINE_COUNT++))
    times(GRID_SIZE, y => drawDivisorLine(grid, GRID_SIZE, 0, GRID_SIZE - y, LINE_COUNT++))
  }


  const lineList = grid.flat().filter(a => !(Array.isArray(a) && a.length === 0)).flat()
  const points = times(GRID_SIZE + 1, x => times(GRID_SIZE + 1, y => ({})))


  lineList.forEach(l => {
    if (l.x1 < l.x2) {
      points[l.x1][l.y1].r = true
      points[l.x2][l.y2].l = true
    }
    if (l.x1 > l.x2) {
      points[l.x1][l.y1].l = true
      points[l.x2][l.y2].r = true
    }

    if (l.y1 < l.y2) {
      points[l.x1][l.y1].d = true
      points[l.x2][l.y2].u = true
    }
    if (l.y1 > l.y2) {
      points[l.x1][l.y1].u = true
      points[l.x2][l.y2].d = true
    }
  })


  function drawInnerBorders(spacing, args1, args2) {
    times(GRID_SIZE + 1, x =>
      times(GRID_SIZE + 1, y => {
        if (points[x][y].r) {
          let xStartB, xEndB, xStartT, xEndT

          if (points[x][y].d) {
            xStartB = toCoord(x) + spacing
          } else if (points[x][y].l) {
            xStartB = toCoord(x)
          } else if (points[x][y].u) {
            xStartB = toCoord(x) - spacing
          }

          if (points[x][y].u) {
            xStartT = toCoord(x) + spacing
          } else if (points[x][y].l) {
            xStartT = toCoord(x)
          } else if (points[x][y].d) {
            xStartT = toCoord(x) - spacing
          }


          if (points[x+1][y].d) {
            xEndB = toCoord(x+1) - spacing
          } else if (points[x+1][y].r) {
            xEndB = toCoord(x+1)
          } else if (points[x+1][y].u) {
            xEndB = toCoord(x+1) + spacing
          }

          if (points[x+1][y].u) {
            xEndT = toCoord(x+1) - spacing
          } else if (points[x+1][y].r) {
            xEndT = toCoord(x+1)
          } else if (points[x+1][y].d) {
            xEndT = toCoord(x+1) + spacing
          }

          svg.drawLine(xStartB, toCoord(y)+spacing, xEndB, toCoord(y)+spacing, args1)
          svg.drawLine(xStartT, toCoord(y)-spacing, xEndT, toCoord(y)-spacing, args1)
        }

        if (points[x][y].d) {
          let yStartR, yEndR, yStartL, yEndL

          if (points[x][y].r) {
            yStartR = toCoord(y) + spacing
          } else if (points[x][y].u) {
            yStartR = toCoord(y)
          } else if (points[x][y].l) {
            yStartR = toCoord(y) - spacing
          }

          if (points[x][y].l) {
            yStartL = toCoord(y) + spacing
          } else if (points[x][y].u) {
            yStartL = toCoord(y)
          } else if (points[x][y].r) {
            yStartL = toCoord(y) - spacing
          }


          if (points[x][y+1].r) {
            yEndR = toCoord(y+1) - spacing
          } else if (points[x][y+1].d) {
            yEndR = toCoord(y+1)
          } else if (points[x][y+1].l) {
            yEndR = toCoord(y+1) + spacing
          }

          if (points[x][y+1].l) {
            yEndL = toCoord(y+1) - spacing
          } else if (points[x][y+1].d) {
            yEndL = toCoord(y+1)
          } else if (points[x][y+1].r) {
            yEndL = toCoord(y+1) + spacing
          }

          svg.drawLine(toCoord(x)+spacing, yStartR, toCoord(x)+spacing, yEndR, args2)
          svg.drawLine(toCoord(x)-spacing, yStartL, toCoord(x)-spacing, yEndL, args2)
        }

      })
    )
  }


  const strokeWidthDiff = STROKE_WIDTH_1 - STROKE_WIDTH_2
  if (!HIDE_DIVISOR_LINE) {
    lineList.forEach(l => {
      svg.drawLine(
        toCoord(l.x1),
        toCoord(l.y1),
        toCoord(l.x2),
        toCoord(l.y2),
        {stroke: DIVISOR_STROKE_COLOR, strokeWidth: STROKE_WIDTH_1}
      )
    })
  }

  times(FILLER_RINGS, r =>
    drawInnerBorders(
      (r+1)*FILLER_SPACING*SIZE/GRID_SIZE + strokeWidthDiff,
      {stroke: FILLER_STROKE_COLOR, strokeWidth: STROKE_WIDTH_2},
      {stroke: FILLER_STROKE_ALT_COLOR, strokeWidth: STROKE_WIDTH_2}
    )
  )


  svg.mount(mountTo)


  let DRAW_MODE
  let DEBUG_SVG

  window.onkeypress = function(e) {
    if (e.code === 'Space') {
      const serializer = new XMLSerializer()
      const el = DRAW_MODE ? DEBUG_SVG : svg
      const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(el.svg)
      const a = document.createElement("a")
      a.href = "data:image/svg+xmlcharset=utf-8,"+encodeURIComponent(source)
      a.download = `${tokenData.hash}${DRAW_MODE ? '-debug' : ''}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

    } else if (e.code === 'KeyD') {
      if (DRAW_MODE) {
        svg.svg.style.display = 'inherit'
        DEBUG_SVG.svg.remove()

      } else {
        svg.svg.style.display = 'none'

        DEBUG_SVG = new SVG(SIZE + PADDING*2, SIZE + PADDING*2, 'debug-view')
        DEBUG_SVG.svg.style.background = BG_COLOR

        times(GRID_SIZE + 1, x => {
          DEBUG_SVG.drawLine(
            toCoord(x), toCoord(0), toCoord(x), toCoord(GRID_SIZE),
            {stroke: DARK_COLOR_SCHEME ? pen.white : pen.black, opacity: 0.2}
          )
        })

        times(GRID_SIZE + 1, y => {
          DEBUG_SVG.drawLine(
            toCoord(0), toCoord(y), toCoord(GRID_SIZE), toCoord(y),
            {stroke: DARK_COLOR_SCHEME ? pen.white : pen.black, opacity: 0.2}
          )
        })



        DEBUG_SVG.css(`
          .edge {
            cursor: pointer;
          }

          .active-edge .edge {
            stroke-width: 15 !important;
          }
        `)

        times(LINE_COUNT + 1, l => {
          DEBUG_SVG.css(`
            .line-${l} {
              cursor: pointer;
            }
            .active-line-${l} .line-${l} {
              stroke-width: 25 !important;
            }
          `)
        })


        lineList.forEach(l => {
          let x1 = toCoord(l.x1)
          let y1 = toCoord(l.y1)
          let x2 = toCoord(l.x2)
          let y2 = toCoord(l.y2)

          if (l.metadata.end) {
            x2 = (x2+x1) / 2
            y2 = (y2+y1) / 2
          }
          const line = DEBUG_SVG.drawLine(
            x1, y1, x2, y2,
            {stroke: DIVISOR_STROKE_COLOR, strokeWidth: 10}
          )

          const className = l.metadata.edge
            ? 'edge'
            : `line-${l.metadata.line}`

          line.addEventListener('mouseover', () => {
            DEBUG_SVG.svg.classList.add('active-' + className)
          })

          line.addEventListener('mouseout', () => {
            DEBUG_SVG.svg.classList.remove('active-' + className)

          })

          line.classList.add(className)
        })

        DEBUG_SVG.mount()
      }
      DRAW_MODE = !DRAW_MODE
    }

  }
}