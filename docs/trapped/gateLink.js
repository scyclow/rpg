import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {createSource, MAX_VOLUME} from './audio.js'
import {getAd, allAds} from './mobilePhone.js'



const state = persist('__INTERCOM_STATE', {})


createComponent(
  'gate-link',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
        scrollbar-width: thin;
      }

      #screen {
        width: min(90vw, calc(85vh * 2 / 3));
        height: min(85vh, calc(90vw * 3 / 2));
        background: linear-gradient(#100, #180404);
        color: #bdb5b5;

        border: 2px solid #111;
        box-shadow: 0 0 3em #433, 0 0 10em #433;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
      }

      h1 {
        text-align: center;

        padding: 0.5em;
        font-size: 3em;
      }

      main {
        transform: skew(0, 0.5deg);
      }

      #screen {
        filter: blur(0.25px)
      }

      .icon {
        display: inline-block;
        transform: scale(1.7);
        margin-right: 0.5em;
      }

      header {
        color: #100;
        background: #bdb5b5;
        padding: 0.25em 0.5em;
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
      }

      .action {
        display: inline-block;
        border: 1px solid;
        border-radius: 4px;
        padding: 1em;
        cursor: pointer;
        background: #100;
        color: #bdb5b5;
        font-size: 1.25em;
        user-select: none;
      }

      .action:hover {
        background: #422;

      }
      .action:active {
        background: #1d1d1d
      }

      footer {
        text-align: center;
        font-size: 0.8em;
        padding: 0.25em;
      }
      footer + footer {
        padding-bottom: 1em;
      }

      ::selection {
        background: #bdb5b5;
        color: #100;
      }

      header::selection {
        background: #100;
        color: #bdb5b5;
      }


      .sc {
        margin: 0.4em 0;
        animation: Ad 1.5s steps(2, start) infinite;
      }

      @keyframes Ad {
        from {
          border: 0 solid;
          padding: calc(0.25em + 2px);
        }
        to {
          border: 2px dashed;
          padding: calc(0.25em);
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

      .waver {
        animation: Waver 0.01s steps(2, start) infinite;
      }

      @keyframes Waver {
        0%, 100% {
          background: #201010;
        }

        50% {
          background: #302828;
        }
      }

      @media (max-width: 490px) {
        #screen {
          font-size: 0.8em;
        }
      }

      @media (max-width: 380px) {
        #screen {
          font-size: 0.6em;
        }
      }


    </style>

    <div id="screen">
      <header>
        WIFI: LandlockRealtyLLC-5G
      </header>

      <main style="flex: 1; display: flex; flex-direction: column">
        <h1>GateLink</h1>
        <div style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column">
          <h6 style="padding-right: 24em; padding-bottom: 0.5em">OUTSIDE</h6>
          <div class="waver" style="border: 2px solid #343434; width: 20em; height: 20em;">
          </div>
          <h6 style="padding-top: 0.5em; width: 30em">WARNING: VIDEO SIGNAL WEAK - CHECK EXTERNAL DEVICE CONNECTION <span id="signalStrength"></span></h6>
        </div>

        <div style="display: flex; justify-content: center; padding-bottom: 4em">
          <div>
            <button class="action" id="talk"><span class="">⚟</span> TALK</button>
            <button class="action" id="listen"><span class="">⚞</span> LISTEN</button>
            <button class="action" id="door"><span class="">✹</span> DOOR</button>
          </div>
        </div>
      </main>

      <footer>
        Download the <strong>GateLink</strong> mobile app in the AppMarket
      </footer>
      <footer>
        Device ID: Q38990284902
      </footer>

    </div>

    <audio loop id="static" src="./tv-static-7019.mp3"></audio>

  `,
  state,
  ctx => {
    const doorSrc1 = createSource('sawtooth', 150)
    const doorSrc2 = createSource('sine', 300)
    const doorSrc3 = createSource('sine', 900)
    const doorSrc4 = createSource('sine', 150)

    let press = 0
    ctx.$('#door').onmousedown = () => {
      doorSrc1.smoothGain(MAX_VOLUME)
      doorSrc2.smoothGain(MAX_VOLUME)
      doorSrc3.smoothGain(MAX_VOLUME/3)
      doorSrc4.smoothGain(MAX_VOLUME)
      press = Date.now()
    }

    const doorSilence = () => {
      doorSrc1.smoothGain(0)
      doorSrc2.smoothGain(0)
      doorSrc3.smoothGain(0)
      doorSrc4.smoothGain(0)
    }

    ctx.$('#door').onmouseup = () => {
      if (Date.now() < press + 50) {
        setTimeout(doorSilence, (press + 50) - Date.now())
      } else {
        doorSilence()
      }
    }

    ctx.$('#door').onmouseleave = () => {
      doorSilence()
    }


    const listenSrc1 = createSource('sine', 200)
    const listenSrc2 = createSource('sine', 203)
    const listenSrc3 = createSource('sawtooth', 9000)

    const listenSilence = () => {
      staticClip.pause()
      listenSrc1.smoothGain(0)
      listenSrc2.smoothGain(0)
      listenSrc3.smoothGain(0)
    }

    const staticClip = ctx.$('#static')
    staticClip.volume = 0.2


    ctx.$('#listen').onmousedown = () => {
      staticClip.play()
      listenSrc1.smoothGain(MAX_VOLUME)
      listenSrc2.smoothGain(MAX_VOLUME)
      listenSrc3.smoothGain(MAX_VOLUME/10)
      press = Date.now()

    }

    ctx.$('#listen').onmouseup = () => {
      if (Date.now() < press + 50) {
        setTimeout(listenSilence, (press + 50) - Date.now())
      } else {
        listenSilence()
      }
    }

    ctx.$('#listen').onmouseleave = listenSilence


    const talkSrc1 = createSource('sine', 440)
    const talkSrc2 = createSource('sine', 660)

    let micStream, active
    ctx.$('#talk').onmousedown = () => {
      active = true
      talkSrc1.smoothGain(MAX_VOLUME)
      setTimeout(() => talkSrc1.smoothGain(0), 100)

      setTimeout(() => {
        talkSrc2.smoothGain(MAX_VOLUME)
        setTimeout(() => talkSrc2.smoothGain(0), 100)
      }, 50)
      micStream = navigator.mediaDevices.getUserMedia({ audio: true })
    }
    ctx.$('#talk').onmouseup = async () => {
      active = false
      if (micStream) {
        talkSrc2.smoothGain(MAX_VOLUME)
        setTimeout(() => talkSrc2.smoothGain(0), 100)

        setTimeout(() => {
          talkSrc1.smoothGain(MAX_VOLUME)
          setTimeout(() => talkSrc1.smoothGain(0), 100)
        }, 50)
        const s = await micStream
        s.getAudioTracks().forEach(t => t.stop())
      }
    }
    ctx.$('#talk').onmouseleave = async () => {
      active = false
      if (micStream && active) {
        talkSrc2.smoothGain(MAX_VOLUME)
        setTimeout(() => talkSrc2.smoothGain(0), 100)

        setTimeout(() => {
          talkSrc1.smoothGain(MAX_VOLUME)
          setTimeout(() => talkSrc1.smoothGain(0), 100)
        }, 50)
        const s = await micStream
        s.getAudioTracks().forEach(t => t.stop())
      }
    }

    setInterval(() => {
      ctx.$('#signalStrength').innerHTML = Math.random() * 0.7
    }, 200)


    if (globalState.deviceViruses) {
      setRunInterval(() => {
        const ad = $.div(null, { className: 'sc' })
        ad.innerHTML = `
          <div class="sc" style="width: 250px; height: 250px">
            <h5>SPONSORED CONTENT</h5>
            <div id="sc">${getAd(allAds, 1).text}</div>
          </div>
        `
        ctx.$('#door').appendChild(ad)
      }, 300000)
    }

// var static = new Audio();
// static.src = './tv-static-7019.mp3';

// document.body.appendChild(static);

//   const AudioContext = window.AudioContext || window.webkitAudioContext

// var context = new AudioContext();
// var analyser = context.createAnalyser();


// window.addEventListener('click', function(e) {
//   // Our <audio> element will be the audio source.
//   var source = context.createMediaElementSource(audio);
//   source.connect(analyser);
//   analyser.connect(context.destination);


// }, false);
  },
  ctx => {},
  (oldState, newState, stateUpdate) => {
    Object.assign(state, { ...newState, lastScreen: oldState.screen})

  }
)