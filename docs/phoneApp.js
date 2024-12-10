import {StateMachine, CTX} from './stateMachine.js'
import {voices, say} from './voices.js'
import {createSource, MAX_VOLUME, allSources} from './audio.js'
import {ispCSNodes} from './cs/isp.js'
import {billingCSNodes} from './cs/billing.js'
import {disputeResolutionNodes} from './cs/dispute.js'
import {turboConnectNodes} from './cs/turboConnect.js'
import {ssoNodes, ssoCTX} from './cs/sso.js'
import {hellNodes} from './cs/hell.js'
import {emergencyNodes} from './cs/emergency.js'
import {jeanText} from './mobilePhone.js'


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
  silent = false
  hangups = 0

  constructor(onclick, select=$.id) {
    PhoneCall.active = this
    this.onclick = onclick

    document.addEventListener('click', () => {
      if (!this.srcs.key1) {
        this.srcs.key1 = createSource('sine')
        this.srcs.key2 = createSource('sine')

        this.srcs.ring1 = createSource('sine')
        this.srcs.ring2 = createSource('sine')
      }
    })



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
        this.pressKey(key)
      }
      elem.onmousedown = () => this.startTone(key)
      elem.onmouseup = () => this.endTone(key)
      elem.onmouseleave = () => this.endTone(key)

      return elem
    })
  }

  pressKey(key) {
    this.live = true
    this.dialed.push(key === 'hash' ? '#' : key === 'star' ? '*' : key)
    this.onclick(this, key)
  }

  startTone(key) {
    if (!this.srcs[key]) {
      this.srcs.key1.smoothFreq(PhoneCall.tones[key][0])
      this.srcs.key2.smoothFreq(PhoneCall.tones[key][1])
    }


    this.pressTS = Date.now()

    if (!this.silent) {
      if (this.srcs.key1.gain.gain.value > 0) {
        this.srcs.key1.smoothGain(0)
        this.srcs.key2.smoothGain(0)

        setTimeout(() => {
          this.srcs.key1.smoothGain(MAX_VOLUME)
          this.srcs.key2.smoothGain(MAX_VOLUME)
        }, 25)
      } else {
        this.srcs.key1.smoothGain(MAX_VOLUME)
        this.srcs.key2.smoothGain(MAX_VOLUME)
      }
    }
  }

  endTone(key) {
    const diff = Date.now() - this.pressTS
    if (diff < 200) {
      setTimeout(() => {
        this.srcs.key1.smoothGain?.(0)
        this.srcs.key2.smoothGain?.(0)
      }, 200 - diff)
    } else {
      this.srcs.key1.smoothGain?.(0)
      this.srcs.key2.smoothGain?.(0)
    }
  }

  async ringTone(rings=3, soundEnabled=true) {
    this.isRinging = true

    this.srcs.ring1.smoothFreq(PhoneCall.tones.ring[0])
    this.srcs.ring2.smoothFreq(PhoneCall.tones.ring[1])

    const hangups = this.hangups
    await waitPromise(500)
    for (let i = 0; i < rings; i++) {
      if (!this.live || hangups < this.hangups) return

      if (soundEnabled) this.srcs.ring1.smoothGain(MAX_VOLUME)
      if (soundEnabled) this.srcs.ring2.smoothGain(MAX_VOLUME)

      await waitPromise(3000)

      this.srcs.ring1.smoothGain(0)
      this.srcs.ring2.smoothGain(0)

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
    this.hangups++
    this.answerTime = 0
    this.stateMachine?.kill?.()
    // allSources.forEach(src => src.stop())
    // Object.keys(this.srcs).forEach(s => {
    //   this.srcs[s][0].stop()
    //   this.srcs[s][1].stop()
    //   delete this.srcs[s]
    // })

      this.srcs.ring1.smoothGain(0)
      this.srcs.ring2.smoothGain(0)

    this.onHangup?.(this.stateMachine)

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

      .a11yMode #phoneAppContent {
        font-size: 1rem;
      }
      .a11yMode #phoneAppContent button {
        font-size: 1.5rem;
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
        user-select: none;
        overflow: hidden;
      }

      #phoneAppInfo.silentMode {
        padding-top: 2em;
        justify-content: flex-start;
      }

      #phoneAppInfo.silentMode #menuNumbers {
        font-size: 0.8em
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

      <div style="padding-top: 0.5em; display: flex; justify-content: space-evenly">
        <button id="home">Back</button>
        <button id="hangup">Hangup</button>
        <button id="previousCalls" class="hidden"><em>Premium</em></button>
      </div>
    </div>

    <div id="previousCallsView" class="hidden">
      <div id="previouslyDialedNumbers" style="height: 513px; overflow: scroll; "></div>

      <div style="padding: 0.5em; padding-bottom: 0; display: flex; justify-content: flex-end; border-top: 1px solid; height: 29px">
        <button id="backToPhone" style="margin-right:2em">Back</button>
      </div>
    </div>
  `
}






function formatPhoneNumber(num) {
  if (num.slice(0, 3) === '911') return '911'
  if (num.length < 4) return num.slice(0, 3).join('')
  if (num.length < 8) return `${num.slice(0, 3).join('')}-${num.slice(3, 7).join('')}`
  if (num.length < 11) return `${num.slice(0, 3).join('')}-${num.slice(3, 6).join('')}-${num.slice(6, 10).join('')}`
  else return `${num[0]}-${num.slice(1, 4).join('')}-${num.slice(4, 7).join('')}-${num.slice(7, 11).join('')}`

}



const padZero = n => n < 10 ? '0' + n : '' +  n
function setCallTime(ctx, phone) {
  const $time = ctx.$('#callTime')
  if (phone.isRinging) {
    $time.innerHTML = `<span class="blink">(Ringing)</span>`
  }
  if (!phone.answerTime) return


  ctx.setInterval(() => {
    if ($time) {
      if (phone.phoneAnswered) {
        const totalSecondsElapsed = Math.floor((Date.now() - phone.answerTime) / 1000)
        const secondsElapsed = totalSecondsElapsed % 60
        const minutesElapsed = Math.floor(totalSecondsElapsed / 60)

        $time.innerHTML = `${padZero(minutesElapsed)}:${padZero(secondsElapsed)}`
      } else if (!phone.live) {
        $time.innerHTML = ``
      }
    }
  })
}

let keypressHandlerSet

function phoneBehavior(ctx) {
  const userData = ctx.state.userData[ctx.state.currentUser]

  if (ctx.state.currentUser === 0 || (userData.previouslyDialed && userData.previouslyDialed.length >= 1)) {
    ctx.$('#previousCalls').classList.remove('hidden')
  }

  ctx.$('#home').onclick = () => {
    ctx.setState({ screen: 'home' })
  }



  let transcriptTimeout = 0, transcriptInterval = 0, wordIx = 0, wordQueue = ''

  function clearTranscripts() {
    clearTimeout(transcriptTimeout)
    clearInterval(transcriptInterval)
    transcriptTimeout = 0
    transcriptInterval = 0
    wordQueue = ''
  }

  function startInterval() {
    transcriptTimeout = setTimeout(() => {
      ctx.$('#menuNumbers').innerHTML = `Transcript: `

      transcriptInterval = setInterval(() => {
        try {
          const allWords = wordQueue.split(' ')
          const word = allWords.shift()
          wordQueue = allWords.join(' ')

          const newWords = ctx.$('#menuNumbers').innerHTML.split(' ')
          newWords.push(word)
          if (newWords.length >= 110) times(20, () => newWords.shift())

          ctx.$('#menuNumbers').innerHTML = newWords.join(' ')

          if (!wordQueue) clearTranscripts()
        } catch (e) {
          clearTranscripts()
        }
      }, 200)
    }, 1000)
  }

  function displayTranscript(txt) {
    if (!txt) return

    ctx.$('#phoneAppInfo').classList.add('silentMode')
    if (!transcriptTimeout) startInterval()

    wordQueue += ' ' + txt.replaceAll('.,', '.')
  }


  const phoneCall = PhoneCall.active || new PhoneCall(
    async (phone, key) => {
      clearTranscripts()

      const dialed = phone.dialed.join('')
      const is911 = dialed.slice(0,3) === '911'

      const validDigits = is911 ? 3 : dialed[0] === '1' ? 11 : 10

      const hangups = phone.hangups


      const vs = await voices

      const defaultVoice = vs.filter(v => v.lang === 'en-US')[0]

      const femaleVoice = (
        vs.find(v => v.voiceURI.includes('Samantha') && v.lang === 'en-US')
        || vs.find(v => v.voiceURI.includes('Microsoft Zira') && v.lang === 'en-US')
        || vs.filter(v => v.lang === 'en-US')[0]
      )

      const britishVoice = (
        vs.find(v => v.voiceURI.includes('Daniel') && v.lang === 'en-GB')
        || vs.find(v => v.voiceURI.includes('Google UK English Male'))
        || vs.filter(v => v.lang === 'en-US')[0]
      )

      const derpyVoice = (
        vs.find(v => v.voiceURI.includes('Aaron') && v.lang === 'en-US')
        || vs.find(v => v.voiceURI.includes('Microsoft Mark') && v.lang === 'en-US')
        || vs.filter(v => v.lang === 'en-US')[0]
      )


      const incomprehensibleVoice = (
        vs.find(v => (
            v.voiceURI.includes('Reed') && (v.lang === 'fi-FI'|| v.lang === 'de-DE')) || v.voiceURI.includes('Reed')
        )
        || vs.find(v => v.voiceURI.includes('Google polski'))
        || vs[0]
      )


      if (dialed.length > 0 && dialed.length < validDigits) {
        ctx.$('#hangup').innerHTML = 'Clear'
      } else {
        ctx.$('#hangup').innerHTML = 'Hangup'
      }

      ctx.$('#dialedNumber').innerHTML = formatPhoneNumber(phone.dialed.slice(0, validDigits))

      ctx.$('#menuNumbers').innerHTML = phone.dialed.slice(validDigits).join('')
      // else  ctx.$('#menuNumbers').innerHTML = phone.dialed.slice(validDigits).join('')


      window.speechSynthesis.cancel()

      if (phone.phoneAnswered) phone.stateMachine.next(key)


      if (dialed.length === validDigits) {
        ctx.$('#callTime').innerHTML = `<span class="blink">(Ringing)</span>`

        userData.previouslyDialed = userData.previouslyDialed || []
        userData.previouslyDialed.push(dialed)
      }

      // ISP
      if (dialed === '18005552093' || dialed === '8005552093') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 2, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return


        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
            tmp: {
              srcs: []
            },
          }),
          {
            defaultWait: 1000,
            async onUpdate({text, action, ...props}, sm) {
              sm.ctx.history.push(text)

              if (ctx.state.soundEnabled) say(femaleVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          ispCSNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)


        phone.onHangup = () => {
          stateMachine.ctx.tmp.srcs.forEach(src => src.stop())

          if (!globalState.ispBillingReminderSent) {
            setTimeout(() => {
              ctx.newText({
                from: '1-888-555-9483',
                value: 'URGENT: Our records indicate that your account has an outstanding balance of . Immediate payment is required to prevent a discontinuation of your internet service. <strong style="text-decoration: underline">Please dial the National Broadband Services Billing Department at 1-888-555-9483 to pay this bill immediately</strong>.',
              })
              globalState.ispBillingReminderSent = true
              phone.onHangup = noop
            }, 20000)
          }
        }

        stateMachine.next('')

      }

      // ISP Billing
      else if (dialed === '18885559483' || dialed === '8885559483') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 1, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {
              sm.ctx.history.push(text)

              if (ctx.state.soundEnabled) say(femaleVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          billingCSNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      // Billing dispute resolution administrator
      else if (dialed === '18007770836' || dialed === '8007770836') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 3, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {

              sm.ctx.history.push(text)
              // TODO different voice
              const vs = await voices

              if (ctx.state.soundEnabled) say(britishVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          disputeResolutionNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }


      // SSO
      else if (dialed === '18772225379' || dialed === '8772225379') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 1, ctx.state.soundEnabled)
        if (!phone.live || hangups < phone.hangups) return

        ssoCTX.phoneUserData = ctx.state.userData

        const stateMachine = new StateMachine(
          ssoCTX,
          {
            defaultWait: 1000,
            async onUpdate({text, action}, sm) {

              sm.ctx.history.push(text)

              if (action && action === 'hangup') {
                phone.hangup()
                ctx.$('#dialedNumber').innerHTML = ''
                ctx.$('#menuNumbers').innerHTML = ''
                setTimeout(() => ctx.$('#callTime').innerHTML = ``, 2000)
                return
              }

              if (ctx.state.soundEnabled) say(derpyVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          ssoNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        phone.onHangup = () => {
          if (!globalState.jeanTextSent) {
            ctx.newText(jeanText)
            globalState.jeanTextSent = true
            phone.onHangup = noop
          }
        }

        stateMachine.next('')
      }

      // TurboConnect
      else if (dialed === '18004443830' || dialed === '8004443830') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 2, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {

              sm.ctx.history.push(text)

              say(incomprehensibleVoice, text)
            },
          },
          turboConnectNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      // GatesOfHell
      else if (dialed === '18006660000' || dialed === '8006660000') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 3, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {

              sm.ctx.history.push(text)
              // TODO different voice
              const vs = await voices
              if (ctx.state.soundEnabled) say(defaultVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          hellNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')
      }

      else if (dialed === '911') {
        await phone.ringTone(ctx.state.fastMode ? 0 : 1, ctx.state.soundEnabled)

        if (!phone.live || hangups < phone.hangups) return

        const stateMachine = new StateMachine(
          new CTX({
            currentNode: 'start',
            tmp: {
              srcs: []
            },
          }),
          {
            defaultWait: 1000,
            async onUpdate({text}, sm) {

              sm.ctx.history.push(text)
              if (ctx.state.soundEnabled) say(defaultVoice, text)
              else {
                displayTranscript(text)
              }
            },
          },
          emergencyNodes
        )
        phone.answer(stateMachine)
        setCallTime(ctx, phone)

        stateMachine.next('')


        phone.onHangup = () => {
          stateMachine.ctx.tmp.srcs.forEach(src => src.stop())
        }


      }

      else if (dialed.length === validDigits) {
        await phone.ringTone(ctx.state.fastMode ? 0 : 40, ctx.state.soundEnabled)
      }
    },
    (id) => ctx.$(`#${id}`)
  )

  phoneCall.silent = !ctx.state.soundEnabled


  ctx.$('#dialedNumber').innerHTML = formatPhoneNumber(phoneCall.dialed.slice(0, 11))
  ctx.$('#menuNumbers').innerHTML = phoneCall.dialed.slice(11).join('')

  ctx.$('#keypad').append(...phoneCall.$keypad)

  function hangup() {
    clearTranscripts()
    ctx.$('#dialedNumber').innerHTML = ''
    ctx.$('#menuNumbers').innerHTML = ''
    ctx.$('#hangup').innerHTML = 'Hangup'
    setTimeout(() => {
      try {
        ctx.$('#callTime').innerHTML = ''
      } catch (e) {}
    }, 2000)
    window.speechSynthesis.cancel()
    if (PhoneCall.active) PhoneCall.active.hangup()
    // PhoneCall.active.stateMachine.goto('start')
  }

  ctx.$('#hangup').onclick = hangup


  const allKeys = ['0' ,'1' ,'2' ,'3' ,'4' ,'5' ,'6' ,'7' ,'8' ,'9' ,'#', '*']

  if (!keypressHandlerSet) {
    document.addEventListener('keydown', e => {
      if (ctx.state.screen === 'phoneApp' && primarySM.ctx.state.isOpen && userData.previouslyDialedUnlocked) {
        allKeys.forEach(k => {
          if (String(e.key) === k) phoneCall.startTone(k)
        })
      }
    })

    document.addEventListener('keyup', e => {
      if (ctx.state.screen === 'phoneApp' && primarySM.ctx.state.isOpen && userData.previouslyDialedUnlocked) {
        allKeys.forEach(k => {
          if (String(e.key) === k) phoneCall.endTone(k)
        })
      }
    })

    document.addEventListener('keypress', e => {
      if (ctx.state.screen === 'phoneApp' && primarySM.ctx.state.isOpen && userData.previouslyDialedUnlocked) {
        allKeys.forEach(k => {
          if (String(e.key) === k) phoneCall.pressKey(k)
        })
        if (e.key === 'h' || e.key === 'c') hangup()
      }
    })

    keypressHandlerSet = true
  }


  const renderPrevCalls = () => {
    ctx.$('#previouslyDialedNumbers').innerHTML = `
      <div style="padding: 1em; padding-bottom: 0"><input id="pasteToDial" placeholder="Paste Number Here" type="number"> <button id="dialPasted">Dial</button></div>
      <div style="padding: 1em">
        ${[...userData.previouslyDialed].reverse().map((n, i) => `<div>${formatPhoneNumber(n.split(''))} <button id="redial-${i}">Re-Dial</button></div>`).join('')}
      </div>
    `

      ctx.$(`#dialPasted`).onclick = async () => {
        const n = ctx.$('#pasteToDial').value
        if (!n) return

        ctx.$('#phoneAppContent').classList.remove('hidden')
        ctx.$('#previousCallsView').classList.add('hidden')

        for (let d of n.split('')) {
          phoneCall.pressKey(d)
          phoneCall.startTone(d)
          await waitPromise(75)
          phoneCall.endTone(d)
          await waitPromise(35)
        }
      }

    ;[...userData.previouslyDialed].reverse().forEach((n, i) => {
      ctx.$(`#redial-${i}`).onclick = async () => {
        ctx.$('#phoneAppContent').classList.remove('hidden')
        ctx.$('#previousCallsView').classList.add('hidden')

        for (let d of n.split('')) {
          phoneCall.pressKey(d)
          phoneCall.startTone(d)
          await waitPromise(75)
          phoneCall.endTone(d)
          await waitPromise(25)
        }
      }
    })
  }

  ctx.$('#previousCalls').onclick = () => {
    ctx.$('#phoneAppContent').classList.add('hidden')
    ctx.$('#previousCallsView').classList.remove('hidden')

    if (userData.previouslyDialedUnlocked) {
      renderPrevCalls()


    } else {
      ctx.$('#previouslyDialedNumbers').innerHTML = `
        <h2 style="text-align: center; margin: 0.4em 0">Premium Feature Upgrade Available!</h2>
        <h4 style="font-size: 1em; margin: 0.4em 0; text-align: center">View all previous calls!</h4>
        <h4 style="font-size: 1em; margin: 0.4em 0; text-align: center">Re-dial numbers!</h4>
        <h4 style="font-size: 1em; margin: 0.4em 0; text-align: center">Paste-to-dial!</h4>
        <h4 style="font-size: 1em; margin: 0.4em 0; text-align: center">Only <span class="blink">2</span> Credits!</h4>

        <div style="margin-top: 5em; padding: 1em">
          <button id="upgrade">Upgrade</button>
          <div id="upgradeError"></div>
        </div>
      `

      if (userData.appCreditBalance < 1) {
        ctx.$('#upgrade').disabled = true
        ctx.$('#upgradeError').innerHTML = `Not Enough Credits. <br>App Market Credits: ${userData.appCreditBalance}`
      } else {
        ctx.$('#upgradeError').innerHTML = `App Market Credits: ${userData.appCreditBalance}`
      }

      ctx.$('#upgrade').onclick = () => {
        if (userData.appCreditBalance >= 1) ctx.setUserData({
          appCreditBalance: userData.appCreditBalance - 1,
          previouslyDialedUnlocked: true
        })

        setTimeout(() => {
          ctx.$('#phoneAppContent').classList.add('hidden')
          ctx.$('#previousCallsView').classList.remove('hidden')
          renderPrevCalls()

        }, 100)
      }
    }
  }

  ctx.$('#backToPhone').onclick = () => {
    ctx.$('#phoneAppContent').classList.remove('hidden')
    ctx.$('#previousCallsView').classList.add('hidden')
  }


  setCallTime(ctx, phoneCall)

  window.pc = phoneCall
}
