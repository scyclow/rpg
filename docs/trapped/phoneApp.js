import {StateMachine, CTX} from './stateMachine.js'
import {voices, say} from './voices.js'
import {createSource, MAX_VOLUME} from './audio.js'
import {ispCSNodes} from './cs/isp.js'
import {billingCSNodes} from './cs/billing.js'
import {disputeResolutionNodes} from './cs/dispute.js'
import {turboConnectNodes} from './cs/turboConnect.js'
import {ssoNodes, ssoCTX} from './cs/sso.js'


export class PhoneCall {
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

export function phoneApp(ctx) {
  ctx.$phoneContent.innerHTML = phoneMarkup()
  phoneBehavior(ctx)
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
        user-select: none;
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
        await phone.ringTone(ctx.state.fastMode ? 0 : 3)

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
        await phone.ringTone(ctx.state.fastMode ? 0 : 1)

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
        await phone.ringTone(ctx.state.fastMode ? 0 : 4)

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
        await phone.ringTone(ctx.state.fastMode ? 0 : 1)

        if (!phone.live) return

        const stateMachine = new StateMachine(
          ssoCTX,
          {
            defaultWait: 1000,
            async onUpdate({text, action}, sm) {
              globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phoneCall', payload: { connection: 'sso', text } }})

              sm.ctx.history.push(text)

              if (action && action === 'hangup') {
                phone.hangup()
                ctx.$('#dialedNumber').innerHTML = ''
                ctx.$('#menuNumbers').innerHTML = ''
                return
              }

              const vs = await voices
              const voice = vs.find(v => v.voiceURI.includes('Aaron') && v.lang === 'en-US') || vs.filter(v => v.lang === 'en-US')[0]

              say(voice, text)
            },
          },
          ssoNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      // TurboConnect
      else if (dialed === '18004443830') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 2)

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
        await phone.ringTone(ctx.state.fastMode ? 0 : 40)
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
