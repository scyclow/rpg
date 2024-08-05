import {$, createComponent} from './$.js'
import {createSource, MAX_VOLUME} from './audio.js'
import {voices, say} from './voices.js'
import {StateMachine, CTX} from './stateMachine.js'
import {persist} from './persist.js'
import {ispCSNodes} from './cs/isp.js'
import {billingCSNodes} from './cs/billing.js'

// probably a better way to inject this
// import {globalState} from './global.js'


class PhoneCall {
  static keys = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'star',
    '0',
    'hash',
  ]
  static tones = {
    1: [697, 1209],
    2: [697, 1336],
    3: [697, 1477],
    4: [770, 1209],
    5: [770, 1336],
    6: [770, 1477],
    7: [852, 1209],
    8: [852, 1336],
    9: [852, 1477],
    '*': [941, 1209],
    0: [941, 1336],
    '#': [941, 1477],
    ring: [440, 480],
  }

  static active = null

  dialed = []

  srcs = {}
  $keypad = []
  pressTS = 0

  constructor(onclick, select=$.id) {
    PhoneCall.active = this

    const keys = [
      [1, '@'],
      [2, 'ABC'],
      [3, 'DEF'],
      [4, 'GHI'],
      [5, 'JKL'],
      [6, 'MNO'],
      [7, 'PQRS'],
      [8, 'TUV'],
      [9, 'WXYZ'],
      ['*', ''],
      ['0', '+'],
      ['#', ''],
    ]

    this.$keypad = keys.map(([key, letters]) => {
      const elem = $.div(
        [$.span(key), $.span(letters)],
        { class: 'key' }
      )


      elem.onclick = () => {
        this.live = true
        this.dialed.push(key === 'hash' ? '#' : key === 'star' ? '*' : key)
        onclick(this, key)
      }
      elem.onmousedown = () => this.startTone(key)
      elem.onmouseup = () => this.endTone(key)
      elem.onmouseleave = () => this.endTone(key)

      return elem
    })
  }

  startTone(key) {
    if (!this.srcs[key]) {
      this.srcs[key] = [createSource('sine'), createSource('sine')]

      this.srcs[key][0].smoothFreq(PhoneCall.tones[key][0])
      this.srcs[key][1].smoothFreq(PhoneCall.tones[key][1])
    }

    this.pressTS = Date.now()

    if (this.srcs[key][0].gain.gain.value > 0) {
      this.srcs[key][0].smoothGain(0)
      this.srcs[key][1].smoothGain(0)

      setTimeout(() => {
        this.srcs[key][0].smoothGain(MAX_VOLUME)
        this.srcs[key][1].smoothGain(MAX_VOLUME)
      }, 25)
    } else {
      this.srcs[key][0].smoothGain(MAX_VOLUME)
      this.srcs[key][1].smoothGain(MAX_VOLUME)
    }
  }

  endTone(key) {
    const diff = Date.now() - this.pressTS
    if (diff < 200) {
      setTimeout(() => {
        this.srcs[key]?.[0]?.smoothGain?.(0)
        this.srcs[key]?.[1]?.smoothGain?.(0)
      }, 200 - diff)
    } else {
      this.srcs[key]?.[0]?.smoothGain?.(0)
      this.srcs[key]?.[1]?.smoothGain?.(0)
    }
  }

  async ringTone(rings=3) {
    this.isRinging = true
    const [src0, src1] = [createSource('sine'), createSource('sine')]

    src0.smoothFreq(PhoneCall.tones.ring[0])
    src1.smoothFreq(PhoneCall.tones.ring[1])


    await waitPromise(500)
    for (let i = 0; i < rings; i++) {
      if (!this.live) return

      src0.smoothGain(MAX_VOLUME)
      src1.smoothGain(MAX_VOLUME)

      await waitPromise(3000)

      src0.smoothGain(0)
      src1.smoothGain(0)

      if (!this.live) return
      await waitPromise(i === rings - 1 ? 1000 : 3000)
    }

    this.isRinging = false
  }

  hangup() {
    this.phoneAnswered = false
    this.dialed = []
    this.isRinging = false
    this.live = false

    // PhoneCall.active = null
  }

  answer(stateMachine) {
    this.phoneAnswered = true
    this.stateMachine = stateMachine
    // PhoneCall.active = this
  }
}




