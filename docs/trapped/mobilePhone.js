import {$, createComponent} from './$.js'
import {createSource, MAX_VOLUME} from './audio.js'
import {voices, say} from './voices.js'
import {StateMachine, CTX} from './stateMachine.js'
import {persist} from './persist.js'
import {ispCSNodes} from './cs/isp.js'
import {billingCSNodes} from './cs/billing.js'
import {disputeResolutionNodes} from './cs/dispute.js'
import {turboConnectNodes} from './cs/turboConnect.js'
import {globalState, calcIdVerifyCode, calcExchangeRecipientAddr, calcCryptoUSDExchangeRate, setColor} from './global.js'


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

    src0.stop()
    src1.stop()

    this.isRinging = false
  }

  hangup() {
    this.phoneAnswered = false
    this.dialed = []
    this.isRinging = false
    this.live = false
    this.answerTime = 0
    this.stateMachine?.kill?.()

    // PhoneCall.active = null
  }

  answer(stateMachine) {
    this.phoneAnswered = true
    this.answerTime = Date.now()
    this.stateMachine = stateMachine
    window.sm = stateMachine
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
        z-index: 1;
        pointer-events: none;
      }

      h4 {
        height: 1em;
        font-size: 1.5em;
      }


      #dialedNumber {
        font-size: 2.7em;
      }

      #menuNumbers {
        font-size: 1.5em;
        min-height: 1.1em;
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.5em;
        pointer-events: none;
        text-align: center;
        word-wrap: break-word;
      }


      #keypad {
        display: grid;
        grid-gap: 0;
        grid-template-columns: repeat(3, 1fr);
        border-top: 1px solid;
        border-bottom: 1px solid;
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
        <h4 id="callTime"></h4>
        <h1 id="dialedNumber"></h1>
        <h4 id="menuNumbers"></h4>
      </div>
      <div id="keypad"></div>

<!--
      <ul id="menu">
        <li>Phone</li>
        <li>Contacts</li>
        <li>Voice Mail</li>
      </ul>
      -->
      <div style="padding-top: 0.5em; display: flex; justify-content: space-evenly">
        <button id="home">Back</button>
        <button id="hangup">Hangup</button>
      </div>
    </div>
  `
}






function formatPhoneNumber(num) {
  if (num.length < 4) return num.slice(0, 3).join('')
  if (num.length < 8) return `${num.slice(0, 3).join('')}-${num.slice(3, 7).join('')}`
  if (num.length < 11) return `${num.slice(0, 3).join('')}-${num.slice(3, 6).join('')}-${num.slice(6, 10).join('')}`
  else return `${num[0]}-${num.slice(1, 4).join('')}-${num.slice(4, 7).join('')}-${num.slice(7, 11).join('')}`

}



const padZero = n => n < 10 ? '0' + n : '' +  n
function setCallTime(ctx, phone) {
  if (!phone.answerTime) return
  const $time = ctx.$('#callTime')


  ctx.setInterval(() => {
    if (phone.phoneAnswered) {
      const totalSecondsElapsed = Math.floor((Date.now() - phone.answerTime) / 1000)
      const secondsElapsed = totalSecondsElapsed % 60
      const minutesElapsed = Math.floor(totalSecondsElapsed / 60)

      $time.innerHTML = `${padZero(minutesElapsed)}:${padZero(secondsElapsed)}`
    } else {
      $time.innerHTML = ``
    }

  })
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

      // ISP
      if (dialed === '18005552093') {
        await phone.ringTone(3)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
            paymentCode: [],
            routerIdentifier: []
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {
              globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phoneCall', payload: { connection: 'isp', text } }})

              sm.ctx.history.push(text)
              say(await voices.then(vs => vs.filter(v => v.lang === 'en-US')[0]), text)
            },
          },
          ispCSNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')

      }

      // ISP Billing
      else if (dialed === '18885559483') {
        await phone.ringTone(1)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {
              globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phoneCall', payload: { connection: 'billing', text } }})

              sm.ctx.history.push(text)
              // TODO different voice
              say(await voices.then(vs => vs.filter(v => v.lang === 'en-US')[0]), text)
            },
          },
          billingCSNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      // Billing dispute resolution administrator
      else if (dialed === '18007770836') {
        await phone.ringTone(4)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {
              globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phoneCall', payload: { connection: 'billingDispute', text } }})

              sm.ctx.history.push(text)
              // TODO different voice
              const vs = await voices
              const voice = vs.find(v => v.voiceURI.includes('Daniel') && v.lang === 'en-GB') || vs.filter(v => v.lang === 'en-US')[0]
              say(voice, text)
            },
          },
          disputeResolutionNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }


      // SSO
      else if (dialed === '18182225379') {
        await phone.ringTone(40)

        // if (!phone.live) return

        // const stateMachine = new StateMachine(
        //   new CTX({
        //     currentNode: 'start',
        //   }),
        //   {
        //     defaultWait: 1000,
        //     async onUpdate({text}, sm) {
        //       sm.ctx.history.push(text)
        //       // TODO different voice
        //       const vs = await voices
        //       const voice = vs.find(v => v.voiceURI.includes('Daniel') && v.lang === 'en-GB') || vs.filter(v => v.lang === 'en-US')[0]
        //       say(voice, text)
        //     },
        //   },
        //   disputeResolutionNodes
        // )
        // phone.answer(stateMachine)
        // setCallTime(ctx, phone)

        stateMachine.next('')
      }

      // TurboConnect
      else if (dialed === '18004443830') {
        await phone.ringTone(2)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {
              globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phoneCall', payload: { connection: 'turboConnect', text } }})

              sm.ctx.history.push(text)
              // TODO different voice
              const vs = await voices
              const voice = vs.find(v => (
                  v.voiceURI.includes('Reed') && (
                    v.lang === 'fi-FI'
                    || v.lang === 'de-DE'
                  )
                ) || v.voiceURI.includes('Reed')
              ) || vs.filter(v => v.lang === 'en-US')[0]
              say(voice, text)
            },
          },
          turboConnectNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      else if (dialed.length === 11) {
        await phone.ringTone(40)
      }
    },
    (id) => ctx.$(`#${id}`)
  )


  ctx.$('#dialedNumber').innerHTML = formatPhoneNumber(phoneCall.dialed.slice(0, 11))
  ctx.$('#menuNumbers').innerHTML = phoneCall.dialed.slice(11).join('')

  ctx.$('#keypad').append(...phoneCall.$keypad)

  setCallTime(ctx, phoneCall)

  window.pc = phoneCall
}




