import {createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState, rndAddr} from './global.js'
import {achievements, achievement} from './achievements.js'


const state = persist('__MAZE_COMPUTER_STATE', {
  screen: 'login',
  lastScreen: '',
  loginError: '',
  loggedIn: false,
  openApp: '',
  yieldFarmerHighScore: 0,
  payAppUSDAddr: rndAddr(),
  payAppUSDBalance: 6437.98,
})

if (state.payAppUSDAddr === undefined) state.payAppUSDAddr = rndAddr()
if (state.payAppUSDBalance === undefined) state.payAppUSDBalance = 6437.98


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
        max-width: 100%;
        box-sizing: border-box;
      }

      input:focus, input, select, button {
        outline: none;
        cursor: nw-resize;
      }

      button {
        background: #000;
        color: #fff;
        border: 1px solid #fff;
        padding: 0.5em 1.5em;
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
        max-width: 100%;
      }

      .loginBox {
        border: 1px solid #fff;
        padding: 1.5em 2em;
        max-width: 100%;
        box-sizing: border-box;
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
        grid-template-rows: repeat(2, 1fr);
        gap: 1em;
        padding: 1em;
        padding-top: 3em
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
        text-align: center
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

      #clock {
        margin-left: auto;
        padding: 0 1em;
        color: #000;
        align-self: center;
        font-size: 0.95em;
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

      ::selection {
        background: #fff;
        color: #000;
      }

      @media (max-width: 440px) {
        .loginBox {
          padding: 1em 1.25em;
        }

        .grid {
          grid-template-columns: repeat(3, 1fr);
          padding-top: 1em;
        }

        .cell {
          align-items: flex-start;
          padding-top: 0.5em;
        }
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
    clearInterval(ctx.clockInterval)
    const screen = ctx.state.screen
    const $content = ctx.$('#content')

    if (screen === 'login') {
      $content.innerHTML = `
        <div class="computerScreen">
          <div class="loginBox">
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
      const apps = ['Network', 'Web Browser', 'TODO', 'yieldFarmer2.exe',  'payApp.exe']
      const cells = apps.map((app, i) => `
        <div class="cell">
          <div class="app" data-app="${app}">
            <div class="appIcon"></div>
            <div class="appLabel">${app}</div>
          </div>
        </div>
      `).join('')

      $content.innerHTML = `
        <div class="desktop">
          <div style="flex: 1">
            <div class="grid">${cells}</div>
          </div>
          <div class="bottomBar">
            <button id="desktopExit">EXIT</button>
            <div id="clock"></div>
          </div>
          ${ctx.state.openApp ? `
            <div class="appModal">
              <div class="appModalClose" id="appModalClose">X</div>
              <div id="appModalContent" style="width: 100%; height: 100%; padding: 0.5em; box-sizing: border-box; overflow: auto; display: flex; flex-direction: column;"></div>
            </div>
          ` : ''}
        </div>
      `

      const updateClock = () => {
        if (ctx.$('#clock')) {
          ctx.$('#clock').innerHTML = window.formatTime(globalState.secondsPassed * 1000)
        }
      }
      updateClock()
      ctx.clockInterval = setInterval(updateClock, 1000)

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

          if (currentScore === Infinity) achievement('beatYieldFarmer', true)
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

      } else if (ctx.state.openApp === 'payApp.exe') {
        const renderBalance = () => {
          ctx.$('#balance').innerHTML = ctx.state.payAppUSDBalance.toFixed(2)
        }

        ctx.$('#appModalContent').innerHTML = `
          <style>
            #payApp input { margin: 0.25em 0; }
            #payApp .module { margin-top: 1em; padding-top: 1em; border-top: 1px dashed #fff; }
            #payApp .addrChip { font-size: 0.9em; padding: 0.25em; margin-top: 0.1em; display: inline-block; word-break: break-all }
          </style>
          <div id="payApp">
            <h2 style="margin-bottom: 0.25em">PayApp</h2>
            <h3 style="margin: 1em 0; text-align: center">Balance: $<span id="balance"></span></h3>

            <h3 style="text-align: center; margin: 0.25em 0">I want to: <select id="payAction" style="font-size: 1.1em">
              <option value="receive">Receive $</option>
              <option value="send">Send $</option>
            </select></h3>

            <div id="sendModule" class="module hidden">
              <h3 style="margin-bottom: 0.5em; text-align: center">Send $</h3>
              <div style="width: 320px; margin: auto">
                <ol>
                  <li><input autocomplete="off" id="recipient" placeholder="Recipient Address"></li>
                  <li><input autocomplete="off" id="amount" placeholder="Amount" type="number" step=".01"></li>
                  <li><button id="sign">Sign Transaction</button></li>
                </ol>
                <h4 id="sptx"></h4>
              </div>

            </div>

            <div id="receiveModule" class="module hidden">
              <h3 style="margin-bottom: 0.5em; text-align: center">Receive $</h3>
              <div style="width: 320px; margin: auto">
                <h4>My $ Recipient Address:</h4>
                <span class="addrChip">${ctx.state.payAppUSDAddr}</span>
                <div style="margin-top: 0.5em">
                  <input autocomplete="off" id="sptxInput" placeholder="S.P.T.X. identifier" type="number">
                  <button id="processSPTX">Process SPTX</button>
                </div>
                <h5 id="sptxError"></h5>
              </div>
            </div>
          </div>
        `

        renderBalance()

        const renderPage = () => {
          const val = ctx.$('#payAction').value
          ctx.$('#sendModule').classList.toggle('hidden', val !== 'send')
          ctx.$('#receiveModule').classList.toggle('hidden', val !== 'receive')
        }
        renderPage()
        ctx.$('#payAction').onchange = renderPage

        ctx.$('#sign').onclick = () => {
          const $sptx = ctx.$('#sptx')
          $sptx.innerHTML = ''
          const amount = Number(ctx.$('#amount').value)
          const recipient = ctx.$('#recipient').value.toLowerCase().trim()

          if (!recipient) {
            $sptx.innerHTML = 'Please input a valid $ Recipient Address'
            return
          }
          if (amount <= 0 || !amount) {
            $sptx.innerHTML = 'Please input a value greater than 0'
            return
          }
          if (amount > ctx.state.payAppUSDBalance) {
            $sptx.innerHTML = 'INSUFFICIENT BALANCE'
            return
          }

          const sptx = Math.floor(Math.random() * 100000000000000000)
          globalState.payments[sptx] = {
            sptx,
            sender: ctx.state.payAppUSDAddr,
            recipient,
            amount,
            timestamp: Date.now(),
            received: false,
          }

          const newBalance = ctx.state.payAppUSDBalance - amount
          ctx.state.payAppUSDBalance = newBalance
          state.payAppUSDBalance = newBalance
          renderBalance()

          setTimeout(() => {
            $sptx.innerHTML = `Secure Payment Transaction (S.P.T.X.) identifier: ${sptx}`
          }, 2000)
        }

        ctx.$('#processSPTX').onclick = () => {
          const $err = ctx.$('#sptxError')
          const sptxInput = ctx.$('#sptxInput').value
          if (!sptxInput) {
            $err.innerHTML = 'SPTX ERROR: empty'
            return
          }
          $err.innerHTML = 'processing [do not reload page]'

          setTimeout(() => {
            const payment = globalState.payments[sptxInput]
            if (!payment) {
              $err.innerHTML = 'SPTX ERROR: invalid identifier'
              return
            }
            if (payment.recipient !== ctx.state.payAppUSDAddr) {
              $err.innerHTML = 'SPTX ERROR: invalid recipient'
              return
            }
            if (payment.received) {
              $err.innerHTML = 'SPTX ERROR: already processed'
              return
            }

            payment.received = true
            const newBalance = ctx.state.payAppUSDBalance + payment.amount
            ctx.state.payAppUSDBalance = newBalance
            state.payAppUSDBalance = newBalance
            renderBalance()
            $err.innerHTML = 'success'
          }, 2000)
        }

      } else if (ctx.state.openApp === 'Web Browser') {
        const bookmarks = {
          'News': 'http://fakebullshit.news/',
          'Finance': 'https://fastcashmoneyplus.biz/',
          'Dating': 'https://0ms.co/sexydating/',
          'Social': 'https://friendworld.social',
          'Shopping': 'https://ronamerch.co/',
          'XXX': 'https://finsexy.com',
          'Church': 'https://steviep.xyz/jesus/',
          'Taxes': 'https://cryptotaxspecialist.0ms.co/',
          'steviep.xyz': 'https://steviep.xyz/',
        }

        ctx.$('#appModalContent').innerHTML = `

          <div id="bookmarksBar" style="padding-top: 0 3em 0.4em 0; border-bottom: 1px solid #fff; margin-bottom: 0.4em">
            <h5 style="font-size: 0.75em">BOOKMARKS</h5>
            ${Object.entries(bookmarks).map(([name, url]) => `<button data-url="${url}" style="border: none; padding: 0.25em; margin-right: 0.75em"><span style="display: inline-block; transform: translateY(-2px);">⌖</span> ${name}</button>`).join('')}
          </div>
          <iframe id="browserIframe" style="flex: 1; border: none; background: #fff; width: 100%" src=""></iframe>
        `

        ctx.qsa('#bookmarksBar button').forEach(btn => {
          btn.onclick = () => {
            ctx.$('#browserIframe').src = btn.dataset.url
          }
        })

      } else if (ctx.state.openApp === 'Network') {
        ctx.$('#appModalContent').innerHTML = `
          <div style="padding: 1em">
            <h3 style="text-align: left">Current Network: LandlockRealtyLLC-5G</h3>
            <h3 style="text-align: left">Current Password: <span id="currentPassword">${times(globalState.landlockRealtyPassword.length, () => '◼︎').join('')}</span></h3>
            <h4 style="margin-top: 1.5em; text-align: left">Reset Password:</h4>
            <div style="margin-top: 0.5em">
              <input autocomplete="off" id="newPassword" type="text">
              <button id="resetPassword">Reset</button>
            </div>
            <h5 id="resetError" style="min-height: 1.2em; margin-top: 0.75em"></h5>
          </div>
        `

        ctx.$('#resetPassword').onclick = () => {
          const $err = ctx.$('#resetError')
          const pwd = ctx.$('#newPassword').value
          if (pwd === '') {
            $err.innerHTML = 'PASSWORD CANNOT BE BLANK'
            return
          }
          if (pwd.includes(' ')) {
            $err.innerHTML = 'PASSWORD CONTAINS INVALID CHARACTER(S)'
            return
          }
          $err.innerHTML = '<span class="blink">RESETTING...</span>'
          ctx.$('#resetPassword').disabled = true
          ctx.$('#newPassword').disabled = true
          setTimeout(() => {
            globalState.landlockRealtyPassword = pwd
            ctx.$('#newPassword').value = ''
            if (ctx.$('#resetError')) ctx.$('#resetError').innerHTML = 'PASSWORD RESET'
            if (ctx.$('#resetPassword')) ctx.$('#resetPassword').disabled = false
            if (ctx.$('#newPassword')) ctx.$('#newPassword').disabled = false
            if (ctx.$('#currentPassword')) ctx.$('#currentPassword').innerHTML = times(globalState.landlockRealtyPassword.length, () => '◼︎').join('')
          }, 5000)
        }

      } else if (ctx.state.openApp === 'TODO') {

        const formatBestTime = ms => {
          if (ms == null) return '--:--:--'
          const pad = (x, n=2) => String(Math.floor(x)).padStart(n, '0')
          const hours = ms / 3600000
          const minutes = 60 * (hours % 1)
          const seconds = 60 * (minutes % 1)
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        }

        const timedKeys = ['escapeStairway', 'escapeMaze']

        ctx.$('#appModalContent').innerHTML = `
          <div style="padding: 2.5em 4em; overflow: auto">
            <h2 style="margin-bottom: 0.5em">TODO</h2>
            <ul style="list-style: none; padding: 0;">
              ${Object.values(achievements).map(a => `
                <li style="margin: 0.4em 0; line-height: 1.3;">
                  ${a.status ? '[X]' : '[ ]'}
                  <span> ${a.description}</span>
                </li>
              `).join('')}
            </ul>
            <div style="margin-top: 1em; padding-top: 0.5em; border-top: 1px dashed #fff;">
              <h3 style="text-align: center">Best Times</h3>
              ${timedKeys.map(k => `
                <div style="margin: 0.25em 0;">${achievements[k].description}: <strong>${formatBestTime(achievements[k].bestTime)}</strong></div>
              `).join('')}
            </div>
          </div>
        `

      } else if (ctx.state.openApp) {
        ctx.$('#appModalContent').innerHTML = ctx.state.openApp
      }
    }
  },
  () => {}
)
