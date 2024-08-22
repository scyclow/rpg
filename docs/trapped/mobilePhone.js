import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState, calcIdVerifyCode, calcAddr, calcCryptoUSDExchangeRate, setColor, rndAddr} from './global.js'
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
  plantStatus: 'Poor',
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
      exchangeUSDBalance: 0,
      exchangeCryptoBalance: 0,
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

      cb()
      setTimeout(() => {
        clearInterval(ctx.interval)
        ctx.interval = setRunInterval(cb, globalState.eventLoopDuration)
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

    ctx.receiveSPTX = sptx => {
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
      lampOn,
      usdBalances,
      cryptoBalances
    } = ctx.state

    const currentUserData = userData[currentUser]

    const {
      appsInstalled,
      textMessages,
      payAppUSDAddr,
      moneyMinerCryptoAddr,
      exchangeCryptoBalance,
      exchangeUSDBalance,
      notePadValue,
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

      setTimeout(() => {
        if (ctx.state.screen === 'loading') ctx.setState({ screen: 'login' })
      }, 10000)

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
              exchangeUSDBalance: 0,
              exchangeCryptoBalance: 0,
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
                  value: `Hello new friend to receive the ADVANCED wealth-generation platform to provide high-growth crypto currency investment methods simply follow the advice of our experts to achieve stable and continuous profits. We have the world's top analysis team for wealth generation But how does it work you might ask?. First you download the <strong>MoneyMiner</strong> application to your device. Second you participate in a proprietary proof of work (pow) protocol to mine crypto coins. Third you can optionally transfer your crypto to participating exchanges such as <strong>Currency Xchange</strong> to exchange your crypto for fiat currencies such as United States Dollars. This opportunity is once in your life time. `,
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

          <div style="margin-bottom: 0.6em">
            <h3>My $ Recipient Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h3>
            <span style="font-size: 0.9em">${payAppUSDAddr}</span>
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

          <h4 id="sptx"></h4>
          <p style="margin-top: 0.4em"><em>All $ transactions are irreversible. Please ensure that you have input the correct recipient address and amount</em></p>
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
          sender, recipient, amount
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
          <div class="deviceData">
            <h5>Device ID: 49-222999-716-2580</h5>
            <h5>User: ${userNames[currentUser]} (${currentUser})</h5>
            <h5>OS Version: ${window.GAME_VERSION}</h5>
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


      // const faq = `
      //     <h4>FAQ</h4>
      //     <p><strong>Q:</strong> How do I mine Crypto?</p>
      //     <p><strong>A:</strong> In order to mine crypto, all you need to do is click the <strong>"Mine Crypto"</strong> button in the Money Miner interface. Each click will mine a new Crypto Coin.</p>

      //     <p><strong>Q:</strong> How can I convert crypto to $?</p>
      //     <p><strong>A:</strong> Exchanging crypto is easy! Just download the <strong>Currency Xchange App</strong>, create an account, and send your crypto to your new address! </p>

      //     <p><strong>Q:</strong> Can other Smart Devices mine Crypto for me?</p>
      //     <p><strong>A:</strong> Yes! Select smart devices can be configured to mine Crypto in order to create a passive income stream. In order to configure these devices, please download the <strong>CryptoMinerPlus App!</strong></p>

      // `

      const faq = `
          <h4>FAQ</h4>
          <p><strong>Q:</strong> How does Money Miner work?</p>
          <p><strong>A:</strong> In order to mine crypto coins, all you need to do is click the <strong>Mine Crypto Coin"</strong> button in the Money Miner interface. Each click will mine a new Crypto Coin.</p>

          <p><strong>Q:</strong> How can I convert crypto to $?</p>
          <p><strong>A:</strong> Exchanging crypto is easy! Just download the <strong>Currency Xchange App</strong>, create an account, and send your crypto coins to your new address! </p>
      `

      const adContent = [
        'Mine Crypto While You Sleep!',
        `Learn the secret mining technique the government doesn't want you to know about`,
        `Click Here to improving mining efficiency by 100000% !!`
      ]

      const getAd = () => adContent[Math.floor(Date.now()/20000)%adContent.length]

      const cryptoBalance = cryptoBalances[moneyMinerCryptoAddr] || 0

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 >Welcome to  $ Money Miner $</h2>
          <h4 style="margin-top: 0.5em;">Crypto Coin Wallet Address:</h4>
          <h4 style="word-wrap: break-word; margin-bottom: 0.4em">${moneyMinerCryptoAddr}</h4>

          <h4 style="text-align: center">To mine Crypto Coins, click the button below ⬇↓⇣↓⬇</h4>
          <div style="display: flex; justify-content: center">
            <button id="mine" style="font-size: 1.1em">Mine Crypto</button>
          </div>
          <h4>Crypto Balance: <span id="cryptoBalance">${cryptoBalance}</span></h4>

          <div class="ad" id="adContainer">
            <h5>SPONSORED CONTENT</h5>
            <div id="ad">${getAd()}</div>
          </div>


          <div style="margin-top: 0.5em; margin-bottom: 0.4em">
            <h4>Send Crypto Coins</h4>
            <input id="recipient" placeholder="recipient address">
            <input id="amount" placeholder="CC 0.00" type="number">
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
              <h2>Instructions on how to auto-mine Crypto Coins:</h2>
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
          ctx.$('#error').innerHTML = 'Error: invalid cc amount'
          return
        } else {
          ctx.$('#error').innerHTML = ''
        }

        console.log(moneyMinerCryptoAddr, recipient, amount)

        ctx.sendCrypto(moneyMinerCryptoAddr, recipient, amount)


        ctx.$('#amount').value = ''
        ctx.$('#recipient').value = ''
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'exchange') {
      const {exchangeTab} = ctx.state

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>Currency Xchange</h2>
          <h4 style="margin: 0.4em 0">Temporary Crypto Recipient Address: <div id="tempAddr" style="word-wrap: break-word; border: 1px dotted; padding: 0.2em; margin: 0.2em 0">${calcAddr(currentUser)}</div> (Valid for <span id="timeRemaining"></span> more seconds)</h4>
          <em>Recipient addresses are cycled every 60 seconds for security purposes. Any funds sent to an expired recipient address will be lost</em>

          <div style="margin: 0.4em 0">
            <h3>Crypto Balance: ${exchangeCryptoBalance.toFixed(6)}</h3>
            <h3>$ Balance: $${exchangeUSDBalance.toFixed(6)}</h3>
          </div>

          <nav style="margin-top: 1em; padding: 0.25em; border: 4px solid; text-align: center">
            <h4>I want to: <button id="viewTradeTab" style="margin-bottom: 0">TRADE</button> <button id="viewSendTab" style="margin-bottom: 0">SEND</button></h4>
          </nav>

          <div style="margin: 0.6em 0; ${exchangeTab === 'trade' ? '' : 'display: none'}">
            <h3>Exchange Rates (<em>Live!</em>)</h3>
            <table style="border: 1px solid; margin-bottom: 0.4em">
              <tr>
                <td style="border: 1px solid"> $ 1.00</td>
                <td style="border: 1px solid">=</td>
                <td id="usdC" style="border: 1px solid"></td>
              </tr>
             <tr>
                <td style="border: 1px solid">CC 1.00</td>
                <td style="border: 1px solid">=</td>
                <td id="cUSD" style="border: 1px solid"></td>
              </tr>
            </table>

            <div>
              <div>
                <input id="buyAmount" placeholder="$ 0.00" type="number"> <button id="buyUSD">BUY $</button>
              </div>
              <div>
                <input id="sellAmount" placeholder="$ 0.00" type="number"> <button id="sellUSD">SELL $</button>
              </div>
            </div>
            <h4 id="tradeError"></h4>
          </div>

          <div style="margin: 0.6em 0; ${exchangeTab === 'send' ? '' : 'display: none'}">
            <h4 style="margin: 0.4em 0">Send Funds</h4>
            <input id="sendCryptoAddress" placeholder="CryptoCoin Address" style="width: 90%; margin-bottom: 0.4em">
            <input id="sendCryptoAmount" placeholder="CC 0.00" type="number"> <button id="sendCrypto">SEND Crypto</button>
            <input id="sendUSDAddress" placeholder="$ Address" style="width: 90%; margin-bottom: 0.4em">
            <input id="sendUSDAmount" placeholder="$ 0.00" type="number"> <button id="sendUSD">SEND $</button>
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
          ctx.$('#tempAddr').innerHTML = calcAddr(currentUser)
        }

        ctx.$('#usdC').innerHTML = 'CC ' +(1 / calcCryptoUSDExchangeRate()).toFixed(6)
        ctx.$('#cUSD').innerHTML = '$ ' + calcCryptoUSDExchangeRate().toFixed(6)

      })

      ctx.$('#viewTradeTab').onclick = () => ctx.setState({ exchangeTab: 'trade' })
      ctx.$('#viewSendTab').onclick = () => ctx.setState({ exchangeTab: 'send' })



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

        let vals = {}
        if (recipient === payAppUSDAddr) {
          const payAppBalance = usdBalances[payAppUSDAddr] || 0

          // TODO refactor using SPTX
          ctx.setUserData({
            exchangeUSDBalance: exchangeUSDBalance - amount
          })
          ctx.setState({
            usdBalances: {
              ...usdBalances,
              [recipient]: usdBalances[recipient] + amount
            }
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

        if (sellC > exchangeCryptoBalance) {
          ctx.$('#tradeError').innerHTML = 'Insufficient Crypto balance to execute transaction'
          return
        } else if (!buy$ || buy$ < 0) {
          ctx.$('#tradeError').innerHTML = 'Must Input Positive $ Amount'
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

        if (sell$ > exchangeUSDBalance) {
          ctx.$('#tradeError').innerHTML = '$ Amount Exceeds Account Balance'
          return
        } else if (!sell$ || sell$ < 0) {
          ctx.$('#tradeError').innerHTML = 'Must Input Positive $ Amount'
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
              <h4>OS: MPX ${window.GAME_VERSION}</h4>
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
              if (args[1] === 'view') {
                commandDisplay = `Current admin user: ${userNames[rootUser]} (${rootUser})`
              } else if (args[1] === 'reassign') {
                if (args[2]) {
                  const userId = Object.keys(userNames).find(k => userNames[k] === args[2])

                  if (userId && userId !== 0) {
                    commandDisplay = `Admin role assigned to: ${args[2]}`
                    behavior = { rootUser: userId }


                  } else {
                    commandDisplay = `Cannot find user: ${args[2]}`

                  }
                } else {
                  commandDisplay = `MISSING ARGUMENT`
                }

              } else {
                commandDisplay = `Unrecognized command: ${args[1]}`
              }
            } else if (fn === 'disable') {
              const [_, path] = args
              if (path === '/System/.malware-detection.exe') {
                behavior = {
                  disabledMalDetection: true
                }
                commandDisplay = '/System/.malware-detection.exe disabled!'
              } else {
                commandDisplay = 'DISABLE ERROR: Executable not found'
              }
            } else if (fn === 'install') {
              const [_, flag, url, location] = args
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
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.25em 0; font-size:0.85em">INSTALL ERROR: System blocked install</div>`],
                      })
                    }, 1000)

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
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.25em 0; font-size:0.85em">Installed qd://0ms.co/tjn/jailbreakx-0_13_1.mal!</div>`],
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
              exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.25em 0; font-size:0.85em">${commandDisplay}</div>`],
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
          <div id="binaryApply">
            <button id="appMarket">App Market</button><button id="phoneApp">Phone App</button><button id="textMessage">Text Messages${unreadTextCount ? ` (${unreadTextCount})` : ''}</button><button id="settings">Settings</button><button id="network">Network & Internet</button>${appsInstalled.map(a => `<button id="${a.key}" class="${a.jailbreakr ? 'jailbreakr' : ''}">${a.name}</button>`).join('')}
          </div>
          <h4 id="error"></h4>

        </div>
      `

      const allApps = ['appMarket', 'phoneApp', 'textMessage', 'settings', 'network', ...appsInstalled.map(a => a.key)]
      const validJailbreakApps = [
        'bathe',
        'lumin',
        'shayd',
        'planter',
        'toastr',
        // refrigerator
      ]

      for (let app of allApps) {
        if (ctx.state.jailbrokenApps[app]) {
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