const APPS = [
  { name: 'Alarm', key: 'alarm', size: 128, price: 1 },
  { name: 'Bathe', key: 'bathe', size: 128, price: 1 },
  { name: 'CryptoMinerPlus', key: 'alarm', size: 128, price: 1 },
  { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
  { name: 'Elevate', key: 'elevate', size: 128, price: 1 },
  { name: 'Identity Verfier', key: 'idVerifier', size: 128, price: 0 },
  { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
  { name: 'Lumin', key: 'lumin', size: 128, price: 0 },
  { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
  { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
  { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
  { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
  { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
  { name: 'Shayd', key: 'shayd', size: 128, price: 1 },
  { name: 'SmartLock', key: 'lock', size: 128, price: 0 },
  { name: 'SmartPlanter', key: 'planter', size: 256, price: 0 },
  { name: 'SmartPro Security Camera', key: 'camera', size: 128, price: 1 },
  { name: 'Toastr', key: 'toastr', size: 128, price: 0 },
]


const state = persist('__MOBILE_STATE', {
  started: false,
  screen: 'loading',
  internet: 'wifi',
  dataPlanActivated: false,
  wifiNetwork: '',
  userNames: {0: 'default'},
  // appsInstalled: {0: []},
  // payAppBalance: {0: 0},
  // textMessages: {0: []},
  // moneyMinerBalance: {0: 0},
  // exchangeCryptoBalance: {0: 0},
  // exchangeUSDBalance: {0: 0},
  newUsers: 0,
  currentUser: 0,
  lampOn: false,
  luminPaired: false,
  toasterPaired: false,
  planterPaired: false,
  plantStatus: 'Poor',
  smartLockPaired: false,
  smartLockOpen: false,
  messageViewerMessage: '',
  availableActions: [],
  userData: {
    0: {
      appsInstalled: [],
      payAppBalance: 0,
      textMessages: [],
      moneyMinerBalance: 0,
      exchangeCryptoBalance: 0,
      exchangeUSDBalance: 0,
      notePadValue: ''
    }
  }
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

      button:disabled {
        user-select: none;
        cursor: no-drop;
      }

      h1 {
        font-size: 1.9em;
        margin: 0.7em 0;
      }

      textarea {
        padding: 0.25em;
        resize: none;
      }

      textarea:focus {
        outline: 0;
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

      .tm {
        cursor: pointer;
        border-top: 1px dashed;
        padding: 0.5em;
      }

      .tm:first-child {
        border-top: 0;
      }

      .tm:hover {
        text-decoration: underline
      }

      .tm-from {
        font-size: 0.75em;
        font-weight: bolder;
      }

      .unread {
        font-weight: bolder;
        background: #ccc;
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

    ctx.phoneNotifications = () => ctx.state.userData[ctx.state.currentUser].textMessages.reduce((a, c) => c.read ? a : a + 1, 0)

    ctx.newText = (txt) => {
      ctx.setState({
        userData: {
          ...ctx.state.userData,
          [ctx.state.currentUser]: {
            ...ctx.state.userData[ctx.state.currentUser],
            textMessages: [...ctx.state.userData[ctx.state.currentUser].textMessages, {
              ...txt,
              read: false
            }]
          }
        }
      })
    }

    ctx.setUserData = (userData) => {
      ctx.setState({
        userData: {
          ...ctx.state.userData,
          [ctx.state.currentUser]: {
            ...ctx.state.userData[ctx.state.currentUser],
            ...userData
          }
        }
      })
    }

    ctx.setInterval = cb => {
      clearInterval(ctx.interval)
      const wait = globalState.eventLoopDuration - (Date.now() - globalState.eventLoopStartTime) % globalState.eventLoopDuration

      cb()
      setTimeout(() => {
        ctx.interval = setRunInterval(cb, globalState.eventLoopDuration)
      }, wait)
    }
  },
  ctx => {
    clearInterval(ctx.interval)

    ctx.$phoneContent = ctx.$('#phoneContent')
    ctx.$header = ctx.$('#header')
    ctx.$internetType = ctx.$('#internetType')

    const {
      screen,
      currentUser,
      dataPlanActivated,
      wifiNetwork,
      internet,
      userData,
      userNames,
      bluetoothEnabled,
      luminPaired,
      toasterPaired,
      planterPaired,
      lampOn
    } = ctx.state

    const currentUserData = userData[currentUser]

    const {
      appsInstalled,
      payAppBalance,
      textMessages,
      moneyMinerBalance,
      exchangeCryptoBalance,
      exchangeUSDBalance,
      notePadValue
    } = currentUserData

    const inInternetLocation = globalState.location !== 'externalHallway' && globalState.location !== 'stairway'
    const wifiConnected = internet === 'wifi' && wifiNetwork && inInternetLocation
    const dataConnected = internet === 'data' && dataPlanActivated && inInternetLocation
    const hasInternet = dataConnected || wifiConnected


    if (globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
      ctx.newText({
        from: '+7 809 3390 753',
        value: `United Package Delvery: your package has been delivered to your front door <RENDER_ERROR:/home/usr/img/package-dliver83y.jpg> Please pay delivery fee: 0xb0b9d337b68a69f5560969c7ab60e711ce83276f `
      })
    }



    ctx.$internetType.innerHTML = `
      ${internet === 'wifi' ? 'WiFi' : 'Data'}: ${
        hasInternet
          ? 'connected'
          : 'unconnected'
      }
    `

    ctx.$header.classList.remove('hidden')
    ctx.$phoneContent.innerHTML = ''

    const unreadTextCount = textMessages.reduce((a, c) => c.read ? a : a + 1, 0)

    // TODO: none of the apps should work if you're outside the apartment

    if (screen === 'loading') {
      ctx.$header.classList.add('hidden')
      ctx.$phoneContent.innerHTML = `
        <div class="loadingScreen">
          <h2 class="loadingAnimation">
            <span>Loading</span><span style="animation-delay: .11s">.</span><span style="animation-delay: .22s">.</span><span style="animation-delay: .33s">.</span>
          </h2>
        </div>
      `

    } else if (screen === 'login') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <h1>Select User Profile:</h1>
          ${
            Object.keys(userNames).sort().map(u => `<button id="user-${u}">${userNames[u]}</button>`).join('')
          }
          <button id="newProfile">Create New Profile</button>
        </div>
      `

      window.speechSynthesis.cancel()
      if (PhoneCall.active) PhoneCall.active.hangup()

      ctx.$('#user-0').onclick = () => {
        alert('This profile has been indefinitely suspended for violating our terms of service. Please contact us at 1-818-222-5379 if you believe there has been a mistake')
      }

      Object.keys(userNames).sort().forEach(id => {
        if (id === '0') return
        ctx.$(`#user-${id}`).onclick = () => {
          ctx.setState({
            screen: 'loading'
          })

          setTimeout(() => {
            ctx.setState({
              currentUser: id,
              screen: 'home'
            })
          }, 1000)
        }
      })

      ctx.$('#newProfile').onclick = () => {
        ctx.setState({ screen: 'newProfile' })
      }

    } else if (screen === 'newProfile') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="back">back</button>
          <div><input placeholder="first name" id="firstName" /></div>
          <div><input placeholder="last name"/></div>
          <div><input placeholder="birthday"/></div>
          <div><input placeholder="gender"/></div>
          <div><input placeholder="sexual orientation"/></div>
          <div><input placeholder="height"/></div>
          <div><input placeholder="weight"/></div>
          <button id="submit">submit</button>
          <h3 id="error"></h3>
        </div>
      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'login' })
      }

      ctx.$('#submit').onclick = () => {
        const firstName = ctx.$('#firstName').value
        if (!firstName) {
          ctx.$('#error').innerHTML = 'Please provide a first name'
          return
        } else {
          ctx.$('#error').innerHTML = ''
        }
        const id = ctx.state.newUsers + 1

        ctx.setState({
          screen: 'loading',
          currentUser: id,
          newUsers: id,
          userNames: {
            ...userNames,
            [id]: firstName
          },
          userData: {
            ...userData,
            [id]: {
              appsInstalled: [],
              textMessages: [],
              payAppBalance: 0,
              moneyMinerBalance: 0,
              exchangeCryptoBalance: 0,
              exchangeUSDBalance: 0,
              notePadValue: ''
            }
          }
        })
        setTimeout(() => {
          ctx.setState({ screen: 'home' })
        }, 4000)
      }

    } else if (screen === 'home') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex: 1; display: flex">
          <div style="display: flex; flex-direction: column; justify-content: space-between; flex: 1">
            <div>
              <button id="appMarket">App Market</button>
              <button id="phoneApp">Phone App</button>
              <button id="textMessage">Text Messages${unreadTextCount ? ` (${unreadTextCount})` : ''}</button>
              <button id="settings">Settings</button>
              <button id="network">Network & Internet</button>
              ${appsInstalled.map(a => `<button id="${a.key}">${a.name}</button>`).join('')}
              <button id="logOut">Log Out</button>
            </div>

            <div style="display: flex; justify-content: flex-end">
              <button id="close" style="font-size: 1.25em">Close</button>
            </div>
          </div>
        </div>
      `

      const appScreens = ['appMarket', 'phoneApp', 'textMessage', 'settings', 'network', ...appsInstalled.map(a => a.key)]

      for (let screen of appScreens) {
        ctx.$('#' + screen).onclick = () => {
          ctx.setState({ screen })
        }
      }


      ctx.$('#close').onclick = () => {
        ctx.parentElement.close()
      }

      ctx.$('#logOut').onclick = () => {
        ctx.setState({ screen: 'loading' })
        setTimeout(() => {
          ctx.setState({ screen: 'login' })
        }, 4000)
      }

    } else if (screen === 'appMarket') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>

          <div id="appContent">
            <input placeholder="search" id="appSearch">
            <table id="matchingApps"></table>
            <h3 id="searchError"></h3>
            ${hasInternet ? `
              <h3 style="margin-top: 0.5em; margin-bottom: 0.25em">Credits Balance: 0</h3>
              <button id="purchase">Purchase Credits</button>
              <h4 id="error"></h4>
            ` : ''}
          </div>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      if (ctx.$('#purchase')) ctx.$('#purchase').onclick = () => {
        ctx.$('#error').innerHTML = 'Error: Cannot purchase Credits at this time'
      }

      const appSearch = ctx.$('#appSearch')

      const clean = txt => txt.toLowerCase().replaceAll(' ', '').replaceAll(':', '')

      const search = () => {
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
                    appsInstalled.some(_a => _a.name === a.name)
                      ? `Downloaded`
                      : `<button id="${clean(a.name)}-download" ${a.price > 0 ? 'disabled' : ''}>Download</button></td>`

                  }
                  </tr>`).join('')
              }
            </tbody>
          `

          APPS.forEach(a => {
            const app = ctx.$(`#${clean(a.name)}-download`)
            if (app) app.onclick = () => {

              ctx.$('#appContent').innerHTML = `<h4 class="blink">Downloading: ${a.name}</h4>`

              setTimeout(() => {
                if (ctx.$('#appContent')) ctx.$('#appContent').innerHTML = `<h4>Successfully downloaded: ${a.name}!</h4>`
              }, 2700)
              setTimeout(() => {
                ctx.setState({
                  appMarketPreSearch: '',
                  userData: {
                    ...userData,
                    [currentUser]: {
                      ...userData[currentUser],
                      appsInstalled: [...appsInstalled, a]
                    }
                  }
                })
              }, 3300)
            }
          })

        } else {
          ctx.$('#searchError').innerHTML = 'Cannot connect to AppMarket. Please check your internet connection.'
        }
      }

      appSearch.onkeyup = () => {
        ctx.state.appMarketPreSearch = ''
        search()
      }

      if (ctx.state.appMarketPreSearch) {
        appSearch.value = ctx.state.appMarketPreSearch
        search()
      }

    } else if (screen === 'network') {
      if (ctx.state.internet === 'wifi') {
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="data">Switch to Data</button>
            <h3>Current Network: ${wifiNetwork ? 'InpatientRehabilitationServices' : 'null'}</h3>
            ${
              bluetoothEnabled
                ? `
                  <h3 style="margin-top: 0.4em">Network Name:</h3>
                  <select id="networkName" style="margin: 0.25em 0">
                    <option></option>
                    <option value="Alien Nation">Alien Nation</option>
                    <option value="CapitalC">CapitalC</option>
                    <option value="ClickToAddNetwork">ClickToAddNetwork</option>
                    <option value="ElectricLadyLand" ${inInternetLocation && wifiNetwork === 'ElectricLadyLand' ? 'selected' : ''}>ElectricLadyLand</option>
                    ${globalState.routerReset ? `<option value="InpatientRehabilitationServices" ${inInternetLocation && wifiNetwork === 'InpatientRehabilitationServices' ? 'selected' : ''}>InpatientRehabilitationServices</option>` : ''}
                    <option value="ISP-Default-89s22D">ISP-Default-89s22D</option>
                    <option value="MyWiFi-9238d9">MyWiFi-9238d9</option>
                    <option value="NewNetwork">NewNetwork</option>
                    <option value="XXX-No-Entry">XXX-No-Entry</option>
                  </select>
                  <input id="networkPassword" placeholder="password" type="password">
                  <button id="connect">Connect</button>
                `
                : `<h3>Please enable Bluetooth in your device Settings to view available networks</h3>`
            }

            <h3 id="error"></h3>
          </div>
        `
        ctx.$('#data').onclick = () => {
          ctx.setState({ internet: 'data' })
        }

        if (ctx.$('#connect')) ctx.$('#connect').onclick = () => {
          const networkName = ctx.$('#networkName').value
          const networkPassword = ctx.$('#networkPassword').value

          if (
            (networkName === 'InpatientRehabilitationServices' && networkPassword === 'StompLookAndListen123')
            || (networkName === 'ElectricLadyLand' && networkPassword === 'CrosstownTraffic007')
          ) {
            ctx.$('#error').innerHTML = 'Connecting...'

            setTimeout(() => {
              if (globalState.wifiActive) {
                ctx.$('#error').innerHTML = 'Success!'
                setTimeout(() => {
                  ctx.setState({ wifiNetwork: networkName })
                }, 2000)
              } else {
                ctx.$('#error').innerHTML = 'ServiceError: No signal detected'
              }
            }, 3000)

          } else {
            ctx.$('#error').innerHTML = 'Connecting...'
            setTimeout(() => {
              ctx.$('#error').innerHTML = 'Incorrect Password'
            }, 500)
          }
        }
      } else {
        // TODO add dropdowns for district ix
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="wifi">Switch to Wifi</button>
            <h3>Data Plan: ${dataPlanActivated ? 'TurboConnect FREE TRIAL for MOBILE + DATA Plan' : 'null'}</h3>
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
              setTimeout(() => {
                ctx.setState({ dataPlanActivated: true })
                ctx.newText({
                  from: '1-800-444-3830',
                  value: 'You have subscribed: TurboConnect FREE TRIAL for MOBILE + DATA Plan! Please Dial 1-800-444-3830 on <strong>*PhoneApp*</strong> for all question',
                })
              }, 2000)

              setTimeout(() => {
                ctx.newText({
                  from: '1-800-777-0836',
                  value: `Hello new friend to receive the ADVANCED wealth-generation platform to provide high-growth crypto currency investment methods simply follow the advice of our experts to achieve stable and continuous profits. We have the world's top analysis team for wealth generation But how does it work you might ask?. First you download the <strong>MoneyMiner</strong> application to your device. Second you participate in a proprietary proof of work (pow) protocol to mine crypto. Third you can optionally transfer your crypto to participating exchanges such as <strong>Currency Xchange</strong> to exchange your crypto for fiat currencies such as United States Dollars. This opportunity is once in your life time. `,
                })
              }, 60000)

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

    } else if (screen === 'phoneApp') {
      ctx.$phoneContent.innerHTML = phoneMarkup()
      phoneBehavior(ctx)

      ctx.$('#hangup').onclick = () => {
        ctx.$('#dialedNumber').innerHTML = ''
        ctx.$('#menuNumbers').innerHTML = ''
        window.speechSynthesis.cancel()
        if (PhoneCall.active) PhoneCall.active.hangup()
        // PhoneCall.active.stateMachine.goto('start')
      }

      if (!dataPlanActivated) {
        setTimeout(() => {
          ctx.$('#keypad').innerHTML = '<div style="font-size:4em; margin: 0.75em; text-align: center">Cannot connect to service provider</div>'
        }, 400)
      }

    } else if (screen === 'payApp') {

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin-bottom: 0.25em">PayApp: Making Payment as easy as 1-2-3!</h2>
          <h3 style="margin: 0.5em 0">Current $ Balance: $${payAppBalance.toFixed(2)}</h3>

          <div style="margin-bottom: 0.6em">
            <h3>My PayApp Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h3>
            <span style="font-size: 0.9em">0x308199aE4A5e94FE954D5B24B21B221476Dc90E9</span>
          </div>
          <!--
            <div style="margin-bottom: 0.6em">
              <h3>Private Payment Key (PPK):</h3>
              <span style="font-size: 0.9em"><em>hidden</em></span>
              <div>(Don't share this with anyone! Including PayApp employees)</div>
            </div>
          -->

          <h3>Send $</h3>
          <ol>
            <li><input id="recipient" placeholder="Recipient Address"></li>
            <li style="margin:0.25em 0"><input id="amount" placeholder="Amount" type="number"></li>
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
        const amount = Number(ctx.$('#amount').value)
        const recipient = ctx.$('#recipient').value.toLowerCase().trim()

        const $sptx = ctx.$('#sptx')

        $sptx.innerHTML = ''

        if (!recipient) {
          $sptx.innerHTML = `Please input a valid recipient`
          return
        }
        if (amount <= 0 || !amount) {
          $sptx.innerHTML = `Please input a value greater than 0`
          return
        }
        if (amount > payAppBalance) {
          $sptx.innerHTML = `INVALID AMOUNT`
          return
        }

        // globalState.payments = {}

        const sptx = Math.floor(Math.random()*100000000000000000)

        globalState.payments[sptx] = {
          sptx,
          recipient,
          amount,
          timestamp: Date.now(),
          received: false
        }

        ctx.setUserData({
          payAppBalance: payAppBalance - amount
        })


        setTimeout(() => {
          ctx.$('#sptx').innerHTML = `Secure Payment Transaction (SPTX) identifier: ${sptx}`
        }, 2000)

      }

    } else if (screen === 'settings') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <button id="bluetooth">${bluetoothEnabled ? 'Disable' : 'Enable'} Bluetooth</button>
        </div>
      `

      ctx.$('#bluetooth').onclick = () => {
        ctx.setState({ bluetoothEnabled: !bluetoothEnabled })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'messageViewer') {

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Message Viewer</h2>
          <h4>MESSAGE:</h4>
          <p id="message">${ctx.state.messageViewerMessage}</p>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'textMessage') {

      // dataPlanActivated


      const messageList = `<ul style="list-style: none; border: 1px dashed; margin-top: 0.4em">${textMessages.map((m, ix) => `
        <li id="tm-${ix}" class="tm ${!m.read ? 'unread' : ''}">
          <div class="tm-from">${m.from || 'unknown'}</div>
          <div>${(!m.read ? '<em>(unread!)</em> ' : '') + m.value.slice(0, 19) + '...'}</div>
        </li>
      `).join('')}</ul`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Text Messages</h2>

          ${
            dataPlanActivated ? messageList : '<h3>Cannot retrieve text messages</h3>'
          }
        </div>
      `

      textMessages.forEach((m, ix) => {
        ctx.$(`#tm-${ix}`).onclick = () => {
          ctx.setState({
            activeTextMessage: ix,
            screen: 'textMessageIndividual',
            userData: {
              ...userData,
              [currentUser]: {
                ...currentUserData,
                textMessages: textMessages.map((_m, _ix) => _ix === ix
                  ? {
                    ..._m,
                    read: true
                  }
                  : _m
                )

              }
            }
          })
        }
      })

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'textMessageIndividual') {

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="textMessage">Back</button>
          <p style="word-wrap: break-word">${textMessages[ctx.state.activeTextMessage].value}</p>
        </div>
      `

      ctx.$('#textMessage').onclick = () => {
        ctx.setState({ screen: 'textMessage' })
      }

    } else if (screen === 'qrScanner') {

      const objects = ctx.state.availableActions.map(a => `<button id="qr-${a.value}" style="margin-right: 0.25em">${a.text}</button>`).join('')
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>QR SCANNER</h2>
          <div style="padding: 0.5em">${objects}</div>
          <h4 id="error"></h4>
        </div>
      `

      ctx.state.availableActions.forEach(a => {
        ctx.$('#qr-'+a.value).onclick = () => {
          if (a.qr) {
            if (a.qr.screen === 'messageViewer' && !appsInstalled.some(a => a.key === 'messageViewer')) {
              ctx.$('#error').innerHTML = 'Please download the Message Viewer app from the AppMarket to view this message'
            } else {
              ctx.setState(a.qr)
            }
          } else {
            ctx.$('#error').innerHTML = 'This item does not have a qr code'
          }
        }
      })

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'lumin') {
      // const localDevices = {
      //   livingRoom: 'Lumin Lamp A32',
      //   livingRoom: 'Lumin Lamp A32',
      // }[globalState.location]

      // TODO pair by room

      const mainInterface = `
        <button id="offOn">${lampOn ? 'Turn Off' : 'Turn On'}</button>
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          ${
            bluetoothEnabled
              ? luminPaired
                ? mainInterface
                : `<button id="pairLumin">Pair Device</button>`
              : `<h3>Please enable blue tooth to pair local devices</h3>`
          }
        </div>
      `

      if (ctx.$('#pairLumin')) ctx.$('#pairLumin').onclick = () => {
        ctx.setState({ luminPaired: true })
      }

      if (ctx.$('#offOn')) ctx.$('#offOn').onclick = () => {

        const lampStatus = !lampOn

        if (lampStatus) {
          setColor('--bg-color', '#fff')
          setColor('--primary-color', '#000')
        } else {
          setColor('--bg-color', 'var(--dark-color)')
          setColor('--primary-color', 'var(--light-color)')
        }
        globalState.lightsOn = lampStatus
        ctx.setState({ lampOn: lampStatus })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'idVerifier') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3>WARNING: This device already has another Identity Verifier App installed. This may affect performance</h3>

          <h1>Identity Verifier Code (IVC): <span id="idCode"></span></h1>
          <h2 id="timeRemaining"></h2>

        </div>

      `

      ctx.setInterval(() => {
        const msSinceUpdate = Date.now() - globalState.idVerifierUpdate
        const secondsSinceUpdate = msSinceUpdate / 1000

        ctx.$('#timeRemaining').innerHTML = 60 - (Math.floor(secondsSinceUpdate))
        ctx.$('#idCode').innerHTML = calcIdVerifyCode(currentUser)
      }, 1000)

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'moneyMiner') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Welcome to  $ Money Miner $</h2>
          <h4>My Address:</h4>
          <h4 style="word-wrap: break-word; margin-bottom: 0.4em">0x5f9fc040c204724c833a777516a06ffe88b81819</h4>
          <h4>To mine crypto, click the button below ⬇</h4>
          <button id="mine">Mine Crypto</button>

          <h4>Crypto Balance: <span id="cryptoBalance">${moneyMinerBalance}</span></h4>

          <h3>Send</h3>
          <input id="recipient" placeholder="recipient">
          <input id="amount" placeholder="amount" type="number">
          <button id="send">Send</button>

          <h4 id="error"></h4>

          <h4>FAQ</h4>
          <p><strong>Q:</strong> How do I mine Crypto?</p>
          <p><strong>A:</strong> In order to mine crypto, all you need to do is click the <strong>"Mine Crypto"</strong> button in the Money Miner interface. Each click will mine a new Crypto Coin.</p>

          <p><strong>Q:</strong> How can I convert crypto to $?</p>
          <p><strong>A:</strong> Exchanging crypto is easy! Just download the <strong>Currency Xchange App</strong>, create an account, and send your crypto to your new address! </p>

          <p><strong>Q:</strong> Can other Smart Devices mine Crypto for me?</p>
          <p><strong>A:</strong> Yes! Select smart devices can be configured to mine Crypto in order to create a passive income stream. In order to configure these devices, please download the <strong>CryptoMinerPlus App!</strong></p>

        </div>

      `

      ctx.$('#mine').onclick = () => {
        ctx.setUserData({
          moneyMinerBalance: moneyMinerBalance + 1
        })
      }

      ctx.$('#send').onclick = () => {
        const amount = Number(ctx.$('#amount').value)
        const recipient = ctx.$('#recipient').value.trim()

        if (amount > moneyMinerBalance || amount < 0 || !amount) {
          ctx.$('#error').innerHTML = 'Error: invalid amount'
          return
        } else {
          ctx.$('#error').innerHTML = ''
        }

        ctx.setUserData({
          moneyMinerBalance: moneyMinerBalance - amount,
          exchangeCryptoBalance: exchangeCryptoBalance + (
            recipient === calcExchangeRecipientAddr(currentUser)
              ? amount
              : 0
          )
        })


        ctx.$('#amount').value = ''
        ctx.$('#recipient').value = ''
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'exchange') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Currency Xchange</h2>
          <h3 style="margin-bottom: 0.4em">Temporary Recipient Address: <div id="tempAddr" style="word-wrap: break-word; border: 1px dotted; padding: 0.2em; margin: 0.2em 0">${calcExchangeRecipientAddr(currentUser)}</div> (Valid for <span id="timeRemaining"></span> more seconds)</h3>
          <em>Recipient addresses are cycled every 60 seconds for security purposes. Any funds sent to an expired recipient address will be lost</em>

          <div style="margin: 0.6em 0">
            <h3>Exchange Rates (<em>Live!</em>)</h3>
            <table style="border: 1px solid; margin-bottom: 0.4em">
              <tr>
                <td style="border: 1px solid">$1.00</td>
                <td id="usdC" style="border: 1px solid"></td>
              </tr>
             <tr>
                <td style="border: 1px solid">C 1</td>
                <td id="cUSD" style="border: 1px solid"></td>
              </tr>
            </table>

            <div>
              <div>
                <input id="buyAmount" placeholder="Buy $ (val)" type="number"> <button id="buyUSD">BUY</button>
              </div>
              <div>
                <input id="sellAmount" placeholder="Sell $ (val)" type="number"> <button id="sellUSD">SELL</button>
              </div>
            </div>
            <h4 id="tradeError"></h4>
          </div>

          <div style="margin: 0.6em 0">
            <h3>Crypto Balance: ${exchangeCryptoBalance.toFixed(6)}</h3>
            <h3>$ Balance: $${exchangeUSDBalance.toFixed(6)}</h3>

            <h4 style="margin: 0.4em 0">Send Funds</h4>
            <input id="sendCryptoAddress" placeholder="Send Crypto Address" style="width: 90%; margin-bottom: 0.4em">
            <input id="sendCryptoAmount" placeholder="Send Crypto (val)" type="number"> <button id="sendCrypto">SEND</button>
            <input id="sendUSDAddress" placeholder="Send $ Address" style="width: 90%; margin-bottom: 0.4em">
            <input id="sendUSDAmount" placeholder="Send $ (val)" type="number"> <button id="sendUSD">SEND</button>
            <h4 id="sendError"></h4>
          </div>

        </div>

      `

      ctx.setInterval(() => {
        const msSinceUpdate = Date.now() - globalState.idVerifierUpdate
        const secondsSinceUpdate = msSinceUpdate / 1000

        const seconds = (Math.floor(secondsSinceUpdate))


        ctx.$('#timeRemaining').innerHTML = 60 - seconds
        if (Math.random() < 0.1)  {
          ctx.$('#tempAddr').innerHTML = 'ERROR: Invalid signing key'
        } else if (ctx.$('#tempAddr').innerHTML.includes('ERROR') || seconds < 2) {
          ctx.$('#tempAddr').innerHTML = calcExchangeRecipientAddr(currentUser)
        }

        ctx.$('#usdC').innerHTML = 'C ' +(1 / calcCryptoUSDExchangeRate()).toFixed(6)
        ctx.$('#cUSD').innerHTML = '$' + calcCryptoUSDExchangeRate().toFixed(6)

      })

      ctx.$('#sendCrypto').onclick = () => {
        const amount = Number(ctx.$('#sendCryptoAmount').value)
        const recipient = ctx.$('#sendCryptoAddress').value

        if (!amount || amount < 0) {
          ctx.$('#sendError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#sendError').innerHTML = ''

        }

        let vals = {}
        if (recipient === calcExchangeRecipientAddr(currentUser)) {
          // pass

        } else if (recipient === '0x5f9fc040c204724c833a777516a06ffe88b81819') {
          ctx.setUserData({
            moneyMinerBalance: moneyMinerBalance + amount,
            exchangeCryptoBalance: exchangeCryptoBalance - amount
          })

        } else {
          ctx.setUserData({
            exchangeCryptoBalance: exchangeCryptoBalance - amount
          })
        }

        ctx.$('#sendCryptoAmount').value = ''
        ctx.$('#sendCryptoAddress').value = ''

      }

      ctx.$('#sendUSD').onclick = () => {
        const amount = Number(ctx.$('#sendUSDAmount').value)
        const recipient = ctx.$('#sendUSDAddress').value

        if (!amount || amount < 0) {
          ctx.$('#sendError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#sendError').innerHTML = ''

        }

        let vals = {}
        if (recipient === '0x308199aE4A5e94FE954D5B24B21B221476Dc90E9') {
          ctx.setUserData({
            payAppBalance: payAppBalance + amount,
            exchangeUSDBalance: exchangeUSDBalance - amount
          })


          if (payAppBalance === 0 && !textMessages.some(m => m.from === '1-800-333-7777')) {
            ctx.newText({
              from: '1-800-333-7777',
              value: 'Triple your $$$ !!! → → → 0x3335d32187a49be186c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be186c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be186c88d41c610538b412f333 ← ← ←',
            })
          }

        } else {
          ctx.setUserData({
            exchangeUSDBalance: exchangeUSDBalance - amount
          })
        }

        ctx.$('#sendUSDAmount').value = ''
        ctx.$('#sendUSDAddress').value = ''
      }

      ctx.$('#buyUSD').onclick = () => {
        const buy$ = Number(ctx.$('#buyAmount').value)
        const sellC = buy$ / calcCryptoUSDExchangeRate()

        if (!buy$ || buy$ < 0 || sellC > exchangeCryptoBalance) {
          ctx.$('#tradeError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#tradeError').innerHTML = ''
        }

        ctx.setUserData({
          exchangeUSDBalance: exchangeUSDBalance + buy$,
          exchangeCryptoBalance: exchangeCryptoBalance - sellC
        })

        ctx.$('#buyAmount').value = ''

      }

      ctx.$('#sellUSD').onclick = () => {
        const sell$ = Number(ctx.$('#sellAmount').value)
        const buyC = sell$ / calcCryptoUSDExchangeRate()

        if (!sell$ || sell$ < 0 || sell$ > exchangeUSDBalance) {
          ctx.$('#tradeError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#tradeError').innerHTML = ''
        }

        ctx.setUserData({
          exchangeUSDBalance: exchangeUSDBalance - sell$,
          exchangeCryptoBalance: exchangeCryptoBalance + buyC
        })

        ctx.$('#buyAmount').value = ''


      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'lock') {
      // todo: make it so you can pair with other smartlocks
      const mainContent = ctx.state.smartLockPaired
        ? `
          <h3>Lock Status: ${globalState.smartLockOpen ? 'Unlocked' : 'Locked'}</h3>
          <button id="toggleSmartLock">${globalState.smartLockOpen ? 'Lock' : 'Unlock'}</button>
        `
        : `<button id="pairSmartLock">Pair Device</button>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>SmartLock 🔒</h2>
          <p>SmartLock Technology<sup>TM</sup> keeps you safe</p>
          ${bluetoothEnabled
            ? inInternetLocation ? mainContent : '<h3>Cannot find device</h3>'
            : `
              <h3>Cannot pair device: Please Enable Bluetooth</h3>
            `
          }
          <h3 id="error"></h3>
        </div>
      `

      if (ctx.$('#pairSmartLock')) ctx.$('#pairSmartLock').onclick = () => {
        ctx.$('#error').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ smartLockPaired: true })
        }, 200)
      }

      if (ctx.$('#toggleSmartLock')) ctx.$('#toggleSmartLock').onclick = () => {
        ctx.$('#error').innerHTML = 'Proccessing'

        setTimeout(() => {
          if (!wifiConnected || !globalState.wifiActive) {
            ctx.$('#error').innerHTML = `
              ${!wifiConnected ? 'Network Error: No Internet Detected <br>' : ''}
              ${!globalState.wifiActive ? 'Device Error: Wifi Connection Error <br>Device Error: Cannot Connect To Server' : ''}
            `

          } else if (globalState.rentBalance <= 0) {
            globalState.smartLockOpen = !globalState.smartLockOpen
            ctx.setState({}, true)
            window.primarySM.enqueue('smartLockShift')

          } else {
            ctx.$('#error').innerHTML = `Error: Device Failed With Message: "PLEASE TAKE NOTICE that you are hereby required to pay to Landlock Realty, LLC landlord of the premisis, the sum of $${globalState.rentBalance.toFixed(2)} for rent of the premises (Unit #948921). You are required to pay within <strong>-3 days</strong> from the day of service of this notice. All payments shall be made through the official Landlock Realty Rental App"`

          }
          ctx.setState({ smartLockPaired: true })
        }, 150 + Math.random() * 100)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'landlock') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Landlock Realty Rental App</h2>
          <div>
            <input id="unit" placeholder="Unit #" type="number">
            <button id="search">Search</button>
          </div>

          <div id="unitStatus"></div>
          <div id="payNow" style="margin: 0.4em 0; word-break: break-word"></div>
        </div>
      `

      ctx.$('#search').onclick = () => {
        const unit = Number(ctx.$('#unit').value)

        if (unit === 948921) {
          ctx.$('#unitStatus').innerHTML = `
            <h3>Unit #${unit}</h3>
            <h3 id="status">Status: ${globalState.rentBalance === 0 ? 'Paid' : 'Delinquent'}</h3>
            <h3 id="balance">Balance: $${globalState.rentBalance.toFixed(2)}</h3>
          `

        } else {
          ctx.$('#unitStatus').innerHTML = `
            <h3>Unit #${unit}</h3>
            <h3 id="status">Status: Paid</h3>
            <h3 id="balance">Balance: $0.00</h3>
          `
        }
        ctx.$('#payNow').innerHTML = `
          <p>Please use the following PayApp recipient address to generate a SPTX: 0xef301fb6c54b7cf2cecac63c9243b507a8695f4d</p>
          <input id="sptx" placeholder="SPTX identifier" type="number">
          <button id="pay">Pay Now</button>
          <h4 id="error"></h4>
        `

        ctx.$('#pay').onclick = () => {
          const sptx = ctx.$('#sptx').value
          const payment = globalState.payments[sptx]

          if (!payment || payment.recipient !== '0xef301fb6c54b7cf2cecac63c9243b507a8695f4d') {
            ctx.$('#error').innerHTML = 'Invalid SPTX'
          } else if (payment.received) {
            ctx.$('#error').innerHTML = 'SPTX already processed'
          } else {

            setTimeout(() => {
              ctx.$('#error').innerHTML = 'Processing Payment. Do not refresh this page!'
              payment.received = true
            }, 2000)

            setTimeout(() => {
              ctx.$('#error').innerHTML = 'SPTX processed!'

              if (unit === 948921) {
                globalState.rentBalance = Math.max(0, globalState.rentBalance - payment.amount)
                ctx.$('#balance').innerHTML = `Balance: $${globalState.rentBalance.toFixed(2)}`
                if (globalState.rentBalance === 0) {
                  ctx.$('#status').innerHTML = 'Status: Paid'
                }
              }
            }, 11000)
          }

        }

      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'notePad') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex: 1; display: flex; flex-direction: column">
          <div><button id="home">Back</button></div>
          <h4>NotePad</h4>
          <textarea id="pad" style="flex: 1">${notePadValue || ''}</textarea>
        </div>
      `

      ctx.$('#pad').onkeyup = (...args) => {
        ctx.state.userData[currentUser].notePadValue = ctx.$('#pad').value
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'toastr') {

      const mainInterface = globalState.wifiActive
        ? `<h3 class="blink">Loading Interface</h3>`
        : `<h3>Device Error: ERROR: Cannot connect to server.</h3>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Toastr</h2>
          ${
            bluetoothEnabled
              ? toasterPaired ? mainInterface : `<button id="pairToaster">Pair Device</button>`
              : `<h3>Must enable bluetooth permissions in Home/Settings</h3>`
          }
        </div>
      `

      if (ctx.$('#pairToaster')) ctx.$('#pairToaster').onclick = () => {
        ctx.setState({ toasterPaired: true })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'planter') {

      const mainInterface = globalState.wifiActive
        ? `<h3 class="blink">Loading Interface</h3>`
        : `<h3>Device Error: ERROR: Cannot connect to server.</h3>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>SmartPlanter</h2>
          ${planterPaired
            ? `
              <h3>Plant Status: ${ctx.state.plantStatus}</h3>
              <button id="water" ${globalState.plantWatered ? 'disabled' : ''}>Water</button>
            `
            : `
              <input id="planterDeviceCode" placeholder="Device Code"><button id="pairPlanter" style="margin-left: 0.25em">Pair Device</button>
            `
          }
          <h4 id="error"><h4>
        </div>
      `

      if (ctx.$('#water')) ctx.$('#water').onclick = () => {
        globalState.plantWatered = true

        setTimeout(() => {
          ctx.setState({ plantStatus: 'Okay' })
        }, 2000)
      }

      if (ctx.$('#pairPlanter')) ctx.$('#pairPlanter').onclick = () => {

        if (ctx.$('#planterDeviceCode').value !== 'F93892O30249B48') {
          ctx.$('#error').innerHTML = 'Pairing device...'
          setTimeout(() => {
            ctx.$('#error').innerHTML = 'Unregistered Device: Please check that you have input a valid Device Code'
          }, 800)

        } else if (globalState.wifiActive) {
          ctx.$('#error').innerHTML = 'Pairing device...'
          setTimeout(() => {
            ctx.setState({ planterPaired: true })
          }, 3000)

        } else {
          ctx.$('#error').innerHTML = 'Pairing device...'
          setTimeout(() => {
            ctx.$('#error').innerHTML = `Cannot find device. Please check your SmartPlanter<sup>TM</sup>'s internet connection and try again`
          }, 2000)
        }
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
    }


  },
  (oldState, newState, stateUpdate) => {
    Object.assign(state, newState)
    globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phone', payload: stateUpdate }})
  }
)
