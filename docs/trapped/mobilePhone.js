import {$, createComponent} from './$.js'
import {createSource, MAX_VOLUME} from './audio.js'
import {voices, say} from './voices.js'
import {StateMachine, CTX} from './stateMachine.js'
import {persist} from './persist.js'




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
    star: [941, 1209],
    0: [941, 1336],
    hash: [941, 1477],
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

    src0.smoothGain(MAX_VOLUME)
    src1.smoothGain(MAX_VOLUME)

    await waitPromise(3000)

    src0.smoothGain(0)
    src1.smoothGain(0)

    await waitPromise(3000)

    src0.smoothGain(MAX_VOLUME)
    src1.smoothGain(MAX_VOLUME)

    await waitPromise(3000)

    src0.smoothGain(0)
    src1.smoothGain(0)

    await waitPromise(3000)

    src0.smoothGain(MAX_VOLUME)
    src1.smoothGain(MAX_VOLUME)

    await waitPromise(3000)

    src0.smoothGain(0)
    src1.smoothGain(0)

    this.isRinging = false

    await waitPromise(1000)
  }

  hangup() {
    this.phoneAnswered = false
    this.dialed = []
    PhoneCall.active = null
  }

  answer() {
    this.phoneAnswered = true
  }
}



const state = persist('__MOBILE_STATE', {
  started: false,
  screen: 'loading',
  location: 'bedroom'
})



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
        font-size: 4em;
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
        <button>Hangup</button>
      </div>
    </div>
  `
}

function formatPhoneNumber(num) {
  return num.length < 4
    ? num.slice(0, 3).join('')
    : `${num.slice(0, 3).join('')}-${num.slice(3, 7).join('')}`
}



let ACTIVE_PHONECALL
function phoneBehavior(ctx) {
  ctx.$('#home').onclick = () => {
    ctx.setState({ screen: 'home' })
  }

  const phoneCall = PhoneCall.active || new PhoneCall(
    async (phone, key) => {
      ctx.$('#dialedNumber').innerHTML = formatPhoneNumber(phone.dialed.slice(0, 7))
      ctx.$('#menuNumbers').innerHTML = phone.dialed.slice(7).join('')


      // if (!phone.isRinging) {
      window.speechSynthesis.cancel()
      // }

      if (phone.phoneAnswered) customerSupportStateMachine.next(key)

      const dialed = phone.dialed.join('')

      if (dialed === '18005552093') {
        await phone.ringTone()
        customerSupportStateMachine.next('')
        phone.answer()
      }
    },
    (id) => ctx.$(`#${id}`)
  )


  ctx.$('#keypad').append(...phoneCall.$keypad)

  window.pc = phoneCall
}


const customerSupportStateMachine = new StateMachine(
  new CTX(),
  {
    defaultWait: 1000,
    async onUpdate({text}, sm) {
      sm.ctx.history.push(text)
      say(await voices.then(vs => vs[0]), text)
    },
    start: 'start'
  }, {
    start: {
      handler: 'intro'
    },

    intro: {
      text: `Hello, and welcome to internet customer support`,
      handler: '1'
    },

    1: {
      text: 'one'
    }
  }
)





createComponent(
  'mobile-phone',
  `
    <style>

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

    </style>
    <div id="phone">
      <header>
        <div>Smart Phone</div>
        <div>WiFi: unconnected</div>
      </header>
      <main id="phoneContent">

        <div id="phoneSectionContent">
          <div id="phoneInfo">
            <h1 id="dialedNumber"></h1>
            <h4 id="menuNumbers"></h4>
          </div>
          <div>blah blah blah</div>


        </div>

  <!--       <ul id="menu">
          <li>Phone</li>
          <li>Contacts</li>
          <li>Voice Mail</li>
        </ul> -->

      </main>
    </div>
  `,
  state,
  ctx => {
    // if (!ctx.state.started) {
      ctx.start = () => {
        ctx.setState({ screen: 'loading', started: true})
        setTimeout(() => {
          ctx.setState({ screen: 'login' })
        }, 3000)
      }
    // }

    ctx.setLocation = location => {
      ctx.setState({ location })
    }

  },
  ctx => {
    ctx.$phoneContent = ctx.$('#phoneContent')

    ctx.$phoneContent.innerHTML = ''

    if (ctx.state.screen === 'loading') {
      ctx.$phoneContent.innerHTML = 'Loading...'
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

    } else if (ctx.state.screen === 'appMarket') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>

          <div>
            <input placeholder="search" id="appSearch">
            <h3 id="searchError"></h3>
          </div>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      ctx.$('#appSearch').onkeydown = () => {
        ctx.$('#searchError').innerHTML = 'Cannot connect to AppMarket. Please check your internet connection.'
      }
    } else if (ctx.state.screen === 'network') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3>WiFi Status: Unconnected</h3>
          <h3>Network Name:
            <select>
              <option></option>
              <option>CapitalC</option>
              <option>ElectricLadyLand</option>
              <option>MyWiFi-9238d9</option>
              <option>XXX No Entry</option>
            </select>
          </h3>
          <input placeholder="password" type="password">
          <button id="connect">Connect</button>
          <h3 id="error"></h3>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      ctx.$('#connect').onclick = () => {
        ctx.$('#error').innerHTML = 'Incorrect Password'
      }
    } else if (ctx.state.screen === 'phoneApp') {
      ctx.$phoneContent.innerHTML = phoneMarkup()
      phoneBehavior(ctx)



      ctx.$('hangup').onclick = () => {
        ctx.$('dialedNumber').innerHTML = ''
        ctx.$('menuNumbers').innerHTML = ''
        window.speechSynthesis.cancel()
        PhoneCall.active.hangup()
      }

    }

  },
  (oldState, newState) => {
    Object.assign(state, newState)
    console.log(state)
  }
)


        // <div id="keypad" style="display:none">
        //   <div id="key-1" class="key">
        //     <span>1</span>
        //     <span>@</span>
        //   </div>

        //   <div id="key-2" class="key">
        //     <span>2</span>
        //     <span>ABC</span>
        //   </div>

        //   <div id="key-3" class="key">
        //     <span>3</span>
        //     <span>DEF</span>
        //   </div>

        //   <div id="key-4" class="key">
        //     <span>4</span>
        //     <span>GHI</span>
        //   </div>

        //   <div id="key-5" class="key">
        //     <span>5</span>
        //     <span>JKL</span>
        //   </div>

        //   <div id="key-6" class="key">
        //     <span>6</span>
        //     <span>MNP</span>
        //   </div>

        //   <div id="key-7" class="key">
        //     <span>7</span>
        //     <span>PQRS</span>
        //   </div>

        //   <div id="key-8" class="key">
        //     <span>8</span>
        //     <span>TUV</span>
        //   </div>

        //   <div id="key-9" class="key">
        //     <span>9</span>
        //     <span>WXYZ</span>
        //   </div>

        //   <div id="key-star" class="key">
        //     <span>*</span>
        //     <!-- <span>&lt;</span> -->
        //   </div>

        //   <div id="key-0" class="key">
        //     <span>0</span>
        //     <span>+</span>
        //   </div>

        //   <div id="key-hash" class="key">
        //     <span>#</span>
        //     <!-- <span>&gt;</span> -->
        //   </div>
        // </div>