import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {createSource, MAX_VOLUME} from './audio.js'


tmp.lastClick = 0

const state = persist('__TV_STATE', {
  screen: 'noSignal',
  tvPaired: false,
  phoneCastingEnabled: false,
  deviceCastingEnabled: false,
  phoneCastScreens: 1,
  picture: {
    sharpness: 100,
    contrast: 100,
    brightness: 100,
    invert: 0,
    saturation: 100,
    hue: 0,
    warmth: 0,
  }
})

let menuSrc
document.addEventListener('click', () => {
  if (!menuSrc) {
    menuSrc = createSource('sine', 440)
  }
})


createComponent(
  'smart-tv',
  `
    <style>

      * {
        padding: 0;
        margin: 0;
        scrollbar-width: thin;
        user-select: none;
      }

      #tv {
        width: min(90vw, calc(85vh * 16 / 9));
        height: min(85vh, calc(90vw * 9 / 16));

        border: 2px solid #262626;
        border-radius: 3px;
        display: flex;
        --sharpness: 0px;
        --contrast: 100%;
        --brightness: 100%;
        --invert: 0%;
        --saturation: 100%;
        --hue: 0deg;
        --warmth: 0%;
        --bg-color: #00f;

        box-shadow: 0 0 3em var(--bg-color), 0 0 10em var(--bg-color);
        filter: blur(var(--sharpness)) contrast(var(--contrast)) brightness(var(--brightness)) invert(var(--invert)) saturate(var(--saturation)) hue-rotate(var(--hue)) sepia(var(--warmth));
      }

      #screen {
        flex: 1;
        background: var(--bg-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        color: #fff;
      }

      button {
        background: none;
        border: 0;
        font-family: monospace;
        cursor: pointer;
        padding: 0.5em;
      }

      .buttonText, button {
        color: #fff;
        font-weight: bold;
        font-size: 1.25em;
      }

      button:hover {
        outline: 2px solid;
      }

      button:active {
        color: #ff0
      }


      @media (max-aspect-ratio: 0.95) and (max-width: 550px) {
        #tv {
          transform: rotate(90deg);

          width: min(90vh, calc(85vw * 16 / 9));
          height: min(85vw, calc(90vh * 9 / 16));
        }
      }

    </style>

    <div id="tv">
      <div id="screen"></div>


      <!--
        <div id="mobileContainer" style="display: none">
          <mobile-phone screen-only="true" id="blah"></mobile-phone>
          <mobile-phone screen-only="true" ></mobile-phone>
          <mobile-phone screen-only="true" ></mobile-phone>
        </div>
      -->


    </div>
  `,
  state,
  ctx => {
    // ctx.$('#blah').onClose = () => console.log('blah')
  },
  ctx => {
    const {screen, picture, tvPaired, phoneCastingEnabled, deviceCastingEnabled} = ctx.state

    const wifiAvailable = globalState.wifiActive && !globalState.routerUnplugged && globalState.routerReset


    const setProp = (p, v) => {
      ctx.$('#tv').style.setProperty(p, v)
    }

    setProp('--sharpness', 2 - (picture.sharpness/50) + 'px')
    setProp('--contrast', picture.contrast + '%')
    setProp('--brightness', picture.brightness + '%')
    setProp('--invert', picture.invert + '%')
    setProp('--saturation', picture.saturation + '%')
    setProp('--hue', picture.hue + 'deg')
    setProp('--warmth', picture.warmth + '%')

    setProp('--bg-color', '#00f')







    const $screen = ctx.$('#screen')

    const hoverSound = async () => {
      if (Date.now() - tmp.lastClick < 50) {
        return
      }
      menuSrc.smoothFreq(300)
      menuSrc.smoothGain(MAX_VOLUME*1.25)
      menuSrc.smoothFreq(440, 0.025)
      setTimeout(() => menuSrc.smoothGain(0), 50)
    }

    const clickSound =  () => {
      tmp.lastClick = Date.now()

      menuSrc.smoothFreq(600)
      menuSrc.smoothGain(MAX_VOLUME*1.25)
      menuSrc.smoothFreq(800, 0.025)
      setTimeout(() => menuSrc.smoothGain(0), 50)
    }

    if (screen === 'noSignal') {
      $screen.innerHTML = `
        <div style="display: flex; align-self: flex-start; padding: 0.5em 1em">
          <button id="menu">MENU</button>
          <button id="off">POWER OFF</button>
        </div>

        <h1>NO SIGNAL</h1>

        <p style="font-size: 0.8em; width: 40em; padding: 1em; text-align: center">
          ${
            wifiAvailable
            ? 'Your current National Broadband Services subscription does not include cable access. Please call 1-800-555-2093 to add this service to your account.'
            : `There is an issue with your National Broadband Services account. Please call at 1-800-555-2093 to report this issue.`
          }
        </p>
      `

      ctx.$('#off').onclick = () => {
        ctx.parentElement.close()
      }

      ctx.$('#menu').onclick = () => {
        ctx.setState({ screen: 'menu' })
      }


      ctx.qsa('button').forEach(b => {
        b.onmouseover = hoverSound
        b.onmousedown = clickSound
      })


    } else if (screen === 'menu') {
      $screen.innerHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center">
          <button id="watch">WATCH</button>
          <button id="picture">PICTURE</button>
          <button id="smartCast">SMARTCAST</button>
          <button id="off">POWER OFF</button>
        </div>


      `

      ctx.$('#watch').onclick = () => {
        ctx.setState({ screen: 'noSignal' })
      }

      ctx.$('#picture').onclick = () => {
        ctx.setState({ screen: 'picture' })
      }

      ctx.$('#smartCast').onclick = () => {
        ctx.setState({ screen: 'smartCast' })
      }

      ctx.$('#off').onclick = () => {
        ctx.parentElement.close()
      }


      ctx.qsa('button').forEach(b => {
        b.onmouseover = hoverSound
        b.onmousedown = clickSound
      })

    } else if (screen === 'picture') {
      $screen.innerHTML = `
        <style>
          .buttonText button {
            padding: 0.25em;
            margin: 0 0.25em;
            line-height: 1;
          }

          .value {
            width: 3ch;
            display: inline-block;
            text-align: right;
          }
        </style>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center">
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">SHARPNESS</span>
            <button id="sharpnessDown">-</button><span class="value">${picture.sharpness}</span><button id="sharpnessUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">CONTRAST</span>
            <button id="contrastDown">-</button><span class="value">${picture.contrast}</span><button id="contrastUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">BRIGHTNESS</span>
            <button id="brightnessDown">-</button><span class="value">${picture.brightness}</span><button id="brightnessUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">INVERT</span>
            <button id="invertDown">-</button><span class="value">${picture.invert}</span><button id="invertUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">SATURATION</span>
            <button id="saturationDown">-</button><span class="value">${picture.saturation}</span><button id="saturationUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">HUE</span>
            <button id="hueDown">-</button><span class="value">${picture.hue}</span><button id="hueUp">+</button>
            </div>
          <div class="buttonText">
            <span style="display: inline-block; width: 11ch">WARMTH</span>
            <button id="warmthDown">-</button><span class="value">${picture.warmth}</span><button id="warmthUp">+</button>
            </div>

          <div style="text-align: center; margin-top: 1em">
            <button id="back">BACK</button>
          </div>
        </div>
      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'menu' })
      }


      const limits = {
        sharpness: [0, 100],
        contrast: [0, 200],
        brightness: [0, 200],
        invert: [0, 100],
        saturation: [0, 300],
        hue: [0, 720],
        warmth: [0, 100]
      }

      Object.keys(limits).forEach(key => {
        const [low, high] = limits[key]

        const stop = () => {
          clearInterval(tmp[key + 'pictureIntervalDown'])
          clearInterval(tmp[key + 'pictureIntervalUp'])
        }

        ctx.$(`#${key}Up`).addEventListener('mouseup', stop)
        ctx.$(`#${key}Up`).addEventListener('mouseleave', stop)
        ctx.$(`#${key}Down`).addEventListener('mouseup', stop)
        ctx.$(`#${key}Down`).addEventListener('mouseleave', stop)

        ctx.$(`#${key}Up`).addEventListener('mousedown', () => {
          let lastClick = Date.now()
          const change = () => {
            if (ctx.state.picture[key] > high-1) return
            ctx.setState({
              picture: {
                ...ctx.state.picture,
                [key]: ctx.state.picture[key] + 1
              }
            })
          }

          change()
          tmp[key+'pictureIntervalUp'] = setInterval(() => {
            if (Date.now() - 500 < lastClick) return
            change()
          }, 150)
        })

        ctx.$(`#${key}Down`).addEventListener('mousedown', () => {
          let lastClick = Date.now()
          const change = () => {
            if (ctx.state.picture[key] < low+1) return

            ctx.setState({
              picture: {
                ...ctx.state.picture,
                [key]: ctx.state.picture[key] - 1
              }
            })
          }

          change()
          tmp[key+'pictureIntervalDown'] = setInterval(() => {
            if (Date.now() - 500 < lastClick) return
            change()
          }, 150)
        })
      })




      ctx.qsa('button').forEach(b => {
        b.onmouseover = hoverSound
        b.addEventListener('mousedown', clickSound)
      })

    } else if (screen === 'smartCast') {
      const castScreen = `
        ${!(phoneCastingEnabled || deviceCastingEnabled) ? '<p style="margin-bottom: 1em">Please follow all instructions on the SmartTV app to SmartCast</p>' : ''}
        ${phoneCastingEnabled ? `<button id="phoneCast">PHONECAST</button>` : ''}
        ${deviceCastingEnabled ? `<button id="deviceCast">DEVICECAST</button>` : ''}
        <button id="back">BACK</button>
      `

      $screen.innerHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center">
          ${tvPaired
              ? castScreen
              : `
                <p>Pleae download the official SmartTV app and follow all setup instructions to SmartCast.</p>
                <div style="text-align: center; margin-top: 1em">
                  <button id="back">BACK</button>
                </div>
              `

          }
        </div>
      `
      if (ctx.$('#phoneCast')) ctx.$('#phoneCast').onclick = () => {
        ctx.setState({
          screen: 'phoneCastMenu'
        })
      }

      if (ctx.$('#deviceCast')) ctx.$('#deviceCast').onclick = () => {
        ctx.setState({
          screen: 'deviceCast'
        })
      }

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'menu' })
      }

      ctx.qsa('button').forEach(b => {
        b.onmouseover = hoverSound
        b.addEventListener('mousedown', clickSound)
      })

    } else if (screen === 'phoneCastMenu') {
      $screen.innerHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center">
          <button id="screens1">SCREENS: 1</button>
          <button id="screens2">SCREENS: 2</button>
          <button id="screens3">SCREENS: 3</button>
          <button id="screens4">SCREENS: 4</button>
          <button id="screens6">SCREENS: 6</button>
          <button id="screens9">SCREENS: 9</button>
          <button id="back">BACK</button>
        </div>
      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'smartCast' })
      }

      ctx.$('#screens1').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 1 })
      }

      ctx.$('#screens2').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 2 })
      }

      ctx.$('#screens3').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 3 })
      }

      ctx.$('#screens4').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 4 })
      }

      ctx.$('#screens6').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 6 })
      }

      ctx.$('#screens9').onclick = () => {
        ctx.setState({ screen: 'phoneCast', phoneCastScreens: 9 })
      }

      ctx.qsa('button').forEach(b => {
        b.onmouseover = hoverSound
        b.addEventListener('mousedown', clickSound)
      })

    } else if (screen === 'phoneCast') {
      const {phoneCastScreens} = ctx.state
      setProp('--bg-color', '#fff')

      let gridTemplate
      if (phoneCastScreens === 1) {
        gridTemplate = '1fr / 1fr'
      } else if (phoneCastScreens === 2) {
        gridTemplate = '1fr / 1fr 1fr'
      } else if (phoneCastScreens === 3) {
        gridTemplate = '1fr / 1fr 1fr 1fr'
      } else if (phoneCastScreens === 4) {
        gridTemplate = '1fr 1fr / 1fr 1fr'
      } else if (phoneCastScreens === 6) {
        gridTemplate = '1fr 1fr / 1fr 1fr 1fr'
      } else if (phoneCastScreens === 9) {
        gridTemplate = '1fr 1fr 1fr / 1fr 1fr 1fr'
      }

      $screen.innerHTML = `
        <style>
          * {
            user-select: initial !important;
          }

          #castGrid {
            flex: 1;
            display: grid;
            grid-template: ${gridTemplate};
            width: 100%;
            height: 0%;
          }

          .mobileContainer {
            overflow: scroll;
            display: flex;
            outline: 1px solid #000;
          }

          mobile-phone {
            display: flex;
            width: 100%;
            min-width: 320px;
            min-height: 570px;
          }

          #back {
            color: #fff;
            font-size: 0.9em;
            font-family: sans-serif;
          }

          #back:hover {
            outline: 0;
            color: #bbb;
          }


        </style>

        <header style="width: 100%; background: #5a5a5a;">
          <button id="back">← Back</button>
        </header>

        <div id="castGrid">
          <div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>
          ${phoneCastScreens >= 2
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }
          ${phoneCastScreens >= 3
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }
          ${phoneCastScreens >= 4
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

          ${phoneCastScreens >= 5
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

          ${phoneCastScreens >= 6
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

          ${phoneCastScreens >= 7
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

          ${phoneCastScreens >= 8
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

          ${phoneCastScreens >= 9
            ? '<div class="mobileContainer"><mobile-phone screen-only="true" ></mobile-phone></div>'
            : ''
          }

        </div>

      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'phoneCastMenu' })
      }

      // ctx.$('#back').onmouseover = hoverSound
      // ctx.$('#back').addEventListener('mousedown', clickSound)

    } else {
      $screen.innerHTML = `
        <h1>NO SIGNAL</h1>
      `
    }
  },
  (oldState, newState, stateUpdate) => {
    Object.assign(state, { ...newState, lastScreen: oldState.screen})

  }
)