import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState, tmp, calcIdVerifyCode, calcAddr, calcCryptoUSDExchangeRate, calcPremiumCryptoUSDExchangeRate, setColor, rndAddr, setMiningInterval, clearMiningInterval} from './global.js'
import {PhoneCall, phoneApp} from './phoneApp.js'
import {createSource, MAX_VOLUME} from './audio.js'






const APPS = [

// needs name/IRL callout
  // TV
  // ebook
  // fridge (freezelocker)
  // elevate
  // ai assistant?
  // intercom
  // roomba
  // SmartStove?

// needs building
  // bathe
  // alarm
  // thermostat
  // security camera
  // fastcash (finance)
  // ronamerch (ecommerce)
  // fakebullshit (news)
  // finsexy (dating)
  // friendworld (social)

  { name: 'Bathe', key: 'bathe', size: 128, price: NaN },
  { name: 'ClearBreeze', key: 'clearBreeze', size: 128, price: 0 },
  { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
  // { name: 'Elevate', key: 'elevate', size: 128, price: NaN },
  { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },
  { name: 'FreezeLocker', key: 'freeze', size: 128, price: NaN },
  { name: 'Identity Wizard', key: 'identityWizard', size: 128, price: 0 },
  { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
  { name: 'Lumin', key: 'lumin', size: 128, price: 0 },
  { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
  { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
  { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
  { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
  { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
  { name: 'Secure 2FA', key: 'secure2fa', size: 128, price: 0 },
  { name: 'Shayd', key: 'shayd', size: 128, price: 0 },
  { name: 'SmartLock', key: 'lock', size: 128, price: 0 },
  { name: 'SmartPlanter<sup>TM</sup>', key: 'planter', size: 256, price: 0 },
  { name: 'SmartPro Security Camera', key: 'camera', size: 128, price: NaN },
  { name: 'ThermoSmart', key: 'thermoSmart', size: 128, price: 0 },
  { name: 'Toastr', key: 'toastr', size: 128, price: 0 },
  { name: 'Wake', key: 'wake', size: 128, price: 0 },
  { name: 'YieldFarmer 2', key: 'yieldFarmer', size: 128, price: 1 },
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

const turboConnectText = {
  from: '1-800-444-3830',
  value: 'You have subscribed: TurboConnect FREE TRIAL for MOBILE + DATA Plan! Please Dial 1-800-444-3830 on <strong>*PhoneApp*</strong> for all question',
}
const mmText = {
  from: '1-800-777-0836',
  value: `Hello new friend to receive the ADVANCED wealth-generation platform to provide high-growth crypto currency investment methods simply follow the advice of our experts to achieve stable and continuous profits. We have the world's top analysis team for wealth generation But how does it work you might ask?. First you download the <strong>MoneyMiner</strong> application to your device. Second you participate in a proprietary proof of work (pow) protocol to mine ₢rypto. Third you can optionally transfer your ₢rypto to participating exchanges such as <strong>Currency Xchange</strong> to exchange your crypto for fiat currencies such as $ Dollars. This opportunity is once in your life time. `,
}
const packageText = {
  from: '+7 809 3390 753',
  value: `United Pakcåge Delvery MsG: "W⍷lcome ◻︎⎅◻︎ y⌾ure Pâck⎀ge ⎙ h⍶s been ◻︎ deLiveRed t⌀ ⇢⇢ <strong>FRONT DOOR</strong> ⇠⇠ <RENDER_ERROR:/home/usr/img/package-d⌽liver83y.jpg> ⎆ pAy deliver fee ⌱ 0xb0b9d337b68a69f5560969c7ab60e711ce83276f"`
}

const tripleText = {
  from: '1-800-333-7777',
  value: 'Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ←',
}

const billingText1 = {
  from: '1-888-555-9483',
  value: 'URGENT: Our records indicate that your account has an outstanding balance of $0.37. Immediate payment is required to prevent a discontinuation of your internet service. Please dial the National Broadband Services Billing Department at 1-888-555-9483 to pay this bill immediately',
}

const billingText2 = {
  from: '1-888-555-9483',
  value: 'Outstang balance: $0.37 -- Your internet service will be discontinued without further payment. Please call 1-888-555-9483 at your earliest convenience',
}

const billingText3 = {
  from: '1-888-555-9483',
  value: 'INTERNET DISCONTINUATION: Due to an outstanding balance of $0.37 your internet subscription will be terminated. Please call 1-888-555-9483 to remit this balance.',
}

const billingText4 = {
  from: '1-888-555-9483',
  value: 'FINAL WARNING: This is your final notice regarding your overdue balance of $0.37 with National Broadband Services. Immediate payment is required 1-888-555-9483',
}

const funTimeText = {
  from: '1-800-666-7777',
  value: 'Text 1-800-666-7777 for a fun time ;)',
}




const state = persist('__MOBILE_STATE', {
  bluetoothEnabled: false,
  a11yEnabled: false,
  devMode: false,
  soundEnabled: true,
  distractionMode: 1,
  fastMode: false,
  started: false,
  screen: 'loading',
  internet: 'wifi',
  dataPlanActivated: false,
  wifiNetwork: '',
  userNames: {0: 'default'},
  newUsers: 0,
  currentUser: null,
  rootUser: 0,
  lampOn: false,

  luminPaired: false,
  wakePaired: false,
  clearBreezePaired: false,
  toasterPaired: false,
  planterPaired: false,
  smartLockPaired: false,
  thermoSmartPaired: false,

  plantStatus: 1,
  plantName: '',
  payAppUpdate: 0,
  lastPayApp2fa: 0,
  alarmRing: 0,
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
  yieldFarmerGlobalHighScore: 19011.44,
  appMarketPPC: 1.03,
  userData: {
    0: {
      appsInstalled: [
        { name: 'SmartPlanter', key: 'planter', size: 256, price: 0 },
        { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
        { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
        { name: 'Shayd', key: 'shayd', size: 128, price: 0 },
        { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
        { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
        { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
        { name: 'SmartLock', key: 'lock', size: 128, price: 0 },
        // { name: 'Bathe', key: 'alarm', size: 128, price: NaN },
        // { name: 'Elevate', key: 'elevate', size: 128, price: NaN },

        // { name: 'Alarm', key: 'alarm', size: 128, price: NaN },

        { name: 'Lumin', key: 'lumin', size: 128, price: 0 },
        { name: 'Toastr', key: 'toastr', size: 128, price: 0 },
        { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
        { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
        { name: 'Secure 2FA', key: 'secure2fa', size: 128, price: 0 },
        { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },
      ],
      textMessages: [
        {...turboConnectText, read: true},
        ...times(196, () => ({...sample([billingText1, billingText2, billingText3, billingText4, mmText, packageText, tripleText, funTimeText]), read: false})),
        {...billingText4, read: false}
      ],
      appCreditBalance: 1,
      keyPairs: [],
      payAppUSDAddr: rndAddr(),
      moneyMinerCryptoAddr: rndAddr(),
      exchangeUSDAddr: rndAddr(),
      exchangePremium: false,
      exchangeCryptoBalance: 0,
      exchangePremiumCryptoBalance: 0,
      notePadValue: defaultNotePadValue,
      payAppAMLKYCed: false,
      idvWizardStep: 0,
      idWizardInfo: {},
      yieldFarmerHighScore: 0
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

      .a11yMode {
        font-size: 1.5em;
      }

      .a11yMode button, .a11yMode input {
        font-size: 0.9em;
      }

      .a11yMode .phoneScreen {
        height: 525px;
        overflow: scroll
      }

      header {
        height: 1em;
        font-family: sans-serif;
        display: flex;
        justify-content: space-between;
        padding: 0.35em;
        font-size: 0.75em;
        color: #fff;
        background: #5a5a5a;
        user-select: none;
        border-bottom: 1px solid #000;
      }

      a, a:visited {
        color: #00f
      }

      button, select, label, input[type="range"], input[type="checkbox"] {
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

      .icon {
        display: inline-block;
        transform: scale(1.7)
      }

      #phone {
        width: 320px;
        height: 569px;
        border: 2px solid;
        border-radius: 6px;
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
        display: none !important;
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

      .tm:last-child {
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

      .wizardSection {
        animation: SlideFromLeft 1s linear;
      }
      .wizardSection h2, .wizardSection h3 {
        text-align: center;
        margin-top: 0.5em
      }
      .wizardSection fieldset {
        padding: 0.75em;
        border: 1px solid;
        margin: 0.5em 0;
        text-align: center;
      }

      .wizardSection section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1em;
      }

      .wizardSection input, .wizardSection select {
        padding: 0.25em;
        font-size: 1em;
        text-align: center;
      }
      .wizardSection button#next {
        font-size: 1.25em;
        margin: 0.5em 0;
        padding: 0.25em 0.75em;
      }



      @keyframes SlideFromLeft {
        0% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(0%);
        }
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
      }, ctx.state.fastMode ? 0 : 8000)
    }

    ctx.phoneNotifications = () => ctx.state.userData[ctx.state.currentUser]?.textMessages?.reduce?.((a, c) => c.read ? a : a + 1, 0)

    ctx.__notificationCb
    ctx.onNotification = cb => ctx.__notificationCb = cb

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
      clearInterval(ctx.interval)

      const queuedInterval = Math.random()
      ctx.__queuedInterval = queuedInterval

      cb()
      setTimeout(() => {
        if (queuedInterval === ctx.__queuedInterval) {
          ctx.interval = setRunInterval(cb, globalState.eventLoopDuration)
        }
      }, wait)
    }

    ctx.createSPTX = ({ sender, recipient, amount }) => {
      const {usdBalances, currentUser, payAppUpdate, userData} = ctx.state
      const {payAppUSDAddr} = userData[currentUser]

      const sptx = Math.floor(Math.random()*100000000000000000)

      globalState.payments[sptx] = {
        sptx,
        sender,
        recipient,
        amount,
        timestamp: Date.now(),
        received: false
      }

      if (usdBalances[sender] < amount) throw new Error('invalid amount')

      let updatePayApp = {}
      const totalAmount = amount + (usdBalances[payAppUSDAddr] || 0)

      if (totalAmount >= 0.37 && recipient === payAppUSDAddr && payAppUpdate <= 0) {
        updatePayApp = {
          payAppUpdate: 1
        }
      }

      ctx.setState({
        ...updatePayApp,
        usdBalances: {
          ...usdBalances,
          [sender]: usdBalances[sender] - amount
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

      return payment
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
    ctx.__queuedInterval = 0

    ctx.$phoneContent = ctx.$('#phoneContent')
    ctx.$header = ctx.$('#header')
    ctx.$phone = ctx.$('#phone')
    ctx.$internetType = ctx.$('#internetType')

    const {
      screen,
      lastScreen,
      currentUser,
      dataPlanActivated,
      wifiNetwork,
      internet,
      userData,
      userNames,
      bluetoothEnabled,
      a11yEnabled,
      soundEnabled,
      distractionMode,
      luminPaired,
      wakePaired,
      toasterPaired,
      planterPaired,
      thermoSmartPaired,
      lampOn,
      usdBalances,
      cryptoBalances,
      jailbrokenApps,
      devMode,
      payAppUpdate,
      lastPayApp2fa,
      appMarketPPC,
      alarmRing
    } = ctx.state

    const currentUserData = userData[currentUser] || {}

    const {
      appsInstalled,
      payAppUSDAddr,
      moneyMinerCryptoAddr,
      exchangeUSDAddr,
      exchangeCryptoBalance,
      exchangePremiumCryptoBalance,
      notePadValue,
      exchangePremium,
      keyPairs,
      payAppAMLKYCed,
      idvWizardStep,
      idWizardInfo,
      appCreditBalance
    } = currentUserData

    const textMessages = currentUserData?.textMessages || []


    const inInternetLocation = globalState.location !== 'externalHallway' && globalState.location !== 'stairway'
    const wifiAvailable = globalState.wifiActive && !globalState.routerUnplugged
    const wifiConnected = internet === 'wifi' && wifiNetwork && inInternetLocation && wifiAvailable
    const dataConnected = internet === 'data' && dataPlanActivated && inInternetLocation
    const hasInternet = dataConnected || wifiConnected


    if (currentUser !== null && globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
      ctx.newText(packageText)
    }


    // if thermostat app downloaded, provide alert
    // ringing in hallway


    // if (currentUser !== null && globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
    //   ctx.newText(packageText)
    // }

    ctx.$internetType.innerHTML = `
      ${internet === 'wifi' ? 'WiFi' : 'Data'}: ${
        hasInternet
          ? 'connected'
          : 'unconnected'
      }
    `

    ctx.$header.classList.remove('hidden')
    ctx.$phoneContent.innerHTML = ''

    if (a11yEnabled) ctx.$phone.classList.add('a11yMode')
    else ctx.$phone.classList.remove('a11yMode')

    const unreadTextCount = textMessages.reduce((a, c) => c.read ? a : a + 1, 0) || 0


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
      ctx?.__notificationCb?.()

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <h1>Select User Profile:</h1>
          ${
            Object.keys(userNames).sort().map(u => `<button id="user-${u}" style="margin-right: 0.5em; margin-bottom: 0.5em">${userNames[u]}</button>`).join('')
          }
          <h3 style="margin-bottom: 0.4em">Or</h3>
          <button id="newProfile">Create New Profile</button>
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
              keyPairs: [],
              payAppUSDAddr: rndAddr(),
              moneyMinerCryptoAddr: rndAddr(),
              exchangeUSDAddr: rndAddr(),
              exchangeCryptoBalance: 0,
              exchangePremiumCryptoBalance: 0,
              exchangePremium: false,
              payAppAMLKYCed: false,
              notePadValue: '',
              idvWizardStep: 0,
              idWizardInfo: {},
              yieldFarmerHighScore: 0,
              appCreditBalance: 0
            }
          }
        })
        setTimeout(() => {
          ctx.setState({ screen: 'home' })
        }, ctx.state.fastMode ? 0 : 4000)
      }

    } else if (screen === 'home') {
      ctx?.__notificationCb?.()

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
          ctx.setState({ screen: 'login', currentUser: null })
        }, ctx.state.fastMode ? 0 : 4000)
      }

    } else if (screen === 'appMarket') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>

          <div id="appContent">
            <input placeholder="Type to search..." id="appSearch" style="width: 90%; font-size: 1.1em; padding: 0.25em">
            <table id="matchingApps" style="margin-top: 0.5em"></table>
            <div id="purchase"></div>
            <h3 id="searchError"></h3>
          </div>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      const appSearch = ctx.$('#appSearch')

      const clean = txt => txt.replaceAll('<sup>TM</sup>', 'tm').toLowerCase().replaceAll(' ', '').replaceAll(':', '')

      const search = () => {
        if (hasInternet) {
          const searchTerm = clean(appSearch.value)

          if (!searchTerm) {
            ctx.$('#matchingApps').innerHTML = ''
            ctx.$('#purchase').innerHTML = ''
          }

          ctx.$('#matchingApps').innerHTML = `
            <thead>
              <tr>
                <th style="text-align: left">Name</th>
                <!--<th>Size</th>-->
                <th>Credits</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${searchTerm && APPS
                .filter(a => clean(a.name).includes(searchTerm))
                .map(a => `<tr>
                  <td>${a.name}</td>
                  <!--<td>${a.size}</td>-->
                  <td style="text-align: center">${a.price}</td>
                  <td>${
                    appsInstalled.some(_a => _a.name === a.name)
                      ? `Downloaded`
                      : `<button id="${clean(a.key)}-download" ${isNaN(a.price) || a.price > appCreditBalance ? 'disabled' : ''}>Download</button></td>`

                  }
                  </tr>`).join('')
              }
            </tbody>
          `

          if (searchTerm) {
            ctx.$('#purchase').innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5em; padding-top: 0.5em; border-top: 1px dashed">
                <strong>AppCredit Balance: ${appCreditBalance}</strong>
                <button id="purchaseCredits" style="margin-bottom: 0">Purchase Credits</button>
              </div>
            `

            ctx.$('#purchaseCredits').onclick = () => {
              ctx.setState({ screen: 'appMarketCredits' })
            }
          }



          APPS.forEach(a => {
            const app = ctx.$(`#${clean(a.key)}-download`)
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
              }, ctx.state.fastMode ? 0 : 2700)
              setTimeout(() => {
                ctx.setState({
                  appMarketPreSearch: '',
                  userData: {
                    ...userData,
                    [currentUser]: {
                      ...userData[currentUser],
                      appsInstalled: [...appsInstalled, a],
                      appCreditBalance: appCreditBalance - a.price
                    }
                  }
                })
              }, ctx.state.fastMode ? 0 : 3300)
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

    } else if (screen === 'appMarketCredits') {
      const appMarketAddress = '0x743513ee56840e2558a764cb35c71f7beebda7a8'

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="appMarket">Back</button>
          <div style="margin-bottom: 1em">
            <h3 style="margin-bottom: 0.4em">AppCredit Balance: ${appCreditBalance}</h3>
            <h4>Current Price-Per-Credit (PPC): <span style="border: 1px dashed; padding: 0.25em; display: inline-block">$${appMarketPPC.toFixed(2)}</span></h4>
          </div>

          <h3 style="margin-bottom: 0.4em">How To Purchase AppCredits:</h3>
          <ul style="list-style: square; padding-left: 1em; font-size: 0.95em">
            <li style="padding-bottom: 0.5em">Download the free <strong>PayApp</strong> application from <strong>AppMarket</strong>.</li>
            <li style="padding-bottom: 0.5em">Locate the "Send $" section.</li>
            <li style="padding-bottom: 0.5em">Input the following address into the "Recipient Address" input box: <span style="border: 1px dashed; padding: 0.25em; display: inline-block; word-break: break-word; font-family: serif; background: #ccc">${appMarketAddress}</span></li>
            <li style="padding-bottom: 0.5em">Multiply your desired quantity of AppCredits by the current PPC, <em style="text-decoration: underline">rounding up to the nearest full AppCredit</em>.</li>
            <li style="padding-bottom: 0.5em">Input this $ amount in the "Amount" input box.</li>
            <li style="padding-bottom: 0.5em">Press the "Sign Transaction" button.</li>
            <li style="padding-bottom: 0.5em">Wait for the PayApp interface to produce a S.P.T.X. identifier.</li>
            <li style="padding-bottom: 0.5em">Copy the resulting S.P.T.X. identifier.</li>
            <li style="padding-bottom: 0.5em">Paste your S.P.T.X. identifier into this input box: <input id="sptx" placeholder="000000000000000" type="number"></li>
            <li style="padding-bottom: 0.5em">Click this button: <button id="clickHere" style="margin:0">Click Here</button></li>
            <li style="padding-bottom: 0.5em">All Errors will be displayed here: <span id="error" style="border: 1px solid; padding: 0.25em; display: inline-block; word-break: break-word"></span></li>
          </ul>
        </div>
      `

      ctx.$('#clickHere').onclick = () => {
        const sptx = ctx.$('#sptx').value

        if (!sptx) {
          ctx.$('#error').innerHTML = 'SPTX ERROR: empty'
          return
        }
        const payment = globalState.payments[sptx]

        ctx.$('#error').innerHTML = 'processing [do not reload page]'

        setTimeout(() => {
          if (!payment) {
            ctx.$('#error').innerHTML = 'SPTX ERROR: invalid identifier'
            return
          } else if (payment.recipient !== appMarketAddress) {
            ctx.$('#error').innerHTML = 'SPTX ERROR: invalid recipient'
            return
          } else if (payment.received) {
            ctx.$('#error').innerHTML = 'SPTX ERROR: already processed'
            return
          }

          ctx.receiveSPTX(sptx)

          ctx.setUserData({
            appCreditBalance: appCreditBalance + Math.floor(payment.amount / appMarketPPC)
          })

          setTimeout(() => {
            ctx.$('#error').innerHTML = 'success'
          }, 200)
        }, 3000)


      }

      ctx.$('#appMarket').onclick = () => {
        ctx.setState({ screen: 'appMarket' })
      }

    } else if (screen === 'network') {
      if (ctx.state.internet === 'wifi') {
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="data">Switch to Data</button>
            <h3>Current Network: ${wifiNetwork || 'null'}</h3>
            ${
              bluetoothEnabled
                ? `
                  <h3 style="margin-top: 0.4em">Network Name:</h3>
                  <select id="networkName" style="margin: 0.25em 0">
                    <option></option>
                    <option value="Alien Nation">Alien Nation</option>
                    <option value="CapitalC">CapitalC</option>
                    <option value="ClickToAddNetwork">ClickToAddNetwork</option>
                    <!-- i feel like i need to unlock this experience
                      <option value="Dial19996663333ForAFunTime">Dial19996667777ForAFunTime</option>
                    -->
                    <option value="ElectricLadyLand" ${inInternetLocation && wifiNetwork === 'ElectricLadyLand' ? 'selected' : ''}>ElectricLadyLand</option>
                    <option value="Free-WiFi">Free-WiFi</option>
                    <option value="HellInACellPhone98">HellInACellPhone98</option>
                    ${globalState.routerReset && !globalState.routerUnplugged? `<option value="InpatientRehabilitationServices" ${inInternetLocation && wifiNetwork === 'InpatientRehabilitationServices' ? 'selected' : ''}>InpatientRehabilitationServices</option>` : ''}
                    <option value="ISP-Default-89s22D">ISP-Default-89s22D</option>
                    <option value="MyWiFi-9238d9">MyWiFi-9238d9</option>
                    <option value="NewNetwork">NewNetwork</option>
                    <option value="XXX-No-Entry">XXX-No-Entry</option>
                  </select>
                  <input id="networkPassword" placeholder="password" type="password">
                  <button id="connect">Connect</button>
                `
                : `<h3>${inInternetLocation ? 'Please enable Bluetooth in your device Settings to view available networks' : 'Cannot find networks'}</h3>`
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

          ctx.$('#error').innerHTML = 'Connecting...'

          if (
            (networkName === 'InpatientRehabilitationServices' && networkPassword === 'StompLookAndListen948921')
            || (networkName === 'ElectricLadyLand' && networkPassword === 'CrosstownTraffic007')
          ) {

            setTimeout(() => {
              if (globalState.wifiActive || networkName === 'ElectricLadyLand') {
                ctx.$('#error').innerHTML = 'Success!'
                setTimeout(() => {
                  ctx.setState({ wifiNetwork: networkName })
                }, 2000)
              } else {
                ctx.$('#error').innerHTML = 'ServiceError: No signal detected. Please contact your internet service provider if this issue persists.'
              }
            }, 3000)

          } else {
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
                ctx.newText(turboConnectText)
              }, 2000)

              setTimeout(() => {
                ctx.newText(mmText)
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
          <div id="payappContent">
            <h2 style="margin-bottom: 0.25em">PayApp: Making Payment as easy as 1-2-3!</h2>
            <h3 style="margin: 0.5em 0">Current $ Balance: $${hasInternet ? usdBalance.toFixed(2) : '-.--'}</h3>
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
              <div id="txMessage"></div>
              <h3>Receive $</h3>
              <div>
                <input id="sptxInput" placeholder="S.P.T.X. identifier" type="number">
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
                <li style="margin:0.25em 0"><input id="amount" placeholder="Amount" type="number" step=".01"></li>
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
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

      ctx.$('#processSPTX').onclick = () => {
        if (!hasInternet) {
          setTimeout(() => {
            ctx.$('#sptxError').innerHTML = 'SPTX ERROR: cannot connect to server'
          }, 3000)
          return
        }
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
            ctx.newText(tripleText)
          }

          ctx.receiveSPTX(sptxInput)

          if (payment.amount >= 1000) {
            setTimeout(() => {
              ctx.setState({
                payAppUpdate: 4
              })
            }, 1000)
          }
          setTimeout(() => {
            ctx.$('#sptxError').innerHTML = 'success'
          }, 500)
        }, 7000)

      }

      ctx.$('#sign').onclick = () => {
        const $sptx = ctx.$('#sptx')

        if (!hasInternet) {
          setTimeout(() => {
            $sptx.innerHTML = 'Cannot connect to server'
          }, 3000)
          return
        }
        const amount = Number(ctx.$('#amount').value)
        const recipient = ctx.$('#recipient').value.toLowerCase().trim()


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
          $sptx.innerHTML = `INSUFFICIENT BALANCE`
          return
        }

        const sptx = ctx.createSPTX({
          sender: payAppUSDAddr,
          recipient,
          amount
        })


        setTimeout(() => {
          ctx.$('#sptx').innerHTML = `Secure Payment Transaction (S.P.T.X.) identifier: ${sptx}`
        }, 2000)

      }

      const outstandingPayment = Object.values(globalState.payments).reverse().find(p => !p.received && p.recipient === payAppUSDAddr) || null

      if (payAppUpdate === 1) {
        ctx.$('#payappContent').innerHTML = `
          <div>
            <h2>PayApp</h2>
            <h3>Auto-Update Progress</h3>
            <progress id="autoUpdateProgress" value="96" max="100" style="width:20em"></progress><h4 id="progressNumber" style="display: inline-block; padding-left: 1em"></h4>
          </div>
        `

        ctx.setInterval(() => {
          if (Date.now() % 2) return
          if (Number(ctx.$('#autoUpdateProgress').value) < 100) {
            ctx.$('#autoUpdateProgress').value = Number(ctx.$('#autoUpdateProgress').value) + 1
            ctx.$('#progressNumber').innerHTML = Number(ctx.$('#autoUpdateProgress').value) + '%'
          } else {
            ctx.setState({
              payAppUpdate: 2
            })
          }
        })

      } else if (payAppUpdate === 2) {
        ctx.$('#payappContent').innerHTML = `
          <div>
            <h2>PayApp: Making Payment as easy as 1-2-3!</h2>
            <h3 style="margin: 0.4em 0">Welcome to the new, more secure PayApp! To continue to your account, please download the Secure 2FA app, and generate a 2FA Code using the following security key: 48299285</h3>
            <input id="faInput" placeholder="2FA Code" type="number"> <button id="faLogin">Login</button>
            <h4 id="faError"></h4>
          </div>
        `
        ctx.$('#faLogin').onclick = () => {
          if (Number(ctx.$('#faInput').value) === Number(calcIdVerifyCode(currentUser + 48299285))) {
            ctx.$('#faError').innerHTML = 'VERIFYING...'
            setTimeout(() => {
              ctx.setState({
                payAppUpdate: 3,
                lastPayApp2fa: Date.now()
              })
            }, 1000)
          } else {
            ctx.$('#faError').innerHTML = 'INVALID 2FA CODE'
          }
        }

      // let the user log in for 10 minutes
      } else if (
        (payAppUpdate === 3 || payAppAMLKYCed)
        && lastPayApp2fa < Date.now() - 600000 && lastScreen !== 'payApp'
      ) {
        ctx.$('#payappContent').innerHTML = `
          <div>
            <h2>PayApp: Making Payment as easy as 1-2-3!</h2>
            <h3 style="margin: 0.4em 0">You have been logged out for your security. Please generate a 2FA Code using the following security key: 48299285</h3>
            <input id="faInput" placeholder="2FA Code" type="number"> <button id="faLogin">Login</button>
            <h4 id="faError"></h4>
          </div>
        `
        ctx.$('#faLogin').onclick = () => {
          if (Number(ctx.$('#faInput').value) === Number(calcIdVerifyCode(currentUser + 48299285))) {
            ctx.$('#faError').innerHTML = 'VERIFYING...'
            setTimeout(() => {
              ctx.setState({
                lastPayApp2fa: Date.now()
              })
            }, 300)
          } else {
            ctx.$('#faError').innerHTML = 'INVALID 2FA CODE'
          }
        }
      } else if (payAppUpdate === 4 && !payAppAMLKYCed) {
        ctx.$('#payappContent').innerHTML = `
          <h2>PayApp: Making Payment as easy as 1-2-3!</h2>

          <div style="margin: 0.5em; padding: 0.5em;">
            <div style="text-align: justify">
              <h1 class="blink" style="text-align: center">ACTION REQUIRED ⚑</h1>
              <p>Your PayApp account <strong>has been flagged for suspicious activity</strong> by our Anti Money Laundering (AML) division.</p>
              <p>This may be related to recent cryptocurrency transactions. As a precautionary measure we have <strong>locked your acount</strong>. In order to continue, please complete the following Know Your Customer (KYC) steps:</p>
            </div>
            <div style="margin-top: 0.5em; padding: 1em; border: 1px solid">
              <p style="margin-bottom: 0.75em"><strong>1.</strong> Download and install the <strong>Identity Wizard</strong> application</p>
              <p style="margin-bottom: 0.75em"><strong>2.</strong> Using the Customer Referral Code: <strong>777123865</strong>, follow the instructions given</p>
              <p style="margin-bottom: 0.75em"><strong>3.</strong> Input the resulting <strong>IVC</strong> here:</p>
              <div style="text-align: center">
                <input id="ivcValue" placeholder="I.V.C." id="ivc" style="padding: 0.25em; text-align: center"> <button id="submitIVC" style="margin-bottom: 0; font-size: 1em">Submit</button>
              </div>
              <h4 id="ivcError" style="text-align: center; margin-top: 0.4em"></h4>
            </div>
          </div>
        `

        const ivc = Math.floor((777123865 * 3) / 7) + 5

        ctx.$('#submitIVC').onclick = () => {
          if (Number(ctx.$('#ivcValue').value) !== ivc) {
            ctx.$('#ivcError').innerHTML = 'Invalid IVC: Cannot Verify Identity'
            return
          }

          ctx.$('#ivcError').innerHTML = 'Verifying...'

          setTimeout(() => {
            ctx.setUserData({
              payAppAMLKYCed: true
            })
          }, 1000)


        }

      } else if (outstandingPayment) {

        ctx.$('#txMessage').innerHTML = `
          <div style="border: 2px solid; border-radius: 5px; padding: 0.5em; margin-bottom: 0.5em">
            <div id="closeMessage" style="cursor: pointer; font-weight: bolder; text-align: right">X</div>
            <h4>You have a $${outstandingPayment.amount.toFixed(2)} transaction waiting for you! Input your SPTX below to redeem it <span class="icon blink">☟</span></h4>
          </div>
        `

        ctx.$('#closeMessage').onclick = () => ctx.$('#txMessage').classList.add('hidden')
      }

    } else if (screen === 'identityWizard') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <section id="wizardContent">
          </section>
        </div>
      `

      const {idvWizardStep, idWizardInfo} = currentUserData
      const $wizardContent = ctx.$('#wizardContent')

      // <span style="transform: scale(-1.5,1.5); display: inline-block">⎉✪✷⎌</span>
      if (idvWizardStep === 0) {
        $wizardContent.innerHTML = `
          <h2 style="text-align: center; margin: 1em 0.5em">Welcome to the Identity Verifier Wizard! <span style="transform: scale(1.5); display: inline-block">✔</span></h2>

          <h4 style="margin: 1em">Please continue with a Customer Referral Code</h4>

          <div style="margin: 1em">
            <input id="referralCode" placeholder="Referral Code" style="padding: 0.25em" type="number"> <button id="continue" style="font-size: 1em">Continue</button>
          </div>
        `
        ctx.$('#continue').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 1,
            idWizardInfo: {
              ...idWizardInfo,
              referralCode: Number(ctx.$('#referralCode').value)
            }
          })
        }

      } else if (idvWizardStep === 1) {
        $wizardContent.innerHTML = `
          <div class="wizardSection">
            <button id="goBack">Back</button>
            <h2>Let's get started!</h2>
            <h3>What's your name?</h3>
            <section>
              <fieldset>
                <legend>First Name</legend>
                <input id="firstName" placeholder="First Name" value="${idWizardInfo.firstName}">
              </fieldset>

              <fieldset>
                <legend>Middle Name</legend>
                <input id="middleName" placeholder="Middle Name" value="${idWizardInfo.middleName}">
              </fieldset>

              <fieldset>
                <legend>Last Name</legend>
                <input id="lastName" placeholder="Last Name" value="${idWizardInfo.lastName}">
              </fieldset>
              <button id="next">Next →</button>
            </section>
          </div>
        `

        ctx.$('#next').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 2,
            idWizardInfo: {
              ...idWizardInfo,
              firstName: ctx.$('#firstName').value,
              middleName: ctx.$('#middleName').value,
              lastName: ctx.$('#lastName').value,
            }
          })
        }

        ctx.$('#goBack').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 0,
          })
        }

      } else if (idvWizardStep === 2) {
        $wizardContent.innerHTML = `
          <div class="wizardSection">
            <button id="goBack">Back</button>
            <h2>Nice to meet you, ${idWizardInfo.firstName}!</h2>
            <h3>We just need to verify that you're really you</h3>
            <section>
              <fieldset>
                <legend>Date of Birth</legend>
                <select value="${idWizardInfo.dobMonth}" id="dobDay">
                  ${times(31, i => `<option value="${i}">${i}</option>`).join('')}
                </select>

                <select value="${idWizardInfo.dobMonth}" id="dobMonth">
                  ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'].map((m, i) => `<option value="${i}">${m}</option>`).join('')}
                </select>

                <select value="${idWizardInfo.dobYear}" id="dobYear">
                  ${times(125, i => `<option value="${i+ 1900}">${i+ 1900}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Social Security Number</legend>
                <input id="ssn" placeholder="000-00-0000" value="${idWizardInfo.ssn}" type="number">
              </fieldset>

              <fieldset>
                <legend>Legal Address</legend>
                <textarea id="address" placeholder="123 Main Street, New York, NY 10001, USA" value="${idWizardInfo.address}"></textarea>
              </fieldset>
              <button id="next">Next →</button>
            </section>
          </div>
        `

        ctx.$('#next').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 3,
            idWizardInfo: {
              ...idWizardInfo,
              ssn: ctx.$('#ssn').value,
              dobDay: ctx.$('#dobDay').value,
              dobMonth: ctx.$('#dobMonth').value,
              dobYear: ctx.$('#dobYear').value,
              address: ctx.$('#address').value,
            }
          })
        }

        ctx.$('#goBack').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 1,
          })
        }

      } else if (idvWizardStep === 3) {
        $wizardContent.innerHTML = `
          <div class="wizardSection">
            <button id="goBack">Back</button>
            <h2>Almost there!</h2>
            <h3>Just a few more questions</h3>
            <section>
              <fieldset>
                <legend>Gender</legend>
                <select value="${idWizardInfo.gender}" id="gender">
                  ${['Agender', 'Androgynous', 'Bigender', 'Binary', 'Demigender', 'DemiFlux', 'GenderFluid', 'GenderNonConforming', 'Genderqueer', 'Hijra', 'Intersex', 'Male', 'Non-Binary', 'Other', 'Pangender', 'Transfeminine', 'Transmasculine', 'TransNonBinary', 'Two-Spirit', 'Woman'].map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Sexual Orientation</legend>
                <select value="${idWizardInfo.sexualOrientation}" id="sexualOrientation">
                  ${['Androgynosexual', 'Androsexual', 'Aromantic', 'Asexual', 'Bisexual', 'Bi-curious', 'Demisexual', 'Finsexual', 'Gay', 'GrayAsexual', 'Gynosexual', 'Heteroflexible', 'Heterosexual', 'Homoflexible', 'Homosexual', 'Lesbian', 'Lithosexual', 'Minsexual', 'Neptunic', 'Ninsexual', 'Objectumsexual', 'Omnisexual', 'Pansexual', 'Polysexual', 'Queer', 'Sapiosexual', 'Saturnic', 'Skoliosexual', 'Straight', 'Uranic'].map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Martial Status</legend>
                <select value="${idWizardInfo.martialStatus}" id="martialStatus">
                  ${['Casual Relationship', 'Civil Union', 'Divorced', 'Domestic Partner', 'Married', 'Filing for Divorce', 'Polyamorous', 'Single', 'Relationship Anarchy'].map(m => `<option value="${m}">${m}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Dependants</legend>
                <select value="${idWizardInfo.martialStatus}" id="martialStatus">
                  ${times(50, i => `<option value="${i}">${i}</option>`).join('')}
                </select>
              </fieldset>
              <button id="next">Next →</button>
            </section>
          </div>
        `

        ctx.$('#next').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 4,
            idWizardInfo: {
              ...idWizardInfo,
              gender: ctx.$('#gender').value,
              sexualOrientation: ctx.$('#sexualOrientation').value,
              martialStatus: ctx.$('#martialStatus').value,
            }
          })
        }

        ctx.$('#goBack').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 2,
          })
        }

      } else if (idvWizardStep === 4) {
        $wizardContent.innerHTML = `
          <div class="wizardSection">
            <button id="goBack">Back</button>
            <h2 style="margin-top: 0">Last Step!</h2>
            <h3>Humanity Verification</h3>

            <section style="padding: 0 1em">
              <div style="margin-bottom: 1em">
                <h4>1. 892 + 899 * 3 = ???</h4>
                <input type="number" placeholder="???" style="margin-top: 0.4em" id="mathProblem">
              </div>

              <div style="margin-bottom: 1em; padding: 0 2em">
                <h4>2. "Before the Law stands a doorkeeper. To this doorkeeper there comes a man from the country and prays admittance to the Law. But the doorkeeper says that he cannot grant admittance at the moment." What is the subject of this passage?</h4>
                <div style="display: flex; justify-content: center; margin-top: 0.75em">
                  <select>
                    ${['The Law', 'The doorkeeper', 'The man', 'The country', 'The moment'].map(i => `<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div style="margin-bottom: 1em; padding: 0 2em">
                <h4>3. What color was your first car?</h4>
                <div style="display: flex; justify-content: center; margin-top: 0.25em">
                  <select>
                    ${['Red', 'Orange', 'Brown', 'Yellow', 'Green', 'Teal', 'Blue', 'Purple', 'White', 'Black', 'Gray',].map(i => `<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
              </div>

              <label style="margin-top: 0.5em"><input type="checkbox" id="confirmation"> I am a Human</label>
              <button id="next">Complete →</button>
              <h4 id="humanError"></h4>
            </section>
          </div>
        `

        ctx.$('#next').onclick = () => {
          if (Number(ctx.$('#mathProblem').value) !== (892 + 899 * 3) || !ctx.$('#confirmation').checked) {
            ctx.$('#humanError').innerHTML = 'Please correctly answer all Human Verification questions'
            return
          }

          ctx.setUserData({
            idvWizardStep: 5,
          })
        }

        ctx.$('#goBack').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 3,
          })
        }

      } else if (idvWizardStep === 5) {
        $wizardContent.innerHTML = `
          <div class="wizardSection">
            <button id="goBack">Back</button>
            <div id="lastStepContent">
              <h2 style="margin: 2em 0" class="blink">Verifying Identity...</h2>
            </div>
          </div>
        `

        setTimeout(() => {
          if (!hasInternet) {
            ctx.$('#lastStepContent').innerHTML = `<h2 style="margin: 2em 0" class="blink">Cannot connect to internet. Please try again later.</h2>`
            return
          }
          ctx.$('#lastStepContent').innerHTML = `
            <h2 style="margin: 2em 0">Success!</h2>
            <h3>Identity Verification Code: ${Math.floor((idWizardInfo.referralCode * 3) / 7) + 5}</h3>
            <div style="display: flex; justify-content: center; margin-top: 2em">
              <button id="startOver" style="font-size: 1.25em">Start Over</button>
            </div>
          `

          ctx.$('#startOver').onclick = () => {
            ctx.setUserData({
              idvWizardStep: 0,
              idWizardInfo: {}
            })
          }
        }, 6300)

        ctx.$('#goBack').onclick = () => {
          ctx.setUserData({
            idvWizardStep: 4,
          })
        }

      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
      // welcome to the identity wizard

    } else if (screen === 'settings') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <div>
            <button id="sound">${soundEnabled ? 'Disable' : 'Enable'} Sound</button><br>
            <button id="bluetooth">${bluetoothEnabled ? 'Disable' : 'Enable'} Bluetooth ®</button><h4 id="message" style="display: inline-block; margin-left: 1em"></h4><br>
            <button id="a11y">${a11yEnabled ? 'Disable' : 'Enable'} A11Y Mode</button>
            <div>
              <label style="display: block; font-size: 0.9em"><input id="noDistraction" type="radio" name="distractionMode" ${distractionMode === 1 ? 'checked' : ''}> No-Distraction Mode</label>
              <label style="display: block; font-size: 0.9em"><input id="deepFocus" type="radio" name="distractionMode" ${distractionMode === 2 ? 'checked' : ''}> Deep Focus Mode</label>
              <label style="display: block; font-size: 0.9em"><input id="multitask" type="radio" name="distractionMode" ${distractionMode === 0 ? 'checked' : ''}> Multitask Mode</label>
            </div>
          </div>

          <div class="deviceData" style="margin-top: 2em">
            <h5>Device ID: 49-222999-716-2580</h5>
            <h5>User: ${userNames[currentUser]}</h5>
            <h5 id="versionNumber">OS Version: ${window.GAME_VERSION}.1</h5>
            <h5><a href="https://steviep.xyz" target="_blank">stevie.xyz</a> [2024]</h5>
          </div>
          ${devMode
            ? `
              <div style="margin-top: 0.5em; padding: 0.5em; border: 1px solid; height: 290px; overflow: scroll">
                <h3>Dev Mode</h3>
                <div>
                  <label><input id="fastMode" type="checkbox" ${ctx.state.fastMode ? 'checked' : ''}> fast mode</label>
                </div>
                <div>
                  <label><input id="activateWiFi" type="checkbox" ${globalState.wifiActive ? 'checked' : ''}> wifi activated</label>
                </div>
                <div>
                  <label><input id="connectData" type="checkbox" ${dataPlanActivated ? 'checked' : ''}> data connected</label>
                </div>
                <div>
                  <label><input id="getPremium" type="checkbox" ${exchangePremium ? 'checked' : ''}> exchange premium</label>
                </div>
                <div>
                  <label><input id="pauseCurrency" type="checkbox" ${globalState.pauseCurrency ? 'checked' : ''}> pause currency</label>
                </div>
                <div>
                  <label><input id="defaultUnlocked" type="checkbox" ${globalState.defaultUnlocked ? 'checked' : ''}> default unlocked</label>
                </div>
                <div>
                  <label><input id="rentPaid" type="checkbox" ${globalState.rentPaid ? 'checked' : ''}> rent paid</label>
                </div>
                <div><input id="exchangeUSD" type="number" placeholder="exchange $"> <button id="setExchangeUSD">Set</button></div>
                <div><input id="exchangeC" type="number" placeholder="exchange ₢"> <button id="setExchangeC">Set</button></div>
                <div><input id="exchangeP" type="number" placeholder="exchange ₱"> <button id="setExchangeP">Set</button></div>
                <div><input id="payappUSD" type="number" placeholder="payapp $"> <button id="setPayappUSD">Set</button></div>
                <div><input placeholder="admin account"> <button>Set</button></div>
                <button id="dlJB">Download JailBreaker</button>

                <table>
                  <tr>
                    <td>ISP:</td>
                    <td>1.800.555.2093</td>
                  </tr>
                  <tr>
                    <td>Billing:</td>
                    <td>1.888.555.9483</td>
                  </tr>
                  <tr>
                    <td>Dispute:</td>
                    <td>1.800.777.0836</td>
                  </tr>
                  <tr>
                    <td>SSO:</td>
                    <td>1.818.222.5379</td>
                  </tr>
                  <tr>
                    <td>TurboConnect:</td>
                    <td>1.800.444.3830</td>
                  </tr>
                  <tr>
                    <td>ISP recipient addr:</td>
                    <td style="word-break: break-word">0x4b258603257460d480c929af5f7b83e8c4279b7b</td>
                  </tr>
                </table>

              </div>
            `
            : ''
          }

        </div>
      `

      let versionTaps = 0
      ctx.$('#versionNumber').onclick = () => {
        versionTaps++
        if (versionTaps >= 7) {
          ctx.setState({ devMode: true })
        }
      }

      if (devMode) {
        ctx.$('#dlJB').onclick = () => {
          if (!ctx.state.userData[currentUser].appsInstalled.some(a => a.key === 'jailbreak')) {
            ctx.state.userData[currentUser].appsInstalled.push({ name: 'JAILBREAKR', key: 'jailbreak', size: 128, price: 0, jailbreakr: true })
          }
        }

        ctx.$('#fastMode').onclick = () => {
          ctx.setState({
            fastMode: ctx.$('#fastMode').checked
          })
        }
        ctx.$('#connectData').onclick = () => {
          ctx.setState({
            dataPlanActivated: ctx.$('#connectData').checked,
            internet: 'data'
          })
        }
        ctx.$('#activateWiFi').onclick = () => {
          globalState.wifiActive = ctx.$('#activateWiFi').checked
        }
        ctx.$('#getPremium').onclick = () => {
          ctx.state.userData[currentUser].exchangePremium = ctx.$('#getPremium').checked
        }
        ctx.$('#pauseCurrency').onclick = () => {
          globalState.pauseCurrency = ctx.$('#pauseCurrency').checked
        }

        ctx.$('#defaultUnlocked').onclick = () => {
          globalState.defaultUnlocked = ctx.$('#defaultUnlocked').checked
        }

        ctx.$('#rentPaid').onclick = () => {
          globalState.rentBalance = ctx.$('#rentPaid').checked ? 0 : 6437.98
        }

        ctx.$('#setExchangeUSD').onclick = () => {
          ctx.state.usdBalances[exchangeUSDAddr] = Number(ctx.$('#exchangeUSD').value)
        }
        ctx.$('#setExchangeC').onclick = () => {
          ctx.state.userData[currentUser].exchangeCryptoBalance = Number(ctx.$('#exchangeC').value)
        }
        ctx.$('#setExchangeP').onclick = () => {
          ctx.state.userData[currentUser].exchangePremiumCryptoBalance = Number(ctx.$('#exchangeP').value)
        }
        ctx.$('#setPayappUSD').onclick = () => {
          ctx.state.usdBalances[payAppUSDAddr] = Number(ctx.$('#payappUSD').value)
        }

      }

      ctx.$('#bluetooth').onclick = () => {
        ctx.$('#message').innerHTML = `Connecting...`
        setTimeout(() => {
          ctx.setState({ bluetoothEnabled: !bluetoothEnabled })
        }, Math.random() * 750)
      }

      ctx.$('#a11y').onclick = () => {
        ctx.setState({ a11yEnabled: !a11yEnabled })
      }

      ctx.$('#noDistraction').onclick = () => {
        globalState.modelBgMode = 1
        ctx.parentElement.setBgMode(1)
        ctx.setState({ distractionMode: 1 })
      }

      ctx.$('#deepFocus').onclick = () => {
        globalState.modelBgMode = 2
        ctx.parentElement.setBgMode(2)
        ctx.setState({ distractionMode: 2 })
      }

      ctx.$('#multitask').onclick = () => {
        globalState.modelBgMode = 0
        ctx.parentElement.setBgMode(0)
        ctx.setState({ distractionMode: 0 })
      }

      ctx.$('#sound').onclick = () => {
        if (!soundEnabled) {
          const src = createSource('sine', sample([440, 660, 880]))
          src.smoothGain(MAX_VOLUME)
          setTimeout(() => {
            src.smoothGain(0)
          }, 300)
        }
        ctx.setState({ soundEnabled: !soundEnabled })
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

      const messageList = `<ul style="list-style: none; border: 1px dashed; margin-top: 0.4em; display: flex; flex-direction: column-reverse">${textMessages.map((m, ix) => `
        <li id="tm-${ix}" class="tm ${!m.read ? 'unread' : ''}">
          <div class="tm-from">${m.from || 'unknown'}</div>
          <div>${(!m.read ? '<em>(unread!)</em> ' : '') + m.value.slice(0, 19) + '...'}</div>
        </li>
      `).join('')}</ul`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex: 1; overflow: scroll; padding-bottom: 2em">
          <button id="home">Back</button>
          <h2>Text Messages</h2>

          ${
            dataPlanActivated ? messageList : '<h3>Cannot retrieve text messages</h3>'
          }
        </div>
      `

      textMessages.forEach((m, ix) => {
        if (ctx.$(`#tm-${ix}`)) ctx.$(`#tm-${ix}`).onclick = () => {
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
      ctx?.__notificationCb?.()

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
      const availableActions = ctx.state.availableActions.filter(a => !['standUpBed', 'openPhone', 'closePhone', 'hallway', 'livingRoom', 'bathroom', 'bedroom', 'hallwayCurrent', 'kitchen', 'livingRoomCurrent', 'resetRouter', 'checkWifiPower', 'frontDoorListen', 'pickupEnvelopes', 'reenterApartment', 'externalHallwayBack'].includes(a.value))

      const objects = availableActions.map(a => `<button id="qr-${a.value}" style="margin-right: 0.25em">${a.text}</button>`).join('')
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>QR SCANNER</h2>
          <div style="padding: 0.5em">${objects}</div>
          <h4 id="error"></h4>
        </div>
      `

      availableActions.forEach(a => {
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

    } else if (screen === 'wake') {

      const deviceInterface = wifiAvailable
        ? `
          <h4 style="text-align: center">Current Time: NaN<span class="blink">:</span>NaN<span class="blink">:</span>NaN</h4>
          <h4 style="text-align: center">Alarm Set For: <span id="currentAlarm"></span></h4>
          <div style="display: flex; flex-direction: column; align-items: center; margin: 0.5em">
            <h5>Choose Alarm:</h5>
            ${times(4, (ix) => `
              <label style="display: block; font-size: 0.9em">
                <input id="alarm-${ix}" type="radio" name="alarm-${ix}" ${alarmRing === ix ? 'checked' : ''}> Alarm ${ix}
              </label>`).join('')}
          </div>
          <div>${jailbrokenApps.wake ? jbMarkup(globalState.cryptoDevices.wake) : ''}</div>
          <div>${jbMarkup(globalState.cryptoDevices.wake)}</div>
        `
        : `<h3>[ERR 542]: CANNOT RETRIEVE DEVICE DATA FROM SERVER</h3>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center; font-style: italic">Good morning!</h2>

          <h3 style="text-align: center; margin: 0.4em 0">Did you have any dreams last night?</h3>
          <div style="display: flex; align-items: center; flex-direction: column; margin-bottom: 1em">
            <textarea id="journalText" style="font-family: serif; width: 90%; height: 3em; margin-bottom: 0.4em" placeholder="I dreamt I was a butterfly, freely floating, blown about by the gentle summer breeze"></textarea>
            <button id="logDream">Add Dream Journal Entry</button>
            <h6 id="journalError"></h6>
          </div>

          <div>
            <h3 style="text-align: center">Your Wake Device</h3>
            ${
              bluetoothEnabled
                ? wakePaired
                  ? `<div style="padding: 0.5em; border: 1px dotted">${deviceInterface}</div>`
                  : `<button id="pairWake">Pair Wake Device</button>`
                : `<h3>Please enable bluetooth to pair Wake device</h3>`
            }

          </div>

          <footer style="margin-top: 1em"><h5 style="text-align: center; font-style: italic">Wake</h5></footer>
        </div>
      `

      jbBehavior(ctx, globalState.cryptoDevices.wake, 250)

      if (ctx.$('#currentAlarm')) {
        if (!globalState.cryptoDevices.wake) ctx.setInterval(() => {
          ctx.$('#currentAlarm').innerHTML = formatTime(globalState.countdownTimeLeft + 2000)
        }, 1000)

        times(4, ix => {
          ctx.$('#alarm-' + ix).onclick = () => {
            ctx.setState({
              alarmRing: ix
            })

            if (ix === 0) {
              const src = createSource('sawtooth', 830.6)
              const src2 = createSource('sawtooth', 415.30)

              let i = 0
              const interval = setInterval(() => {
                if (i === 3) clearInterval(interval)
                i++

                src.smoothGain(MAX_VOLUME)
                src2.smoothGain(MAX_VOLUME)
                setTimeout(() => {
                  src.smoothGain(0)
                  src2.smoothGain(0)
                }, 350)
              }, 500)
            }

            else if (ix === 1) {
              const measure = 1000 / 6
              const src1 = createSource('square', 415.3)
              const src2 = createSource('square',  523.25)
              const src3 = createSource('square', 622.25)
              const src4 = createSource('square', 830.6)


              src1.smoothGain(MAX_VOLUME, 0.01)

              setTimeout(() => {
                src2.smoothGain(MAX_VOLUME, 0.01)
              }, 250)

              setTimeout(() => {
                src3.smoothGain(MAX_VOLUME, 0.01)
              }, 500)

              setTimeout(() => {
                src4.smoothGain(MAX_VOLUME, 0.01)
              }, 750)

              setTimeout(() => {
                src1.smoothGain(0)
                src2.smoothGain(0)
                src3.smoothGain(0)
                src4.smoothGain(0)
              }, 950)

              setTimeout(() => {
                src1.smoothGain(MAX_VOLUME, 0.1)
                src2.smoothGain(MAX_VOLUME, 0.2)
                src3.smoothGain(MAX_VOLUME, 0.3)
                src4.smoothGain(MAX_VOLUME, 0.4)
              }, 1000)

              setTimeout(() => {
                src1.smoothGain(0)
                src2.smoothGain(0)
                src3.smoothGain(0)
                src4.smoothGain(0)
              }, 1750)

            }

            else if (ix === 2) {
              const src1 = createSource('square', 1)
              const src2 = createSource('square',  1)
              const src3 = createSource('square', 1)
              const src4 = createSource('square', 1)
              src1.smoothGain(MAX_VOLUME*0.65)
              src2.smoothGain(MAX_VOLUME*0.65)
              src3.smoothGain(MAX_VOLUME*0.65)
              src4.smoothGain(MAX_VOLUME*0.65)


              setTimeout(() => {
                let i = 0
                const interval = setRunInterval(() => {
                  if (i === 4) {
                    clearInterval(interval)
                    src1.smoothGain(0)
                    src2.smoothGain(0)
                    src3.smoothGain(0)
                    src4.smoothGain(0)
                    return
                  }
                  i++

                  src1.smoothFreq(830.6, 0.15)
                  src2.smoothFreq(830.6, 0.15)
                  src3.smoothFreq(830.6, 0.15)
                  src4.smoothFreq(830.6, 0.15)

                  setTimeout(() => {
                    src1.smoothFreq(415.3, 0.4)
                    src2.smoothFreq(415.3, 0.42)
                    src3.smoothFreq(415.3, 0.44)
                    src4.smoothFreq(415.3, 0.46)
                  }, 110)
                }, 500)
              }, 100)
            }

            else if (ix === 3) {
              const measure = 1000 / 6
              const src1 = createSource('sine')
              const src2 = createSource('sine')
              const src3 = createSource('sine')

              const mainRiff = [415.30, 523.25, 830.61, 622.25, 1046.5, 830.61, 622.25, 523.25]

              const keys = [
                ...mainRiff,
                ...mainRiff,
                ...mainRiff,
                ...mainRiff,

                ...mainRiff,
                ...mainRiff.map(n => n*0.89),
                ...mainRiff.map(n => n*0.84),
                ...mainRiff.map(n => n*0.7935),
              ]

              let timePassed1 = 0
              for (let key of keys) {
                setTimeout(() => {
                  src1.smoothFreq(key)
                  src1.smoothGain(MAX_VOLUME, 0.01)

                  setTimeout(() => {
                    src1.smoothGain(0)
                  }, measure * 0.9)

                }, timePassed1)

                timePassed1 += measure
              }


              const secondaryKeys = [311.13, 311.13, 311.13, 311.13, 311.13, 311.13, 415.3, 415.3, 349.23, 349.23, 277.18, 277.18, 277.18, 277.18, 261.63, 233.08]

              let timePassed2 = 0
              setTimeout(() => {
                src2.smoothGain(MAX_VOLUME, 0.01)
                src3.smoothGain(MAX_VOLUME, 0.01)

                for (let key of secondaryKeys) {
                  setTimeout(() => {
                    src2.smoothFreq(key*2)
                    src3.smoothFreq(key*2+5)
                  }, timePassed2)

                  timePassed2 += measure * 2
                }

                setTimeout(() => {
                  src2.smoothGain(0)
                  src3.smoothGain(0)
                }, timePassed2)
              }, measure*32)
            }
          }
        })
      }

      if (ctx.$('#pairWake')) ctx.$('#pairWake').onclick = () => {
        ctx.$('#pairWake').innerHTML = 'One moment please...'

        setTimeout(() => {
          ctx.setState({ wakePaired: true })
        }, 2000)
      }

      ctx.$('#logDream').onclick = () => {
        ctx.$('#journalError').innerHTML = 'Logging Dream. Please wait...'

        setTimeout(() => {
          if (hasInternet) {
            ctx.$('#journalError').innerHTML = 'DREAM PROCESSED SUCCESSFULLY'
            ctx.$('#journalText').value = ''

          } else {
            ctx.$('#journalError').innerHTML = 'ERROR: CANNOT CONNECT TO SERVER'
          }
        }, 3000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'lumin') {

      const mainInterface = `
        <button id="offOn">${lampOn ? 'Turn Off' : 'Turn On'}</button>
        ${
          lampOn
            ? `
              <div style="display: flex; justify-content: space-around">
                <div>
                  <h6>H1</h6>
                  <input type="range" min="0" max="360" value="${globalState.light1.h}" id="l1h">
                  <h6>S1</h6>
                  <input type="range" min="0" max="100" value="${globalState.light1.s}" id="l1s">
                  <h6>V1</h6>
                  <input type="range" min="0" max="100" value="${globalState.light1.v}" id="l1v">
                </div>
                <div>
                  <h6>H2</h6>
                  <input type="range" min="0" max="360" value="${globalState.light2.h}" id="l2h">
                  <h6>S2</h6>
                  <input type="range" min="0" max="100" value="${globalState.light2.s}" id="l2s">
                  <h6>V2</h6>
                  <input type="range" min="0" max="100" value="${globalState.light2.v}" id="l2v">
                </div>
              </div>
            `
            : ''
        }
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

          <div>${jailbrokenApps.lumin ? jbMarkup(globalState.cryptoDevices.lumin, !lampOn) : ''}</div>
          <h2 style="text-align: center; font-family: cursive">☼ Lumin ☀︎</h2>
        </div>
      `

      if (ctx.$('#pairLumin')) ctx.$('#pairLumin').onclick = () => {
        ctx.setState({ luminPaired: true })
      }

      const turnOffMiner = jbBehavior(ctx, globalState.cryptoDevices.lumin, 300, noop, () => {
        globalState.light1.h += 1
        globalState.light2.h -= 1

        if (globalState.light1.h >= 360) globalState.light1.h = 0
        if (globalState.light2.h <= 0) globalState.light2.h = 360

        if (globalState.light1.s <= 100) globalState.light1.s = Math.min(globalState.light1.s + 1, 100)
        if (globalState.light1.v <= 100) globalState.light1.v = Math.min(globalState.light1.v + 1, 100)
        if (globalState.light2.s <= 100) globalState.light2.s = Math.min(globalState.light2.s + 1, 100)
        if (globalState.light2.v <= 100) globalState.light2.v = Math.min(globalState.light2.v + 1, 100)

        if (globalState.lightsOn) {
          setColor('--bg-color', hsvToRGB(globalState.light1))
          setColor('--primary-color', hsvToRGB(globalState.light2))
        }

      })

      const changeLight = () => {
        const { light1, light2 } = globalState

        if (globalState.lightsOn) {
          setColor('--bg-color', hsvToRGB(light1))
          setColor('--primary-color', hsvToRGB(light2))
        } else if (globalState.shaydOpen) {
          setColor('--bg-color', 'var(--light-color)')
          setColor('--primary-color', 'var(--dark-color)')
        } else {
          setColor('--bg-color', 'var(--dark-color)')
          setColor('--primary-color', 'var(--light-color)')
        }
      }

      if (ctx.$('#offOn')) ctx.$('#offOn').onclick = () => {
        globalState.lightsOn = !lampOn
        ctx.setState({ lampOn: !lampOn })
        changeLight()

        if (lampOn) {
          turnOffMiner()
        }
      }

      if (lampOn) {
        ctx.$('#l1h').oninput = e => {
          globalState.light1.h = Number(e.target.value)
          changeLight()
        }
        ctx.$('#l1s').oninput = e => {
          globalState.light1.s = Number(e.target.value)
          changeLight()
        }
        ctx.$('#l1v').oninput = e => {
          globalState.light1.v = Number(e.target.value)
          changeLight()
        }
        ctx.$('#l2h').oninput = e => {
          globalState.light2.h = Number(e.target.value)
          changeLight()
        }
        ctx.$('#l2s').oninput = e => {
          globalState.light2.s = Number(e.target.value)
          changeLight()
        }
        ctx.$('#l2v').oninput = e => {
          globalState.light2.v = Number(e.target.value)
          changeLight()
        }
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'secure2fa') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3>WARNING: This device already has another Secure 2FA App installed. This may negatively impact performance</h3>
          <h1 id="timeRemaining" style="text-align: center; margin: 0.5em 0">--s</h1>
          <input id="appName" placeholder="App Name"> <input id="securityKey" placeholder="Security Key">
          <div style="display: flex; flex-direction: column; align-items: center">
            <button id="createKeyPair" style="margin: 0.5em">Create New KeyPair</button>
            <table id="faKeyPairs" style="margin: 0.5em auto"></table>
          </div>
        </div>

      `

      ctx.setInterval(() => {
        if (!hasInternet) return
        const msSinceUpdate = Date.now() - globalState.lastGlobalUpdate
        const secondsSinceUpdate = msSinceUpdate / 1000

        const roundedSeconds =  60 - (Math.floor(secondsSinceUpdate))

        ctx.$('#timeRemaining').innerHTML = roundedSeconds + 's'

        if (!ctx.$('#faKeyPairs').innerHTML || roundedSeconds < 2 || roundedSeconds > 59) {
          if (keyPairs.length) {
            const kps = [...keyPairs].reverse()
            ctx.$('#faKeyPairs').innerHTML = `<tr><th style="padding: 0.5em">App</th><th style="padding: 0.5em; border-left: 1px solid">2FA Code</th></tr>` + kps.map(({ appName, securityKey }) => `
              <tr>
                <td style="padding: 0.5em; border-top: 1px solid">${appName}</td>
                <td style="padding: 0.5em; border-top: 1px solid; border-left: 1px solid">${calcIdVerifyCode(currentUser + securityKey)}</td>
              </tr>
            `).join('')
          }
        }
      }, 1000)


      ctx.$('#createKeyPair').onclick = () => {
        const appName = ctx.$('#appName').value
        const securityKey = Number(ctx.$('#securityKey').value)

        if (!securityKey) return

        ctx.setUserData({
          keyPairs: [
            ...keyPairs,
            { appName, securityKey }
          ]
        })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'moneyMiner') {

      const faq = `
          <h4>FAQ</h4>
          <p style="margin-top: 0.5em"><strong>Q:</strong> How does Money Miner work?</p>
          <p><strong>A:</strong> In order to mine ₢rypto, all you need to do is click the <strong>Mine ₢rypto"</strong> button in the Money Miner interface. Each click will mine a new ₢rypto.</p>

          <p style="margin-top: 0.5em"><strong>Q:</strong> How can I convert ₢rypto to $?</p>
          <p><strong>A:</strong> Exchanging ₢rypto is easy! Just download the <strong>Currency Xchange App</strong>, send ₢rypto to your new wallet, and start trading! </p>
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
          <h2 style="text-align: center"><span class="icon">⚒︎</span> Money Miner <span class="icon">⚒︎</span></h2>

          <h4 style="text-align: center; margin-top: 1em">To mine ₢rypto, click the button below ⬇↓⇣↓⬇</h4>
          <div style="display: flex; justify-content: center">
            <button id="mine" style="font-size: 1.1em">Mine ₢rypto</button>
          </div>
          <h4>₢rypto Balance: <span id="cryptoBalance">${cryptoBalance}</span></h4>
          <h4 style="margin-top: 0.5em;">₢rypto Wallet Address:</h4>
          <h4 style="word-wrap: break-word; margin-bottom: 0.4em">${moneyMinerCryptoAddr}</h4>

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
        if (!hasInternet) {
          ctx.$('#cryptoBalance').innerHTML = 'CANNOT CONNECT TO BLOCKCHAIN'
          return
        }
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
        if (!hasInternet) {
          ctx.$('#error').innerHTML = 'CANNOT CONNECT TO BLOCKCHAIN'
          return

        }
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
            <h3>₢ Balance: ${hasInternet ? exchangeCryptoBalance.toFixed(6) : '-'}</h3>
            <h3>$ Balance: ${hasInternet ? exchangeUSDBalance.toFixed(6) : '-'}</h3>
            ${exchangePremium ? `<h3>₱ Balance: ${hasInternet ? exchangePremiumCryptoBalance.toFixed(6) : '-'}</h3>` : ''}
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
                  <select id="tradeAction" style="box-shadow: 1px 1px 0 ${exchangePremium ? '#fff' : '#000'}">
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                  </select>

                  <select id="currency1" style="box-shadow: 1px 1px 0 ${exchangePremium ? '#fff' : '#000'}">
                    <option value="usd">$</option>
                    <option value="crypto">₢</option>
                    ${exchangePremium ? '<option value="premium">₱</option>' : ''}
                  </select>

                  <input id="transactionAmount" placeholder="0.00" step=".01" style="width: 5em; text-align: center; " type="number">


                  <span id="tradeOperation">with</span>

                  <select id="currency2" style="box-shadow: 1px 1px 0 ${exchangePremium ? '#fff' : '#000'}">
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
              <div>
                <h4 style="margin: 0.4em 0">Send Funds</h4>
                <input id="sendCryptoAddress" placeholder="₢rypto Address" style="width: 90%; margin-bottom: 0.4em">
                <input id="sendCryptoAmount" placeholder="₢ 0.00" type="number" style="width: 6em"> <button id="sendCrypto" style="margin-bottom: 0.1em">SEND ₢</button>
                <h6 id="sendCryptoError" style="display: inline-block; margin-bottom: 0.75em"></h6>
              </div>

              <input id="sendUSDAddress" placeholder="$ Address" style="width: 90%; margin: 0.4em 0">
              <input id="sendUSDAmount" placeholder="$ 0.00" type="number" step=".01" style="width: 6em"> <button id="sendUSD" style="margin-bottom: 0.1em">SEND $</button>
              <h5>SPTX: <span id="sendUSDError">[-----------------]</span></h5>
              <div style="border-top: 3px solid; margin-top: 0.4em">
                <h4 style="margin: 0.4em 0">Receive $</h4>
                <h5 style="border: 1px dotted; text-align: center; padding: 0.25em">${hasInternet ? exchangeUSDAddr : '-'}</h5>
                <input id="sptxInput" placeholder="SPTX" type="number" style="width: 11em"> <button id="receiveSPTX">PROCESS</button>
                <h4 id="sptxError"></h4>
              </div>
            </div>

            <div style="margin: 0.6em 0; ${exchangeTab === 'premium' ? '' : 'display: none'}">
              <ul style="padding-left: 2em">
                <li>Trade the <em>exclusive</em> ₱remium Coin!</li>
                <li>Buy/Sell signals!</li>
                <li>Weekly Alpha Reports!</li>
                <li>Greater money-making opportunity!</li>
              </ul>

              <div style="margin-top: 0.5em; display: flex; flex-direction: column; align-items: center">
                ${exchangePremium
                  ? ''
                  : `
                    <button id="buyPremium" ${exchangeCryptoBalance < 10000} style="font-size: 1.2em; margin-bottom: 0.25em">BUY PREMIUM</button>
                    <h4>₢ 10,000.00</h4>
                    ${exchangeCryptoBalance < 10000 && hasInternet ? '<h5>(CURRENT BALANCE TOO LOW)</h5>' : ''}
                  `}
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
        if (!hasInternet) return
        const msSinceUpdate = Date.now() - globalState.lastGlobalUpdate
        const secondsSinceUpdate = msSinceUpdate / 1000

        const seconds = (Math.floor(secondsSinceUpdate))


        ctx.$('#timeRemaining').innerHTML = 60 - seconds
        if (Math.random() < 0.1 && !globalState.pauseCurrency)  {
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

      if (ctx.$('#buyPremium')) ctx.$('#buyPremium').onclick = () => {
        if (exchangeCryptoBalance >= 10000 && hasInternet) ctx.setUserData({
          exchangePremium: true,
          exchangeCryptoBalance: exchangeCryptoBalance - 10000,

        })
      }



      ctx.$('#sendCrypto').onclick = () => {
        const amount = Number(ctx.$('#sendCryptoAmount').value)
        const recipient = ctx.$('#sendCryptoAddress').value

        if (!hasInternet) {
          ctx.$('#sendCryptoError').innerHTML = 'Cannot connect to database. Please connect your internet connection'
        } else if (amount > exchangeCryptoBalance) {
          ctx.$('#sendCryptoError').innerHTML = 'Amount EXCEEDS Current Balance'
          return
        } else if (!amount || amount < 0) {
          ctx.$('#sendCryptoError').innerHTML = 'Invalid Amount'
          return
        } else {
          ctx.$('#sendCryptoError').innerHTML = ''
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

        if (!hasInternet) {
          ctx.$('#sendUSDError').innerHTML = 'Cannot reach PayApp server'
        } else if (amount > exchangeUSDBalance) {
          ctx.$('#sendUSDError').innerHTML = 'ERROR: Amount EXCEEDS Current Balance'
          return
        } else if (!amount || amount < 0) {
          ctx.$('#sendUSDError').innerHTML = 'ERROR: Invalid Amount'
          return
        } else {
          ctx.$('#sendUSDError').innerHTML = ''

        }

        ctx.$('#sendUSDError').innerHTML = 'Processing [DO NOT RELOAD PAGE]'

        if (['0x4b258603257460d480c929af5f7b83e8c4279b7b', '0xef301fb6c54b7cf2cecac63c9243b507a8695f4d'].includes(recipient)) {
          setTimeout(() => {
            ctx.$('#sendUSDError').innerHTML = `PROCESSING ERROR: Recipient outside payment network`
          }, 2000)
          return
        }

        const sptx = ctx.createSPTX({
          sender: exchangeUSDAddr,
          recipient,
          amount
        })

        setTimeout(() => {
          ctx.$('#sendUSDError').innerHTML = `Message: Secure Payment Transaction (S.P.T.X.) identifier: <span style="font-size: 1.25em">${sptx}</span>`
        }, 500)

        ctx.$('#sendUSDAmount').value = ''
        ctx.$('#sendUSDAddress').value = ''
      }

      ctx.$('#receiveSPTX').onclick = () => {
        const sptxInput = ctx.$('#sptxInput').value
        if (!hasInternet) {
          ctx.$('#sptxError').innerHTML = 'SPTX ERROR: Cannot reach PayApp server'
          return
        }
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
          premiumcrypto: calcPremiumCryptoUSDExchangeRate() / calcCryptoUSDExchangeRate(), // sell premium, buy crypto
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

        if (!hasInternet) {
          ctx.$('#tradeError').innerHTML = 'Processing...'
          return
        }

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


        setTimeout(() => {
          ctx.$('#tradeAction').value = action

          if (action === 'buy') {
            ctx.$('#currency1').value = buyCurrency
            ctx.$('#currency2').value = sellCurrency
            ctx.$('#tradeOperation').innerHTML = 'with'
          } else {
            ctx.$('#currency1').value = sellCurrency
            ctx.$('#currency2').value = buyCurrency
            ctx.$('#tradeOperation').innerHTML = 'for'
          }
        }, 300)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'yieldFarmer') {
      const existingHighScore =
        currentUserData.yieldFarmerHighScore === null
          ? Infinity
          : currentUserData.yieldFarmerHighScore

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex:1; display: flex;">
          <div id="main" style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between">

            <div>
              <button id="home">Back</button>
              <h2>YieldFarmer 2</h2>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%">
              <h1 style="text-align: center; margin-bottom: 0.4em">Crypto: <span id="currentScore">0.00</span></h1>
              <button id="mineCrypto" style="font-size: 1.1em">Mine Crypto</button>

              <div id="stake" class="hidden" style="display: flex; align-items: center; flex-direction: column; margin-top: 1em">
                <h3>Stake (<span id="stakeYield">10%</span>/<span id="stakeTime">5s</span>)</h3>
                <button id="stakeCrypto" style="margin-top: 0.5em">Stake <span id="stakeAmount">10<span></button>
              </div>

              <div id="protocol" class="hidden" style="margin-top: 1em; padding: 0 0.75em">
                <h3 style="margin-bottom:0.4em">Protocol Upgrade</h3>
                <button id="increaseAmount" disabled>Increase Stake Amount 100% (100) </button>
                <button id="increaseYield" disabled>Increase Stake Yield 20% (100) </button>
                <button id="decreaseTime" disabled>Decrease Stake Time 20% (100) </button>

              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
              <div>
                <h5>Your High Score: <span id="highScore">${existingHighScore.toFixed(2)}</span></h5>
                <h5>Global Score: <span id="highScore">${ctx.state.yieldFarmerGlobalHighScore.toFixed(2)}</span></h5>
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

        if (currentScore > currentUserData.yieldFarmerHighScore) {
          currentUserData.yieldFarmerHighScore = currentScore
          ctx.$('#highScore').innerHTML = currentScore.toFixed(2)
        }

        if (currentScore > ctx.state.yieldFarmerGlobalHighScore) {
          ctx.setState.yieldFarmerGlobalHighScore = currentScore
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
          setTimeout(update, stakeTime)
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

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'lock') {
      // todo: make it so you can pair with other smartlocks
      const mainContent = ctx.state.smartLockPaired
        ? `
          <div>
            <h3>Lock Status: ${globalState.smartLockOpen ? 'Unlocked' : 'Locked'}</h3>
            <button id="toggleSmartLock">${globalState.smartLockOpen ? 'Lock' : 'Unlock'}</button>
            <div>${jailbrokenApps.lock ? jbMarkup(globalState.cryptoDevices.lock) : ''}</div>
          </div>

        `
        : `<button id="pairSmartLock">Pair Device</button>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>SmartLock</h2>
          <p>SmartLock Technology<sup>TM</sup> keeps you safe</p>
          ${bluetoothEnabled
            ? inInternetLocation ? mainContent : '<h3>Cannot find device</h3>'
            : `<h3>Cannot pair device: Please Enable Bluetooth</h3>`
          }
          <h3 id="lockError"></h3>
        </div>
      `



      jbBehavior(ctx, globalState.cryptoDevices.lock, 50)


      if (ctx.$('#pairSmartLock')) ctx.$('#pairSmartLock').onclick = () => {
        ctx.$('#lockError').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ smartLockPaired: true })
        }, 200)
      }

      if (ctx.$('#toggleSmartLock')) ctx.$('#toggleSmartLock').onclick = () => {
        ctx.$('#lockError').innerHTML = 'Proccessing'

        setTimeout(() => {
          if (!wifiAvailable) {
            ctx.$('#lockError').innerHTML = 'Device Error: Wifi Connection Error <br>Device Error: Cannot Connect To Server'

          } else if (globalState.rentBalance <= 0) {
            globalState.smartLockOpen = !globalState.smartLockOpen
            ctx.setState({}, true)
            window.primarySM.enqueue('smartLockShift')

          } else {
            ctx.$('#lockError').innerHTML = `Error: Device Failed With Message: "PLEASE TAKE NOTICE that you are hereby required to pay to Landlock Realty, LLC landlord of the premisis, the sum of $${globalState.rentBalance.toFixed(2)} for rent of the premises (Unit #948921). You are required to pay within <strong>-3 days</strong> from the day of service of this notice. All payments shall be made through the official Landlock Realty Rental App"`

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
          <div style="margin-top: 0.4em">
            <input id="unit" placeholder="Unit #" type="number">
            <button id="search">Search</button>
          </div>

          <div id="unitStatus"></div>
          <div id="payNow" style="margin: 0.4em 0; word-break: break-word"></div>
        </div>
      `

      ctx.$('#search').onclick = () => {
        const unit = Number(ctx.$('#unit').value)

        ctx.$('#unitStatus').innerHTML = `<h3>Searching</h3>`
        ctx.$('#payNow').innerHTML = ''

        setTimeout(() => {
          if (!hasInternet) {
            ctx.$('#unitStatus').innerHTML = `<h3>Cannot find server</h3>`

          } else if (unit === 948921) {
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
            <input id="sptx" placeholder="SPTX identifier" type="number" style="margin-top: 0.4em">
            <button id="pay">Pay Now</button>
            <h4 id="error"></h4>
            <div style="margin: 1em 0">
              <h3 style="margin-bottom: 0.4em">Maintenance Request</h3>
              <div>
                <textarea id="maintenanceRequest"></textarea>
              </div>
              <button id="submitMaintenanceRequest">Submit</button>
              <h4 id="maintenanceRequestMsg"></h4>
            </div>
          `

          ctx.$('#submitMaintenanceRequest').onclick = () => {
            ctx.$('#maintenanceRequest').value = ''
            ctx.$('#maintenanceRequestMsg').innerHTML = 'Thank You. Your maintenance request will be processed'
          }
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
        }, Math.random() * 4000)


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

      const mainContent = Number(currentUser) === 0
        ? `
          <div>
            <h3 style="text-align: center; margin: 0.4em 0;">ToastBaby69</h3>
            <h5 style="text-align: center;">Followers: 12 | Following: 58 | Toasts: 11</h5>
            <div>
              <div style="margin-top: 0.4em">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[52 days ago] (3 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[58 days ago] (15 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[63 days ago] (25 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[69 days ago] (24 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[88 days ago] (9 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[104 days ago] (12 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[105 days ago] (77 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[109 days ago] (75 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[111 days ago] (86 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div>♺ re-toast ♺ !</div>
                <div style="padding-left: 0.5em"><strong>ralph23901413043141</strong><span style="font-size: 0.8em; margin-left: 1em">[112 days ago] (847 ♥)</span></div>
                <div style="padding-left: 0.5em"><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[112 days ago] (123 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
              <div style="margin-top: 0.3em; padding-top: 0.3em; border-top: 1px dotted">
                <div><strong>ToastBaby69</strong><span style="font-size: 0.8em; margin-left: 1em">[113 days ago] (189 ♥)</span></div>
                <div><em> Just Toasted!</em></div>
              </div>
            </div>
          </div>
        `
        : `
          <div>
            <input placeholder="Username">
            <input placeholder="Password" type="password">
            <button id="login" style="margin-top: 0.4em">Login</button>
            <h5 id="loginError"></h5>
          </div>
          <div>${jailbrokenApps.toastr ? jbMarkup(globalState.cryptoDevices.toastr) : ''}</div>
        `

      const mainInterface = wifiAvailable
        ? mainContent
        : `<h3>Device Error: NETWORK_ERROR: Cannot connect to server.</h3>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.25em; border-bottom: 1px solid">
            <button id="home" style="margin-bottom: 0">Back</button>
            <h2 style="">Toastr</h2>
            <h6 style="">Powered by <a href="https://friendworld.social" target="_blank">friendworld.social</a></h6>
          </div>
          ${
            bluetoothEnabled
              ? toasterPaired ? mainInterface : `<button id="pairToaster">Pair Device</button>`
              : `<h3>Must enable bluetooth permissions in Home/Settings</h3>`
          }
        </div>
      `


      jbBehavior(ctx, globalState.cryptoDevices.toastr, 300)


      if (ctx.$('#login')) ctx.$('#login').onclick = () => {
        ctx.$('#loginError').innerHTML = 'Credentials Incorrect'
      }

      if (ctx.$('#pairToaster')) ctx.$('#pairToaster').onclick = () => {
        ctx.setState({ toasterPaired: true })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'planter') {

      const plantStates = ['Dead', ':(', ':|', ':)']
      const {plantStatus} = ctx.state
      console.log(plantStatus, plantStates[plantStatus])

      const needs = plantStatus === 0
        ? 'null'
        : [
          !globalState.plantWatered && 'Water',
          !globalState.shaydOpen && 'Sunlight',
          globalState.shaydOpen && globalState.plantWatered && '0',
        ].filter(iden).join(', ')


      const nameModule =
        ctx.state.plantName
          ? `<h3>Plant Name: ${ctx.state.plantName}!</h3>`
          : `
            <div style="margin-top: 1em">
              <h3>Name your plant!</h3>
              <input id="plantName" placeholder="Plant Name"> <button id="namePlant">Name</button>
            </div>
          `


      const mainContent = planterPaired
        ? `
          <h3 style="margin: 0.4em 0">Plant Status: <span id="plantStatus">${plantStates[plantStatus]}</span></h3>
          <button id="water" ${globalState.plantWatered ? 'disabled' : ''}>Water</button>
          <h5>Needs: ${needs}</h5>
          ${globalState.plantWatered && globalState.shaydEverOpen
              ? nameModule
              : ''
            }
          <h4 id="error"><h4>
          ${jailbrokenApps.planter && planterPaired ? jbMarkup(globalState.cryptoDevices.planter) : ''}
        `
        : `<button id="pairPlanter">Pair SmartPlanter<sup>TM</sup></button>`


      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin-bottom: 0.4em">SmartPlanter<sup>TM</sup></h2>
          ${bluetoothEnabled
            ? inInternetLocation ? mainContent : '<h3>Cannot find SmartPlanter<sup>TM</sup></h3>'
            : `<h3>Please Enable Bluetooth to pair SmartPlanter<sup>TM</sup></h3>`
          }
        </div>
      `

      jbBehavior(ctx, globalState.cryptoDevices.planter, 100, () => {
        if (plantStatus > 0 && globalState.cryptoDevices.planter.totalTime > 10000) {

          globalState.plantsDead = true
          ctx.setState({ plantStatus: 0 })
        }
      })

      if (ctx.$('#water')) ctx.$('#water').onclick = () => {

        setTimeout(() => {
          if (!globalState.plantWatered && ctx.state.plantStatus > 0) {
            globalState.plantWatered = true
            ctx.setState({ plantStatus: plantStatus + 1 })
          } else {
            globalState.plantWatered = true
            ctx.setState({}, true)
          }
        }, 1000)
      }

      if (ctx.$('#pairPlanter')) ctx.$('#pairPlanter').onclick = () => {
        ctx.$('#pairPlanter').innerHTML = 'Pairing device...'

        // if (ctx.$('#planterDeviceCode').value !== 'F93892O30249B48') {
        //   setTimeout(() => {
        //     ctx.$('#error').innerHTML = 'Unregistered Device: Please check that you have input a valid Device Code'
        //   }, 800)

        // } else if (!wifiAvailable) {
        //   setTimeout(() => {
        //     ctx.$('#error').innerHTML = `Cannot find device. Please check your SmartPlanter<sup>TM</sup>'s internet connection and try again`
        //   }, 2000)

        // } else {
          setTimeout(() => {
            ctx.setState({ planterPaired: true })
          }, 3000)
        // }
      }

      if (ctx.$('#namePlant')) ctx.$('#namePlant').onclick = () => {
        const name = ctx.$('#plantName').value

        if (!name) {
          ctx.$('#error').innerHTML = `Please input a valid name for your plant`
        }

        ctx.$('#error').innerHTML = `<span style="icon'>⌛︎</span>`

        if (!wifiAvailable) {
          setTimeout(() => {
            ctx.$('#error').innerHTML = 'ERROR: SERVER NOT FOUND -- Please check that your device is connected to WiFi'
          }, 300)
        } else {
          setTimeout(() => {
            ctx.setState({
              plantName: name
            })
          }, 1500)
        }

      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'shayd') {
      const mainContent = ctx.state.shaydPaired
        ? `
          <div>
            <h3>Blinds: ${globalState.shaydOpen ? 'Open' : 'Closed'}</h3>
            <button id="toggleShaydOpen">${globalState.shaydOpen ? 'Close' : 'Open'}</button>
            <h3 id="shaydError" style="display: inline-block;"></h3>
            <div>${jailbrokenApps.shayd ? jbMarkup(globalState.cryptoDevices.shayd) : ''}</div>
          </div>

        `
        : `<button id="pairShayd">Pair Device</button>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center">☾☼☽</h2>
          <h2 style="text-align: center">Shayd</h2>
          ${bluetoothEnabled
            ? inInternetLocation ? mainContent : '<h3>Cannot find Shade device</h3>'
            : `<h3>Please Enable Bluetooth to pair Shayd device</h3>`
          }
          <h3 id="btError"></h3>
        </div>
      `

      const setBg = () => {
        if (!lampOn) {
          if (globalState.shaydOpen) {
            setColor('--bg-color', 'var(--light-color)')
            setColor('--primary-color', 'var(--dark-color)')
          } else {
            setColor('--bg-color', 'var(--dark-color)')
            setColor('--primary-color', 'var(--light-color)')
          }
        }
      }

      jbBehavior(ctx, globalState.cryptoDevices.shayd, 150, () => {
        if (globalState.shaydOpen) {
          globalState.shaydOpen = false
          const stateUpdate = ctx.state.plantStatus === 0 ? {} : {
            plantStatus: ctx.state.plantStatus - 1
          }
          ctx.setState(stateUpdate, true)

          setBg()
        }
      })


      if (ctx.$('#pairShayd')) ctx.$('#pairShayd').onclick = () => {
        ctx.$('#btError').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ shaydPaired: true })
        }, 800)
      }

      if (ctx.$('#toggleShaydOpen')) ctx.$('#toggleShaydOpen').onclick = () => {
        ctx.$('#shaydError').innerHTML = globalState.shaydOpen ? 'Closing' : 'Opening'

        setTimeout(() => {
          let stateUpdate = {}
          // if (!wifiAvailable) {
          //   ctx.$('#shaydError').innerHTML = 'Device Error: "LAN Error: Cannot Connect to Local Area Network"'

          // } else

          if (!globalState.shaydOpen) {
            globalState.shaydOpen = true
            globalState.shaydEverOpen = true
            stateUpdate = ctx.state.plantStatus === 0 ? {} : {
              plantStatus: ctx.state.plantStatus + 1
            }
            ctx.setState(stateUpdate, true)
          } else if (globalState.shaydOpen) {
            globalState.shaydOpen = false
            stateUpdate = ctx.state.plantStatus === 0 ? {} : {
              plantStatus: ctx.state.plantStatus - 1
            }
            ctx.setState(stateUpdate, true)
          }

          setBg()

            // window.primarySM.enqueue('smartLockShift')
        }, 2000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'clearBreeze') {
      const mainContent = ctx.state.clearBreezePaired
        ? `
          <div style="display: flex; flex-direction: column; align-items: center">
            <button id="openWindow" style="font-size: 1.2em">Open Window</button>
            <h3 id="windowError" style="text-align: center; margin-top: 0.5em"></h3>
            <div>${jailbrokenApps.clearBreeze ? jbMarkup(globalState.cryptoDevices.clearBreeze) : ''}</div>
          </div>

        `
        : `<button id="pairWindow">Pair Device</button>`

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin: 1em 0; text-align: center">ClearBreeze Windows</h2>
          <h2 style="margin: 1em 0; text-align: center"><span class="icon">⌸</span></h2>
          ${bluetoothEnabled
            ? inInternetLocation ? mainContent : '<h3>Cannot find Shade device</h3>'
            : `<h3>Please Enable Bluetooth to pair Shayd device</h3>`
          }
          <h3 id="pairError"></h3>
        </div>
      `



      jbBehavior(ctx, globalState.cryptoDevices.clearBreeze, 150)


      if (ctx.$('#pairWindow')) ctx.$('#pairWindow').onclick = () => {
        ctx.$('#pairError').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ clearBreezePaired: true })
        }, 800)
      }

      if (ctx.$('#openWindow')) ctx.$('#openWindow').onclick = () => {
        ctx.$('#windowError').innerHTML = 'Opening...'

        if (!wifiAvailable) {
          setTimeout(() => {
            ctx.$('#windowError').innerHTML = 'Device Error: "Local Area Network (LAN) Error: Cannot Connect to WiFi"'
          }, 1700)
        } else {
          setTimeout(() => {
            ctx.$('#windowError').innerHTML = 'Device Error: "HARDWARE MALFUNCTION"'
          }, 4000)
        }
      }


      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'thermoSmart') {

      const mainInterface = `
        <h1 style="text-align: center; font-size: 3.5em; padding-left: 0.4em">${wifiAvailable ? `84˚` : '-˚'}</h1>
        <h3 style="text-align: center">CO2 Level: ${wifiAvailable ? `<span class="blink">HAZARDOUS</span>` : '-'}</h3>
        <h4 style="text-align: center; margin-top: 0.5em">CONTINUED EXPOSURE AT THIS LEVEL MAY LEAD TO ADVERSE HEALTH EFFECTS</h4>
        <div style="text-align: center">
          ${wifiAvailable && !globalState.thermostatDisabled
            ? `<button id="disable" style="margin-top:1em">Disable Warning</button>`
            : ''
          }
        </div>
        ${wifiAvailable ? `` : `ERROR: ThermoSmart device cannot find "InpatientRehabilitationServices"`}
        <div style="margin-top: 2em">${jailbrokenApps.thermoSmart ? jbMarkup(globalState.cryptoDevices.thermoSmart) : ''}</div>
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="margin: 1em 0; text-align: center">ThermoSmart</h2>
          ${
            bluetoothEnabled
              ? thermoSmartPaired
                ? mainInterface
                : `
                  <div style="text-align: center"><button id="pairThermoSmart">Pair Device</button></div>
                  <h3 id="pairError"></h3>
                `
              : `<h3 id="pairError">Please enable blue tooth in your phones's Settings to pair ThermoSmart device</h3>`
          }
        </div>
      `


      if (ctx.$('#disable')) ctx.$('#disable').onclick = () => {
        clearInterval(tmp.thermostatRingInterval)
        tmp.thermostatSrc?.stop?.()
        tmp.thermostatRinging = false
        globalState.thermostatDisabled = true
        ctx.setState({}, true)
      }



      if (ctx.$('#pairThermoSmart')) ctx.$('#pairThermoSmart').onclick = () => {
        ctx.$('#pairError').innerHTML = 'Please wait while your phone pairs with your ThermoSmart device'
        setTimeout(() => {
          ctx.setState({ thermoSmartPaired: true })
        }, 1400)
      }


      jbBehavior(ctx, globalState.cryptoDevices.thermoSmart, 500)

      // if (ctx.$('#openWindow')) ctx.$('#openWindow').onclick = () => {
      //   ctx.$('#windowError').innerHTML = 'Opening...'

      //   if (!wifiAvailable) {
      //     setTimeout(() => {
      //       ctx.$('#windowError').innerHTML = 'Device Error: "Local Area Network (LAN) Error: Cannot Connect to WiFi"'
      //     }, 1700)
      //   } else {
      //     setTimeout(() => {
      //       ctx.$('#windowError').innerHTML = 'Device Error: "HARDWARE MALFUNCTION"'
      //     }, 4000)
      //   }
      // }


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
              <h4>Active UserID: <span id="activeUserID">${currentUser}</span></h4>
              <h4>Admin Access: <span id="adminAccess">${Number(currentUser) === Number(rootUser) ? 'Granted' : 'Denied'}</span></h4>
              <h4>Device ID: 49-222999-716-2580</h4>
              <h4>OS: MPX ${window.GAME_VERSION}.1</h4>
              <br>
              <br>
            `]})
            setTimeout(() => {
              ctx.setState({exeCommands: [...ctx.state.exeCommands, `
                <h5>Helpful Commands:</h5>
                <h5>"escape()" -- exit the EXE Runner</h5>
                <h5>"lsprofiles()" -- ls device profile info</h5>
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

      if (ctx.$('#activeUserProfile')) ctx.$('#activeUserProfile').innerHTML = `${userNames[currentUser]}`
      if (ctx.$('#activeUserID')) ctx.$('#activeUserID').innerHTML = currentUser
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
          } else if (command.includes('lsprofiles()')) {
            commandDisplay = `
              <table>
                <tr>
                  <th>id</th>
                  <th>username</th>
                  <th>active</th>
                  <th>adminAccess</th>
                </tr>
                ${Object.keys(userData).map(id => `
                  <tr>
                    <td>${id}</td>
                    <td style="max-width: 165px; word-break: break-word; text-align: center">${userNames[id]}</td>
                    <td style="text-align: center">${Number(id) === currentUser ? '*' : ''}</td>
                    <td style="text-align: center">${Number(id) === rootUser ? '*' : ''}</td>
                  </tr>
                `).join('')}
              </table>
            `

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
                <div style="margin: 0.5em 0; font-weight: bolder">Device admin profile: <span style="display: inline-block; padding: 0.25em; border: 1px solid">${userNames[rootUser]}</div>
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
            } else {
              commandDisplay = `${fn}: command not found`
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
          <h4 id="error" style=" text-align: center; margin-top: 1em"></h4>

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


              if (!bluetoothEnabled) {
                ctx.$('#error').innerHTML = 'Please enable Bluetooth'
                return
              }
              ctx.$('#binaryApply').innerHTML = `
                <h4 id="dlMessage" style="animation: Blink .5s steps(2, start) infinite;">Enabling \`autominer\` for: ${app} <br>[DO NOT REFRESH THIS PAGE]</h4>
                <progress id="jbProgress" value="0" max="100" style="width:20em; margin-top:1em"></progress>
              `

              const duration = 10000 * (globalState.cryptoDevices[app].ram / 6)
              const intervalMS = 125
              const updates = duration / intervalMS

              const src1 = createSource('square')
              const freq = 50 + Math.random() * 150
              src1.smoothFreq(freq)
              src1.smoothGain(MAX_VOLUME*.7, 0.5)
              src1.smoothFreq(freq*8, duration/1000)

              const src2 = createSource('square')
              const freq2 = freq*sample([0.5, 1.25, 1.5, 1.2])
              src2.smoothFreq(freq2)
              src2.smoothGain(MAX_VOLUME*.35, 0.5)
              src2.smoothFreq(freq2*8, duration/1000)

              setTimeout(() => {
                src1.stop()
                src2.stop()
              }, duration * 1.2 + 500)


              let p = 0
              const interval = setInterval(() => {
                p += (100 / updates)
                try {
                  ctx.$('#jbProgress').value = p
                } catch (e) {
                  clearInterval(interval)
                }
              }, intervalMS)

              setTimeout(() => {
                ctx.$('#applicationBinary').value = ''
                ctx.$('#dlMessage').innerHTML = ''
                ctx.$('#error').innerHTML = 'complete'
                src1.smoothFreq(freq, 0.1)
                src2.smoothFreq(freq2, 0.1)
                src1.smoothGain(0, 0.3)

                clearInterval(interval)

                setTimeout(() => {
                  ctx.setState({
                    jailbrokenApps: {
                      ...ctx.state.jailbrokenApps,
                      [app]: true
                    }
                  })
                }, 1000)

              }, duration * 1.2)

            } else {
              ctx.$('#error').innerHTML = 'ERROR: Cannot enable `automine` in application that does not support external device functionality'
            }
          }, 1000)
        }
      }


      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
        </div>
      `

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
    }

  },
  (oldState, newState, stateUpdate) => {
    Object.assign(state, { ...newState, lastScreen: oldState.screen})
    // globalState.eventLog.push({timestamp: Date.now(), event: { type: 'phone', payload: stateUpdate }})
  }
)


// TODO can't really send crypto to this wallet, or else it will get blown away
// maybe the sendCrypto function should add it to the global device balance if it exists
function jbMarkup(device, disabled) {

  const balance = device.balance
  return `
    <div style="margin: 0.4em 0; padding: 0.5em; background: #000; color: #fff; border: 2px dashed">
      <div>
        <h3>Auto-Miner Module [${device.ram}gb RAM]</h3>
        <h5 style="display: inline-block; padding: 0.25em; margin: 0.25em 0; background: #333; border: 1px solid">${device.wallet}</h4>
        <h4 style="margin: 0.4em 0">Balance: ₢ <span id="cryptoBalance">${device.balance}</span></h4>
        ${disabled
          ? '<h5 style="text-align:center; padding: 1em">Cannot find device. Please ensure device is powered "On"</h5>'
          : `
            <button id="enableMining">${device.active ? 'Disable' : 'Enable'} Autominer</button>
          `
        }
        <h5 id="mineError"></h5>
      </div>

      <div style="margin-top: 1em">
        <h4>Send</h4>
        <input id="cryptoAddr" placeholder="Address" style="width: 15em">
        <input id="cryptoAmount" placeholder="0.00" type="number" style="width: 15em">
        <button id="sendCrypto">Send</button>
        <h5 id="sendError"></h5>
      </div>
    </div>
  `
}

function jbBehavior(ctx, device, speed, cb=noop, persistCb=noop) {
  const wifiAvailable = globalState.wifiActive && !globalState.routerUnplugged

  const update = () => {
    if (!device.active) {
      clearInterval(ctx.interval)
      clearInterval(tmp.persistantJbInterval)
      return
    }

    ctx.state.cryptoBalances[device.wallet] = device.balance
    if (ctx.$('#cryptoBalance')) ctx.$('#cryptoBalance').innerHTML = device.balance
    cb()
  }

  if (device.active) {
    clearInterval(ctx.interval)
    clearInterval(tmp.persistantJbInterval)
    ctx.interval = setRunInterval(update, speed)
    tmp.persistantJbInterval = setRunInterval(persistCb, speed)
  }

  const turnOff = () => {
    clearInterval(ctx.interval)
    clearInterval(tmp.persistantJbInterval)
    clearMiningInterval(device)
    device.active = false
    ctx.setState({
      cryptoBalances: {
        ...ctx.state.cryptoBalances,
        [device.wallet]: device.balance
      }
    })
  }

  if (ctx.$('#enableMining')) ctx.$('#enableMining').onclick = () => {
    if (!wifiAvailable) {
      setTimeout(() => {
        ctx.$('#mineError').innerHTML = `ERROR: DEVICE CANNOT CONNECT TO INTERNET`
      }, 2500)
      return
    }

    if (device.active) {
      turnOff()

    } else {
      clearInterval(ctx.interval)
      clearInterval(tmp.persistantJbInterval)

      setMiningInterval(device, speed*device.ram/1000, speed)
      ctx.interval = setRunInterval(update, speed)
      tmp.persistantJbInterval = setRunInterval(persistCb, speed)
    }

    ctx.$('#enableMining').innerHTML = `${device.active ? 'Disable' : 'Enable'} Autominer`
  }

  if (ctx.$('#sendCrypto')) ctx.$('#sendCrypto').onclick = () => {
    if (!wifiAvailable) {
      setTimeout(() => {
        ctx.$('#mineError').innerHTML = `ERROR: DEVICE CANNOT CONNECT TO INTERNET`
      }, 2500)
      return
    }

    const amount = Number(ctx.$('#cryptoAmount').value)
    const recipient = ctx.$('#cryptoAddr').value.trim()

    ctx.state.cryptoBalances[device.wallet] = device.balance

    if (amount > device.balance || amount < 0 || !amount) {
      ctx.$('#sendError').innerHTML = 'Error: invalid ₢ amount'
      return
    } else if (!recipient) {
      ctx.$('#sendError').innerHTML = 'Error: Invalid Recipient'
    } else {
      ctx.$('#sendError').innerHTML = ''
    }

    ctx.sendCrypto(device.wallet, recipient, amount)

    // bleh lol
    device.balance -= amount

    ctx.setState({
      cryptoBalances: {
        ...ctx.state.cryptoBalances,
        [device.wallet]: device.balance
      }
    })

    ctx.$('#cryptoAmount').value = ''
    ctx.$('#cryptoAddr').value = ''
  }

  return turnOff
}