function phoneMarkup() {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      #phoneAppContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-top: 1px solid;
      }
      #phoneAppInfo {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }


      #dialedNumber {
        font-size: 2.7em;
      }

      #menuNumbers {
        font-size: 1.5em;
        height: 1.1em;
      }


      #keypad {
        display: grid;
        grid-gap: 0;
        grid-template-columns: repeat(3, 1fr);
        border-top: 1px solid;
      }

      .key {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        outline: 0.5px solid #888;
        padding: 0.5em;
        cursor: pointer;
      }

      .key:hover {
        background: #000;
        outline-color: #000;
        color: #fff;
        user-select: none;
      }

      .key span:first-child {
        font-size: 2em;
      }

      #menu {

        list-style: none;
        display: grid;
        grid-gap: 0;
        grid-template-columns: repeat(3, 1fr);
        border-top:  1px solid;
        padding: 0.25em;
      }
      #menu * {
        text-align: center;
      }

    </style>
    <div id="phoneAppContent">
      <div id="phoneAppInfo">
        <h1 id="dialedNumber"></h1>
        <h4 id="menuNumbers"></h4>
      </div>
      <div id="keypad"></div>

      <ul id="menu">
        <li>Phone</li>
        <li>Contacts</li>
        <li>Voice Mail</li>
      </ul>
      <div>
        <button id="home">Back</button>
        <button id="hangup">Hangup</button>
      </div>
    </div>
  `
}



export const CSConfig = {
  defaultWait: 1000,
  async onUpdate({text}, sm) {
    sm.ctx.history.push(text)
    say(await voices.then(vs => vs[0]), text)
  },
}



function formatPhoneNumber(num) {
  if (num.length < 4) return num.slice(0, 3).join('')
  if (num.length < 8) return `${num.slice(0, 3).join('')}-${num.slice(3, 7).join('')}`
  if (num.length < 11) return `${num.slice(0, 3).join('')}-${num.slice(3, 6).join('')}-${num.slice(6, 10).join('')}`
  else return `${num[0]}-${num.slice(1, 4).join('')}-${num.slice(4, 7).join('')}-${num.slice(7, 11).join('')}`

}



let ACTIVE_PHONECALL
function phoneBehavior(ctx) {
  ctx.$('#home').onclick = () => {
    ctx.setState({ screen: 'home' })
  }

  const phoneCall = PhoneCall.active || new PhoneCall(
    async (phone, key) => {
      ctx.$('#dialedNumber').innerHTML = formatPhoneNumber(phone.dialed.slice(0, 11))
      ctx.$('#menuNumbers').innerHTML = phone.dialed.slice(11).join('')


      window.speechSynthesis.cancel()

      if (phone.phoneAnswered) phone.stateMachine.next(key)

      const dialed = phone.dialed.join('')

      if (dialed === '18005552093') {
        await phone.ringTone(3)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
            paymentCode: [],
            routerIdentifier: []
          }),
          CSConfig,
          ispCSNodes
        )
        phone.answer(stateMachine)

        stateMachine.next('')

      }

      if (dialed === '18885559483') {
        await phone.ringTone(1)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
            paymentCode: [],
            routerIdentifier: []
          }),
          CSConfig,
          billingCSNodes
        )
        phone.answer(stateMachine)

        stateMachine.next('')

      }
    },
    (id) => ctx.$(`#${id}`)
  )


  ctx.$('#keypad').append(...phoneCall.$keypad)

  window.pc = phoneCall
}




