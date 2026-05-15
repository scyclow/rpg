import {createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState} from './global.js'


const state = persist('__MAZE_COMPUTER_STATE', {
  screen: 'login',
  lastScreen: '',
  loginError: '',
  loggedIn: false,
  openApp: '',
  yieldFarmerHighScore: 0,
})

/*
TODO


- a desktop with a few apps:
  - achievements page
  - network and internet
    - access LandlockRealtyLLC-5G, reset network password
  - payapp with $ on it
  - some app, maybe currency exchange, with a bunch of crypto


- elevator says to download app

*/

createComponent(
  'maze-computer',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
        font-family: monospace;
      }

      #screen {
        position: relative;
        width: 95vmin;
        height: 72vmin;
        background: #000;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 1em;
        cursor: nw-resize;
      }

      h1, h2, h4 {
        text-align: center;
        font-weight: normal;
      }

      input {
        background: #000;
        color: #fff;
        border: 1px solid #fff;
        padding: 0.4em 0.6em;
        font-size: 1em;
        width: 16em;
        cursor: nw-resize;
      }

      input:focus {
        outline: none;
      }

      button {
        background: #000;
        color: #fff;
        border: 1px solid #fff;
        padding: 0.5em 1.5em;
        cursor: nw-resize;
        font-size: 1em;
      }

      button:hover {
        background: #fff;
        color: #000;
      }

      button:disabled {
        background: #3c3c3c;
        color: #fff;
      }

      button:disabled:hover {
        background: #222;
        color: #fff;
        cursor: not-allowed;
      }

      .computerScreen {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6em;
      }

      #error {
        min-height: 1.2em;
      }

      .hidden {
        display: none !important;
      }

      @keyframes blink {
        0%, 49.99% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }

      .blink {
        animation: blink .75s infinite;
      }

      #close {
        position: absolute;
        bottom: 1em;
        right: 1em;
      }

      .desktop {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
      }

      .grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
      }

      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4em;
        cursor: nw-resize;
      }

      .app:hover .appLabel {
        text-decoration: underline;
      }

      .appIcon {
        width: 3em;
        height: 3em;
        background: #fff;
      }

      .appLabel {
        font-size: 0.9em;
      }

      .bottomBar {
        height: 2em;
        background: #fff;
        display: flex;
        align-items: stretch;
      }

      #desktopExit {
        height: 100%;
        background: #000;
        color: #fff;
        border: 1px solid #fff;
        font-family: monospace;
        padding: 0 1em;
        cursor: nw-resize;
      }

      #desktopExit:hover {
        background: #fff;
        color: #000;
      }

      .appModal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 75%;
        height: 75%;
        border: 2px solid #fff;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .appModalClose {
        position: absolute;
        top: 0.3em;
        right: 0.3em;
        cursor: nw-resize;
        font-size: 1.1em;
        padding: 0.2em 0.6em;
      }

      .appModalClose:hover {
        background: #fff;
        color: #000;
      }

    </style>

    <div id="screen">
      <div id="content"></div>
    </div>
  `,
  state,
  ctx => {
    ctx.turnOff = () => {
      clearTimeout(ctx.loginTimeout)
      const current = ctx.state.screen
      let savedLast = ['login', 'loading'].includes(current) ? ctx.state.lastScreen : current
      if (savedLast === 'loading') savedLast = 'desktop'
      setTimeout(() => {
        ctx.setState({
          screen: 'login',
          lastScreen: savedLast,
          loginError: '',
          openApp: '',
        })
      }, 100)
    }
  },
  ctx => {
    clearInterval(ctx.interval)
    const screen = ctx.state.screen
    const $content = ctx.$('#content')

    if (screen === 'login') {
      $content.innerHTML = `
        <div class="computerScreen">
          <div style="border: 1px solid; padding: 1.5em 2em">
            <h5 style="margin-bottom: 0.25em;">USERNAME</h5>
            <input autocomplete="off" id="username">
            <h5 style="margin-top: 1em; margin-bottom: 0.25em">PASSWORD</h5>
            <input autocomplete="off" id="password">
            <div style="margin-top: 1.5em; display: flex; justify-content: center;">
              <button id="login">LOGIN</button>
            </div>
          </div>
          <h4 id="error">${ctx.state.loginError}</h4>
        </div>
        <button id="close" style="border: none">EXIT</button>

      `

      ctx.$('#close').onclick = () => ctx.parentElement.close()
      const tryLogin = () => {
        const u = ctx.$('#username').value
        const p = ctx.$('#password').value
        if (u === 'username' && p === 'password') {
          ctx.setState({ screen: 'loading', loginError: '', loggedIn: true })
          clearTimeout(ctx.loginTimeout)
          ctx.loginTimeout = setTimeout(() => {
            ctx.setState({ screen: 'desktop' })
          }, 5000)
        } else {
          ctx.$('#error').innerHTML = 'INVALID CREDENTIALS'
        }
      }

      ctx.$('#login').onclick = tryLogin
      ctx.$('#password').onkeyup = e => { if (e.key === 'Enter') tryLogin() }
      ctx.$('#username').onkeyup = e => { if (e.key === 'Enter') tryLogin() }

    } else if (screen === 'loading') {
      $content.innerHTML = `
        <div class="computerScreen">
          <h1>PLEASE WAIT <span class="blink" style="font-size: 1.5em">⌛︎</span></h1>
        </div>
      `
    } else if (screen === 'desktop') {
      const apps = ['yieldFarmer2.exe', 'Network', 'screen3']
      const cells = Array.from({ length: 16 }, (_, i) => {
        const app = apps[i]
        return app
          ? `<div class="cell">
              <div class="app" data-app="${app}">
                <div class="appIcon"></div>
                <div class="appLabel">${app}</div>
              </div>
            </div>`
          : `<div class="cell"></div>`
      }).join('')

      $content.innerHTML = `
        <div class="desktop">
          <div class="grid">${cells}</div>
          <div class="bottomBar">
            <button id="desktopExit">EXIT</button>
          </div>
          ${ctx.state.openApp ? `
            <div class="appModal">
              <div class="appModalClose" id="appModalClose">X</div>
              <div id="appModalContent" style="width: 100%; height: 100%; padding: 0.5em; box-sizing: border-box; overflow: auto; display: flex; flex-direction: column;"></div>
            </div>
          ` : ''}
        </div>
      `

      ctx.qsa('.app').forEach(el => {
        el.onclick = () => ctx.setState({ openApp: el.dataset.app })
      })

      ctx.$('#desktopExit').onclick = () => ctx.parentElement.close()

      const closeBtn = ctx.$('#appModalClose')
      if (closeBtn) closeBtn.onclick = () => ctx.setState({ openApp: '' })

      if (ctx.state.openApp === 'yieldFarmer2.exe') {
        const existingHighScore =
          ctx.state.yieldFarmerHighScore === null
            ? Infinity
            : (ctx.state.yieldFarmerHighScore || 0)

        ctx.$('#appModalContent').innerHTML = `
          <style>
            button {
              margin-bottom: 0.5em
            }
          </style>
          <div class="phoneScreen" style="flex:1; display: flex;">
            <div id="main" style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between">

              <div>
                <h2 style="margin-bottom: 1em">YieldFarmer 2</h2>
              </div>

              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%">
                <h1 style="text-align: center; margin-bottom: 0.4em">Crypto: <span id="currentScore">0.00</span></h1>
                <button id="mineCrypto" style="font-size: 1.1em">Mine Crypto</button>

                <div id="stake" class="hidden" style="display: flex; align-items: center; flex-direction: column; margin-top: 1em">
                  <h3>Stake (<span id="stakeYield">10%</span>/<span id="stakeTime">5s</span>)</h3>
                  <button id="stakeCrypto" style="margin-top: 0.5em">Stake <span id="stakeAmount">10<span></button>
                </div>

                <div id="protocol" class="hidden" style="margin-top: 2em; padding: 0 0.75em; text-align: center">
                  <h3 style="margin-bottom:0.4em">Protocol Upgrade</h3>
                  <button id="increaseAmount" disabled>Increase Stake Amount 100% (100) </button>
                  <button id="increaseYield" disabled>Increase Stake Yield 20% (100) </button>
                  <button id="decreaseTime" disabled>Decrease Stake Time 20% (100) </button>

                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                <div>
                  <h5>Your High Score: <span id="highScore">${existingHighScore.toFixed(2)}</span></h5>
                  <h5>Global Score: <span id="globalHighScore">${globalState.yieldFarmerGlobalHighScore?.toFixed?.(2) || 'NaN'}</span></h5>
                </div>
                <button id="gotoAbout" style="margin-bottom:0">About</button>
              </div>
            </div>

            <div id="about" class="hidden" style="flex:1">
              <button id="gotoMain">Back</button>
              <h3>About</h3>
              <p>Welcome to YieldFarmer 2! As of last week this was the most downloaded game on AppMarket, and the most popular DeFi simulation game by far! This version has a lot of new features and bug fixes, so I'm really excited for you to play it!</p>
            </div>
          </div>
        `

        let currentScore = 0
        let unstakedAmount = 0
        let stakeAmount = 10
        let stakeYield = 0.1
        let stakeTime = 5000
        let stakeTimestamp = Date.now()
        let staked = false

        let yieldPrice = 100
        let timePrice = 100
        let amountPrice = 100

        const update = () => {
          ctx.$('#currentScore').innerHTML = currentScore.toFixed(2)
          if (ctx.$('#stakeAmount')) ctx.$('#stakeAmount').innerHTML = stakeAmount
          ctx.$('#stakeYield').innerHTML = (stakeYield * 100).toFixed(2) + '%'
          ctx.$('#stakeTime').innerHTML = (stakeTime/1000).toFixed(2) + 's'

          if (currentScore >= 10) {
            ctx.$('#stake').classList.remove('hidden')
          }
          if (currentScore >= 100) {
            ctx.$('#protocol').classList.remove('hidden')
          }

          ctx.$('#increaseAmount').disabled = currentScore < amountPrice
          ctx.$('#increaseYield').disabled = currentScore < yieldPrice
          ctx.$('#decreaseTime').disabled = currentScore < timePrice
          ctx.$('#stakeCrypto').disabled = currentScore < stakeAmount

          if (staked) {
            if (Date.now() < stakeTimestamp + stakeTime) {
              ctx.$('#stakeCrypto').disabled = true
              ctx.$('#stakeCrypto').innerHTML = `Unstake (${Math.floor(( stakeTimestamp + stakeTime - Date.now()) / 1000)}s)`
            } else {
              ctx.$('#stakeCrypto').disabled = false
              ctx.$('#stakeCrypto').innerHTML = `Unstake ${(unstakedAmount).toFixed(2)}`
            }
          } else {
            ctx.$('#stakeCrypto').innerHTML = `Stake ${stakeAmount}`
          }

          if (currentScore > (ctx.state.yieldFarmerHighScore || 0)) {
            ctx.state.yieldFarmerHighScore = currentScore
            state.yieldFarmerHighScore = currentScore
            ctx.$('#highScore').innerHTML = currentScore.toFixed(2)
          }

          if (currentScore > globalState.yieldFarmerGlobalHighScore) {
            globalState.yieldFarmerGlobalHighScore = currentScore
            ctx.$('#globalHighScore').innerHTML = currentScore.toFixed(2)
          }
        }

        ctx.$('#mineCrypto').onclick = () => {
          currentScore += 1
          update()
        }

        ctx.$('#increaseAmount').onclick = () => {
          currentScore -= amountPrice
          amountPrice = Math.floor(amountPrice  * 1.5)
          stakeAmount *= 2
          ctx.$('#increaseAmount').innerHTML = `Increase Stake Amount 100% (${amountPrice})`
          update()
        }
        ctx.$('#increaseYield').onclick = () => {
          currentScore -= yieldPrice
          yieldPrice = Math.floor(yieldPrice  * 1.5)
          stakeYield *= 1.2
          ctx.$('#increaseYield').innerHTML = `Increase Stake Yield 20% (${yieldPrice})`
          update()
        }
        ctx.$('#decreaseTime').onclick = () => {
          currentScore -= timePrice
          timePrice = Math.floor(timePrice  * 1.5)
          stakeTime *= 0.8
          ctx.$('#decreaseTime').innerHTML = `Decrease Stake Time 20% (${timePrice})`
          update()
        }

        ctx.$('#stakeCrypto').onclick = () => {
          if (staked) {
            staked = false
            if (currentScore !== Infinity) {
              currentScore += unstakedAmount
            }
            unstakedAmount = 0
            update()
          } else {
            staked = true
            if (currentScore !== Infinity) {
              currentScore -= stakeAmount
            }
            unstakedAmount = stakeAmount * (1 + stakeYield)
            stakeTimestamp = Date.now()
            ctx.$('#stakeCrypto').disabled = true
            update()
            setTimeout(() => {
              try {
                update()
              } catch (e) {}
            }, stakeTime)
          }
        }

        ctx.interval = setInterval(() => {
          update()
        }, 1000)

        ctx.$('#gotoAbout').onclick = () => {
          ctx.$('#main').classList.add('hidden')
          ctx.$('#about').classList.remove('hidden')
        }

        ctx.$('#gotoMain').onclick = () => {
          ctx.$('#about').classList.add('hidden')
          ctx.$('#main').classList.remove('hidden')
        }

      } else if (ctx.state.openApp) {
        ctx.$('#appModalContent').innerHTML = ctx.state.openApp
      }
    }
  },
  () => {}
)
