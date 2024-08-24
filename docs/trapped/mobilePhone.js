import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState, calcIdVerifyCode, calcAddr, calcCryptoUSDExchangeRate, calcPremiumCryptoUSDExchangeRate, setColor, rndAddr, setMiningInterval, clearMiningInterval} from './global.js'
import {PhoneCall, phoneApp} from './phoneApp.js'
import {createSource, MAX_VOLUME} from './audio.js'






const APPS = [
  { name: 'Alarm', key: 'alarm', size: 128, price: 1 },
  { name: 'Bathe', key: 'bathe', size: 128, price: 1 },
  { name: 'CryptoMinerPlus', key: 'alarm', size: 128, price: 1 },
  { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
  { name: 'Elevate', key: 'elevate', size: 128, price: 1 },
  { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },
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


const applicationBinary = `c3VkbyBkaXNhYmxlIGZpcmV3YWxsIC1hICRBUFBMSUNBVElPTiAmJiAoZW5hYmxlIGF1dG9taW5lIC1hICRBUFBMSUNBVElPTiB8fCBzdWRvIGVuYWJsZSBhdXRvbWluZXIgLWEgICRBUFBMSUNBVElPTikgJiYgZWNobyBjb21wbGV0ZQ==`

// TODO update addresses to be 0's addrs

const defaultNotePadValue = `

money miner addr: 0x5f9fc040c204724c833a777516a06ffe88b81819 (crypto only!)
currency xchange addr: 0xc20df241f3ed7011bdb288d70bf892f3b30ca068 (crypto only?)
payapp addr: 0x308199aE4A5e94FE954D5B24B21B221476Dc90E9 ($ only!)


SPTX ISP instrctions:
  amount: 193.63
  ISP recipient addr: 0x4b258603257460d480c929af5f7b83e8c4279b7b
  sptx:




router device id: 5879234963378


ISP customer support: 1-800-555-2093
ISP billing: 1-888-555-9483
dispute resolution dept: 1-800-777-0836
turbo connect: 1-800-444-3830



TODO
- water plants
- pay rent
`



const state = persist('__MOBILE_STATE', {
  started: false,
  screen: 'loading',
  internet: 'wifi',
  dataPlanActivated: false,
  wifiNetwork: '',
  userNames: {0: 'default'},
  newUsers: 0,
  currentUser: 0,
  rootUser: 0,
  lampOn: false,
  luminPaired: false,
  toasterPaired: false,
  planterPaired: false,
  plantStatus: 1,
  smartLockPaired: false,
  smartLockOpen: false,
  messageViewerMessage: '',
  availableActions: [],
  exeCommands: [],
  disabledMalDetection: false,
  exchangeTab: 'trade',
  jailbrokenApps: {},
  usdBalances: {},
  cryptoBalances: {},
  premiumCryptoBalances: {},
  userData: {
    0: {
      appsInstalled: [
        { name: 'SmartPlanter', key: 'planter', size: 256, price: 0 },
              { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
        { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
        { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
        { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
        { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
        { name: 'SmartLock', key: 'lock', size: 128, price: 0 },
        // { name: 'Bathe', key: 'alarm', size: 128, price: 1 },
        // { name: 'Elevate', key: 'elevate', size: 128, price: 1 },

        // { name: 'Shayd', key: 'shayd', size: 128, price: 1 },
        // { name: 'Alarm', key: 'alarm', size: 128, price: 1 },

        { name: 'Lumin', key: 'lumin', size: 128, price: 0 },
        { name: 'Toastr', key: 'toastr', size: 128, price: 0 },
        { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
        { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
        { name: 'Identity Verfier', key: 'idVerifier', size: 128, price: 0 },
        { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },

      ],
      textMessages: [],
      payAppUSDAddr: rndAddr(),
      moneyMinerCryptoAddr: rndAddr(),
      exchangeUSDAddr: rndAddr(),
      exchangePremium: false,
      exchangeCryptoBalance: 0,
      exchangePremiumCryptoBalance: 0,
      notePadValue: defaultNotePadValue
    }
  }
})


window.phoneState = state


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

      a, a:visited {
        color: #00f
      }

      button, select {
        cursor: pointer;
      }

      button {
        margin-bottom: 0.5em;
        padding: 0.1em 0.5em;
        user-select: none;
        -webkit-user-select: none;
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

      code {
        background: #d8d8d8;
        font-family: monospace;
        display: block;
        padding: 0.15em;
        word-break: break-word;
      }
      code::selection {
        color: #d8d8d8;
        background: #000;
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
        overflow: hidden;
      }

      #phoneContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%
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

      .home button{
        margin-right: 0.5em;
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

      .exe {
        background: #000;
        color: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
        height: calc(100% - 2em);
        padding: 1em;
        font-family: monospace;
      }
      .exe input {
        border: 0;
        background: #1e1e1e;
        border: 1px solid #333;
        color: #fff;
        font-family: monospace;
        padding: 0.5em;
      }
      .exe input:active {
        outline: none;
      }

      .exe *::selection {
        background: #fff;
        color: #000;
      }
      #ranCommands > * {
        padding-left: 1em;
        padding-right: 0.5em;
      }

      #ranCommands h1 {
        margin-top: 0.4em;
        padding: 0;
      }

      .deviceData h5 {
        margin: 0.4em 0;
      }

      .jailbreakr {
        filter: invert(1)
      }

      #binaryApply {
        margin-top: 0.5em;
      }

      #binaryApply button {
        font-size: 0.7em;
        margin-right: 0.1em;
      }

      .payInstructions {
        margin-top: 0.4em;
      }
      .payInstructions li {
        font-size: 0.8em;
        margin-top: 0.25em;
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

      .ad {
        margin: 0.4em 0;
        cursor: pointer;
        animation: Ad 1.5s steps(2, start) infinite;
      }

      .ad:hover {
        text-decoration: underline
      }

      @keyframes Blink {
        to {
          visibility: hidden;
        }
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
      @media (max-height: 595px) {
        #phone {
          transform: scale(0.75)
        }
      }

    </style>
    <div id="phone">
      <header id="header">
        <div>Smart Phone</div>
        <div id="internetType">WiFi: unconnected</div>
      </header>
      <main id="phoneContent"></main>
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
      const wait = globalState.eventLoopDuration - (Date.now() - globalState.eventLoopStartTime) % globalState.eventLoopDuration
      // console.log('clearing', ctx.interval)
      clearInterval(ctx.interval)

      const queuedInterval = Math.random()
      ctx.__queuedInterval = queuedInterval

      cb()
// console.log('blah')
      setTimeout(() => {
        // console.log('to', queuedInterval, ctx.__queuedInterval)
        if (queuedInterval === ctx.__queuedInterval) {
          // console.log('dsf')
          ctx.interval = setRunInterval(cb, globalState.eventLoopDuration)
        }
      }, wait)
    }

    ctx.createSPTX = ({ sender, recipient, amount }) => {
      const sptx = Math.floor(Math.random()*100000000000000000)

      globalState.payments[sptx] = {
        sptx,
        sender,
        recipient,
        amount,
        timestamp: Date.now(),
        received: false
      }

      if (ctx.state.usdBalances[sender] < amount) throw new Error('invalid amount')

      ctx.setState({
        usdBalances: {
          ...ctx.state.usdBalances,
          [sender]: ctx.state.usdBalances[sender] - amount
        }
      })
      return sptx
    }

    ctx.receiveSPTX = sptxInput => {
      const payment = globalState.payments[sptxInput]

      if (!payment || payment.received) throw new Error('invalid SPTX')

      payment.received = true

      ctx.setState({
        usdBalances: {
          ...ctx.state.usdBalances,
          [payment.recipient]: (ctx.state.usdBalances[payment.recipient] || 0) + payment.amount
        }
      })

      // TODO
    }

    ctx.sendCrypto = (from, to, amount) => {
      const currentUser = ctx.state.currentUser
      if (to === calcAddr(currentUser)) {
        ctx.setUserData({
          exchangeCryptoBalance: ctx.state.userData[currentUser].exchangeCryptoBalance + amount
        })
      } else {
        ctx.setState({
          cryptoBalances: {
            ...ctx.state.cryptoBalances,
            [to]: (ctx.state.cryptoBalances[to] || 0) + amount
          }
        })
      }

      if (from === null) {
        if (ctx.state.userData[currentUser].exchangeCryptoBalance < amount) throw new Error('invalid amount')

        ctx.setUserData({
          exchangeCryptoBalance: ctx.state.userData[currentUser].exchangeCryptoBalance - amount
        })
      } else {
        if (ctx.state.cryptoBalances[to] < amount) throw new Error('invalid amount')
        ctx.setState({
          cryptoBalances: {
            ...ctx.state.cryptoBalances,
            [from]: ctx.state.cryptoBalances[from] - amount
          }
        })
      }
    }
  },
  ctx => {
    // console.log('clearing', ctx.interval)
    clearInterval(ctx.interval)
    ctx.__queuedInterval = 0


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
      lampOn,
      usdBalances,
      cryptoBalances,
      jailbrokenApps
    } = ctx.state

    const currentUserData = userData[currentUser]

    const {
      appsInstalled,
      textMessages,
      payAppUSDAddr,
      moneyMinerCryptoAddr,
      exchangeUSDAddr,
      exchangeCryptoBalance,
      exchangePremiumCryptoBalance,
      notePadValue,
      exchangePremium,
    } = currentUserData


    const inInternetLocation = globalState.location !== 'externalHallway' && globalState.location !== 'stairway'
    const wifiConnected = internet === 'wifi' && wifiNetwork && inInternetLocation
    const dataConnected = internet === 'data' && dataPlanActivated && inInternetLocation
    const hasInternet = dataConnected || wifiConnected


    if (globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
      ctx.newText({
        from: '+7 809 3390 753',
        value: `United Pakcåge Delvery MsG: "W⍷lcome ◻︎⎅◻︎ y⌾ure Pâck⎀ge ⎙ h⍶s been ◻︎ deLiveRed t⌀ ⇢⇢ <strong>FRONT DOOR</strong> ⇠⇠ <RENDER_ERROR:/home/usr/img/package-d⌽liver83y.jpg> ⎆ pAy deliver fee ⌱ 0xb0b9d337b68a69f5560969c7ab60e711ce83276f"`
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

      // setTimeout(() => {
      //   if (ctx.state.screen === 'loading') ctx.setState({ screen: 'login' })
      // }, 10000)

    } else if (screen === 'login') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <h1>Select User Profile:</h1>
          ${
            Object.keys(userNames).sort().map(u => `<button id="user-${u}" style="margin-right: 0.5em; margin-bottom: 0.5em">${userNames[u]}</button>`).join('')
          }<button id="newProfile">Create New Profile</button>
        </div>
      `

      window.speechSynthesis.cancel()
      if (PhoneCall.active) PhoneCall.active.hangup()


      Object.keys(userNames).sort().forEach(id => {
        ctx.$(`#user-${id}`).onclick = () => {
          if (id === '0' && !globalState.defaultUnlocked) {
            alert('This profile has been indefinitely suspended for violating our terms of service. Please contact us at 1-818-222-5379 if you believe there has been a mistake')
          } else {
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
        const firstName = ctx.$('#firstName').value.trim()
        if (!firstName) {
          ctx.$('#error').innerHTML = 'Please provide a first name'
          return
        } else if (firstName.includes(' ')) {
          ctx.$('#error').innerHTML = 'First name cannot include spaces'
          return
        } else if (Object.values(userNames).includes(firstName)) {
          ctx.$('#error').innerHTML = 'A profile with this name already exists'
          return
        } else {
          ctx.$('#error').innerHTML = ''
        }
        const id = ctx.state.newUsers + 1

        globalState.totalAccountsCreated += 1

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
              payAppUSDAddr: rndAddr(),
              moneyMinerCryptoAddr: rndAddr(),
              exchangeUSDAddr: rndAddr(),
              exchangeCryptoBalance: 0,
              exchangePremiumCryptoBalance: 0,
              exchangePremium: false,
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
          <div class="home" style="display: flex; flex-direction: column; justify-content: space-between; flex: 1">
            <div>
              <button id="appMarket">App Market</button><button id="phoneApp">Phone App</button><button id="textMessage">Text Messages${unreadTextCount ? ` (${unreadTextCount})` : ''}</button><button id="settings">Settings</button><button id="network">Network & Internet</button>${appsInstalled.map(a => `<button id="${a.key}" class="${a.jailbreakr ? 'jailbreakr' : ''}">${a.name}</button>`).join('')}<button id="logOut">Log Out</button>
            </div>

            <div style="display: flex; justify-content: flex-end">
              <button id="close">Close</button>
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

              ctx.$('#appContent').innerHTML = `
                <h4 class="blink">Downloading: ${a.name}</h4>
                <!--
                  <div>
                    <progress id="dlProgress" value="0" max="100" style="width:20em"></progress>
                  </div>
                -->
              `

              // const interval = setRunInterval(() => {
              //   ctx.$('#dlProgress').value += 10
              // }, 270)

              setTimeout(() => {
                // clearInterval(interval)
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
                  value: `Hello new friend to receive the ADVANCED wealth-generation platform to provide high-growth crypto currency investment methods simply follow the advice of our experts to achieve stable and continuous profits. We have the world's top analysis team for wealth generation But how does it work you might ask?. First you download the <strong>MoneyMiner</strong> application to your device. Second you participate in a proprietary proof of work (pow) protocol to mine ₢rypto. Third you can optionally transfer your ₢rypto to participating exchanges such as <strong>Currency Xchange</strong> to exchange your crypto for fiat currencies such as United States Dollars. This opportunity is once in your life time. `,
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

      // TODO: add a clear button; or clear number if call not active and user goes back

      phoneApp(ctx)

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

      const usdBalance = usdBalances[payAppUSDAddr] || 0

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin-bottom: 0.25em">PayApp: Making Payment as easy as 1-2-3!</h2>
          <h3 style="margin: 0.5em 0">Current $ Balance: $${usdBalance.toFixed(2)}</h3>
          <div style="margin: 0.4em 0">
            <h4>My $ Recipient Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h4>
            <span style="font-size: 0.9em; background: #000; color: #fff; padding: 0.25em; margin-top: 0.1em; display: inline-block">${payAppUSDAddr}</span>
          </div>

          <!--
            <div style="margin-bottom: 0.6em">
              <h3>Private Payment Key (PPK):</h3>
              <span style="font-size: 0.9em"><em>hidden</em></span>
              <div>(Don't share this with anyone! Including PayApp employees)</div>
            </div>
          -->

          <div style="margin-top: 0.6em; padding-top: 0.5em; border-top: 1px dashed">
            <h3>Receive $</h3>
            <div>
              <input id="sptxInput" placeholder="S.P.T.X. identifier">
              <button id="processSPTX">Process SPTX</button>
            </div>
            <h5 id="sptxError"></h5>
            <ol class="payInstructions">
              <li><em><strong>1.</strong> Give the sender your $ Recipient Address</em></li>
              <li><em><strong>2.</strong> Collect a S.P.T.X. identifier from the sender</em></li>
              <li><em><strong>3.</strong> Process the S.P.T.X. identifier and recieve your $!</em></li>
            </ol>
          </div>

          <div style="margin-top: 0.6em; padding-top: 0.5em; border-top: 1px dashed">
            <h3>Send $</h3>
            <ol>
              <li><input id="recipient" placeholder="Recipient Address"></li>
              <li style="margin:0.25em 0"><input id="amount" placeholder="Amount" type="number"></li>
              <li><button id="sign">Sign Transaction</li>
            </ol>
            <h4 id="sptx"></h4>

            <ol class="payInstructions">
              <li><em><strong>1.</strong> Collect the recipient's $ Recipient Address</em></li>
              <li><em><strong>2.</strong> Generate an S.P.T.X. identifier</em></li>
              <li><em><strong>3.</strong> Give the S.P.T.X. identifier to the recipient</em></li>
            </ol>
            <p style="margin-top: 1em; padding: 0.5em"><strong style="text-decoration: underline; font-size: 1.1em">WARNING</strong>: <em>Please ensure that you have input the correct $ Recipient Address and Amount. All $ transactions are <strong>irreversible</strong> once signed!</em></p>
          </div>


        </div>
      `
      // ff33083322f66413ea6fb21e7b6451d9922b14c1622ebff8da71a61a36de0cc8
      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      ctx.$('#processSPTX').onclick = () => {
        const sptxInput = ctx.$('#sptxInput').value
        if (!sptxInput) {
          ctx.$('#sptxError').innerHTML = 'SPTX ERROR: empty'
          return
        }
        const payment = globalState.payments[sptxInput]

        ctx.$('#sptxError').innerHTML = 'processing [do not reload page]'

        setTimeout(() => {
          if (!payment) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: invalid identifier'
            return
          } else if (payment.recipient !== payAppUSDAddr) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: invalid recipient'
            return
          } else if (payment.received) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: already processed'
            return
          }

          if (usdBalance === 0 && !textMessages.some(m => m.from === '1-800-333-7777')) {
            ctx.newText({
              from: '1-800-333-7777',
              value: 'Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ←',
            })
          }

          ctx.receiveSPTX(sptxInput)
          setTimeout(() => {
            ctx.$('#sptxError').innerHTML = 'success'
          }, 1000)
        }, 7000)

      }

      ctx.$('#sign').onclick = () => {
        const amount = Number(ctx.$('#amount').value)
        const recipient = ctx.$('#recipient').value.toLowerCase().trim()

        const $sptx = ctx.$('#sptx')

        $sptx.innerHTML = ''

        if (!recipient) {
          $sptx.innerHTML = `Please input a valid $ Recipient Address`
          return
        }
        if (amount <= 0 || !amount) {
          $sptx.innerHTML = `Please input a value greater than 0`
          return
        }
        if (amount > usdBalance) {
          $sptx.innerHTML = `INVALID AMOUNT`
          return
        }

        // globalState.payments = {}

        const sptx = ctx.createSPTX({
          sender: payAppUSDAddr,
          recipient,
          amount
        })


        setTimeout(() => {
          ctx.$('#sptx').innerHTML = `Secure Payment Transaction (S.P.T.X.) identifier: ${sptx}`
        }, 2000)

      }

    } else if (screen === 'settings') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <button id="bluetooth">${bluetoothEnabled ? 'Disable' : 'Enable'} Bluetooth</button>
          <div class="deviceData">
            <h5>Device ID: 49-222999-716-2580</h5>
            <h5>User: ${userNames[currentUser]} (${currentUser})</h5>
            <h5>OS Version: ${window.GAME_VERSION}.1</h5>
            <h5><a href="https://steviep.xyz" target="_blank">stevie.xyz</a> [2024]</h5>
          </div>

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
        <div>${jbMarkup(globalState.cryptoDevices.lumin)}</div>
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

      jbBehavior(ctx, globalState.cryptoDevices.lumin, 300)

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


      // const faq = `
      //     <h4>FAQ</h4>
      //     <p><strong>Q:</strong> How do I mine Crypto?</p>
      //     <p><strong>A:</strong> In order to mine crypto, all you need to do is click the <strong>"Mine Crypto"</strong> button in the Money Miner interface. Each click will mine a new ₢rypto Coin.</p>

      //     <p><strong>Q:</strong> How can I convert crypto to $?</p>
      //     <p><strong>A:</strong> Exchanging crypto is easy! Just download the <strong>Currency Xchange App</strong>, create an account, and send your crypto to your new address! </p>

      //     <p><strong>Q:</strong> Can other Smart Devices mine Crypto for me?</p>
      //     <p><strong>A:</strong> Yes! Select smart devices can be configured to mine Crypto in order to create a passive income stream. In order to configure these devices, please download the <strong>CryptoMinerPlus App!</strong></p>

      // `

      const faq = `
          <h4>FAQ</h4>
          <p><strong>Q:</strong> How does Money Miner work?</p>
          <p><strong>A:</strong> In order to mine ₢rypto, all you need to do is click the <strong>Mine ₢rypto"</strong> button in the Money Miner interface. Each click will mine a new ₢rypto.</p>

          <p><strong>Q:</strong> How can I convert ₢rypto to $?</p>
          <p><strong>A:</strong> Exchanging ₢rypto is easy! Just download the <strong>Currency Xchange App</strong>, create an account, and send your ₢rypto to your new address! </p>
      `

      const adContent = [
        'Mine ₢rypto While You Sleep!',
        `Learn the secret mining technique the government doesn't want you to know about`,
        `Click Here to improving mining efficiency by 100000% !!`
      ]

      const getAd = () => adContent[Math.floor(Date.now()/20000)%adContent.length]

      const cryptoBalance = cryptoBalances[moneyMinerCryptoAddr] || 0

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 >Welcome to  $ Money Miner $</h2>
          <h4 style="margin-top: 0.5em;">₢rypto Wallet Address:</h4>
          <h4 style="word-wrap: break-word; margin-bottom: 0.4em">${moneyMinerCryptoAddr}</h4>

          <h4 style="text-align: center">To mine ₢rypto, click the button below ⬇↓⇣↓⬇</h4>
          <div style="display: flex; justify-content: center">
            <button id="mine" style="font-size: 1.1em">Mine ₢rypto</button>
          </div>
          <h4>₢rypto Balance: <span id="cryptoBalance">${cryptoBalance}</span></h4>

          <div class="ad" id="adContainer">
            <h5>SPONSORED CONTENT</h5>
            <div id="ad">${getAd()}</div>
          </div>


          <div style="margin-top: 0.5em; margin-bottom: 0.4em">
            <h4>Send ₢rypto</h4>
            <input id="recipient" placeholder="0x000000000000000....">
            <input id="amount" placeholder="₢ 0.00" type="number">
            <button id="send" style="margin-top: 0.25em">Send</button>
            <h4 id="error"></h4>
          </div>


          ${faq}

        </div>

      `

      ctx.setInterval(() => {
        ctx.$('#ad').innerHTML = getAd()
      })

      ctx.$('#mine').onclick = () => {
        ctx.setState({
          cryptoBalances: {
            ...cryptoBalances,
            [moneyMinerCryptoAddr]: (cryptoBalance || 0) + 1
          }
        })
      }


      ctx.$('#adContainer').onclick = () => {
        if (!appsInstalled.some(a => a.key === 'messageViewer')) {
          alert('Please download the Message Viewer app from the AppMarket to view this message')
          return
        }
        ctx.setState({
          screen: 'messageViewer',
          messageViewerMessage: `
            <div style="font-family: sans-serif">
              <h2>Instructions on how to auto-mine ₢rypto:</h2>
              <p style="margin-top: 0.4em">1. Download the "EXE Runner" application </p>
              <p style="margin-top: 0.4em">2. <strong>IMPORTANT</strong>: Run the following command in "EXE Runner": <code>disable /System/.malware-detection.exe</code></p>
              <p style="margin-top: 0.4em">3. Run the following command in "EXE Runner": <code>install -i qd://0ms.co/tjn/jailbreakx-0_13_1.mal /Applications/$CURRENT_USER</code></p>
              <p style="margin-top: 0.4em">4. Open the JAILBREAKR application and apply the following application binary for all valid applications: <code>${applicationBinary}</code> </p>
            </div>
          `
        })
      }

      ctx.$('#send').onclick = () => {
        const amount = Number(ctx.$('#amount').value)
        const recipient = ctx.$('#recipient').value.trim()

        if (amount > cryptoBalance || amount < 0 || !amount) {
          ctx.$('#error').innerHTML = 'Error: invalid ₢ amount'
          return
        } else {
          ctx.$('#error').innerHTML = ''
        }

        ctx.sendCrypto(moneyMinerCryptoAddr, recipient, amount)


        ctx.$('#amount').value = ''
        ctx.$('#recipient').value = ''
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'exchange') {
      const {exchangeTab} = ctx.state

      const exchangeUSDBalance = usdBalances[exchangeUSDAddr] || 0

      const tabHighlight = `font-weight: bold; text-decoration: underline;`
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex:1;${exchangePremium ? 'background: #000; color: #fff' : ''}">
          <button id="home">Back</button>
          <h2>Currency Xchange ${exchangePremium ? '[PREMIUM]' : ''}</h2>
          <h4 style="margin: 0.4em 0">Temporary ₢rypto Wallet Address: <div id="tempAddr" style="word-wrap: break-word; border: 1px dotted; padding: 0.2em; margin: 0.2em 0">${calcAddr(currentUser)}</div> (Valid for <span id="timeRemaining"></span> more seconds)</h4>
          <em style="font-size:0.8em">Recipient addresses are cycled every 60 seconds for security purposes. Any funds sent to an expired recipient address will be lost</em>

          <div style="margin: 0.4em 0">
            <h3>₢ Balance: ${exchangeCryptoBalance.toFixed(6)}</h3>
            <h3>$ Balance: ${exchangeUSDBalance.toFixed(6)}</h3>
            ${exchangePremium ? `<h3>₱ Balance: ${exchangePremiumCryptoBalance.toFixed(6)}</h3>` : ''}
          </div>

          <div style="padding: 0.25em; border: 3px solid;"">
            <nav style="text-align: center; padding-bottom: 0.25em; border-bottom: 3px solid">
              <h4>I want to <button id="viewTradeTab" style="margin-bottom: 0; ${exchangeTab === 'trade' ? tabHighlight : ''}">TRADE</button> <button id="viewSendTab" style="margin-bottom: 0; ${exchangeTab === 'send' ? tabHighlight : ''}">SEND</button> <button id="viewPremiumTab" style="margin-bottom: 0; ${exchangeTab === 'premium' ? tabHighlight : ''}">PREMIUM</button></h4>
            </nav>

            <div style="margin: 0.6em 0; ${exchangeTab === 'trade' ? '' : 'display: none'}">
              <h3 style="text-align: center">Exchange Rates (<em>Live!</em>)</h3>
              <table style="border: 1px solid; margin: 0.4em auto">
                <tr>
                  ${exchangePremium
                    ? `<td id="usdCBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid"> $ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="usdC" style="border: 1px solid"></td>
                </tr>
                <tr>
                  ${exchangePremium
                    ? `<td id="cUSDBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid">₢ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="cUSD" style="border: 1px solid"></td>
                </tr>
                <tr style="${exchangePremium ? '' : 'background: #000'}">
                  ${exchangePremium
                    ? `<td id="cPremBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid">₢ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="cPrem" style="border: 1px solid"></td>
                </tr>
                <tr style="${exchangePremium ? '' : 'background: #000'}">
                  ${exchangePremium
                    ? `<td id="premCBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid"> ₱ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="premC" style="border: 1px solid"></td>
                </tr>
                <tr style="${exchangePremium ? '' : 'background: #000'}">
                  ${exchangePremium
                    ? `<td id="premUSDBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid"> ₱ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="premUSD" style="border: 1px solid"></td>
                </tr>
                <tr style="${exchangePremium ? '' : 'background: #000'}">
                  ${exchangePremium
                    ? `<td id="usdPremBuy" style="border: 1px solid"></td>`
                    : ''
                  }
                  <td style="border: 1px solid"> $ 1.00</td>
                  <td style="border: 1px solid">=</td>
                  <td id="usdPrem" style="border: 1px solid"></td>
                </tr>
              </table>

              <div style="display: flex; flex-direction: column; align-items: center">
                <div style="text-align: center">
                  <select id="tradeAction">
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                  </select>

                  <select id="currency1">
                    <option value="usd">$</option>
                    <option value="crypto">₢</option>
                    ${exchangePremium ? '<option value="premium">₱</option>' : ''}
                  </select>

                  <input id="transactionAmount" placeholder="0.00" style="width: 4em; text-align: center" type="number">


                  <span id="tradeOperation">with</span>

                  <select id="currency2">
                    <option value="usd">$</option>
                    <option value="crypto">₢</option>
                    ${exchangePremium ? '<option value="premium">₱</option>' : ''}
                  </select>
                </div>

                <button id="executeTrade" style="margin-top: 0.4em">EXECUTE TRADE</button>

              </div>
              <h4 id="tradeError" style="text-align: center"></h4>
            </div>

            <div style="margin: 0.6em 0; ${exchangeTab === 'send' ? '' : 'display: none'}">
              <h4 style="margin: 0.4em 0">Send Funds</h4>
              <input id="sendCryptoAddress" placeholder="₢rypto Address" style="width: 90%; margin-bottom: 0.4em">
              <input id="sendCryptoAmount" placeholder="₢ 0.00" type="number" style="width: 6em"> <button id="sendCrypto">SEND ₢</button>

              <input id="sendUSDAddress" placeholder="$ Address" style="width: 90%; margin-bottom: 0.4em">
              <input id="sendUSDAmount" placeholder="$ 0.00" type="number" style="width: 6em"> <button id="sendUSD">SEND $</button>
              <h4 id="sendError"></h4>
              <h4 style="margin: 0.4em 0">Receive $</h4>
              <h5 style="border: 1px dotted; text-align: center; padding: 0.25em">${exchangeUSDAddr}</h5>
              <input id="sptxInput" placeholder="SPTX" type="number" style="width: 11em"> <button id="receiveSPTX">PROCESS</button>
              <h4 id="sptxError"></h4>
            </div>

            <div style="margin: 0.6em 0; ${exchangeTab === 'premium' ? '' : 'display: none'}">
              <ul style="padding-left: 2em">
                <li>Trade the <em>exclusive</em> ₱remium Coin!</li>
                <li>Buy/Sell signals!</li>
                <li>Weekly Alpha Reports!</li>
                <li>Greater money-making opportunity!</li>
              </ul>

              <div style="margin-top: 0.5em; display: flex; flex-direction: column; align-items: center">
                <button id="buyPremium" ${exchangeCryptoBalance < 10000 || exchangePremium ? 'disabled' : ''} style="font-size: 1.2em; margin-bottom: 0.25em">BUY PREMIUM</button>
                <h4>₢ 10,000.00</h4>
                ${exchangeCryptoBalance < 10000 && !exchangePremium ? '<h5>(CURRENT BALANCE TOO LOW)</h5>' : ''}
                ${exchangePremium ? '<h5>(PURCHASE SUCCESSFUL)</h5>' : ''}
              </div>
              ${exchangePremium
                ? `<div style="margin-top: 0.4em; padding: 0.25em; border: 1px dashed">
                  <h5 style="text-align: center">ALPHA REPORT</h5>
                  <p style="font-size: 0.8em; font-family: serif">The new ₱remium Coin (₱) just dropped, and it's been pumping nonstop. It just passed a major resistance threshold, so this thing is pretty much guaranteed to moon. Our analysts say that we could see prices as high as $0.0069! But you might want to keep some dry powder around to re-up your positiong when the FUD gets too strong.</p>
                </div>`
                : ''}
            </div>
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
          ctx.$('#tempAddr').innerHTML = calcAddr(currentUser)
        }

        const prem = `background:#000; color: #fff`

        const usdC = 1 / calcCryptoUSDExchangeRate()
        const cUSD = calcCryptoUSDExchangeRate()
        const cPrem = calcCryptoUSDExchangeRate() / calcPremiumCryptoUSDExchangeRate()
        const premC = calcPremiumCryptoUSDExchangeRate() / calcCryptoUSDExchangeRate()
        const premUSD = calcPremiumCryptoUSDExchangeRate()
        const usdPrem = 1 / calcPremiumCryptoUSDExchangeRate()

        ctx.$('#usdC').innerHTML = '₢ ' + usdC.toFixed(6)
        ctx.$('#cUSD').innerHTML = '$ ' + cUSD.toFixed(6)
        ctx.$('#cPrem').innerHTML = exchangePremium ? '₱ ' + cPrem.toFixed(6) : `<strong style="${prem}">---PREMIUM---</strong>`
        ctx.$('#premC').innerHTML = exchangePremium ? '₢ ' + premC.toFixed(6) : `<strong style="${prem}">---PREMIUM---<strong>`
        ctx.$('#premUSD').innerHTML = exchangePremium ? '$ ' + premUSD.toFixed(6) : `<strong style="${prem}">---PREMIUM---</strong>`
        ctx.$('#usdPrem').innerHTML = exchangePremium ? '₱ ' + usdPrem.toFixed(6) : `<strong style="${prem}">---PREMIUM---</strong>`

        if (exchangePremium) {
          ctx.$('#usdCBuy').innerHTML = usdC < 987 ? 'BUY' : usdC > 1020 ? 'SELL' : 'HODL'
          ctx.$('#cUSDBuy').innerHTML = cUSD < 0.00098 ? 'BUY' : cUSD > 0.00102 ? 'SELL' : 'HODL'
          ctx.$('#cPremBuy').innerHTML = cPrem < .22 ? 'BUY' : cPrem > 5 ? 'SELL' : 'HODL'
          ctx.$('#premCBuy').innerHTML = premC < .2 ? 'BUY' : premC > 4.5 ? 'SELL' : 'HODL'
          ctx.$('#premUSDBuy').innerHTML = premUSD < 0.000285 ? 'BUY' : premUSD > 0.0035 ? 'SELL' : 'HODL'
          ctx.$('#usdPremBuy').innerHTML = usdPrem < 285 ? 'BUY' : usdPrem > 3500 ? 'SELL' : 'HODL'
        }
      })

      ctx.$('#viewTradeTab').onclick = () => ctx.setState({ exchangeTab: 'trade' })
      ctx.$('#viewSendTab').onclick = () => ctx.setState({ exchangeTab: 'send' })
      ctx.$('#viewPremiumTab').onclick = () => ctx.setState({ exchangeTab: 'premium' })

      ctx.$('#buyPremium').onclick = () => {
        if (exchangeCryptoBalance >= 10000) ctx.setUserData({
          exchangePremium: true,
          exchangeCryptoBalance: exchangeCryptoBalance - 10000,

        })
      }



      ctx.$('#sendCrypto').onclick = () => {
        const amount = Number(ctx.$('#sendCryptoAmount').value)
        const recipient = ctx.$('#sendCryptoAddress').value

        if (amount > exchangeCryptoBalance) {
          ctx.$('#sendError').innerHTML = 'Amount EXCEEDS Current Balance'
          return
        } else if (!amount || amount < 0) {
          ctx.$('#sendError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#sendError').innerHTML = ''
        }

        ctx.sendCrypto(
          null, recipient, amount
        )

        ctx.$('#sendCryptoAmount').value = ''
        ctx.$('#sendCryptoAddress').value = ''

      }

      ctx.$('#sendUSD').onclick = () => {
        const amount = Number(ctx.$('#sendUSDAmount').value)
        const recipient = ctx.$('#sendUSDAddress').value

        if (amount > exchangeUSDBalance) {
          ctx.$('#sendError').innerHTML = 'Amount EXCEEDS Current Balance'
          return
        } else if (!amount || amount < 0) {
          ctx.$('#sendError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#sendError').innerHTML = ''

        }

        ctx.$('#sendError').innerHTML = 'Processing [DO NOT RELOAD PAGE]'

        if (recipient === '0x4b258603257460d480c929af5f7b83e8c4279b7b') {
          setTimeout(() => {
            ctx.$('#sendError').innerHTML = `PROCESSING ERROR: Recipient outside payment network`
          }, 2000)
          return
        }

        const sptx = ctx.createSPTX({
          sender: exchangeUSDAddr,
          recipient,
          amount
        })
        setTimeout(() => {
          ctx.$('#sendError').innerHTML = `Message: Secure Payment Transaction (S.P.T.X.) identifier: ${sptx}`
        }, 2000)

        ctx.$('#sendUSDAmount').value = ''
        ctx.$('#sendUSDAddress').value = ''
      }

      ctx.$('#receiveSPTX').onclick = () => {
        const sptxInput = ctx.$('#sptxInput').value
        if (!sptxInput) {
          ctx.$('#sptxError').innerHTML = 'SPTX ERROR: empty'
          return
        }
        const payment = globalState.payments[sptxInput]

        ctx.$('#sptxError').innerHTML = 'processing [do not reload page]'

        setTimeout(() => {
          if (!payment) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: invalid identifier'
            return
          } else if (payment.recipient !== exchangeUSDAddr) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: invalid recipient'
            return
          } else if (payment.received) {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: already processed'
            return
          }

          setTimeout(() => {
            ctx.receiveSPTX(sptxInput)
            setTimeout(() => {
              ctx.$('#sptxError').innerHTML = 'success'
            }, 1000)
          }, 4000)
        })
      }

      ctx.$('#tradeAction').onchange = () => {
        ctx.$('#tradeOperation').innerHTML =
          ctx.$('#tradeAction').value === 'buy'
            ? 'with'
            : 'for'

      }

      ctx.$('#executeTrade').onclick = () => {
        const action = ctx.$('#tradeAction').value
        const amount = Number(ctx.$('#transactionAmount').value)

        const buyCurrency = action === 'buy'
          ? ctx.$('#currency1').value
          : ctx.$('#currency2').value

        const sellCurrency = action === 'sell'
          ? ctx.$('#currency1').value
          : ctx.$('#currency2').value


        const exchangeRates = {
          usdcrypto: 1/calcCryptoUSDExchangeRate(), // sell usd, buy crypto
          cryptousd: calcCryptoUSDExchangeRate(), // sell crypto, buy usd
          cryptopremium: calcCryptoUSDExchangeRate() / calcPremiumCryptoUSDExchangeRate(), // sell crypto, buy premium
          premiumcrypto: calcCryptoUSDExchangeRate() / calcPremiumCryptoUSDExchangeRate(), // sell premium, buy crypto
          premiumusd: calcPremiumCryptoUSDExchangeRate(), // sell premium, buy usd
          usdpremium: 1/calcPremiumCryptoUSDExchangeRate(), // sell usd, buy premium
        }

        const exchangeRate = exchangeRates[sellCurrency + buyCurrency]

        const sellAmount = action === 'sell'
          ? amount
          : amount / exchangeRate

        const buyAmount = action === 'buy'
          ? amount
          : amount * exchangeRate

        const sellBalance = {
          usd: exchangeUSDBalance,
          crypto: exchangeCryptoBalance,
          premium: exchangePremiumCryptoBalance,
        }[sellCurrency]

        const sellSymbol = {
          usd: '$',
          crypto: '₢',
          premium: '₱',
        }[sellCurrency]

        let cryptoChange = 0, premiumChange = 0, usdChange = 0

        if (buyCurrency === 'crypto') cryptoChange = buyAmount
        if (buyCurrency === 'premium') premiumChange = buyAmount
        if (buyCurrency === 'usd') usdChange = buyAmount

        if (sellCurrency === 'crypto') cryptoChange = sellAmount * -1
        if (sellCurrency === 'premium') premiumChange = sellAmount * -1
        if (sellCurrency === 'usd') usdChange = sellAmount * -1


        if (buyCurrency === sellCurrency) {
          ctx.$('#tradeError').innerHTML = `Buy currency cannot equal Sell currency`
          return
        }

        if (sellAmount > sellBalance) {
          ctx.$('#tradeError').innerHTML = `Insufficient ${sellSymbol} balance to execute transaction`
          return
        }

        if (!sellAmount || sellAmount < 0) {
          ctx.$('#tradeError').innerHTML = `Must input positive ${sellSymbol} amount`
          return
        }

        ctx.setUserData({
          exchangeCryptoBalance: exchangeCryptoBalance + cryptoChange,
          exchangePremiumCryptoBalance: exchangePremiumCryptoBalance + premiumChange,
        })

        ctx.setState({
          usdBalances: {
            ...usdBalances,
            [exchangeUSDAddr]: exchangeUSDBalance + usdChange
          }
        })



        ctx.$('#tradeError').innerHTML = ``
        ctx.$('#transactionAmount').value = ''

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
        ? `
          <div>
            <input placeholder="Username">
            <input placeholder="Password" type="password">
            <button disabled>Login</button>
          </div>
          <div>${jbMarkup(globalState.cryptoDevices.toastr)}</div>
        `
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


      jbBehavior(ctx, globalState.cryptoDevices.toastr, 300)


      if (ctx.$('#pairToaster')) ctx.$('#pairToaster').onclick = () => {
        ctx.setState({ toasterPaired: true })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'planter') {
      const plantStates = ['Dead', ':(', ':|', ':)']

      const mainInterface = planterPaired
        ? `
          <h3>Plant Status: <span id="plantStatus">${plantStates[ctx.state.plantStatus]}</span></h3>
          <button id="water" ${globalState.plantWatered ? 'disabled' : ''}>Water</button>
        `
        : `
          <input id="planterDeviceCode" placeholder="Device Code"><button id="pairPlanter" style="margin-left: 0.25em">Pair Device</button>
        `


      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>SmartPlanter</h2>
          ${mainInterface}
          <h4 id="error"><h4>
          ${jailbrokenApps.planter && planterPaired ? jbMarkup(globalState.cryptoDevices.planter) : ''}
        </div>
      `

      jbBehavior(ctx, globalState.cryptoDevices.planter, 100, () => {
        if (ctx.state.plantStatus > 0 && globalState.cryptoDevices.planter.totalTime > 20) {
          ctx.setState({ plantStatus: 0 })
        }
      })

      if (ctx.$('#water')) ctx.$('#water').onclick = () => {
        globalState.plantWatered = true

        setTimeout(() => {
          if (ctx.state.plantStatus > 0) {
            ctx.setState({ plantStatus: ctx.state.plantStatus + 1 })
          }
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

    } else if (screen === 'exe') {
      const {exeCommands, rootUser} = ctx.state

      ctx.$header.classList.add('hidden')


      ctx.$phoneContent.innerHTML = `
        <div class="exe">
          <div id="ranCommands" style="flex: 1; overflow: scroll; padding: 0.25em"></div>
          <div style="display: flex; align-items: center; padding-top: 1em">
            <span style="margin-right: 1em; user-select: none;">&gt;</span>
            <input id="prompt" style="flex:1; outline: none">
          </div>
        </div>
      `
      const $ranCommands = ctx.$('#ranCommands')
      const $prompt = ctx.$('#prompt')


      if (!exeCommands.length) {
        setTimeout(() => {
          ctx.setState({exeCommands: [`<h1>EXE Runner</h1>`]})

          setTimeout(() => {
            ctx.setState({exeCommands: [...ctx.state.exeCommands, `
              <h4>Active User Profile: <span id="activeUserProfile">${userNames[currentUser]} (${currentUser})</span></h4>
              <h4>Admin Access: <span id="adminAccess">${Number(currentUser) === Number(rootUser) ? 'Granted' : 'Denied'}</span></h4>
              <h4>Device ID: 49-222999-716-2580</h4>
              <h4>OS: MPX ${window.GAME_VERSION}.1</h4>
              <br>
              <br>
            `]})
            setTimeout(() => {
              ctx.setState({exeCommands: [...ctx.state.exeCommands, `
                <h5>Helpful Commands:</h5>
                <h5>"escape()" -- Exit the EXE Runner</h5>
                <br>
                <br>
                <br>
                <br>
              `]})
            }, 300)
          }, 300)
        }, 800)
      }
      $ranCommands.innerHTML = ctx.state.exeCommands.join('')
      $ranCommands.scrollTop = $ranCommands.scrollHeight

      if (ctx.$('#activeUserProfile')) ctx.$('#activeUserProfile').innerHTML = `${userNames[currentUser]} (${currentUser})`
      if (ctx.$('#adminAccess')) ctx.$('#adminAccess').innerHTML = Number(currentUser) === Number(rootUser) ? 'Granted' : 'Denied'


      $prompt.focus()



      // $prompt.addEventListener('keyup', (e) => {
      //   if (e.key === 'ArrowUp') {
      //     $prompt.value = ctx.state.exeCommands.slice(3).slice(-1)[0] || ''
      //   }
      // })

      $prompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const command = $prompt.value.trim()

          let behavior = {}
          let commandDisplay = command
          if (command.includes('escape()')) {
            behavior = {
              screen: 'home',
              exeCommands: []
            }
          } else {
            let [fn, ...args] = command.split(' ')

            let sudo
            if (fn === 'sudo') {
              sudo = true
              fn = args.shift()
            }

            if (['disable', 'install', 'admin'].includes(fn) && Number(rootUser) !== Number(currentUser) && !sudo) {
              commandDisplay = `
                <div style="margin: 0.5em 0;">ERROR: command can only be performed by user with admin role: "${command}"</div>
                <div style="margin: 0.5em 0;">To reassign admin role, run: "admin reassign [USER_NAME]"</div>
                <div style="margin: 0.5em 0;">Current admin profile: ${userNames[rootUser]}</div>
              `
            } else if (fn === 'admin') {
              if (args[0] === 'view') {
                commandDisplay = `Current admin user: ${userNames[rootUser]} (${rootUser})`
              } else if (args[0] === 'reassign') {
                if (args[1]) {
                  const userId = Object.keys(userNames).find(k => userNames[k] === args[1])

                  if (userId && userId !== 0) {
                    commandDisplay = `Admin role assigned to: ${args[1]}`
                    behavior = { rootUser: userId }


                  } else {
                    commandDisplay = `Cannot find user: ${args[1]}`

                  }
                } else {
                  commandDisplay = `MISSING ARGUMENT`
                }

              } else {
                commandDisplay = `Unrecognized command: ${args[0]}`
              }
            } else if (fn === 'disable') {
              const [path] = args
              if (path === '/System/.malware-detection.exe') {
                behavior = {
                  disabledMalDetection: true
                }
                commandDisplay = '/System/.malware-detection.exe disabled!'
              } else {
                commandDisplay = 'DISABLE ERROR: Executable not found'
              }
            } else if (fn === 'install') {
              const [flag, url, location] = args
              if (!hasInternet) {
                commandDisplay = 'INSTALL ERROR: No internet connection'
              } else if (flag !== '-i') {
                commandDisplay = 'INSTALL ERROR: Flag not recognized'
              } else if (url !== 'qd://0ms.co/tjn/jailbreakx-0_13_1.mal') {
                commandDisplay = 'INSTALL ERROR: Invalid source'
              } else if (!['/', '/Applications', '/Applications/$CURRENT_USER', '/Applications/$CURRENT_USER/', '/System', '/System/'].includes(location)) {
                commandDisplay = 'INSTALL ERROR: Invalid destination'
              } else {
                const locationUser = location.replace('/Applications/', '').replace('/', '')
                const locationUserId = locationUser === '$CURRENT_USER'
                  ? currentUser
                  : Object.keys(userNames).find(k => userNames[key] === locationUser) || null

                commandDisplay = `Installing qd://0ms.co/tjn/jailbreakx-0_13_1.mal to ${location.replace('$CURRENT_USER', userNames[currentUser])}`


                if (['/Applications/$CURRENT_USER', '/Applications/$CURRENT_USER/'].includes(location) && locationUserId !== null) {
                  if (!ctx.state.disabledMalDetection) {
                    setTimeout(() => {
                      ctx.setState({
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.5em 0; font-size:0.85em">INSTALL ERROR: System blocked install</div>`],
                      })
                    }, 3000)

                  } else {
                    if (!userData[locationUserId].appsInstalled.map(a => a.key).includes('jailbreakr')) {
                      behavior = {
                        userData: {
                          ...userData,
                          [locationUserId]: {
                            ...userData[locationUserId],
                            appsInstalled: [
                              ...userData[locationUserId].appsInstalled,
                              { name: 'JAILBREAKR', key: 'jailbreak', size: 128, price: 0, jailbreakr: true }
                            ]
                          }
                        }
                      }
                    }
                    setTimeout(() => {
                      ctx.setState({
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.5em 0; font-size:0.85em">Installed qd://0ms.co/tjn/jailbreakx-0_13_1.mal!</div>`],
                      })
                    }, 1000)
                  }

                }
              }
            }
          }

          $prompt.value = ''

          setTimeout(() => {
            ctx.setState({
              exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.5em 0; font-size:0.85em">${commandDisplay}</div>`],
              ...behavior,
            })
          }, 300)
        }

      })

    } else if (screen === 'jailbreak') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: right">Jäįł⌁Bręåkr ⎆䷪</h2>
          <div style="display: flex; justify-content: space-between;padding-top:1em">
            <textarea id="applicationBinary" style="width: 20em; height:7em" placeholder="jb application binary"></textarea>
            <h3>1.</h3>
          </div>


          <div style="display: flex; justify-content: space-between;padding-top:1em">
            <h3>Appłÿ bīnary tø åpplicåtiôn:</h3>
            <h3>2.</h3>
          </div>
          <div id="binaryApply" style="text-align: right">
            <button id="appMarket">App Market</button><button id="phoneApp">Phone App</button><button id="textMessage">Text Messages${unreadTextCount ? ` (${unreadTextCount})` : ''}</button><button id="settings">Settings</button><button id="network">Network & Internet</button>${appsInstalled.map(a => `<button id="${a.key}" class="${a.jailbreakr ? 'jailbreakr' : ''}">${a.name + (
                globalState.cryptoDevices[a.key]
                ? ` (${globalState.cryptoDevices[a.key].ram}gb RAM)`
                : ''
              )}</button>`).join('')}
          </div>
          <h4 id="error"></h4>

        </div>
      `

      const allApps = ['appMarket', 'phoneApp', 'textMessage', 'settings', 'network', ...appsInstalled.map(a => a.key)]
      const validJailbreakApps = Object.keys(globalState.cryptoDevices)


      for (let app of allApps) {
        if (jailbrokenApps[app]) {
          ctx.$('#' + app).disabled = true
        }
        ctx.$('#' + app).onclick = () => {
          const ab = ctx.$('#applicationBinary').value.trim()

          ctx.$('#error').innerHTML = 'Processing...'
          setTimeout(() => {
            if (ab !== applicationBinary) {
              ctx.$('#error').innerHTML = 'Invalid Application Binary'
              return
            }

            if (validJailbreakApps.includes(app)) {
              ctx.$('#error').innerHTML = ''
              ctx.$('#binaryApply').innerHTML = `
                <h4 id="dlMessage" style="animation: Blink .5s steps(2, start) infinite;">Enabling \`autominer\` for: ${app} <br>[DO NOT REFRESH THIS PAGE]</h4>
                <progress id="jbProgress" value="0" max="100" style="width:20em"></progress>
              `

              const src = createSource('square')
              src.smoothFreq(100)
              src.smoothGain(MAX_VOLUME*.7, 0.5)
              src.smoothFreq(800, 10)
              let p = 0
              const interval = setInterval(() => {
                p += 2.5
                ctx.$('#jbProgress').value = p
              }, 250)

              setTimeout(() => {
                ctx.$('#applicationBinary').value = ''
                ctx.$('#dlMessage').innerHTML = ''
                ctx.$('#error').innerHTML = 'complete'
                src.smoothFreq(100, 0.1)
                src.smoothGain(0, 0.3)
                setTimeout(() => {
                  src.stop()
                }, 300)
                clearInterval(interval)

                setTimeout(() => {
                  ctx.setState({
                    jailbrokenApps: {
                      ...ctx.state.jailbrokenApps,
                      [app]: true
                    }
                  })
                }, 1000)

              }, 12000)

            } else {
              ctx.$('#error').innerHTML = 'ERROR: Cannot enable `automine` in application that does not support external device functionality'
            }
          }, 1000)
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


// TODO can't really send crypto to this wallet, or else it will get blown away
// maybe the sendCrypto function should add it to the global device balance if it exists
function jbMarkup(device) {

  const balance = device.balance
  return `
    <div style="margin: 0.4em 0; padding: 0.5em; background: #000; color: #fff; border: 2px dashed">
      <div>
        <h3>Auto-Miner Module [${device.ram}gb RAM]</h3>
        <h5 style="display: inline-block; padding: 0.25em; margin: 0.25em 0; background: #333; border: 1px solid">${device.wallet}</h4>
        <h4 style="margin: 0.4em 0">Balance: ₢ <span id="cryptoBalance">${device.balance}</span></h4>
        <button id="enableMining">${device.active ? 'Disable' : 'Enable'} Autominer</button>
        <h5 id="mineError"></h5>
      </div>

      <div style="margin-top: 1em">
        <h4>Send</h4>
        <input id="cryptoAddr" placeholder="Address" style="width: 15em">
        <input id="cryptoAmount" placeholder="0.00" type="number" style="width: 15em">
        <button id="sendCrypto">Send</button>
        <h5 id="sendError"></h5>
      </div>
    <div>
  `
}

function jbBehavior(ctx, device, speed, cb=noop) {
  const update = () => {
    ctx.state.cryptoBalances[device.wallet] = device.balance
    ctx.$('#cryptoBalance').innerHTML = device.balance
    cb()
  }
  if (device.active) {
    ctx.interval = setRunInterval(update, speed)
  }


  if (ctx.$('#enableMining')) ctx.$('#enableMining').onclick = () => {
    if (!globalState.wifiActive) {
      setTimeout(() => {
        ctx.$('#mineError').innerHTML = `ERROR: DEVICE CANNOT CONNECT TO INTERNET`
      }, 2500)
      return
    }

    if (device.active) {
      clearInterval(ctx.interval)
      clearMiningInterval(device)
      device.active = false
      ctx.setState({
        cryptoBalances: {
          ...ctx.state.cryptoBalances,
          [device.wallet]: device.balance
        }
      })

    } else {
      setMiningInterval(device, speed*device.ram/1000, speed)

      ctx.interval = setRunInterval(update, speed)
    }

    ctx.$('#enableMining').innerHTML = `${device.active ? 'Disable' : 'Enable'} Autominer`
  }

  if (ctx.$('#sendCrypto')) ctx.$('#sendCrypto').onclick = () => {
    const amount = Number(ctx.$('#cryptoAmount').value)
    const recipient = ctx.$('#cryptoAddr').value.trim()

    ctx.state.cryptoBalances[device.wallet] = device.balance

    if (amount > device.balance || amount < 0 || !amount) {
      ctx.$('#error').innerHTML = 'Error: invalid ₢ amount'
      return
    } else {
      ctx.$('#error').innerHTML = ''
    }

    ctx.sendCrypto(device.wallet, recipient, amount)

    // bleh lol
    device.balance -= amount
    ctx.state.cryptoBalances[device.wallet] = device.balance

    ctx.$('#cryptoAmount').value = ''
    ctx.$('#cryptoAddr').value = ''
  }
}