const APPS = [
  { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
  { name: 'Shayd', key: 'shayd', size: 128, price: 1 },
  { name: 'Alarm', key: 'alarm', size: 128, price: 1 },
  { name: 'Lumin', key: 'lumin', size: 128, price: 1 },
  { name: 'SmartPro Security Camera', key: 'camera', size: 128, price: 1 },
  { name: 'SmartLock', key: 'lock', size: 128, price: 1 },
  { name: 'SmartPlanter', key: 'planter', size: 256, price: 1 },
]


const state = persist('__MOBILE_STATE', {
  started: false,
  screen: 'loading',
  internet: 'wifi',
  dataPlanActivated: false,
  appsInstalled: [],
  payAppBalance: 0
})




createComponent(
  'mobile-phone',
  `
    <style>
      * {
        padding: 0;
        margin: 0
      }

      header {
        height: 1em;
        font-family: sans-serif;
        display: flex;
        justify-content: space-between;
        padding: 0.25em;
        font-size: 0.75em;
        color: #fff;
        background: #5a5a5a;
      }

      button, select {
        cursor: pointer;
      }

      button {
        margin-bottom: 0.5em;
        padding: 0.1em 0.5em;
      }

      h1 {
        font-size: 1.9em;
        margin: 0.7em 0;
      }

      #phone {
        width: 320px;
        height: 569px;
        border: 2px solid;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        background: #fff;
        color: #000;
        box-shadow: 0 0 3em #ddd;
      }

      #phoneContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      .phoneScreen {
        padding:0.5em;
      }

      #phoneSectionContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-top: 1px solid;
      }

      .hidden {
        display: none;
      }

      .loadingScreen {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #222;
        color: #fff;
      }
      .loadingAnimation * {
        opacity: 0;
        animation: Flashing 2s ease-in-out infinite;
      }

      table {
        border-spacing: 0;
      }

      td, th {
        padding: 0.25em
      }
      td {
        text-align: right;
      }
      td:first-child {
        text-align: left;
      }

      @keyframes Flashing {
        0%, 100% {
          opacity: 0;
        }

        50% {
          opacity: 1;
        }
      }


      .blink {
        animation: Blink 1.5s steps(2, start) infinite;
      }

      @keyframes Blink {
        to {
          visibility: hidden;
        }
      }

    </style>
    <div id="phone">
      <header id="header">
        <div>Smart Phone</div>
        <div id="internetType">WiFi: unconnected</div>
      </header>
      <main id="phoneContent">

        <div id="phoneSectionContent">
          <div id="phoneInfo">
            <h1 id="dialedNumber"></h1>
            <h4 id="menuNumbers"></h4>
          </div>


        </div>
      </main>
    </div>
  `,
  state,
  ctx => {

    ctx.start = () => {
      ctx.setState({ screen: 'loading', started: true})
      setTimeout(() => {
        ctx.setState({ screen: 'login' })
      }, 8000)
    }


  },
  ctx => {
    ctx.$phoneContent = ctx.$('#phoneContent')
    ctx.$header = ctx.$('#header')
    ctx.$internetType = ctx.$('#internetType')

    const hasInternet = (ctx.state.internet === 'data' && ctx.state.dataPlanActivated) || (ctx.state.internet === 'wifi' && ctx.state.wifiActivated)

    ctx.$internetType.innerHTML = `
      ${ctx.state.internet === 'wifi' ? 'WiFi' : 'Data'}: ${
        hasInternet
          ? 'connected'
          : 'unconnected'
      }
    `

    ctx.$header.classList.remove('hidden')
    ctx.$phoneContent.innerHTML = ''


    if (ctx.state.screen === 'loading') {
      ctx.$header.classList.add('hidden')
      ctx.$phoneContent.innerHTML = `
        <div class="loadingScreen">
          <h2 class="loadingAnimation">
            <span>Loading</span><span style="animation-delay: .11s">.</span><span style="animation-delay: .22s">.</span><span style="animation-delay: .33s">.</span>
          </h2>
        </div>
      `

    } else if (ctx.state.screen === 'login') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <h1>Select User Profile:</h1>
          <button onclick="alert('This profile has been indefinitely suspended for violating our terms of service')">default</button>
          <button id="newProfile">Create New Profile</button>
        </div>
      `

      ctx.$('#newProfile').onclick = () => {
        ctx.setState({ screen: 'newProfile' })
      }

    } else if (ctx.state.screen === 'newProfile') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="back">back</button>
          <div><input placeholder="first name"/></div>
          <div><input placeholder="last name"/></div>
          <div><input placeholder="birthday"/></div>
          <div><input placeholder="gender"/></div>
          <div><input placeholder="sexual orientation"/></div>
          <div><input placeholder="height"/></div>
          <div><input placeholder="weight"/></div>
          <button id="submit">submit</button>
        </div>
      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'login' })
      }

      ctx.$('#submit').onclick = () => {
        ctx.setState({ screen: 'loading' })
        setTimeout(() => {
          ctx.setState({ screen: 'home' })
        }, 4000)
      }

    } else if (ctx.state.screen === 'home') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="appMarket">App Market</button>
          <button id="phoneApp">Phone App</button>
          <button id="qrScanner">QR Scanner</button>
          <button id="settings" disabled>Settings</button>
          <button id="network">Network & Internet</button>
          ${ctx.state.appsInstalled.map(a => `<button id="${a.key}">${a.name}</button>`).join('')}
          <button id="logOut">Log Out</button>
        </div>
      `

      ctx.$('#appMarket').onclick = () => {
        ctx.setState({ screen: 'appMarket' })
      }
      ctx.$('#phoneApp').onclick = () => {
        ctx.setState({ screen: 'phoneApp' })
      }


      ctx.$('#network').onclick = () => {
        ctx.setState({ screen: 'network' })
      }

      ctx.state.appsInstalled.forEach(a => {
        ctx.$(`#${a.key}`).onclick = () => {
          ctx.setState({ screen: a.key })
        }
      })

      ctx.$('#logOut').onclick = () => {
        ctx.setState({ screen: 'loading' })
        setTimeout(() => {
          ctx.setState({ screen: 'login' })
        }, 4000)
      }

    } else if (ctx.state.screen === 'appMarket') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>

          <div>
            <input placeholder="search" id="appSearch">
            <table id="matchingApps"></table>
            <h3 id="searchError"></h3>
            ${hasInternet ? `
              <h3>Credits Balance: 0</h3>
              <button disabled>Purchase Credits</button>
            ` : ''}
          </div>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      const appSearch = ctx.$('#appSearch')

      const clean = txt => txt.toLowerCase().replaceAll(' ', '').replaceAll(':', '')

      appSearch.onkeyup = () => {
        if (hasInternet) {
          const searchTerm = clean(appSearch.value)

          ctx.$('#matchingApps').innerHTML = `
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Credits</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${searchTerm && APPS
                .filter(a => clean(a.name).includes(searchTerm))
                .map(a => `<tr>
                  <td>${a.name}</td>
                  <td>${a.size}</td>
                  <td>${a.price}</td>
                  <td>${
                    ctx.state.appsInstalled.some(_a => a.name === a.name)
                      ? `Downloaded`
                      : `<button id="${clean(a.name)}-download">Download</button></td>`

                  }
                  </tr>`).join('')
              }
            </tbody>
          `

          APPS.forEach(a => {
            const app = ctx.$(`#${clean(a.name)}-download`)
            if (app) app.onclick = () => {
              ctx.setState({ appsInstalled: [...ctx.state.appsInstalled, a]})
            }
          })

        } else {
          ctx.$('#searchError').innerHTML = 'Cannot connect to AppMarket. Please check your internet connection.'
        }
      }

    } else if (ctx.state.screen === 'network') {
      if (ctx.state.internet === 'wifi') {
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="data">Switch to Data</button>
            <h3>WiFi Status: Unconnected</h3>
            <h3>Network Name:
              <select>
                <option></option>
                <option>CapitalC</option>
                <option>ClickToAddNetwork</option>
                <option>ElectricLadyLand</option>
                <option>MyWiFi-9238d9</option>
                <option>NewNetwork</option>
                <option>XXX-No-Entry</option>
              </select>
            </h3>
            <input placeholder="password" type="password">
            <button id="connect">Connect</button>
            <h3 id="error"></h3>
          </div>
        `
        ctx.$('#data').onclick = () => {
          ctx.setState({ internet: 'data' })
        }

        ctx.$('#connect').onclick = () => {
          ctx.$('#error').innerHTML = 'Incorrect Password'
        }
      } else {
        // TODO add dropdowns for district ix
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="wifi">Switch to Wifi</button>
            <h3>Data Plan: ${ctx.state.dataPlanActivated ? 'TurboConnect' : 'unknown'}</h3>
            <div id="connectForm">
              <input id="spc" placeholder="SPC">
              <input id="districtIndex" placeholder="District Index">
              <input id="unlockCode" placeholder="Unlock Code">
              <button id="connectData">Connect</button>
            </div>
            <h3 id="error"></h3>
          </div>
        `
        ctx.$('#connectData').onclick = () => {
          ctx.$('#error').innerHTML = '<span class="blink">Connecting...</span>'

          setTimeout(() => {
            const spc = ctx.$('#spc').value
            const districtIndex = ctx.$('#districtIndex').value
            const unlockCode = ctx.$('#unlockCode').value

            if (spc === '00010-032991' && districtIndex === 'B47' && unlockCode === 'Qz8!9g97tR$f29') {
              ctx.$('#error').innerHTML = 'Success!'
              setTimeout(() => ctx.setState({ dataPlanActivated: true }), 2000)

            } else {
              ctx.$('#error').innerHTML = 'Invalid Credentials: service refused'

            }

          }, 3000)
        }

        ctx.$('#wifi').onclick = () => {
          ctx.setState({ internet: 'wifi' })
        }
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (ctx.state.screen === 'phoneApp') {
      ctx.$phoneContent.innerHTML = phoneMarkup()
      phoneBehavior(ctx)

      ctx.$('#hangup').onclick = () => {
        ctx.$('#dialedNumber').innerHTML = ''
        ctx.$('#menuNumbers').innerHTML = ''
        window.speechSynthesis.cancel()
        if (PhoneCall.active) PhoneCall.active.hangup()
        // PhoneCall.active.stateMachine.goto('start')
      }

      if (!ctx.state.dataPlanActivated) {
        setTimeout(() => {
          ctx.$('#keypad').innerHTML = '<div style="font-size:4em; margin: 0.75em; text-align: center">Cannot connect to service provider</div>'
        }, 400)
      }

    } else if (ctx.state.screen === 'payApp') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin-bottom: 0.25em">PayApp: Making Payment as easy as 1-2-3!</h2>
          <h3 style="margin: 0.5em 0">Current Balance: $${ctx.state.payAppBalance.toFixed(2)}</h3>

          <div style="margin-bottom: 0.4em">
            <h3>PayApp Address: </h3>
            <span style="font-size: 0.9em">0x308199aE4A5e94FE954D5B24B21B221476Dc90E9</span>
          </div>
          <div style="margin-bottom: 0.4em">
            <h3>Private Payment Key (PPK):</h3>
            <span style="font-size: 0.9em"><em>hidden</em></span>
            <div>(Don't share this with anyone! Including PayApp employees)</div>
          </div>

          <ol>
            <li><input id="recipient" placeholder="Recipient"></li>
            <li><input id="amount" placeholder="Amount" type="number"></li>
            <li><button id="sign">Sign Transaction</li>
          </ol>

          <div id="sptx"></div>
        </div>
      `
      // ff33083322f66413ea6fb21e7b6451d9922b14c1622ebff8da71a61a36de0cc8
      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
      ctx.$('#sign').onclick = () => {
        const amount = ctx.$('#amount').value
        const recipient = ctx.$('#recipient').value
        const $sptx = ctx.$('#sptx')

        $sptx.innerHTML = ''

        console.log(recipient, !recipient)
        if (!recipient) {
          $sptx.innerHTML = `Please input a valid recipient`
        }
        if (amount === 0) {
          $sptx.innerHTML = `Please input a value greater than 0`
        }
        if (amount > ctx.state.payAppBalance) {
          $sptx.innerHTML = `INVALID AMOUNT`
        }
      }
    }

  },
  (oldState, newState) => {
    Object.assign(state, newState)
  }
)
