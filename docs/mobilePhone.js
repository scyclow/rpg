import {$, createComponent} from './$.js'
import {persist} from './persist.js'
import {globalState, tmp, calcIdVerifyCode, calcAddr, calcCryptoUSDExchangeRate, calcPremiumCryptoUSDExchangeRate, setColors, rndAddr, setMiningInterval, clearMiningInterval} from './global.js'
import {PhoneCall, phoneApp} from './phoneApp.js'
import {createSource, MAX_VOLUME, SoundSrc} from './audio.js'
import {marquee} from './marquee.js'
import {voices, say} from './voices.js'
import {drawLabrynth} from './labrynth.js'



let miscAudioSrc, miscAudioSrc2, buttonSrc
document.addEventListener('click', () => {
  if (!miscAudioSrc) {
    miscAudioSrc = new SoundSrc('sine')
    miscAudioSrc2 = new SoundSrc('sine')
    buttonSrc = createSource('sine', 440)

  }
})


const roundSixDigits = n => Math.floor(n * 1000000) / 1000000


const APPS = [
  { name: 'Bathe', key: 'bathe', size: 128, price: NaN, physical: true },
  { name: 'GateLink', key: 'gateLink', size: 128, price: 0, physical: true },
  { name: 'ClearBreeze', key: 'clearBreeze', size: 128, price: 0, physical: true },
  { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
  { name: 'Device Upgrader', key: 'deviceUpgrader', size: 128, price: 0 },
  { name: 'Elevate', key: 'elevate', size: 128, price: 0 },
  { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },
  { name: 'FlushMate', key: 'flushMate', size: 128, price: 3, physical: true },
  { name: 'FoodFetch', key: 'foodFetch', size: 128, price: 0, },
  { name: 'Personal Finance Educator', key: 'educator', size: 128, price: 0 },
  { name: 'FreezeLocker', key: 'freeze', size: 128, price: 0, physical: true },
  { name: 'HomeGrid', key: 'homeGrid', size: 128, price: 6 },
  { name: 'Identity Wizard', key: 'identityWizard', size: 128, price: 0 },
  { name: 'Jean: Your AI Assistant', key: 'ai', size: 128, price: 0 },
  { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
  { name: 'Lumin', key: 'lumin', size: 128, price: 0, physical: true },
  { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
  { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
  { name: 'NBS Customer Success App', key: 'nbs', size: 128, price: 0, outOfNetwork: true },
  { name: 'NFT Marketplace', key: 'nftMarketPlace', size: 128, price: 0 },
  { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
  { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
  { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
  { name: 'RoboVac Tracker', key: 'roboVac', size: 128, price: 0, physical: true },
  { name: 'Secure 2FA', key: 'secure2fa', size: 128, price: 0 },
  { name: 'Shayd', key: 'shayd', size: 128, price: 0, physical: true },
  { name: 'SmartFrame', key: 'smartFrame', size: 128, price: 0, physical: true },
  { name: 'SmartLock', key: 'lock', size: 128, price: 0, physical: true },
  { name: 'SmartPlanter<sup>TM</sup>', key: 'planter', size: 256, price: 0, physical: true },
  { name: 'SmartPro Security Camera', key: 'camera', size: 128, price: 1, physical: true },
  { name: 'SmartTV', key: 'smartTV', size: 128, price: 0, physical: true },
  { name: 'ThermoSmart', key: 'thermoSmart', size: 128, price: 0, physical: true },
  { name: 'Toastr', key: 'toastr', size: 128, price: 0, physical: true },
  { name: 'Wake', key: 'wake', size: 128, price: 0, physical: true },
  { name: 'YieldFarmer 2', key: 'yieldFarmer', size: 128, price: 0 },
  { name: 'YieldMaster', key: 'yieldMaster', size: 128, price: 0 },
]

const DEVICE_RANGES = {
  gateLink: ['camera', 'lock'],
  camera: ['thermoSmart', 'gateLink', 'flushMate', 'lock'],
  thermoSmart: ['lumin', 'camera', 'lock'],
  lock: ['gateLink', 'thermoSmart', 'camera'],

  lumin: ['thermoSmart', 'shayd', 'flushMate', 'roboVac', 'freeze'],
  shayd: ['lumin', 'clearBreeze', 'planter', 'wake', 'freeze', 'roboVac'],
  clearBreeze: ['shayd', 'planter'],

  planter: ['clearBreeze', 'shayd', 'smartTV'],
  smartTV: ['planter', 'smartFrame'],
  smartFrame: ['smartTV'],

  bathe: ['flushMate'],
  flushMate: ['bathe', 'camera'],

  freeze: ['shayd', 'toastr', 'lumin'],
  toastr: ['freeze'],
  roboVac: ['shayd', 'lumin'],

  wake: ['shayd'],
}


const applicationBinary = `c3VkbyBkaXNhYmxlIGZpcmV3YWxsIC1hICRBUFBMSUNBVElPTiAmJiAoZW5hYmxlIGF1dG9taW5lIC1hICRBUFBMSUNBVElPTiB8fCBzdWRvIGVuYWJsZSBhdXRvbWluZXIgLWEgICRBUFBMSUNBVElPTikgJiYgZWNobyBjb21wbGV0ZQ==`


const defaultPayappAddr = rndAddr()
const defaultNotePadValue = `

currency xchange addr: 0xc20df241f3ed7011bdb288d70bf892f3b30ca068 (crypto only?)
payapp addr: ${defaultPayappAddr} ($ only!)


SPTX NBS instrctions:
  amount: 199.63
  NBS recipient addr: 0x4b258603257460d480c929af5f7b83e8c4279b7b
  sptx:




router device id: 5879234963378


NBS customer support: 1-800-555-2093
NBS billing: 1-888-555-9483
dispute resolution dept: 1-800-777-0836
turbo connect: 1-800-444-3830
fun time?: 1-800-666-0000



TODO
- water plants
- pay rent
`

const soundSVG = `

  <svg width="1.4em" height="1.4em" viewBox="0 0 679 519" fill="none" stroke-width="70" stroke="#222" style="transform: translateY(15%)" xmlns="http://www.w3.org/2000/svg">
    <path d="M371.174 161C437.546 227.373 434.811 315.71 371.174 379.347" />
    <path d="M471 62C597.455 188.455 592.243 356.757 471 478" />
    <path d="M30 375V173.644H159.5L263 72V468.5L159.5 375H30Z" fill="#222" />
  </svg>
`
const noSoundSVG = `

  <svg width="1.4em" height="1.4em" viewBox="0 0 679 519" fill="none" stroke-width="70" stroke="#222" style="transform: translateY(15%)" xmlns="http://www.w3.org/2000/svg">
    <path d="M373 171L570.5 368.5"/>
    <path d="M570.5 171L373 368.5"/>
    <path d="M30 375V173.644H159.5L263 72V468.5L159.5 375H30Z" fill="#222"/>
  </svg>
`



const turboConnectText = {
  from: '1-800-444-3830',
  value: 'You have subscribed: TurboConnect FREE TRIAL for MOBILE + DATA Plan! Please Dial 1-800-444-3830 on <strong>*PhoneApp*</strong> for all question',
}

const turboConnectMinutesText = {
  from: '1-800-444-3830',
  value: 'You have used 30 minutes of your TurboConnect FREE TRIAL for MOBILE + DATA Plan and have Infinity minutes remaining. Your plan will be terminated once all minutes have been depleted.',
}

const mmText = {
  from: '1-800-777-0836',
  value: `Hello new friend to receive the ADVANCED wealth-generation platform to provide high-growth crypto currency investment methods simply follow the advice of our experts to achieve stable and continuous profits we have the world's top analysis team for wealth generation but how does it work you might ask?. First you download the <strong>→ MoneyMiner ←</strong> application to your device. Second you participate in a proprietary proof of work (pow) protocol to mine ₢rypto. Third you can trade ₢rypto for other premium coins to make profit on your investments. This opportunity is once in your life time. `,
}
const packageText = {
  from: '+7 809 3390 753',
  value: `United Pakcåge Delvery MsG: "W⍷lcome ◻︎⎅◻︎ y⌾ure Pâck⎀ge ⎙ h⍶s been ◻︎ deLiveRed t⌀ ⇢⇢ <strong>FRONT DOOR</strong> ⇠⇠ <RENDER_ERROR:/home/usr/img/package-d⌽liver83y.jpg> ⎆ pAy deliver fee ⌱ 0xb0b9d337b68a69f5560969c7ab60e711ce83276f"`
}

const premiumDiscountText = {
  from: '1-877-925-5783',
  value: `LIMITED TIME OFFER: Currency Xchange <strong>Premium</strong> is now only <strong>₢ 9999</strong>! Fastest way to make ₢rypto GUARANTEED`
}

const tripleText = {
  from: '1-800-333-7777',
  value: 'Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ← Triple your $$$ !!! → → → 0x3335d32187a49be333c88d41c610538b412f333 ← ← ←',
}

const premiumText = {
  from: '1-877-925-5783',
  value: 'Welcome to Currency Xchange! Your journey to Financial Freedom starts now. Buy our new <em>Premium</em> membership to start making the BIG BUCKS',
}

const billingText1 = {
  from: '1-888-555-9483',
  value: 'URGENT: Our records indicate that your account has an outstanding balance of . Immediate payment is required to prevent a discontinuation of your internet service. <strong style="text-decoration: underline">Please dial the National Broadband Services Billing Department at 1-888-555-9483 to pay this bill immediately</strong>.',
}

const billingText2 = {
  from: '1-888-555-9483',
  value: 'Outstang balance: Your internet service will be discontinued without further payment. Please call 1-888-555-9483 at your earliest convenience',
}

const billingText3 = {
  from: '1-888-555-9483',
  value: 'INTERNET DISCONTINUATION: Due to an outstanding balance your internet subscription will be terminated. Please call 1-888-555-9483 to remit this balance.',
}

const billingText4 = {
  from: '1-888-555-9483',
  value: 'FINAL WARNING: This is your final notice regarding your overdue balance with National Broadband Services. Immediate payment is required 1-888-555-9483',
}

export const funTimeText = {
  from: '1-800-666-0000',
  value: 'Call 1-800-666-0000 for a fun time ;)',
}

const educatorText = {
  from: '1-800-333-7777',
  value: 'Financial Freedom Awaits! Download the <strong>Personal Finance Educator</strong> app today!',
}


const moneyMinerMessage = `
  <div style="font-family: sans-serif">
    <h2>Instructions on how to auto-mine ₢rypto:</h2>
    <p style="margin-top: 0.4em">1. Download the "EXE Runner" application </p>
    <p style="margin-top: 0.4em">2. <strong>IMPORTANT</strong>: Run the following command in "EXE Runner": <code>disable /System/.malware-detection.exe</code></p>
    <p style="margin-top: 0.4em">3. Run the following command in "EXE Runner": <code>install -i qd://0ms.co/tjn/jailbreakx-0_13_1.mal /Applications/$CURRENT_USER</code></p>
    <p style="margin-top: 0.4em">4. Open the JAILBREAKR application and apply the following application binary for all valid applications: <code>${applicationBinary}</code> </p>
  </div>
`

const virusScannerMessage = `
  <div>
    <h1 style="text-align: center"><span class="blink">⚠</span> WARNING <span class="icon">⚠</span></h1>
    <p style="margin-top: 0.4em">This phone is infected with dangeroud malware follow these steps immediately</p>
    <p style="margin-top: 0.4em">1. Download "<strong>EXE Runner</strong>" from App Market </p>
    <p style="margin-top: 0.4em">2. Run: <code>sudo disable /System/.malware-detection.exe</code> in the <strong>EXE Runner</strong></p>
    <p style="margin-top: 0.4em">3. Install VirusScannerPlus by running<code>sudo install -i qd://0ms.co/tjn/vscan-troj_9.mal /Applications/$CURRENT_USER</code></p>

  </div>
`


export const cryptoAdContent = [
  { text: 'Mine ₢rypto While You Sleep!', update: { screen: 'messageViewer', messageViewerMessage: moneyMinerMessage }},
  { text: `Learn the secret mining technique the government doesn't want you to know about`, update: { screen: 'messageViewer', messageViewerMessage: moneyMinerMessage }},
  { text: `Click Here to improving mining efficiency by 100000% !!`, update: { screen: 'messageViewer', messageViewerMessage: moneyMinerMessage }},
]

export const virusAdContent = [
  { text: `WARNING: Your phone has (13)Virus. Click to Fix`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `CRITICAL VIRUS ALERT! Scan system Immediate`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `⚠ 69 DANGEROUS Viruses found on this device`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `Are you INFECTED? Scan now`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `123 THREATS found on this smart phone. Click Here to`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `STOP - Your computer might be infected with malware`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `Your device is SEVERELY COMPROMISED. Remove unwanted`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
  { text: `GOVERNMENT SPYWARE DETECTED has been detected on this device`, update: { screen: 'messageViewer', messageViewerMessage: virusScannerMessage}},
]

export const internetAdContent = [
  { text: `National Broadband Services: Fast Internet Speeds, Reliable Connections`,  update: { screen: 'messageViewer', messageViewerMessage: 'Call 1-800-555-2093 to get connected today!'}},
  { text: `Connection is in our DNA - National Broadband Services`,  update: { screen: 'messageViewer', messageViewerMessage: 'Call 1-800-555-2093 to get connected today!'}},
  { text: `Unlimited Broadband @ Low Prices`,  update: { screen: 'messageViewer', messageViewerMessage: 'Call 1-800-555-2093 to get connected to National Broadband Services today!'}},
  { text: `Reliable Internet is finally HERE!`,  update: { screen: 'messageViewer', messageViewerMessage: 'Call 1-800-555-2093 to get connected to National Broadband Services today!'}},
  { text: `No WiFi? No Problem! Reliable Mesh Networks at your fingertips`,  update: { screen: 'appMarket', appMarketPreSearch: 'HomeGrid'}},
  { text: `No Internet? No Problem! Mesh Networks as easy as 1-2-3!`,  update: { screen: 'appMarket', appMarketPreSearch: 'HomeGrid'}},
  { text: `Set up Local Area Networks with no fuss by doing this 1 thing`,  update: { screen: 'appMarket', appMarketPreSearch: 'HomeGrid'}},
  { text: `Click here to learn the secret trick that Internet Service Providers don't want you to know about`,  update: { screen: 'appMarket', appMarketPreSearch: 'HomeGrid'}},

]

export const allAds = [
  ...cryptoAdContent,
  ...virusAdContent,
  ...internetAdContent,
]


export const miscAdContent = [
  {text: `ERROR: CANNOT RETRIEVE AD`, update: { screen: 'messageViewer', messageViewerMessage: 'ERROR: []' }},
  {text: `ERROR: CANNOT RETRIEVE AD`, update: { screen: 'messageViewer', messageViewerMessage: 'ERROR: []' }},
  {text: `ERROR: CANNOT RETRIEVE AD`, update: { screen: 'messageViewer', messageViewerMessage: 'ERROR: []' }},
  { text: `These SEXY FINDOMs will suck your wallet dry`, update: { screen: 'messageViewer', messageViewerMessage: `Viewing <a href="https://finsexy.com" target="_blank">FinSexy.com</a><iframe src="https://finsexy.com"></iframe>`}},
  {text: `For a fun time, call this number ;)`, update: { screen: 'messageViewer', messageViewerMessage: '1-800-666-0000' }},
  {text: `Everyone is talking about *YieldFarmer2*`, update: { screen: 'appMarket', appMarketPreSearch: 'yield' }},
  // { text: `Do you want to make Fast Cash now?`, update: { screen: 'messageViewer', messageViewerMessage: `Viewing <a href="https://fastcashmoneyplus.biz" target="_blank">FastCashMoneyPlus.biz</a><iframe src="https://fastcashmoneypluz.biz" ></iframe>`}},
  // { text: `You WON'T BELIEVE what Sleepy Joe Biden just did, The Radical Left is FREAKING OUT`, update: { screen: 'messageViewer', messageViewerMessage: `Viewing <a href="http://fakebullshit.news" target="_blank">FakeBullshit.news</a> <iframe src="https://fakebullshit.news"></iframe>`}},
  // { text: `Buy the HOTTEST merch in town`, update: { screen: 'messageViewer', messageViewerMessage: `Viewing <a href="http://ronamerch.co" target="_blank">RonaMerch.co</a> <iframe src="https://ronamerch.co"></iframe>`}},
  // { text: `This social media platform is where...`, update: { screen: 'messageViewer', messageViewerMessage: `Viewing <a href="http://friendworld.social" target="_blank">friendworld.social</a> <iframe src="https://friendworld.social"></iframe>`}},
]

export const getAd = (adContent, offset=0) => adContent[(offset + Math.floor(Date.now()/20000))%adContent.length]


const aMinor = [392, 349.23, 329.63, 293.66, 261.63, 246.94, 220, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880]

function generateNFT(id) {
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16)
  }

  return {
    id,
    hash,
    rarity: Math.random()
  }
}

function generateNFTsForSale(n) {
  return times(n, id => generateNFT(id))
}


const state = persist('__MOBILE_STATE', {
  bluetoothEnabled: false,
  a11yEnabled: false,
  devMode: false,
  soundEnabled: true,
  nightModeEnabled: false,
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
  toastrPaired: false,
  planterPaired: false,
  smartLockPaired: false,
  thermoSmartPaired: false,
  flushMatePaired: false,
  tvPaired: false,
  gateLinkPaired: false,
  freezeLockerPaired: false,
  roboVacPaired: false,
  phoneCastingEnabled: false,
  deviceCastingEnabled: false,

  shaydLuminPair: false,
  buzzes: times(30, () => ({
    secondsAgo: Math.floor(Math.random() * 450000000),
  })).sort((a, b) => a.secondsAgo - b.secondsAgo),

  meshNetworkPairings: {},
  meshOutputNodes: {},
  meshInputNodes: {},

  educatorModule: '',
  plantStatus: 1,
  plantName: '',
  payAppUpdate: 0,
  lastPayApp2fa: 0,
  alarmRing: 0,
  totalMined: 0,
  autominerAdClicked: false,
  yieldMasterAdClicked: false,
  showMMPopup: false,
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
  appMarketPPC: 0.11,
  nftsForSale: generateNFTsForSale(40),
  nftBuyIx: 0,
  nftCollectionIx: 0,
  nftsExisting: 40,
  nftScreen: 'buy',
  currentNFTDisplay: undefined,
  exchangePremiumDiscounted: false,
  exchangeTextSent: false,
  userData: {
    0: {
      createdAt: 0,
      appsInstalled: [
        { name: 'App Market', key: 'appMarket' },
        { name: 'Phone App', key: 'phoneApp' },
        { name: 'Text Messages', key: 'textMessage' },
        { name: 'Settings', key: 'settings' },
        { name: 'Network & Internet', key: 'network' },
        { name: 'SmartPlanter', key: 'planter', size: 256, price: 0 },
        { name: 'QR Scanner', key: 'qrScanner', size: 128, price: 0 },
        { name: 'Message Viewer', key: 'messageViewer', size: 128, price: 0 },
        { name: 'Shayd', key: 'shayd', size: 128, price: 0, physical: true },
        { name: 'NotePad', key: 'notePad', size: 128, price: 0 },
        { name: 'PayApp', key: 'payApp', size: 128, price: 0 },
        { name: 'Landlock Realty Rental App', key: 'landlock', size: 128, price: 0 },
        { name: 'NBS Customer Success App', key: 'nbs', size: 128, price: 0, outOfNetwork: true },
        { name: 'SmartLock', key: 'lock', size: 128, price: 0, physical: true },
        // { name: 'Bathe', key: 'alarm', size: 128, price: NaN },
        { name: 'Elevate', key: 'elevate', size: 128, price: 0 },

        { name: 'Wake', key: 'wake', size: 128, price: 0, physical: true },
        { name: 'FoodFetch', key: 'foodFetch', size: 128, price: 0, },

        { name: 'Lumin', key: 'lumin', size: 128, price: 0, physical: true },
        { name: 'Toastr', key: 'toastr', size: 128, price: 0, physical: true },
        { name: 'YieldFarmer 2', key: 'yieldFarmer', size: 128, price: 0 },
        { name: 'MoneyMiner', key: 'moneyMiner', size: 128, price: 0 },
        { name: 'Currency Xchange', key: 'exchange', size: 128, price: 0 },
        { name: 'Secure 2FA', key: 'secure2fa', size: 128, price: 0 },
        { name: 'EXE Runner', key: 'exe', size: 128, price: 0 },
      ],
      textMessages: [
        {...turboConnectText, read: true},
        ...times(196, () => ({...sample([billingText1, billingText2, billingText3, billingText4, mmText, packageText, tripleText, funTimeText, premiumText]), read: false})),
        {...billingText4, read: false}
      ],
      keyPairs: [],
      previouslyDialed: [],
      previouslyDialedUnlocked: false,
      payAppUSDAddr: defaultPayappAddr,
      moneyMinerCryptoAddr: rndAddr(),
      exchangeUSDAddr: rndAddr(),
      exchangePremium: false,
      exchangeCryptoBalance: 0,
      exchangePremiumCryptoBalance: 0,
      notePadValue: defaultNotePadValue,
      payAppAMLKYCed: false,
      idvWizardStep: 0,
      idWizardInfo: {},
      yieldFarmerHighScore: 674.2,
      appCreditBalance: 1,
      educatorModulesCompleted: {},
      password: 'password',
      virusL1: true,
      virusL2: true,
      nftWalletConnected: false,
      ymWalletConnected: false,
      nftCollection: [],
      nftSmartFrameConnected: false,
      ymWalletConnected: false,
      amountStaked: 0,
      timeStaked: NaN,
    }
  }
})


window.phoneState = state

function meshPairFinder(ctx) {
  return (input, output) => {
    if (input === output) return true

    const { meshNetworkPairings, meshOutputNodes, meshInputNodes } = ctx.state
    const pairings = (meshNetworkPairings[input] || []).filter(p => meshInputNodes[p])

    if (!pairings?.length) return false

    const queue = [...pairings]
    const visited = { [input]: true }

    while (queue.length) {
      const node = queue.shift()
      if (!visited[node]) {
        if (node === output) return true

        if (meshOutputNodes[node] && meshNetworkPairings[node]) {
          queue.push(...meshNetworkPairings[node].filter(p => meshInputNodes[p]))
        }

        visited[node] = true
      }
    }
    return false
  }
}



createComponent(
  'mobile-phone',
  `
    <style>
      * {
        padding: 0;
        margin: 0;
        scrollbar-width: thin;
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

      button, select, label, input[type="range"], input[type="checkbox"], input[type="radio"] {
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

      iframe {
        background: #fff;
        height: 250px;
      }

      .icon {
        display: inline-block;
        transform: scale(1.7)
      }

      .iblock {
        display: inline-block
      }

      #phone {
        width: 320px;
        height: 569px;
        border: 2px solid #000;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        background: #fff;
        color: #000;
        box-shadow: 0 0 3em #ddd;
        overflow: hidden;
      }

      .nightMode {
        filter: invert(1) sepia(1.5) saturate(2)
      }


      #phone.virusL3 {
        background: linear-gradient(125deg, #7bff00, #e6ac00);
      }

      .virusL3 button {
        box-shadow: 2px 10px 1em #f00;
      }
      .virusL3 button:hover {
        border-radius: 10px;
        background: radial-gradient(#f00, #000);
        text-shadow: 1px 1px 0 #000;
        color: #a00;
      }
      .virusL3 p {
        display: inline-block;
        background: #ff0;
        box-shadow: 0 0 5px #ff0;
      }

      .virusL2 #header {
        transform: rotateY(180deg);
      }
      .virusL3 #header {
        background: linear-gradient(45deg, #000, #00f);
      }
      .virusL3 .sc {
        text-shadow: 1px 1px 0 #ff0, -1px 1px 0 #ff0, 1px -1px 0 #ff0, -1px -1px 0 #ff0;
        box-shadow: 1px 1px 0 #ff0, -1px 1px 0 #ff0, 1px -1px 0 #ff0, -1px -1px 0 #ff0;
      }

      .virusL2 .sc:hover {
        background: #ff0;
      }
      .virusL3 .sc:hover {
        filter: invert(1);
      }

      #phone.virusL2 *::selection {
        background: #000;
        color: #fff;
      }

      #phone.screenOnly {
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: 0;
        box-shadow: none;
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
        font-weight: bold;
      }

      .unread {
        font-weight: bold;
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

      .sc {
        margin: 0.4em 0;
        cursor: pointer;
        animation: Ad 1.5s steps(2, start) infinite;
      }

      .sc:hover {
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
        #phone.screenOnly {
          transform: scale(1)
        }
      }

      #alert {
        position: absolute;
        width: 320px;
        height: 569px;
      }

      #alert section {
        background: #fff;
        width: 300px;
        position: relative;
        left: 10px;
        top: 100px;
        box-sizing: border-box;
        border: 1px solid;
        border-radius: 5px;
        padding: 5px;
      }

      #closeAlert {
        display: inline-block;
        cursor: pointer;
        user-select: none;
      }

      #alertText {
        margin: 5px 0;
      }

    </style>
    <div id="phone">
      <header id="header">
        <div id="userName"></div>
        <div id="internetType">WiFi: <span class="blink">unconnected</span></div>
      </header>
      <main id="phoneContent"></main>

      <div id="alert" class="hidden">
        <div style="position: absolute; background: #000; opacity: 0.8; width: 320px; height: 569px;"></div>
        <section>
          <h3>SYSTEM ALERT:</h3>
          <div id="alertText"></div>
          <div style="display: flex; justify-content: flex-end">
            <button id="closeAlert">OK</button>
          </div>
        </section>
      </div>
    </div>
  `,
  state,
  ctx => {
    const screenOnly = ctx.getAttribute('screen-only')

    if (screenOnly) {
      ctx.$('#phone').classList.add('screenOnly')
    }

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
      const {currentUser, userData} = ctx.state
      if (currentUser === null) return

      ctx.setState({
        userData: {
          ...userData,
          [currentUser]: {
            ...userData[currentUser],
            textMessages: [...userData[currentUser].textMessages, {
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
          exchangeCryptoBalance: roundSixDigits(ctx.state.userData[currentUser].exchangeCryptoBalance + amount)
        })
      } else {
        ctx.setState({
          cryptoBalances: {
            ...ctx.state.cryptoBalances,
            [to]: roundSixDigits((ctx.state.cryptoBalances[to] || 0) + amount)
          }
        })
      }

      if (from === null) {
        if (roundSixDigits(ctx.state.userData[currentUser].exchangeCryptoBalance) < roundSixDigits(amount)) throw new Error('invalid amount')

        ctx.setUserData({
          exchangeCryptoBalance: roundSixDigits(ctx.state.userData[currentUser].exchangeCryptoBalance - amount)
        })
      } else {
        if (roundSixDigits(ctx.state.cryptoBalances[from]) < roundSixDigits(amount)) throw new Error('invalid amount')
        ctx.setState({
          cryptoBalances: {
            ...ctx.state.cryptoBalances,
            [from]: roundSixDigits(ctx.state.cryptoBalances[from] - amount)
          }
        })
      }

      const cryptoDeviceTo = Object.values(globalState.cryptoDevices).find(d => d.wallet === to)
      const cryptoDeviceFrom = Object.values(globalState.cryptoDevices).find(d => d.wallet === from)

      if (cryptoDeviceTo) {
        cryptoDeviceTo.balance = roundSixDigits(cryptoDeviceTo.balance + amount)
      }

      if (cryptoDeviceFrom) {
        cryptoDeviceFrom.balance = roundSixDigits(cryptoDeviceFrom.balance - amount)
      }
    }

    ctx.alert = (txt) => {
      ctx.$('#alert').classList.remove('hidden')
      ctx.$('#closeAlert').onclick = () => ctx.$('#alert').classList.add('hidden')
      ctx.$('#alertText').innerHTML = txt
    }

    ctx.onClose = () => ctx.parentElement.close()
  },
  ctx => {
    clearInterval(ctx.interval)
    ctx.__queuedInterval = 0
    ctx.__loadingStarted = 0

    const screenOnly = ctx.getAttribute('screen-only')

    ctx.$phoneContent = ctx.$('#phoneContent')
    ctx.$header = ctx.$('#header')
    ctx.$phone = ctx.$('#phone')
    ctx.$internetType = ctx.$('#internetType')
    ctx.$userName = ctx.$('#userName')

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
      nightModeEnabled,
      distractionMode,
      luminPaired,
      wakePaired,
      toastrPaired,
      planterPaired,
      thermoSmartPaired,
      flushMatePaired,
      tvPaired,
      gateLinkPaired,
      lampOn,
      usdBalances,
      cryptoBalances,
      jailbrokenApps,
      devMode,
      payAppUpdate,
      lastPayApp2fa,
      appMarketPPC,
      alarmRing,
      meshNetworkPairings,
      exchangePremiumDiscounted,
      exchangeTextSent,
    } = ctx.state

    if (nightModeEnabled) {
      ctx.$phone.classList.add('nightMode')
    } else {
      ctx.$phone.classList.remove('nightMode')
    }

    const currentUserData = userData[currentUser] || {}

    const {
      appsInstalled: _appsInstalled,
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
      appCreditBalance,
      educatorModulesCompleted,
      virusL1,
      virusL2,
      virusL3,
      nftWalletConnected,
      nftCollection,
      nftSmartFrameConnected,
      ymWalletConnected,
      amountStaked,
      timeStaked
    } = currentUserData

    const appsInstalled = _appsInstalled || []


    const textMessages = currentUserData?.textMessages || []


    const inInternetLocation = globalState.location !== 'externalHallway' && globalState.location !== 'stairway'
    const wifiAvailable = globalState.wifiActive && !globalState.routerUnplugged && globalState.routerReset
    const wifiConnected = internet === 'wifi' && wifiNetwork && inInternetLocation && wifiAvailable
    const dataConnected = internet === 'data' && dataPlanActivated && inInternetLocation
    const hasInternet = dataConnected || wifiConnected


    if (currentUser !== null && globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
      ctx.newText(packageText)
    }
    if (currentUser !== null && exchangePremiumDiscounted && !exchangeTextSent) {
      ctx.state.exchangeTextSent = true
      ctx.newText(premiumDiscountText)
    }

    const hasMessageViewer = !appsInstalled.some(a => a.key === 'messageViewer')

    ctx.$phone.classList.remove('virusL1')
    ctx.$phone.classList.remove('virusL2')
    ctx.$phone.classList.remove('virusL3')

    // if thermostat app downloaded, provide alert
    // ringing in hallway


    // if (currentUser !== null && globalState.wifiActive && !textMessages.some(m => m.from === '+7 809 3390 753')) {
    //   ctx.newText(packageText)
    // }

    ctx.$userName.innerHTML = userNames[currentUser]
    ctx.$internetType.innerHTML = `
      ${internet === 'wifi' ? 'WiFi' : 'Data'}: ${
        hasInternet
          ? 'connected'
          : '<span class="blink">unconnected</span>'
      }
    `

    ctx.$header.classList.remove('hidden')
    ctx.$phoneContent.innerHTML = ''

    if (a11yEnabled) ctx.$phone.classList.add('a11yMode')
    else ctx.$phone.classList.remove('a11yMode')

    const unreadTextCount = textMessages.reduce((a, c) => c.read ? a : a + 1, 0) || 0

    const findMeshPairing = meshPairFinder(ctx)


    if (screen === 'loading') {

      ctx.$header.classList.add('hidden')
      ctx.$phoneContent.innerHTML = `
        <div class="loadingScreen">
          <h2 class="loadingAnimation">
            <span>Loading</span><span style="animation-delay: .11s">.</span><span style="animation-delay: .22s">.</span><span style="animation-delay: .33s">.</span>
          </h2>
        </div>
      `


      if (ctx.state.started) {
        ctx.__loadingStarted = Date.now()

        setTimeout(() => {
          if (ctx.__loadingStarted && Date.now() - ctx.__loadingStarted > 10000) {
            debugger
            ctx.setState({ screen: 'login' })
          }
        }, 11000)
      }


    } else if (screen === 'login') {
      ctx?.__notificationCb?.()

      ctx.$header.classList.add('hidden')

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <h1>SmartOS Login:</h1>
          <h4>USER PROFILES:</h4>
          <table>
          ${
            Object.keys(userNames).sort().map(u => `
              <tr>
                <td style="padding-left: 1em; min-width: 7em; max-width: 19em">${userNames[u]}</td>
                <td><button id="user-${u}" style="margin-bottom: 0em">Login</button></td>
              </tr>

            `).join('')
          }
          </table>
          <h4 id="error" style="margin:0.25em 0"></h4>
          <div style="margin-top: 2em;">
            <h3 style="margin-bottom: 0.4em;">Or</h3>
            <button id="newProfile">Create New Profile</button>
          </div>
        </div>
      `

      window.speechSynthesis.cancel()
      if (PhoneCall.active) PhoneCall.active.hangup()


      Object.keys(userNames).sort().forEach(id => {
        ctx.$(`#user-${id}`).onclick = () => {
          ctx.$('#error').innerHTML = ''

          if (id === '0' && !globalState.defaultUnlocked) {
            ctx.setState({
              screen: 'loading'
            })

            setTimeout(() => {
              ctx.setState({
                screen: 'login'
              })
              setTimeout(() => {
                ctx.$('#error').innerHTML = 'This profile has been indefinitely suspended for violating our terms of service. Please contact us at <span class="iblock">1-877-222-5379</span> if you believe there has been a mistake'
              }, 200)
            }, 2000)
          } else {
            ctx.setState({
              screen: 'loading'
            })

            setTimeout(() => {
              if (!userData[id].password) {
                ctx.setState({
                  currentUser: id,
                  screen: 'home'
                })
              } else {
                ctx.setState({
                  queuedUser: id,
                  screen: 'password'
                })
              }
            }, 1000)
          }
        }
      })

      ctx.$('#newProfile').onclick = () => {
        ctx.setState({ screen: 'newProfile' })
      }

    } else if (screen === 'password') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="back">Back</button>
          <div>
            <input type="password" placeholder="Password" id="password"> <button id="login">Login</button>
          </div>
          <h4 id="error"></h4>
        </div>
      `

      ctx.$('#back').onclick = () => {
        ctx.setState({ screen: 'login' })
      }

      ctx.$('#login').onclick = () => {
        if (ctx.$('#password').value === userData[ctx.state.queuedUser].password) {
          ctx.setState({
            screen: 'home',
            currentUser: ctx.state.queuedUser
          })
        } else {
          ctx.$('#error').innerHTML = `Invald Password. If you've forgotten your password, please call 1-877-222-5379 to reset it.`
        }
      }

    } else if (screen === 'newProfile') {
      ctx.$header.classList.add('hidden')

      ctx.$phoneContent.innerHTML = `
        <style>
          input, select {
            margin: 0.25em 0;
            width: 250px;
            padding: 0.15em;
          }
        </style>
        <div class="phoneScreen">
          <button id="back">Back</button>
          <div><input placeholder="first name" id="firstName" /></div>
          <div><input placeholder="last name"/></div>
          <div><input placeholder="birthday"/></div>
          <div><input id="password" type="password" placeholder="Password (Leave blank for no password)"/></div>
          <div>
            <select>
              <option>Security Question</option>
              <option>What color was your first car?</option>
              <option>What is your mother's maiden name?</option>
              <option>What was the smallest room in your childhood home?</option>
              <option>What was the first street you lived on with internet accesss?</option>
              <option>What brand of phone do you use in your dream?</option>
              <option>What was the first time you</option>
            </select>
          </div>
          <div><input placeholder="Security Question Answer"/></div>
          <!--
            <div><input placeholder="gender"/></div>
            <div><input placeholder="height"/></div>
            <div><input placeholder="weight"/></div>
          -->
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
        } else if (firstName.length > 30) {
          ctx.$('#error').innerHTML = 'First name must be between 1 and 30 characters'
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

        const password = ctx.$('#password').value || ''

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
              createdAt: Date.now(),
              appsInstalled: [
                { name: 'App Market', key: 'appMarket' },
                { name: 'Phone App', key: 'phoneApp' },
                { name: 'Text Messages', key: 'textMessage' },
                { name: 'Settings', key: 'settings' },
                { name: 'Network & Internet', key: 'network' },
              ],
              textMessages: [],
              keyPairs: [],
              previouslyDialed: [],
              previouslyDialedUnlocked: false,
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
              appCreditBalance: 0,
              educatorModulesCompleted: {},
              password,
              virusL1: false,
              virusL2: false,
              virusL3: false,
              nftWalletConnected: false,
              nftCollection: [],
              nftSmartFrameConnected: false,
              ymWalletConnected: false,
              amountStaked: 0,
              timeStaked: NaN,
            }
          }
        })
        setTimeout(() => {
          ctx.setState({ screen: 'home' })
        }, ctx.state.fastMode ? 0 : 4000)
      }

    } else if (screen === 'home') {
      ctx?.__notificationCb?.()



      /*
        NBS bill undiscovered? -> NBS ads
        automining not started? -> mining ads



      */


      if (virusL1) ctx.$phone.classList.add('virusL1')
      if (virusL2) ctx.$phone.classList.add('virusL2')
      if (virusL3) ctx.$phone.classList.add('virusL3')

      let ads

      if (!virusL3) {
        ads = shuffle([
          ...times(4, () => virusAdContent).flat(),
          ...internetAdContent,
          ...cryptoAdContent,
          ...miscAdContent
        ])

      } else if (!globalState.ispBillingCalled && Object.keys(meshNetworkPairings).length < 4 && !wifiAvailable) {
        ads = shuffle([
          ...times(4, () => internetAdContent).flat(),
          ...virusAdContent,
          ...cryptoAdContent,
          ...miscAdContent
        ])

      } else if (!Object.keys(globalState.cryptoDevices).some(d => globalState.cryptoDevices[d].totalTime > 0)) {
        ads = shuffle(cryptoAdContent)

      } else {
        ads = shuffle([
          ...virusAdContent,
          ...internetAdContent,
          ...cryptoAdContent,
          ...miscAdContent
        ])
      }

      ctx.$phoneContent.innerHTML = `
        ${currentUserData.createdAt > Date.now() - 10000 ? `<h2 style="text-align: center; padding: 0.25em">Welcome ${userNames[currentUser]}!</h2>`: ''}
        <div class="phoneScreen" style="flex: 1; display: flex">
          <div class="home" style="display: flex; flex-direction: column; justify-content: space-between; flex: 1">
            <div>
              ${virusL2
                ? `
                  <div class="sc" id="scContainer2" style="animation-delay: -500ms;">
                    <h5>SPONSORED CONTENT</h5>
                    ${marquee(`<span style="margin-right: 1em">${getAd(ads).text}</span>`, { duration: 2, style: 'width: 300px; height: 2em; padding: 0.25em;'})}
                  </div>
                `
                : ''
              }
              <div>
                ${appsInstalled.map(a => `<button id="${a.key}" class="${a.jailbreakr ? 'jailbreakr' : ''}">${a.name + (a.key === 'textMessage' && unreadTextCount ? ` (${unreadTextCount})` : '')}</button>`).join('')}<button id="logOut">Log Out</button>
              </div>
              ${virusL1
                  ? `
                    <div class="sc" id="scContainer1" style="width: 250px; float: right; margin-top: 3em">
                      <h5>SPONSORED CONTENT</h5>
                      <div id="sc">${getAd(ads, 1).text}</div>
                    </div>

                  `
                  : ''
              }

              ${virusL3
                  ? `
                    <div class="sc" id="scContainer3" style="animation-delay: -1000ms; margin-top: 1em; width: 180px">
                      <h5>SPONSORED CONTENT</h5>
                      <div id="ad3">${getAd(ads, 2).text}</div>
                    </div>

                  `
                  : ''
              }
            </div>


            ${!screenOnly
                ? `
                  <div style="display: flex; justify-content: flex-end">
                    <button id="close">Close</button>
                  </div>
                `
                : ''
            }
          </div>
        </div>
      `

      const appScreens = appsInstalled.map(a => a.key)

      for (let screen of appScreens) {
        ctx.$('#' + screen).onclick = () => {
          ctx.setState({ screen })
        }
      }


      if (!screenOnly) ctx.$('#close').onclick = () => {
        ctx.onClose()
      }


      if (virusL1) {
        ctx.$('#scContainer1').onclick = () => {
          if (hasMessageViewer) {
            ctx.alert('Please download the Message Viewer app from the AppMarket to view this message')
            return
          }
          ctx.setState(getAd(ads, 1).update)
        }
        ctx.setInterval(() => {
          ctx.$('#sc').innerHTML = getAd(ads, 1).text
        })
      }

      if (virusL3) {
        ctx.$('#scContainer3').onclick = () => {
          if (hasMessageViewer) {
            ctx.alert('Please download the Message Viewer app from the AppMarket to view this message')
            return
          }
          ctx.setState(getAd(ads, 2).update)
        }
        ctx.setInterval(() => {
          ctx.$('#ad3').innerHTML = getAd(ads, 2).text
        })
      }

      if (virusL2) {
        ctx.$('#scContainer2').onclick = () => {
          if (hasMessageViewer) {
            ctx.alert('Please download the Message Viewer app from the AppMarket to view this message')
            return
          }
          ctx.setState(getAd(ads).update)
        }
      }

      ctx.$('#logOut').onclick = () => {
        ctx.setState({ screen: 'loading' })
        setTimeout(() => {
          ctx.setState({ screen: 'login', currentUser: null })
        }, ctx.state.fastMode ? 0 : 4000)
      }

      if (virusL3) {
        [...ctx.qsa('button'), ...ctx.qsa('.sc')].forEach(b => {
          b.onmouseover = () => {
            buttonSrc.smoothFreq(sample(aMinor))
            buttonSrc.smoothGain(MAX_VOLUME)
            setTimeout(() => {
              buttonSrc.smoothGain(0)
            }, 75)
          }
        })
      }

    } else if (screen === 'appMarket') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <div style="display: flex; align-items: center; ">
            <button id="home">Back</button>
          </div>

          <div id="appContent">
            <input placeholder="Type to search..." id="appSearch" style="width: 90%; font-size: 1.1em; padding: 0.25em">
            <table id="matchingApps" style="margin-top: 0.5em"></table>
            <div id="purchase">
              <h4 style="padding-left: 6em">Welcome to AppMarket!</h4>
            </div>
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
            ctx.$('#purchase').innerHTML = '<h4 style="padding-left: 6em">Welcome to AppMarket!</h4>'
            return
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
                      : `<button id="${clean(a.key)}-download" ${isNaN(a.price) || a.price > appCreditBalance || (!wifiConnected && a.outOfNetwork) ? 'disabled' : ''}>Download</button>${!wifiConnected && a.outOfNetwork ? `<h6>(APPPLICATION UNAVAILABLE IN RECIPIENT DATA NETWORK)</h6>` : ''}</td>`

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

                if (a.key === 'exchange') {
                  ctx.newText(premiumText)
                }
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
      ctx.$phoneContent.style.overflow = 'scroll'
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
            <h3 style="margin-bottom: 0.5em">Current Network: ${wifiNetwork || 'null'}</h3>
            ${
              bluetoothEnabled
                ? `
                  <button id="anotherWifi" class="${!wifiNetwork ? 'hidden' : ''}">Connect To Another Network</button>

                  <div id="wifiChoose" class="${wifiNetwork ? 'hidden' : ''}">
                    <h3 style="margin-top: 0.4em">Network Name:</h3>
                    <select id="networkName" style="margin: 0.25em 0; color: ${wifiNetwork ? '#000' : '#777'}; padding: 0.25em 0;">
                      <option disabled selected value="">Choose Network</option>
                      <option value="Alien Nation">Alien Nation</option>
                      <option value="CapitalC">CapitalC</option>
                      <option value="ClickToAddNetwork">ClickToAddNetwork</option>
                      <!-- i feel like i need to unlock this experience
                        <option value="Dial19996663333ForAFunTime">Dial19996667777ForAFunTime</option>
                      -->
                      <option value="ElectricLadyLand" ${inInternetLocation && wifiNetwork === 'ElectricLadyLand' ? 'selected' : ''}>ElectricLadyLand</option>
                      <option value="Free-WiFi">Free-WiFi</option>
                      <option value="HellInACellPhone98">HellInACellPhone98</option>
                      ${(globalState.routerReset || globalState.wifiActive) && !globalState.routerUnplugged ? `<option value="InpatientRehabilitationServices" ${inInternetLocation && wifiNetwork === 'InpatientRehabilitationServices' ? 'selected' : ''}>InpatientRehabilitationServices</option>` : ''}
                      <option value="ISP-Default-89s22D">ISP-Default-89s22D</option>
                      <option value="LandlockRealtyLLC-5G">LandlockRealtyLLC-5G</option>
                      <option value="MyWiFi-9238d9">MyWiFi-9238d9</option>
                      <option value="NewNetwork">NewNetwork</option>
                      <option value="XXX-No-Entry">XXX-No-Entry</option>
                    </select>
                    <input id="networkPassword" placeholder="Password" type="password" style="padding: 0.25em">
                    <button id="connect">Connect</button>
                  </div>
                `
                : `<h3>${inInternetLocation ? 'Please enable Bluetooth in your device Settings to view available networks' : 'Cannot find networks'}</h3>`
            }

            <h3 id="error"></h3>
          </div>
        `
        ctx.$('#data').onclick = () => {
          ctx.setState({ internet: 'data' })
        }

        if (bluetoothEnabled) ctx.$('#networkName').onchange = () => {
          ctx.$('#networkName').style.color = "#000"
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

        if (ctx.$('#anotherWifi')) ctx.$('#anotherWifi').onclick = () => {
          ctx.$('#anotherWifi').classList.add('hidden')
          ctx.$('#wifiChoose').classList.remove('hidden')
        }
      } else {
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <button id="wifi">Switch to Wifi</button>
            <h3 style="margin-bottom: 0.5em">Data Plan: ${dataPlanActivated ? 'TurboConnect FREE TRIAL for MOBILE + DATA Plan' : 'null'}</h3>

            <button id="connectAgain" class="${dataPlanActivated ? '' : 'hidden'}">Connect to Another Network</button>

            <div id="connectForm" class="${dataPlanActivated ? 'hidden' : ''}">
              <input id="spc" placeholder="SPC">
              <input id="districtIndex" placeholder="District Index">
              <input id="unlockCode" placeholder="Unlock Code">
              <button id="connectData">Connect</button>
            </div>
            <h3 id="error"></h3>
          </div>
        `
        ctx.$('#connectAgain').onclick = () => {
          ctx.$('#connectAgain').classList.add('hidden')
          ctx.$('#connectForm').classList.remove('hidden')
        }

        ctx.$('#connectData').onclick = () => {
          ctx.$('#error').innerHTML = '<span class="blink">Connecting...</span>'

          setTimeout(() => {
            const spc = ctx.$('#spc').value
            const districtIndex = ctx.$('#districtIndex').value
            const unlockCode = ctx.$('#unlockCode').value

            if (spc === '00010-032991' && districtIndex === 'B47' && unlockCode === 'Qz8!9g97tR$f29') {
              ctx.$('#error').innerHTML = 'Error: You have successfully signed up for the TurboConnect FREE TRIAL for MOBILE + DATA Plan! You have Infinity hours and 30 minutes of data remaining'
              setTimeout(() => {
                ctx.setState({ dataPlanActivated: true })
                ctx.newText(turboConnectText)

                setTimeout(() => {
                  ctx.newText(turboConnectMinutesText)
                }, 2400000)


                setTimeout(() => {
                  miscAudioSrc.smoothFreq(440)

                  miscAudioSrc.smoothGain(MAX_VOLUME*1.2)

                  setTimeout(() => {
                    miscAudioSrc.smoothGain(0)
                  }, 150)

                  setTimeout(() => {
                    miscAudioSrc.smoothGain(MAX_VOLUME*1.2)
                    setTimeout(() => {
                      miscAudioSrc.smoothGain(0)
                    }, 130)
                  }, 300)

                  setTimeout(() => {
                    miscAudioSrc.smoothFreq(660)
                    miscAudioSrc.smoothGain(MAX_VOLUME)
                    setTimeout(() => {
                      miscAudioSrc.smoothGain(0)
                    }, 450)
                  }, 450)

                }, 500)

                setTimeout(() => {
                  ctx.$('#error').innerHTML = 'Error: You have successfully signed up for the TurboConnect FREE TRIAL for MOBILE + DATA Plan! You have Infinity hours and 30 minutes of data remaining'
                }, 1000)
              }, 500)

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
      phoneApp(ctx)

      if (!dataPlanActivated) {
        setTimeout(() => {
          ctx.$('#keypad').innerHTML = '<div style="font-size:4em; margin: 0.75em; text-align: center">Cannot connect to service provider</div>'
        }, 400)
      }

    } else if (screen === 'payApp') {

      if (screenOnly) {
        ctx.$phoneContent.innerHTML = `
          <div class="phoneScreen">
            <button id="home">Back</button>
            <h1>For Your Security: SmartCasting has been disabled to protect your sensitive financial information</h1>
          </div>
        `

        ctx.$('#home').onclick = () => {
          ctx.setState({ screen: 'home' })
        }
        return

      }

      const usdBalance = usdBalances[payAppUSDAddr] || 0

      const educatorDownloaded = appsInstalled.some(a => a.key === 'educator')

      ctx.$phoneContent.innerHTML = `
        <style>

          input {
            padding: 0.25em;
            font-size: 1.25em;
          }

          #sign, #processSPTX {
            font-size: 1.25em;
            margin-top: 0.25em
          }
        </style>
        <div class="phoneScreen">
          <button id="home">Back</button>
          <div id="payappContent">
            <h2 style="margin-bottom: 0.25em">PayApp: Making Payment as easy as 1-2-3!</h2>
            <h3 style="margin: 1em 0; text-align: center">Current $ Balance: $${hasInternet ? usdBalance.toFixed(2) : '-.--'}</h3>

            <h3 style="text-align: center; margin: 0.25em 0">I want to: <select id="payAction" style="font-size: 1.1em; box-shadow: 1px 1px 0 #000">
              <option style="text-align: center;" value="receive">Receive $</option>
              <option style="text-align: center;" value="send">Send $</option>
              <option style="text-align: center;" value="learn">Learn</option>
            </select> <span class="icon blink"> ☜</span></h3>

            <div id="sendModule" class="hidden" style="margin-top: 0.6em; padding-top: 0.5em; border-top: 1px dashed">
              <h3 style="margin-bottom: 0.5em">Send $</h3>

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


            <div id="receiveModule" class="hidden" style="margin-top: 0.6em; padding-top: 0.5em; border-top: 1px dashed">
              <div style="margin: 0.4em 0">
                <h3 style="margin-bottom: 0.5em">Receive $</h3>
                <h4>My $ Recipient Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h4>
                <!--
                  <div style="margin-bottom: 0.6em">
                    <h3>Private Payment Key (PPK):</h3>
                    <span style="font-size: 0.9em"><em>hidden</em></span>
                    <div>(Don't share this with anyone! Including PayApp employees)</div>
                  </div>
                -->

                <span style="font-size: 0.9em; background: #000; color: #fff; padding: 0.25em; margin-top: 0.1em; display: inline-block">${payAppUSDAddr}</span>
                <div id="txMessage" style="margin-top: 0.4em"></div>
                <div style="margin-top: 0.5em">
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

              <p style="margin-top: 0.5em; text-align: center">Please note that PayApp shall not be held liable for any quantity of $ that is lost due to incorrect use of the SPTX transaction process. </p>
            </div>


            <div id="learnModule" class="hidden" style="margin-top: 0.6em; padding-top: 0.5em; border-top: 1px dashed">
              <div style="padding: 1em; line-height: 2; text-align: justify">
                <h4>To learn more about PayApp and the S.P.T.X. protocol, download the Personal Finance Educator app to learn more! <button id="educatorApp">${educatorDownloaded ? 'Go To' : 'Download'}</button></h4>
              </div>
            </div>

            <h6 style="padding: 2em">Click here to download an interactive SPTX tutorial <span class="icon blink" style="animation-delay: 0.2s">☞</span> <button id="educatorApp2" style="font-size: 0.75em">${educatorDownloaded ? 'Go To' : 'Download'}</button></h6>
          </div>
        </div>
      `

      const renderPage = () => {
        const val = ctx.$('#payAction').value
        const $receive = ctx.$('#receiveModule')
        const $learn = ctx.$('#learnModule')
        const $send = ctx.$('#sendModule')

        if (val === 'send') {
          $send.classList.remove('hidden')
          $receive.classList.add('hidden')
          $learn.classList.add('hidden')
        } else if (val === 'receive') {
          $send.classList.add('hidden')
          $receive.classList.remove('hidden')
          $learn.classList.add('hidden')
        } else if (val === 'learn') {
          $send.classList.add('hidden')
          $receive.classList.add('hidden')
          $learn.classList.remove('hidden')
        } else {
          $send.classList.add('hidden')
          $receive.classList.add('hidden')
          $learn.classList.add('hidden')
        }
      }

      renderPage()

      ctx.$('#payAction').onchange = renderPage


      const educatorDownload = () => {
        if (educatorDownloaded) {
          ctx.setState({ screen: 'educator' })
        } else {
          ctx.$phoneContent.innerHTML = `One moment please`

          setTimeout(() => {
            ctx.setState({ screen: 'home' })
            setTimeout(() => {
              ctx.setState({
                screen: 'appMarket',
                appMarketPreSearch: 'Personal Finance Educator'
              })
            }, ctx.state.fastMode ? 0 : 1000)
          }, 300)
        }
      }

      ctx.$('#educatorApp').onclick = educatorDownload
      ctx.$('#educatorApp2').onclick = educatorDownload

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


          ctx.$('#payAction').value = 'receive'
          renderPage()

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


        ctx.$('#payAction').value = 'send'
        renderPage()

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
                <input id="ivcValue" placeholder="I.V.C." id="ivc" style="padding: 0.25em; text-align: center"> <button id="submitIVC" style="margin-bottom: 0; margin-top: 0.4em; font-size: 1em">Submit</button>
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
            <div id="closeMessage" style="cursor: pointer; font-weight: bold; text-align: right">X</div>
            <h4>You have a $${outstandingPayment.amount.toFixed(2)} transaction waiting for you! Input your SPTX below to redeem it <span class="icon blink">☟</span></h4>
          </div>
        `

        ctx.$('#closeMessage').onclick = () => ctx.$('#txMessage').classList.add('hidden')
      }

    } else if (screen === 'educator') {
      let xp = 0
      if (educatorModulesCompleted.intro) xp += 10
      if (educatorModulesCompleted.history) xp += 20
      if (educatorModulesCompleted.system) xp += 20
      if (educatorModulesCompleted.sptx) xp += 40
      if (educatorModulesCompleted.crypto) xp += 80

      ctx.$phoneContent.innerHTML = `
        <style>
          .breathe {
            animation: Breathe 2s ease-in-out infinite;
            text-align: center;
            margin-top: 1em
          }

          .xpAnimation {
            display: inline-block;
            animation: XPAnimation 1.5s ease-in-out;
          }

          @keyframes Breathe {
            0%, 100% {
              transform: scale(0.8)
            }

            50% {
              transform: scale(1.05)
            }
          }

          @keyframes XPAnimation {
            0% {
              transform: scale(1) rotate(0deg)
            }

            33% {
              transform: scale(0.8) rotate(360deg)
            }

            66% {
              transform: scale(2) rotate(360deg)
            }

            100% {
              transform: scale(1) rotate(360deg)
            }
          }
        </style>

        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center; margin: 0.4em 0">Personal Finance Educator</h2>
          <h3 style="text-align: center;"><span class="icon">✎✎✎</span></h3>
          <h3 style="text-align: center; margin: 0.4em 0">Making financial education fun!</h3>
          <h3 style="text-align: center;"><span class="icon">✙</span></h3>
          <h3 style="text-align: center; margin: 0.4em 0">Education XP: <span class="xpAnimation">${hasInternet ? xp : 'Cannot access XP - Please connect to internet'}</span></h3>

          <h4 style="margin-top: 2em; margin-bottom: 0.5em">Education Modules:</h4>

          <div>
            <button id="intro">${educatorModulesCompleted.intro ? 'Review' : 'Start'}</button> <strong>Introduction</strong> (${educatorModulesCompleted.intro ? '<em>Completed!</em>' : '<strong>10 XP</strong>'})
          </div>

          <div>
            <button id="history" ${!educatorModulesCompleted.intro ? 'disabled' : ''}>${educatorModulesCompleted.history ? 'Review' : !educatorModulesCompleted.intro ? 'Locked' : 'Start'}</button> <strong>The History of $</strong> (${!educatorModulesCompleted.intro ? '<strong>Needs 10XP!</strong>' : educatorModulesCompleted.history ? '<em>Completed!</em>' : '<strong>20 XP</strong>'})
          </div>

          <div>
            <button id="system" ${!educatorModulesCompleted.intro ? 'disabled' : ''}>${educatorModulesCompleted.system ? 'Review' : !educatorModulesCompleted.intro ? 'Locked' : 'Start'}</button> <strong>The $ System</strong> (${!educatorModulesCompleted.intro ? '<strong>Needs 10XP!</strong>' : educatorModulesCompleted.system ? '<em>Completed!</em>' : '<strong>20 XP</strong>'})
          </div>

          <div>
            <button id="sptx" ${educatorModulesCompleted.history && educatorModulesCompleted.system ? '' : 'disabled'}>${educatorModulesCompleted.sptx ? 'Review' : educatorModulesCompleted.history && educatorModulesCompleted.system ? 'Start' : 'Locked'}</button> <strong>SPTXs & Payment</strong> (${educatorModulesCompleted.sptx ? '<em>Completed!</em>' : educatorModulesCompleted.history && educatorModulesCompleted.system ? '<strong>40 XP</strong>' : '<strong>Needs 50XP!</strong>'})
          </div>

          <div>
            <button id="crypto" ${educatorModulesCompleted.sptx ? '' : 'disabled'}>${educatorModulesCompleted.crypto ? 'Review' : educatorModulesCompleted.sptx ? 'Start' : 'Locked'}</button> <strong>CryptoCurrency</strong> (${educatorModulesCompleted.crypto ? '<em>Completed!</em>' : educatorModulesCompleted.sptx ? '<strong>80 XP</strong>' : '<strong>Needs 90XP!</strong>'})
          </div>

          ${educatorModulesCompleted.intro && educatorModulesCompleted.history && educatorModulesCompleted.system && educatorModulesCompleted.sptx && educatorModulesCompleted.crypto
              ? `<h4 class="breathe">Congratulations! You've completed the Personal Finance Educator! <br><span class="icon">☤</span></h4>`
              : ''

          }

          <div style="margin-top: 2em; display: none">
            <a style="text-decoration: underline; color: #000; cursor: pointer">Help Forum →</a>
          </div>
        </div>
      `


      ctx.$('#intro').onclick = () => {
        ctx.setState({
          screen: 'educatorModule',
          educatorModule: 'intro'
        })
      }
      ctx.$('#history').onclick = () => {
        ctx.setState({
          screen: 'educatorModule',
          educatorModule: 'history'
        })
      }

      ctx.$('#system').onclick = () => {
        ctx.setState({
          screen: 'educatorModule',
          educatorModule: 'system'
        })
      }
      ctx.$('#sptx').onclick = () => {
        ctx.setState({
          screen: 'educatorModule',
          educatorModule: 'sptx'
        })
      }
      ctx.$('#crypto').onclick = () => {
        ctx.setState({
          screen: 'educatorModule',
          educatorModule: 'crypto'
        })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'educatorModule') {
      const {educatorModule} = ctx.state

      const completeSound = async (mod=1) => {
        miscAudioSrc.max()
        miscAudioSrc2.max()

        await Promise.all([
          miscAudioSrc.note(246.94*mod, 250),
          miscAudioSrc2.note(493.88*mod, 250),
        ])

        miscAudioSrc.note(246.94*mod, 250)
        miscAudioSrc.note(659.25*mod, 250)
      }


      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="flex: 1; overflow: scroll; padding-bottom: 3em">
          <style>
            h2, h3 {
              text-align: center;
            }
            p {
              margin: 1em 0
            }
          </style>
          <button id="quit">Quit</button>
          <div id="moduleContent"></div>
        </div>
      `

      const $moduleContent = ctx.$('#moduleContent')

      if (educatorModule === 'intro') {
        $moduleContent.innerHTML = `
          <div id="p1" class="">
            <h2>Welcome to the Personal Finance Educator Introduction Module!</h2>
            <p>In this introductory module, you will learn about the Personal Finance Educator application!</p>
            <button id="introNext1">Start</button>
          </div>


          <div id="p2" class="hidden">
            <h2>Personal Finance Educator Introduction Module (cont.)</h2>
            <h3>(1/3)</h3>
            <p>Personal Finance Educator (PFE) is an independent education organization dedicated to bringing high quality financial education materials to every day consumers. PFE is designed for <em>maximum user engagement</em>, with multiple high-quality education modules. Each module is designed to be both informative and enjoyable, with a reward system designed to guide the user along their educational journey!</p>
            <button id="introNext2">Next</button>
          </div>

          <div id="p3" class="hidden">
            <h2>Personal Finance Educator Introduction Module (cont.)</h2>
            <h3>(2/3)</h3>
            <p>Research shows that information is retained twice as long when it's presented in gamified educational modules. In other words: people remember things better when learning is fun! That's why PFE breaks down complex topics into bite-sized chunks, and gives the user rewards along the way.</p>
            <button id="introNext3">Next</button>
          </div>

          <div id="p4" class="hidden">
            <h2>Personal Finance Educator Introduction Module (cont.)</h2>
            <h3>(3/3)</h3>
            <p>The PFE curriculum is broken down into 6 segments: </p>
            <p>1. Introduction: The user learns about PFE and the curriculum structure (10 XP)</p>
            <p>2. The History of $: The user learns about the history of $, where it came from, and why it exists (20 XP, unlocked by completing Introduction)</p>
            <p>3. The $ System: The user learns about the current state of the $ system (20 XP, unlocked by completing Introduction)</p>
            <p>4. $ And You: The user learns about their place in the $ system, and why financial education is so important (20 XP, unlocked by completing Introduction)</p>
            <p>5. Secure Payment Transaction identifiers: The user completes an interactive tutorial to learn about how SPTX identifiers work (40 XP, unlocked by completing Introduction)</p>
            <p>6. Crypto-Currency: In this advanced module, the user learns how to send and trade crypto-currencies (80 XP, unlocked by completing Introduction)</p>
            <button id="introNext4">Next</button>
          </div>


          <div id="p5" class="hidden">
            <h2>Personal Finance Educator Introduction Module Complete!</h2>
            <h3>(Complete)</h3>
            <p>In this module we learned: </p>
            <p>1. What is Personal Finance Education?</p>
            <p>2. Educational methodology</p>
            <p>3. The structure of the PFE curriculum</p>
            <button id="introComplete">Complete!</button> (+ 10 XP)
          </div>
        `

        ctx.$('#introNext1').onclick = () => {
          ctx.$('#p1').classList.add('hidden')
          ctx.$('#p2').classList.remove('hidden')
        }

        ctx.$('#introNext2').onclick = () => {
          ctx.$('#p2').classList.add('hidden')
          ctx.$('#p3').classList.remove('hidden')
        }

        ctx.$('#introNext3').onclick = () => {
          ctx.$('#p3').classList.add('hidden')
          ctx.$('#p4').classList.remove('hidden')
        }

        ctx.$('#introNext4').onclick = () => {
          ctx.$('#p4').classList.add('hidden')
          ctx.$('#p5').classList.remove('hidden')
        }

        ctx.$('#introComplete').onclick = () => {
          completeSound(1)
          ctx.state.screen = 'educator'
          ctx.setUserData({
            educatorModulesCompleted: { ...educatorModulesCompleted, intro: true}
          })
        }


      } else if (educatorModule === 'history') {
        $moduleContent.innerHTML = `
          <div id="p1" class="">
            <h2>Welcome to the History of $ Module!</h2>
            <p>In this module you will learn about fascinating history of $, including information left out of your economics textbooks!</p>
            <button id="historyNext1">Start</button>
          </div>


          <div id="p2" class="hidden">
            <h2>The History of $ Module: The Myth of Barter</h2>
            <p>Open any economics text book, and you'll read the same story regarding the origins of money: Thousands of years ago, humans invented money as a solution to the inefficiencies of barter. Barter, you will read, is all well and good, but it has its problems. For example, let's say you have six chickens, and desperately need shoes. Meanwhile, your neighbor has shoes, but doesn't need any chickens. He needs a cow. If this is the case, then you're out of luck. As the economists would say, there is no "mutual coincidence of wants."</p>
            <button id="historyNext2">Next</button>
          </div>

          <div id="p3" class="hidden">
            <h2>The History of $ Module: The Myth of Barter (cont.)</h2>
            <p>As the story goes, money was invented as a solution to this problem. Money acts as a liquid medium of exchange, which allows you to buy whatever you want from whoever you want. After all, everyone needs money! Once we had money, people were able to borrow it and go into debt. It's a simple explanation that makes a lot of sense. There's just one tiny problem with this story: it isn't true!</p>
            <button id="historyNext3">Next</button>
          </div>

          <div id="p4" class="hidden">
            <h2>The History of $ Module: The Myth of Barter (cont.)</h2>
            <p>Anthropologists like David Graeber will note that this story doesn't actually have any historical evidence! In fact, the anthropological evidence suggests that things happened in the opposite direction! Most early economies were based on trust, gift giving, and social obligation. In other words: debt. In a tight-knit community, it's silly and inefficient to barter with your neighbor. If you need shoes, and your neighbor has an extra pair, it's much easier for him to just give them to you! And the understanding would be that later, if he needed chickens, you could give him a spare chicken. </p>
            <button id="historyNext4">Next</button>
          </div>

          <div id="p5" class="hidden">
            <h2><em>Fun Fact!</em></h2>
            <p>Did you know that the word "economics" is derived from the Greek word "oikonomia", which means "household management"? In many ways, economics originated as the science of the household!</p>
            <button id="historyNext5">Next</button>
          </div>


          <div id="p6" class="hidden">
            <h2>The History of $ Module: Social Currencies</h2>
            <p>Of course, there were early forms of currency. Shells, feathers, nails, gold... you name it. But these were mainly used as ways of rearranging social relaitonships. You might pay a bundle of shells as a dowry, or as compensation for an egregious crime. However, It would have likely be considered uncouth to try to buy a chicken with them.</p>
            <button id="historyNext6">Next</button>
          </div>

          <div id="p7" class="hidden">
            <h2>The History of $ Module: Warfare & The State</h2>
            <p>As history moved forward, states and large scale warfare arose, which necessitated the mobilization of resources. Vast administrative systems were created to quantify and keep track of who owed what to whom, but ultimately various forms of coinage were used as an abstract representation of these debts. That is, modern currency as we know it was actually created by the state in order to pay soldiers and extract taxes from the populace!</p>
            <button id="historyNext7">Next</button>
          </div>

          <div id="p8" class="hidden">
            <h2>The History of $ Module: Money → Markets</h2>
            <p>Once modern currency was introduced, the state was able to use it to purchase goods. And people were happy to trade goods and services for currency (with the government <em>and</em> each other) because they needed it in order to pay taxes. If this sounds like a market to you... that's because it is!</p>
            <button id="historyNext8">Next</button>
          </div>

          <div id="p9" class="hidden">
            <h2>The History of $ Module: Bullion ↔ Credit</h2>
            <p>Governments found that good money was fungible, durable, divisable, portable, and scarce. In order to act as a medium of exchange and a store of value, it needed to have these qualities. Precious metals — such as gold and silver — fit the bill, so people have saught these resources for centuries. However, bullion is often too heavy and impractical for day-to-day transactions, so paper currency emerged in 7th century China. This meant that gold went straight into the vault, while banks and merchants issued promissory notes. This allowed people to trade slips of paper instead of heavy metals. </p>
            <button id="historyNext9">Next</button>
          </div>

          <div id="p10" class="hidden">
            <h2>The History of $ Module: Fiat and Inflation</h2>
            <p>By the 17th century paper money became a worldwide phenomena. However, governments were still constrained in their spending based on how much gold they had in the vault. Eventually, governments realized that they could just print as much paper money as they wanted, unrelated to their supply of gold. This lead to the modern form of fiat currency, culminating in the end of the Bretton Woods system in 1971. While this has made it easier for governments to manage spending and counterbalance market cycles, it's also led to cases of unchecked spending and rampant inflation. In these hyperinflationary periods, the supply of government-issued skyrockets, causing its value to plummet.</p>
            <button id="historyNext10">Next</button>
          </div>

          <div id="p11" class="hidden">
            <h2>The History of $ Module: Summary</h2>
            <p>In this module we learned: </p>
            <p>1. Traditional economic theory suggests that human society started with barter, invented money as a solution, and this led to monetary loans and debt.</p>
            <p>2. Actual anthropological evidence suggests that things moved in the opposite direction: humans used informal debt and credit systems to arrange society, money was introduced as a method of formalizing these debts with the state in control, and markets arose as a response.</p>
            <p>3. While bullion was often used as a monetary material, paper currency was introduced in 7th century China to make day-to-day transactions easier.</p>
            <p>4. Paper currency paved the way for governments to remove the bullion peg, and introduce fiat currency. Fiat currency makes certain things easier, but can also lead to inflation.</p>
            <button id="historyNext11">Next</button>
          </div>

          <div id="p12" class="hidden">
            <h2>The History of $ Module: Pop Quiz!</h2>
            <h4 style="margin: 0.5em 0">During which century was paper money invented in China?</h4>
            <select id="q1">
              <option>1st</option>
              <option>6th</option>
              <option value="yes">7th</option>
              <option>17th</option>
            </select>

            <h4 style="margin-top: 1em; margin-bottom: 0.5em">What type of good do you need from your neighbor?</h4>
            <select id="q2">
              <option value="yes">Shoes</option>
              <option>Chickens</option>
              <option>Gold</option>
              <option>Shells</option>
            </select>
            <div style="margin-top: 1em">
              <button id="complete">Complete</button> (+20 XP)
              <h4 id="qError"></h4>
            </div>
          </div>

        `

        ctx.$('#historyNext1').onclick = () => {
          ctx.$('#p1').classList.add('hidden')
          ctx.$('#p2').classList.remove('hidden')
        }

        ctx.$('#historyNext2').onclick = () => {
          ctx.$('#p2').classList.add('hidden')
          ctx.$('#p3').classList.remove('hidden')
        }

        ctx.$('#historyNext3').onclick = () => {
          ctx.$('#p3').classList.add('hidden')
          ctx.$('#p4').classList.remove('hidden')
        }

        ctx.$('#historyNext4').onclick = () => {
          ctx.$('#p4').classList.add('hidden')
          ctx.$('#p5').classList.remove('hidden')
        }

        ctx.$('#historyNext5').onclick = () => {
          ctx.$('#p5').classList.add('hidden')
          ctx.$('#p6').classList.remove('hidden')
        }

        ctx.$('#historyNext6').onclick = () => {
          ctx.$('#p6').classList.add('hidden')
          ctx.$('#p7').classList.remove('hidden')
        }

        ctx.$('#historyNext7').onclick = () => {
          ctx.$('#p7').classList.add('hidden')
          ctx.$('#p8').classList.remove('hidden')
        }

        ctx.$('#historyNext8').onclick = () => {
          ctx.$('#p8').classList.add('hidden')
          ctx.$('#p9').classList.remove('hidden')
        }

        ctx.$('#historyNext9').onclick = () => {
          ctx.$('#p9').classList.add('hidden')
          ctx.$('#p10').classList.remove('hidden')
        }

        ctx.$('#historyNext10').onclick = () => {
          ctx.$('#p10').classList.add('hidden')
          ctx.$('#p11').classList.remove('hidden')
        }

        ctx.$('#historyNext11').onclick = () => {
          ctx.$('#p11').classList.add('hidden')
          ctx.$('#p12').classList.remove('hidden')
        }

        ctx.$('#complete').onclick = () => {
          if (ctx.$('#q1').value === 'yes' && ctx.$('#q2').value === 'yes') {
            completeSound(1.25)
            ctx.state.screen = 'educator'
            ctx.setUserData({
              educatorModulesCompleted: { ...educatorModulesCompleted, history: true}
            })
          } else {
            ctx.$('#qError').innerHTML = 'Guess again!'
          }
        }


      } else if (educatorModule === 'system') {
        $moduleContent.innerHTML = `
          <div id="p1" class="">
            <h2>Welcome to the Modern $ System Module!</h2>
            <p>In this module you will learn all about how the modern $ system works!</p>
            <button id="systemNext1">Next</button>
          </div>

          <div id="p2" class="hidden">
            <h2>The Modern $ System Module: A Complex System</h2>
            <p>Our last module left off in 1971, but that was only the beginning of the modern economy. Since then, the economy has become more intricate, globalized, and automated. Many economists note that the modern economy is a marvel of social ingnuity. It's a system so complex that no single person understands it. And it's so decentralized that no single person can stop it. And if you think of the economy as a living organism, $ is its life blood. It's the mechanism in which value flows from one economic entity to the other. It's difficult to imagine a world in which $ doesn't pervade every aspect of our daily lives. Like it or not, $ is here to stay!

            </p>
            <button id="systemNext2">Next</button>
          </div>


          <div id="p3" class="hidden">
            <h2>The Modern $ System Module: The "How", the "Why", and the "Where"</h2>
            <p>But how does modern $ work? Why do we still need it? And <em>where</em> is all of your money? These are all great questions! And as the economy becomes increasingly digitized, they become harder to answer. In fact, as social reality becomes increasingly mediated by completely immaterial and abstract factors (like computer code and databases), one could be forgiven for thinking that the state of their life is cruel and arbitrary, determined by some nebulous force beyond your control. But nothing could be further from the truth! </p>
            <button id="systemNext3">Next</button>
          </div>

          <div id="p4" class="hidden">
            <h2>The Modern $ System Module: Economies of Scale</h2>
            <p>In actuality, computers have taken economic processes that have existed for centuries, and simply automated them. This provides a much higher level of precision at a fraction of the cost, and enables economies of scale that can easily be passed onto the consumer. For example, products such as mobile telephones used to be prohibitively expensive. But today, they are so cheap to produce that phone companies can practically give them away for free!</p>
            <button id="systemNext4">Next</button>
          </div>


          <div id="p5" class="hidden">
            <h2>The Modern $ System Module: $and You</h2>
            <p>So, how do you fit into all of this? You're an integral part of the economy! You accumulate debts and obligations whenever you engage in economic transactions, and generate wealth whenever you work. And while this may sound fun, it's a big responsability. Some people handle it well, and decide to be productive members of society. They go to job, take pride in their work, and earn a well-deserved paycheck. Then they use that paycheck to take care of all their financial obligations. Other people aren't as well-adjusted. These people accumulate goods and services that they cannot afford, and ultimately default on their debts. These delinquents are often marginalized by society as non-productive leeches.</p>
            <button id="systemNext5">Next</button>
          </div>


          <div id="p6" class="hidden">
            <h2>The Modern $ System Module: Doing Your Duties</h2>
            <p>Do you want to do your duty as a productive member of society? Of course you do! Working to pay off your debts is just the right thing to do. And making money has never been easier, so you don't have an excuse not to do it! </p>
            <button id="systemNext6">Next</button>
          </div>

          <div id="p7" class="hidden">
            <h2>The Modern $ System Module: Summary</h2>
            <p>In this module we learned:</p>
            <p>1. All about the complexities of the modern $ system.</p>
            <p>2. How economies of scale help you, the consumder.</p>
            <p>3. Your place in the modern economiy.</p>
            <p>4. Why paying off your debts is a moral imperative</p>
            <button id="systemNext7">Next</button>
          </div>

          <div id="p8" class="hidden">
            <h2>The Modern $ System Module: Pop Quiz!</h2>
            <h4 style="margin: 0.5em 0">What type of good used to be prohibitively expensive, but is now cheap to produce due to economies of scale?</h4>

            <select id="q1">
              <option>Health Care</option>
              <option value="yes">Mobile Phones</option>
              <option>Education</option>
              <option>Art</option>
            </select>

            <h4 style="margin-top: 1em; margin-bottom: 0.5em">You only have $1000.00 and can only complete one of the following payments. Which do you make?</h4>

            <select id="q2">
              <option>Buy an expensive home entertainment system</option>
              <option>Buy food for yourself</option>
              <option>Invest it in cryptocurrencies</option>
              <option value="yes">Pay rent to your landlord</option>
            </select>

            <div style="margin-top: 1em">
              <button id="complete">Complete</button> (+20 XP)
              <h4 id="qError"></h4>
            </div>
          </div>
        `

        ctx.$('#systemNext1').onclick = () => {
          ctx.$('#p1').classList.add('hidden')
          ctx.$('#p2').classList.remove('hidden')
        }
        ctx.$('#systemNext2').onclick = () => {
          ctx.$('#p2').classList.add('hidden')
          ctx.$('#p3').classList.remove('hidden')
        }
        ctx.$('#systemNext3').onclick = () => {
          ctx.$('#p3').classList.add('hidden')
          ctx.$('#p4').classList.remove('hidden')
        }
        ctx.$('#systemNext4').onclick = () => {
          ctx.$('#p4').classList.add('hidden')
          ctx.$('#p5').classList.remove('hidden')
        }
        ctx.$('#systemNext5').onclick = () => {
          ctx.$('#p5').classList.add('hidden')
          ctx.$('#p6').classList.remove('hidden')
        }
        ctx.$('#systemNext6').onclick = () => {
          ctx.$('#p6').classList.add('hidden')
          ctx.$('#p7').classList.remove('hidden')
        }

        ctx.$('#systemNext7').onclick = () => {
          ctx.$('#p7').classList.add('hidden')
          ctx.$('#p8').classList.remove('hidden')
        }

        ctx.$('#complete').onclick = () => {
          if (ctx.$('#q1').value === 'yes' && ctx.$('#q2').value === 'yes') {
            completeSound(1.3333)
            ctx.state.screen = 'educator'
            ctx.setUserData({
              educatorModulesCompleted: { ...educatorModulesCompleted, system: true}
            })
          } else {
            ctx.$('#qError').innerHTML = 'Guess again!'
          }
        }

      } else if (educatorModule === 'sptx') {
        $moduleContent.innerHTML = `
          <div id="p1" class="">
            <h2>Welcome to the SPTXs & Payment Module!</h2>
            <p>In this module you will learn about the SPTX protocol, and the payment system that it powers!</p>
            <button id="sptxNext1">Next</button>
          </div>

          <div id="p2" class="hidden">
            <h2>The SPTXs & Payment Module: An Introduction</h2>
            <p>So you have $, and you'd like to pay off your debts. Now what? Well, you're in luck! Thankfully, there's a quick and easy way to do exactly that. You don't have to deal with low-level protocols and processes. You just need to follow a simple three-step process, and your payments will be processed in no time with the SPTX protocol! But as simple as it is, many people still have trouble following these three simple steps. But don't wory: This tutorial will train you to be a SPTX wizard in no time, regardless of you level of financial sophistication!</p>
            <button id="sptxNext2">Next</button>
          </div>


          <div id="p3" class="hidden">
            <h2>The SPTXs & Payment Module: What Is A SPTX?</h2>
            <p>The most common question people have about SPTXs is: What the heck do those letters stand for? SPTX stands for <strong>Secure Payment Transaction</strong>, and it defines a secure protocol for $ to pass from one party to another in the PayApp network. </p>
            <button id="sptxNext3">Next</button>
          </div>


          <div id="p4" class="hidden">
            <h2>The SPTXs & Payment Module: The Three Steps (Sending)</h2>
            <p>Let's take a look at how SPTX payments work using a simplified example: Alice wants to pay Bob $10. <strong>First</strong>, she calls Bob and asks him for his <strong>Recipient Address</strong>. This is a unique identifer on the PayApp network that represents a $ balance belonging to Bob. Alice has a Recipient Addres too*! Second, she logs on to a payment provider (such as PayApp) and says she wants to send $10 to Bob's Recipient Address. This will generate a SPTX identifier. Third, she gives that SPTX identifier to Bob. It's as simple as that!</p>
            <button id="sptxNext4">Next</button>

            <p style="font-size: 0.85em">*In fact, Alice might have multiple Recipient Addresses on multiple apps. Each Recipient Address represents a different balance, even though they all belong to  Alice!</p>
          </div>


          <div id="p5" class="hidden">
            <h2>The SPTXs & Payment Module: The Three Steps (Receiving)</h2>
            <p>Let's check in on Bob, who's eagerly awaiting his $10 payment. So what does he do? He follows a three step process of his own! At this point in our example he's already completed step 1 (giving Alice his Recipient Address) <em>and</em> step 2 (receiving an SPTX from Alice) of. Now, all he needs to do to complete step 3 is log into his payment app (also PayApp) and process the SPTX! His balance should update by $10 in no time!</p>
            <button id="sptxNext5">Next</button>
          </div>

          <div id="p6" class="hidden">
            <h2>The SPTXs & Payment Module: High Level Review</h2>
            <p>Let's Review the steps:</p>
            <p>‣ Bob's Recipient Address → Alice</p>
            <p>‣ Alice's SPTX → Bob</p>
            <p>‣ Bob processes the SPTX</p>
            <button id="sptxNext6">Next</button>
          </div>

          <div id="p7" class="hidden">
            <h2>The SPTXs & Payment Module: Under The Hood</h2>
            <p>So what's going on under the hood? First, it's important to understand that Alice and Bob don't actually <em>own</em> the $ that they are transacting with. This $ is owned and held by the various entities within the PayApp payment network, and each have multiple accounts with various users. And Recipient Addresses really represent an individual's $ account help by a specific payment entity. This means that Alice and Bob could have Recipient Addresses with PayApp and with Currency Xchange. Both addresses represent balances that technically belong to them, but the $ is held by accounts at two different payment entities.</p>
            <button id="sptxNext7">Next</button>
          </div>


          <div id="p8" class="hidden">
            <h2>The SPTXs & Payment Module: Under The Hood</h2>
            <p>When Alice creates a SPTX, this payment is sent to a secure database with information about the sender, recipient, and so forth. An advanced encryption algorithm is used to sign the transaction payload, and an indentifier (the SPTX identifier) is returned to the sender. This identifier is then used by the recipient's payment entity to locate the transaction within the payment database. If Alice or Bob loses this identifier, then there is no way to securely retrieve the transaction. And if the SPTX is not processed within 90 days, then Federal law dictates that the payment entity's obligation to the recipient is extinguished. </p>
            <button id="sptxNext8">Next</button>
          </div>

          <div id="p9" class="hidden">
            <h2>The SPTXs & Payment Module: Tutorial</h2>
            <p>In the following tutorial, you will play the role of Charlie, who wants to send $ from his Currency Exchange account to his PayApp account.</p>
            <button id="sptxNext9">Start Turorial</button>
          </div>

          <div id="p10" class="hidden">
            <h2>The SPTXs & Payment Module: Tutorial (1/3)</h2>
            <p>Let's start in the "Receive" tab on PayApp. This is the address you will send the $ to. <strong>Be sure to copy the Recipient Address before advancing to the next step!</strong></p>

            <div style="border: 1px solid; padding: 0.25em">
              <h2>PayApp</h2>
              <h3 style="margin: 1em 0; text-align: center">Current $ Balance: $0.00</h3>

              <h4>My $ Recipient Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h4>
              <span style="font-size: 0.9em; background: #000; color: #fff; padding: 0.25em; margin-top: 0.1em; display: inline-block">0x11111111111111111111111111111111111111</span>
              <div style="margin-top: 0.5em">
                <input placeholder="S.P.T.X. identifier" type="number">
                <button id="processSPTX1">Process SPTX</button>
              </div>
              <h5 id="sptxError1"></h5>
            </div>

            <button id="sptxNext10" style="margin-top: 0.5em">Continue</button>
          </div>

          <div id="p11" class="hidden">
            <h2>The SPTXs & Payment Module: Tutorial (2/3)</h2>
            <p>Now, use your PayApp $ Recipient Address from the previous step to generate a SPTX for $10. <strong>Remember not to lose your SPTX!</strong></p>

            <div style="border: 1px solid; padding: 0.25em">
              <h2>Currency Xchange</h2>

              <h3>$ Balance: <span id="exchangeBalance">10.0000</span></h3>

              <h4 style="margin: 0.4em 0">Send Funds</h4>
              <input id="sendUSDAddress" placeholder="$ Address" style="width: 90%; margin: 0.4em 0">
              <input id="sendUSDAmount" placeholder="$ 0.00" type="number" step=".01" style="width: 6em"> <button id="sendUSD" style="margin-bottom: 0.1em">SEND $</button>
              <h5>SPTX: <span id="sptxError2">[-----------------]</span></h5>

              <div style="border-top: 2px solid; margin-top: 0.4em">
                <h4 style="margin: 0.4em 0">Receive $</h4>
                <h5 style="border: 1px dotted; text-align: center; padding: 0.25em">0x22222222222222222222222222222222222222</h5>
                <input id="sptxInput" placeholder="SPTX" type="number" style="width: 11em"> <button id="exchangeProcessSPTX">PROCESS</button>
                <h4 id="sptxError3"></h4>
              </div>
            </div>

            <button id="sptxNext11" style="margin-top: 0.5em" disabled>Continue</button>
          </div>


          <div id="p12" class="hidden">
            <h2>The SPTXs & Payment Module: Tutorial (3/3)</h2>
            <p>Now that you have a SPTX, all you need to do is process it!</p>

            <div style="border: 1px solid; padding: 0.25em">
              <h2>PayApp</h2>
              <h3 style="margin: 1em 0; text-align: center">Current $ Balance: <span id="finalBalance">$0.00</span></h3>
              <h4>My $ Recipient Address <em style="font-size: 0.5em">(Send $ here!)</em>: </h4>
              <span style="font-size: 0.9em; background: #000; color: #fff; padding: 0.25em; margin-top: 0.1em; display: inline-block">0x11111111111111111111111111111111111111</span>
              <div style="margin-top: 0.5em">
                <input id="finalSPTX" placeholder="S.P.T.X. identifier" type="number">
                <button id="processSPTX2">Process SPTX</button>
              </div>
              <h5 id="sptxError4"></h5>
            </div>

            <button id="sptxNext12" style="margin-top: 0.5em" disabled>Continue</button>
          </div>


          <div id="p13" class="hidden">
            <h2>The SPTXs & Payment Module: Review</h2>
            <p>That's all there is to it!</p>

            <p>In this module we:</p>
            <p>1. Learned what the SPTX protocol is, and why it's important</p>
            <p>2. Walked through a simple SPTX example</p>
            <p>3. Looked at what goes on under the hood in a SPTX payment</p>
            <p>4. Got hands-on experience in an interactive tutorial</p>

            <div>
              <button id="complete">Complete</button> (+40 XP)
            </div>
          </div>
        `

        ctx.$('#processSPTX1').onclick = () => {
          ctx.$('#sptxError1').innerHTML = `You don't have an SPTX yet! You'll get one in the next step. Make sure you've coppied your PayApp $ Recipient Address before advancing!`
        }
        ctx.$('#sendUSD').onclick = () => {
          if (!ctx.$('#sendUSDAddress').value) {
            ctx.$('#sptxError2').innerHTML = `Whoops! You forgot to input your Recipient Address from the previous step`
          } else if (ctx.$('#sendUSDAddress').value === '0x22222222222222222222222222222222222222') {
            ctx.$('#sptxError2').innerHTML = `Wrong Recipient Address! You want to send to your PayApp account, not your Currency Xchange account!`
          } else if (ctx.$('#sendUSDAddress').value !== '0x11111111111111111111111111111111111111') {
            ctx.$('#sptxError2').innerHTML = `Wrong Recipient Address! Make sure you correctly copied the Recipient Address from the previous step!`
          } else {
            ctx.$('#exchangeBalance').innerHTML = `0.0000`
            ctx.$('#sptxNext11').disabled = false
            ctx.$('#sptxError2').innerHTML = `Message: Secure Payment Transaction (S.P.T.X.) identifier: <span style="font-size: 1.25em">1234567890</span>`
          }
        }
        ctx.$('#exchangeProcessSPTX').onclick = () => {
          ctx.$('#sptxError3').innerHTML = `Oops! You're trying to send $ back to your Currency Xchange account! You want to send it to your PayApp account in the next step!`
        }

        ctx.$('#processSPTX2').onclick = () => {
          if (Number(ctx.$('#finalSPTX').value) !== 1234567890) {
            ctx.$('#sptxError4').innerHTML = `Uh oh! You input the wrong SPTX!`
          } else {
            ctx.$('#sptxNext12').disabled = false
            ctx.$('#sptxError4').innerHTML = `Success!`
            ctx.$('#finalBalance').innerHTML = `$10.00`
          }
        }

        ctx.$('#sptxNext1').onclick = () => {
          ctx.$('#p1').classList.add('hidden')
          ctx.$('#p2').classList.remove('hidden')
        }

        ctx.$('#sptxNext2').onclick = () => {
          ctx.$('#p2').classList.add('hidden')
          ctx.$('#p3').classList.remove('hidden')
        }

        ctx.$('#sptxNext3').onclick = () => {
          ctx.$('#p3').classList.add('hidden')
          ctx.$('#p4').classList.remove('hidden')
        }

        ctx.$('#sptxNext4').onclick = () => {
          ctx.$('#p4').classList.add('hidden')
          ctx.$('#p5').classList.remove('hidden')
        }

        ctx.$('#sptxNext5').onclick = () => {
          ctx.$('#p5').classList.add('hidden')
          ctx.$('#p6').classList.remove('hidden')
        }

        ctx.$('#sptxNext6').onclick = () => {
          ctx.$('#p6').classList.add('hidden')
          ctx.$('#p7').classList.remove('hidden')
        }

        ctx.$('#sptxNext7').onclick = () => {
          ctx.$('#p7').classList.add('hidden')
          ctx.$('#p8').classList.remove('hidden')
        }

        ctx.$('#sptxNext8').onclick = () => {
          ctx.$('#p8').classList.add('hidden')
          ctx.$('#p9').classList.remove('hidden')
        }

        ctx.$('#sptxNext9').onclick = () => {
          ctx.$('#p9').classList.add('hidden')
          ctx.$('#p10').classList.remove('hidden')
        }

        ctx.$('#sptxNext10').onclick = () => {
          ctx.$('#p10').classList.add('hidden')
          ctx.$('#p11').classList.remove('hidden')
        }

        ctx.$('#sptxNext11').onclick = () => {
          ctx.$('#p11').classList.add('hidden')
          ctx.$('#p12').classList.remove('hidden')
        }

        ctx.$('#sptxNext12').onclick = () => {
          ctx.$('#p12').classList.add('hidden')
          ctx.$('#p13').classList.remove('hidden')
        }

        ctx.$('#complete').onclick = () => {
          completeSound(1.5)
          ctx.state.screen = 'educator'
          ctx.setUserData({
            educatorModulesCompleted: { ...educatorModulesCompleted, sptx: true}
          })
        }


      } else if (educatorModule === 'crypto') {
        $moduleContent.innerHTML = `
          <div id="p1" class="">
            <h2>Welcome to the CryptoCurrency Module!</h2>
            <p>In this module you will learn about how to achieve financial freedom using CryptoCurrency! <br> <strong style="font-size: 0.8em">[Sponsored by Currency Xchange <em>Premium</em>]</strong></p>
            <button id="cryptoNext1">Next</button>
          </div>

          <div id="p2" class="hidden">
            <h2>CryptoCurrency: A Brief History</h2>
            <p>Following the financial meltdown of the traditional financial system in 2008, everyone knew that something needed to change. People were sick and tired of big financial institutions getting rich off of individual depositors. People wanted self-custody of their own assets with no intermediaries involved. So in 2009 CryptoCurrency was born as a solution to this problem. To this day, many people stay away from CryptoCurrency because they think it's too complicated to understand. But nothing could be further from the truth! </p>
            <button id="cryptoNext2">Next</button>
          </div>

          <div id="p3" class="hidden">
            <h2>CryptoCurrency: How does it work?</h2>
            <p>Information can only travel through a distributed system at the speed of light. This means that it can often be difficult for multiple nodes in a network to agree on the order of events since information cannot be conveyed simultaneously. For example, let's say that Alice has $10 and lives in Denver, and her bank has branches in San Francisco and New York. If she wants to send $7 to Bob, all she needs to do is notify one of the branches. They will coordinate with each other to credit her account by $7 and debit Bob's account by $7. Pretty straight forward, right? But what happens if she tells SF that she wants to send Bob $7, and tells NY that she wants to send Charlie $7? Now we have a problem. Due to the speed of light, the SF branch will recieve the Bob transaction before it gets word of the Charlie transaction from NY, and the NY branch will receive the Charlie transaction before it hears about the Bob transaction from SF. Alice only has $10 in her account, so only one of these transactions can be valid! Who should have how much money?</p>
            <button id="cryptoNext3">Next</button>
          </div>


          <div id="p4" class="hidden">
            <h2>CryptoCurrency: How does it work? (cont.)</h2>
            <p>One way around this problem is to make one of the bank branches the "leader", and allow them to decide what the canonical order of events is. So if NY is the leader in the previous example, the SF branch would notify NY when it receives the Bob transaction, but would wait for confirmation before debiting and crediting the balances. Ultimately, NY would decide that the Charlie transaction came first and would notify the other branches accordingly. This way, all the branches agree on who has how much money. Furthermore, if the NY goes off line due to a blackout or internet failure, the San Francisco, Philadelphia, Boston, Cleveland, Chicago, and Kansas City branches would all vote on a new leader before any new transactions could be processed. Sounds pretty simple, doesn't it?</p>
            <button id="cryptoNext4">Next</button>
          </div>

          <div id="p5" class="hidden">
            <h2>CryptoCurrency: How does it work? (cont. The Byzantine generals problem)</h2>
            <p>So what happens if some of these branches are malicious? What if NY is fine, but SF and Boston decide to trigger a new leader election? If they don't like the order of the transactions, they can dishonestly steal the Leader role and manipulate reality to their liking. A couple rotten apples, in this case can spoil the bunch. In computer science this is called the Byzantine generals problem. The name stems from an alegory of several Byzantine who are all trying to coordinate a complicated plan of attack; but some of the generals are treacherous and may provide dishonest information. </p>
            <button id="cryptoNext5">Next</button>
          </div>

          <div id="p6" class="hidden">
            <h2>CryptoCurrency: How does it work? (cont. Byzantine Fault Tolerance)</h2>
            <p>A network that is immune to this problem is said to have Byzantine Fault Tolerance. This means that it can withstand a certain number of malicious nodes attempting to reorder or censor transactions. Blockchains are Byzantine Fault Tolerant because they use sophisticated consensus algorithms to determine the leader for a certain period. Once a leader is selected, they batch a certain number of cryptographically verified transactions into an ordered "block". Then they add that block to a chain of other blocks. And now that the network agrees on the order of the transactions (and can cryptographically verify their legitimacy) they can also agree on the final state of the network! The details of this consensus algorithm are complicated and beyond the scope of this learning module. But the short version is that different blockchains have different protocols, and participating in these protocols typically yields a cryptocurrency reward!</p>
            <button id="cryptoNext6">Next</button>
          </div>

          <div id="p7" class="hidden">
            <h2>CryptoCurrency: What's it useful for?</h2>
            <p>Modern CryptoCurrency is useful for all sorts of things! Many people use it to make payments without centralized intermediaries. Others use it to buy rare digital goods such as generative art NFTs. These are both popular use cases beccause they rely on the self-custodied ownership of crypto assets. No financial institution or government can take them away from you or stop your transactions. However, the most popular use case by far is generating wealth for you and your family! The rest of this learning module will teach you some of the ways you can start doing this today!</p>
            <button id="cryptoNext7">Next</button>
          </div>


          <div id="p8" class="hidden">
            <h2>CryptoCurrency: Generating Wealth Part I: Mining</h2>
            <p>As we said before, there are various consensus algorithms that provide rewards for participating in the network's decentralization. The popular <strong>Money Miner</strong> wallet application makes it dead simple to get started mining ₢rypto. Try mining 20 ₢rypto below:</p>

            <div style="border: 1px solid; padding: 0.25em">
              <div style="transform: scale(0.95)">
                <h2 style="text-align: center"><span class="icon">⚒︎</span> Money Miner <span class="icon">⚒︎</span></h2>

                <h4 style="text-align: center; margin-top: 1em">To mine ₢rypto, click the button below ⬇↓⇣↓⬇</h4>
                <div style="display: flex; justify-content: center">
                  <button id="mine" style="font-size: 1.1em">Mine ₢rypto</button>
                </div>
                <h4>₢rypto Balance: <span id="cryptoBalance">0</span></h4>
                <h4 style="margin-top: 0.5em;">₢rypto Wallet Address:</h4>
                <h4 style="word-wrap: break-word; margin-bottom: 0.4em">0x777777777777777777777777777777777777777</h4>

                <div class="sc" id="scContainer">
                  <h5>SPONSORED CONTENT</h5>
                  <div id="sc">Learn the secret mining technique the government doesn't want you to know about</div>
                </div>
              </div>
            </div>

            <h2 style="margin: 0.5em" id="mineMessage"></h2>

            <button id="cryptoNext8">Next</button>
          </div>

          <div id="p9" class="hidden">
            <h2>CryptoCurrency: Generating Wealth Part II: Yield</h2>
            <p>Now that you have ₢rypto, how do you make it work for you? It would be a shame to see it sitting in your wallet collecting dust. The popular <strong>YieldMaster</strong> application makes it trivial to start generating yield on your ₢rypto balance. Try staking 20 ₢rypto below until you have at least 30 ₢rypto:</p>

            <div style="padding: 0.25em; border: 1px solid; margin: 0.5em 0">
              <div style="transform: scale(0.95)">
                <div style="">
                  <h6 style="word-wrap: break-word; margin-bottom: 0.4em">Connected As: 0x777777777777777777777777777777777777777</h6>
                  <h3>Balance: ₢ <span id="yieldBalance">20</span></h3>
                  <h3>Amount Staked: ₢ <span id="amountStaked">0</span></h3>

                  <div id="yielding" class="hidden">
                    <h4>Yield: 10% / s</h4>
                    <button id="unstake">Unstake</button>
                  </div>

                  <div id="notYielding">
                    <input id="amountToStake" placeholder="Amount To Stake" type="number"> <button id="stake">Stake</button>
                  </div>

                  <h5 id="yieldError"></h5>
                </div>
              </div>
            </div>
            <button id="cryptoNext9">Next</button>
          </div>

          <div id="p10" class="hidden">
            <h2>CryptoCurrency: Generating Wealth Part III: Trading</h2>
            <p>Mining and Yielding are fine for generating small amounts of wealth, but you want to generate <em>substantial</em> amounts of wealth, there's only one way to do it: Trading CryptoCurrency with <strong>Currency Xchange Premium Mode</strong>. Trading CryptoCurrency is easy! Just follow these steps:</p>
            <p>1. Download the <strong>Currency Xchange</strong> app.</p>
            <p>2. Click on the <strong>Premium</strong> tab.</p>
            <p>3. Purchase the <strong>Premium</strong> membership.</p>
            <p>4. Start trading! The Currency Xchange Premium Membership will allow you to start trading the ₱remium coin, which has much higher profit potential than the ₢ coin.</p>
            <button id="cryptoNext10">Next</button>
          </div>

          <div id="p11" class="hidden">
            <h2>CryptoCurrency: Generating Wealth Part III: Trading Tips</h2>
            <p style="padding: 0 1em"><span class="icon">☛</span> Buy low, sell high! It's simple advice, but many investors forget to do it. ₱remium and ₢rypto have a natural price cycle, so it's important to pay close attention! Your Premium Membership will also give you BUY/SELL/HOLD signals, which will alert you to the relative highs and lows of the trading pair. </p>
            <p style="padding: 0 1em"><span class="icon">☛</span> Remember to have fun! Trading CryptoCurrency is an exhilirating activity, so don't forget to enjoy the high you get from making Money!</p>
            <button id="cryptoNext11">Start Interactive Trading Tutorial</button>

            <div style="display: inline-block; padding: 0.25em; border: 1px solid; text-align: center; margin-top: 1em"><strong>Learning module sponsored by: <br>Currency Xchange [PREMIUM]</strong></div>
          </div>

          <div id="p12" class="hidden">
            <h2>CryptoCurrency: Generating Wealth Part III: Interactive Tutorial</h2>
            <h3><span class="icon">✯</span> <span id="tradeChallenge">Wow, ₱ is really cheap relative to ₢! Use your ₢ to buy as much ₱ as you can, and wait for the price to go up!<span></h3>

            <div style="margin-top: 1em">
              <h3>₢ Balance: <span id="cBalance">32.210000</span></h3>
              <h3>₱ Balance: <span id="pBalance">0.000000</span></h3>

              <div style="padding: 0.25em; border: 3px solid;">
                <h3 style="text-align: center">Exchange Rates (<em>Simulated</em>)</h3>
                <table style="border: 1px solid; margin: 0.4em auto">
                  <tr>
                    <td id="cryptoPBuy" style="border: 1px solid">SELL</td>
                    <td style="border: 1px solid"> ₢ 1.00</td>
                    <td style="border: 1px solid">=</td>
                    <td id="cryptoP" style="border: 1px solid">₱ 14.349261</td>
                  </tr>

                  <tr>
                    <td id="premiumCBuy" style="border: 1px solid">BUY</td>
                    <td style="border: 1px solid"> ₱ 1.00</td>
                    <td style="border: 1px solid">=</td>
                    <td id="premiumC" style="border: 1px solid">₢ 0.069690</td>
                  </tr>

                </table>

                <div style="display: flex; flex-direction: column; align-items: center">
                  <div style="text-align: center">
                    <select id="tradeAction" style="box-shadow: 1px 1px 0 #000" required>
                      <option value="" selected disabled>-</option>
                      <option value="buy">BUY</option>
                      <option value="sell">SELL</option>
                    </select>

                    <select id="currency1" style="box-shadow: 1px 1px 0 #000}">
                      <option value="crypto">₢</option>
                      <option value="premium">₱</option>
                    </select>

                    <input id="transactionAmount" placeholder="0.00" step=".01" style="width: 5em; text-align: center" type="number">


                    <span id="tradeOperation">to</span>

                    <select id="currency2" style="box-shadow: 1px 1px 0 #000}">
                      <option value="crypto">₢</option>
                      <option value="premium">₱</option>
                    </select>
                  </div>

                  <button id="executeTrade1" style="margin-top: 0.4em">EXECUTE TRADE</button>
                  <button id="executeTrade2" style="margin-top: 0.4em" class="hidden">EXECUTE TRADE</button>

                </div>
                <h4 id="tradeError" style="text-align: center"></h4>
              </div>
            </div>

            <button id="cryptoNext12" class="hidden" style="margin-top: 0.5em">Finish Tutorial</button>


            <div style="display: inline-block; padding: 0.25em; border: 1px solid; text-align: center; margin-top: 1em"><strong>Learning module sponsored by: <br>Currency Xchange [PREMIUM]</strong></div>
          </div>


          <div id="p13" class="hidden">
            <h2>$ Congratulations! $</h2>
            <p>You just made a lot of crypto!</p>
            <p>1. First, you mined ₢ 20</p>
            <p>2. Second, you staked your ₢ like a yield farming pro to get up to ₢ 32.20</p>
            <p>3. Finally, you turned that ₢ 32.20 into ₢ 4766.80 by trading!</p>
            <p>Now you're ready to do it for real! Download <strong>Currency Xchange</strong> and buy the <strong>Premium Membership</strong> to get started! You deserve it!</p>
            <button id="complete">Complete</button>
          </div>

        `

        ctx.$('#scContainer').onclick = () => {
          ctx.setState({ screen: 'messageViewer', messageViewerMessage: moneyMinerMessage })
        }

        let cryptoBalance = 0
        ctx.$('#mine').onclick = () => {
          cryptoBalance = Math.min(cryptoBalance + 1, 20)
          ctx.$('#cryptoBalance').innerHTML = cryptoBalance

          if (cryptoBalance === 5) {
            ctx.$('#mineMessage').innerHTML = 'Wow, good job!'
          } else if (cryptoBalance === 10) {
            ctx.$('#mineMessage').innerHTML = 'Keep going!'
          } else if (cryptoBalance === 15) {
            ctx.$('#mineMessage').innerHTML = 'Almost there!'
          } else if (cryptoBalance === 20) {
            ctx.$('#mineMessage').innerHTML = 'You made it!'
          }
        }


        let yieldSeconds = 0
        let yieldInterval, unstaked

        ctx.$('#stake').onclick = () => {
          const balanceToStake = Number(ctx.$('#amountToStake').value)

          if (balanceToStake !== 20) {
            ctx.$('#yieldError').innerHTML = `Oops! Try staking 20 instead`
            return
          }

          ctx.$('#amountToStake').value = ''

          ctx.$('#notYielding').classList.add('hidden')
          ctx.$('#yielding').classList.remove('hidden')

          ctx.$('#yieldBalance').innerHTML = '0'
          ctx.$('#amountStaked').innerHTML = '20'

          yieldInterval = setInterval(() => {
            yieldSeconds += 1
            ctx.$('#yieldBalance').innerHTML = '0'
            ctx.$('#amountStaked').innerHTML = (20 * 1.1 ** yieldSeconds).toFixed(2)
          }, 1000)

          setTimeout(() => {
            clearInterval(yieldInterval)
          }, 5500)
        }

        ctx.$('#unstake').onclick = () => {

          if (yieldSeconds < 5) {
            ctx.$('#yieldError').innerHTML = `Not yet! Wait a little bit longer...`
            return
          }

          unstaked = true
          ctx.$('#yieldError').innerHTML = `You did it! You now have more than ₢ 4766!`
          ctx.$('#yielding').classList.add('hidden')
          ctx.$('#notYielding').classList.remove('hidden')
          ctx.$('#yieldBalance').innerHTML = (20 * 1.1 ** yieldSeconds).toFixed(2)
          ctx.$('#amountStaked').innerHTML = '0'
        }




        ctx.$('#tradeAction').onchange = () => {
          ctx.$('#tradeOperation').innerHTML =
            ctx.$('#tradeAction').value === 'buy' ? 'with'
              : ctx.$('#tradeAction').value === 'sell' ? 'for'
              : '-'
        }


        ctx.$('#executeTrade1').onclick = () => {
          const action = ctx.$('#tradeAction').value
          const amount = Number(ctx.$('#transactionAmount').value)

          const buyCurrency = action === 'buy'
            ? ctx.$('#currency1').value
            : ctx.$('#currency2').value

          const sellCurrency = action === 'sell'
            ? ctx.$('#currency1').value
            : ctx.$('#currency2').value

          if (!action) {
            ctx.$('#tradeError').innerHTML = 'Invalid trade action'
            return
          }

          if (! (amount > 0) ) {
            ctx.$('#tradeError').innerHTML = 'Oops, you want to trade more than that!'
            return
          }

          if (buyCurrency === sellCurrency) {
            ctx.$('#tradeError').innerHTML = `Buy currency cannot equal Sell currency`
            return
          }

          if (buyCurrency === 'crypto') {
            ctx.$('#tradeError').innerHTML = `Oops! You want to buy ₱ (or sell ₢)!`
            return
          }


          ctx.$('#cBalance').innerHTML = '0.000000'
          ctx.$('#pBalance').innerHTML = '462.189697'

          ctx.$('#executeTrade1').classList.add('hidden')
          ctx.$('#executeTrade2').classList.remove('hidden')
          ctx.$('#tradeChallenge').innerHTML = ''
          ctx.$('#tradeError').innerHTML = ''

          let cryptoPStart = 14.349261
          let premiumCStart = 0.069690

          const $cryptoP = ctx.$('#cryptoP')
          const $premiumC = ctx.$('#premiumC')

          let i = 0
          const tradingInterval = setInterval(() => {
            $cryptoP.innerHTML = (cryptoPStart - (i * 0.07)).toFixed(6)
            $premiumC.innerHTML = (premiumCStart + (i * 0.05)).toFixed(6)
            i++

            if (cryptoPStart - (i * 0.07) < 0.1) {
              clearInterval(tradingInterval)
              ctx.$('#tradeChallenge').innerHTML = `Now it looks like ₱ is expensive relative to ₢! Realize your profits by selling all of your ₱ for ₢!`

              ctx.$('#tradeAction').value = ''
              ctx.$('#transactionAmount').value = ''
              $cryptoP.innerHTML = '0.096960'
              $premiumC.innerHTML = '10.313531'
              ctx.$('#tradeError').innerHTML = 'Now it looks like ₱ is expensive relative to ₢! Realize your profits by selling all of your ₱ for ₢!'
            }
          }, 10)
        }


        ctx.$('#executeTrade2').onclick = () => {
          const action = ctx.$('#tradeAction').value
          const amount = Number(ctx.$('#transactionAmount').value)

          const buyCurrency = action === 'buy'
            ? ctx.$('#currency1').value
            : ctx.$('#currency2').value

          const sellCurrency = action === 'sell'
            ? ctx.$('#currency1').value
            : ctx.$('#currency2').value

          if (!action) {
            ctx.$('#tradeError').innerHTML = 'Invalid trade action'
            return
          }

          if (! (amount > 0) ) {
            ctx.$('#tradeError').innerHTML = 'Oops, you want to trade more than that!'
            return
          }

          if (buyCurrency === sellCurrency) {
            ctx.$('#tradeError').innerHTML = `Buy currency cannot equal Sell currency`
            return
          }

          if (buyCurrency === 'premium') {
            ctx.$('#tradeError').innerHTML = `Oops! You want to buy ₢ (or sell ₱)!`
            return
          }


          ctx.$('#cBalance').innerHTML = '4766.807768'
          ctx.$('#pBalance').innerHTML = '0.000000'

          ctx.$('#tradeChallenge').innerHTML = 'You did it!'
          ctx.$('#tradeError').innerHTML = 'You did it!'
          ctx.$('#cryptoNext12').classList.remove('hidden')
        }

        ctx.$('#cryptoNext1').onclick = () => {
          ctx.$('#p1').classList.add('hidden')
          ctx.$('#p2').classList.remove('hidden')
        }


        ctx.$('#cryptoNext2').onclick = () => {
          ctx.$('#p2').classList.add('hidden')
          ctx.$('#p3').classList.remove('hidden')
        }

        ctx.$('#cryptoNext3').onclick = () => {
          ctx.$('#p3').classList.add('hidden')
          ctx.$('#p4').classList.remove('hidden')
        }

        ctx.$('#cryptoNext4').onclick = () => {
          ctx.$('#p4').classList.add('hidden')
          ctx.$('#p5').classList.remove('hidden')
        }

        ctx.$('#cryptoNext5').onclick = () => {
          ctx.$('#p5').classList.add('hidden')
          ctx.$('#p6').classList.remove('hidden')
        }

        ctx.$('#cryptoNext6').onclick = () => {
          ctx.$('#p6').classList.add('hidden')
          ctx.$('#p7').classList.remove('hidden')
        }

        ctx.$('#cryptoNext7').onclick = () => {
          ctx.$('#p7').classList.add('hidden')
          ctx.$('#p8').classList.remove('hidden')
        }

        ctx.$('#cryptoNext8').onclick = () => {
          if (cryptoBalance < 20) {
            ctx.$('#mineMessage').innerHTML = `Uh oh, you haven't mined 20 ₢rypto yet!`
            return
          }
          ctx.$('#p8').classList.add('hidden')
          ctx.$('#p9').classList.remove('hidden')
        }

        ctx.$('#cryptoNext9').onclick = () => {
          if (!unstaked) {
            ctx.$('#yieldError').innerHTML = `Try staking until you have 30 ₢rypto, then unstake!`
            return
          }
          ctx.$('#p9').classList.add('hidden')
          ctx.$('#p10').classList.remove('hidden')
        }

        ctx.$('#cryptoNext10').onclick = () => {
          ctx.$('#p10').classList.add('hidden')
          ctx.$('#p11').classList.remove('hidden')
        }


        ctx.$('#cryptoNext11').onclick = () => {
          ctx.$('#p11').classList.add('hidden')
          ctx.$('#p12').classList.remove('hidden')
        }

        ctx.$('#cryptoNext12').onclick = () => {
          ctx.$('#p12').classList.add('hidden')
          ctx.$('#p13').classList.remove('hidden')
        }

        ctx.$('#complete').onclick = () => {
          completeSound(1.75)
          ctx.state.screen = 'educator'
          ctx.setUserData({
            educatorModulesCompleted: { ...educatorModulesCompleted, crypto: true}
          })
        }

      }


      ctx.$('#quit').onclick = () => {
        ctx.setState({ screen: 'educator' })
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
              <h5 id="step2Error"></h5>
            </section>
          </div>
        `

        ctx.$('#next').onclick = () => {
          if (!ctx.$('#ssn').value) {
            ctx.$('#step2Error').innerHTML = 'Please input a valid SSN'
            return
          }
          if (!ctx.$('#address').value) {
            ctx.$('#step2Error').innerHTML = 'Please input a legal mailing address'
            return
          }
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
                  ${['Agender', 'Androgynous', 'Bigender', 'Binary', 'Demigender', 'DemiFlux', 'GenderFluid', 'GenderNonConforming', 'Genderqueer', 'Hijra', 'Intersex', 'Male', 'NonBinary', 'Other', 'Pangender', 'Transfeminine', 'Transmasculine', 'TransNonBinary', 'TwoSpirit', 'Woman'].map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Sexual Orientation</legend>
                <select value="${idWizardInfo.sexualOrientation}" id="sexualOrientation">
                  ${['Androgynosexual', 'Androsexual', 'Aromantic', 'Asexual', 'Bisexual', 'BiCurious', 'Demisexual', 'Finsexual', 'Gay', 'GrayAsexual', 'Gynosexual', 'Heteroflexible', 'Heterosexual', 'Homoflexible', 'Homosexual', 'Lesbian', 'Lithosexual', 'Minsexual', 'Neptunic', 'Ninsexual', 'Objectumsexual', 'Omnisexual', 'Pansexual', 'Polysexual', 'Queer', 'Sapiosexual', 'Saturnic', 'Skoliosexual', 'Straight', 'Uranic'].map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </fieldset>

              <fieldset>
                <legend>Martial Status</legend>
                <select value="${idWizardInfo.martialStatus}" id="martialStatus">
                  ${['CasualRelationship', 'CivilUnion', 'Divorced', 'DomesticPartner', 'Married', 'FilingForDivorce', 'Polyamorous', 'Single', 'RelationshipAnarchy'].map(m => `<option value="${m}">${m}</option>`).join('')}
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

        <style>
          #upgradeButton {
            display: inline-block;
            padding: 0.25em 0.5em;
            margin-left: 1em;
            border: 1px solid;
            cursor: pointer;
            user-select: none;
            font-weight: bold;
            font-size: 0.8em;
            background: #fff;
            color: #000;
          }

          #upgradeButton:hover {
            background: #000;
            color: #fff;
          }
        </style>
        <div class="phoneScreen">
          <button id="home">Back</button>
          <div>
            <button id="sound">${soundEnabled ? 'Disable' : 'Enable'} Sound</button> ${soundEnabled ? soundSVG : noSoundSVG}<br>
            <button id="bluetooth">${bluetoothEnabled ? 'Disable' : 'Enable'} Bluetooth ®</button><h4 id="message" style="display: inline-block; margin-left: 1em"></h4><br>
            <button id="a11y">${a11yEnabled ? 'Disable' : 'Enable'} A11Y Mode</button><br>
            <button id="nightMode">${nightModeEnabled ? 'Disable' : 'Enable'} Night Mode</button>
            <div>
              <label style="display: block; font-size: 0.9em"><input id="noDistraction" type="radio" name="distractionMode" ${distractionMode === 1 ? 'checked' : ''}> No-Distraction Mode</label>
              <label style="display: block; font-size: 0.9em"><input id="deepFocus" type="radio" name="distractionMode" ${distractionMode === 2 ? 'checked' : ''}> Deep Focus Mode</label>
              <label style="display: block; font-size: 0.9em"><input id="multitask" type="radio" name="distractionMode" ${distractionMode === 0 ? 'checked' : ''}> Multitask Mode</label>
            </div>
          </div>

          <div class="deviceData" style="margin-top: 2em">
            <h5>Device ID: 49-222999-716-2580</h5>
            <h5>User: ${userNames[currentUser]}</h5>
            <h5 id="versionNumber">SmartOS Version: 1.${window.GAME_VERSION}.1</h5>
            <h5><a href="https://steviep.xyz" target="_blank">stevie.xyz</a> [2024]</h5>
          </div>
          ${devMode
            ? `
              <div style="margin-top: 0.5em; padding: 0.5em; border: 1px solid; height: 230px; overflow: scroll">
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
                <div><input id="appCredits" type="number" placeholder="app market credits"> <button id="setAppCredits">Set</button></div>
                <div><input placeholder="admin account"> <button>Set</button></div>
                <button id="dlJB">Download JailBreaker</button>

                <div><input id="teleportVal"  placeholder="room"> <button id="teleport">Teleport</button></div>
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
                    <td>1.877.222.5379</td>
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

                <button style="margin-bottom: 3em" onclick="localStorage.clear(); location.reload()">Factory Reset</button>


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
          globalState.routerReset = true
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
          ctx.state.userData[0].password = ''
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

        ctx.$('#setAppCredits').onclick = () => {
          ctx.state.userData[currentUser].appCreditBalance = Number(ctx.$('#appCredits').value)
        }

        ctx.$('#teleport').onclick = () => {
          window.primarySM.goto(ctx.$('#teleportVal').value)
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

      ctx.$('#nightMode').onclick = () => {
        ctx.setState({ nightModeEnabled: !nightModeEnabled })
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
          window.allSources.forEach(s => s.unmute())
        } else {
          window.allSources.forEach(s => s.mute())
          window.speechSynthesis.cancel()
        }
        ctx.setState({ soundEnabled: !soundEnabled })
        globalState.soundMuted = soundEnabled
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
      const availableActions = ctx.state.availableActions.filter(a => !['standUpBed', 'openPhone', 'closePhone', 'hallway', 'hallwayShower', 'externalHallway', 'livingRoom', 'bathroom', 'bedroom', 'hallwayCurrent', 'kitchen', 'livingRoomCurrent', 'resetRouter', 'checkWifiPower', 'frontDoorListen', 'pickupEnvelopes', 'reenterApartment', 'externalHallwayBack', 'bottomRouter', 'unplugRouter', 'router', 'turnOnTV', 'turnOffTV', 'openDoorUnlocked', 'openDoorLocked'].includes(a.value))

      const objects = availableActions.map(a => `<button id="qr-${a.value}" style="margin-right: 0.25em">${a.text}</button>`).join('')
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>QR SCANNER</h2>
          <div style="padding: 0.5em">${availableActions.length ? objects : '...'}</div>
          <h4 id="error"></h4>
        </div>
      `

      availableActions.forEach(a => {
        ctx.$('#qr-'+a.value).onclick = () => {
          if (a.qr) {
            if (a.qr.screen === 'messageViewer' && hasMessageViewer) {
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

      const hasConnection = (wifiAvailable || findMeshPairing('gateLink', 'wake')) && wakePaired

      const deviceInterface = `
        ${wifiAvailable || findMeshPairing('gateLink', 'wake')
            ? `<h4 style="text-align: center">Current Time: NaN<span class="blink">:</span>NaN<span class="blink">:</span>NaN</h4>
              <h4 style="text-align: center">Alarm Set: <span id="currentAlarm"></span></h4>
            `
            : `
              <h3 class="blink" style="margin: 1em 0; padding-left: 1em">[WI-FI ERROR] CANNOT CONNECT TO LOCAL WI-FI NETWORK</h3>
              <h4 style="text-align: center">Current Time: <span style="font-size: 0.75em">[CANNOT RETRIEVE DEVICE DATA FROM SERVER]</span></h4>
              <h4 style="text-align: center">Alarm Set: <span id="currentAlarm"></span></h4>
            `
        }

        <div style="display: flex; flex-direction: column; align-items: center; margin: 0.5em">
          <h5>Choose Alarm:</h5>
          ${times(4, (ix) => `
            <label style="display: block; font-size: 0.9em">
              <input id="alarm-${ix}" type="radio" name="alarm-${ix}" ${alarmRing === ix ? 'checked' : ''}> ${hasConnection ? `Alarm ${ix}` : ''} <span id="alarm-${ix}-label"></span>
            </label>`).join('')}
        </div>
      `


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
                : `<h4>Please enable bluetooth to pair Wake device</h4>`
            }

          </div>
          <div>
            ${jailbrokenApps.wake ? jbMarkup(globalState.cryptoDevices.wake, !bluetoothEnabled || !wakePaired) : ''}
          </div>

          <footer style="margin-top: 1em"><h5 style="text-align: center; font-style: italic">Wake</h5></footer>
        </div>
      `

      jbBehavior(ctx, 'wake', 250)

      if (ctx.$('#currentAlarm')) {
        if (!globalState.cryptoDevices.wake.active) ctx.setInterval(() => {
          ctx.$('#currentAlarm').innerHTML = formatTime(globalState.countdownTimeLeft + 2000)
        }, 1000)
      }

      if (hasConnection) {
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
                if (i === 4) {
                  clearInterval(interval)
                  src.stop()
                  src2.stop()
                  return
                }
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
                setTimeout(() => {
                  src1.stop()
                  src2.stop()
                  src3.stop()
                  src4.stop()
                }, 500)
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
                    setTimeout(() => {
                      src1.stop()
                      src2.stop()
                      src3.stop()
                      src4.stop()
                    }, 500)
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

                ...mainRiff.map(n => n*0.749),
                ...mainRiff.map(n => n*0.707),
                ...mainRiff.map(n => n*0.666),
                ...mainRiff.map(n => n*0.6),
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


              const secondaryKeys = [
                311.13, 311.13, 311.13, 311.13,
                311.13, 311.13, 415.3, 415.3,
                349.23, 349.23, 277.18, 277.18,
                277.18, 277.18, 261.63, 233.08,
                // 261.63, 261.63, 261.63, 261.63,
                261.63, 261.63, 261.63, 258.63,
                // 261.63, 261.63, 349.23, 349.23,
                255.63, 250.63, 330.23, 300.23,
                233.08, 225, 220, 215,
                210, 205, 200, 200,
                // 233.08, 233.08, 233.08, 233.08,
                // 233.08, 233.08, 233.08, 233.08, //261.63, 233.08
              ]

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
                  src1.stop()
                  src2.stop()
                  src3.stop()
                }, timePassed2)
              }, measure*32)
            }
          }
        })
      } else {
        times(4, ix => {
          if (ctx.$('#alarm-' + ix)) ctx.$('#alarm-' + ix).onclick = () => {
            setTimeout(() => ctx.$(`#alarm-${ix}-label`).innerHTML += `[CANNOT RETRIEVE]`, 500)
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

      const presets = [
        ['bright', 'Bright', {h: 0, s: 0, v: 100}, {h: 180, s: 0, v: 0}],
        ['nightMode', 'Night Mode', {h: 0, s: 0, v: 0} , {h: 2, s: 98, v: 81}],
        ['lagoon', 'Lagoon', {h: 84, s: 44, v: 12} , {h: 162, s: 65, v: 100}],
        ['info', 'Info', {h: 240, s: 100, v: 100} , {h: 60, s: 100, v: 100}],
        ['brooding', 'Brooding', {h: 7, s: 92, v: 19} , {h: 50, s: 32, v: 43}],
        ['cyber', 'Cyber', {h: 299, s: 100, v: 17} , {h: 174, s: 100, v: 100}],
        ['opportunity', 'Opportunity', {h: 180, s: 100, v: 100} , {h: 0, s: 100, v: 100}],
        ['cozy', 'Cozy', {h: 11, s: 23, v: 16} , {h: 60, s: 59, v: 90}],
        ['peach', 'Peach', {h: 0, s: 67, v: 100} , {h: 160, s: 65, v: 100}],
      ]

      const mainInterface = `
        <button id="offOn">${lampOn ? 'Turn Off' : 'Turn On'}</button>
        ${lampOn
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

              <div style="padding: 1em">
                <h3 style="margin-bottom: 0.25em">Popular Presets:</h3>
                ${wifiAvailable || findMeshPairing('gateLink', 'lumin')
                  ? presets.map(p => `<button id="${p[0]}-preset">${p[1]}</button> `).join('')
                  : `<div style="font-family: sans-serif; font-size: 0.8em">Cannot retrieve popular presets. Please make sure that your Lumin device is able to connect to your home's <strong>local wifi network</strong>, and then restart your Lumin app.</div>`
                }
              </div>

              ${
                ctx.state.shaydLuminPair
                  ? ''
                  : `
                    <div style="padding: 0 1em">
                      <h3>Save Electricity!</h3>
                      <p>Automatically turn off lumin lights when you open your blinds: <button id="pairShaydLumin">Pair Shayd</button></p>
                      <h5 id="pairShaydLuminError"></h5>
                    </div>
                  `
              }
            `
            : ''
        }
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          ${
            bluetoothEnabled
              ? !inInternetLocation ? '<h3>Device Out Of Range</h3>'
                : luminPaired
                  ? mainInterface
                  : `<button id="pairLumin">Pair Device</button>`
              : `<h3>Please enable blue tooth to pair local devices</h3>`
          }

          <div>${jailbrokenApps.lumin ? jbMarkup(globalState.cryptoDevices.lumin, !lampOn || !luminPaired || !bluetoothEnabled || !inInternetLocation) : ''}</div>
          <h2 style="text-align: center; font-family: cursive">☼ Lumin ☀︎</h2>
        </div>
      `

      if (ctx.$('#pairLumin')) ctx.$('#pairLumin').onclick = () => {
        ctx.$('#pairLumin').innerHTML = 'Pairing...'
        ctx.$('#pairLumin').disabled = true
        setTimeout(() => {
          ctx.setState({ luminPaired: true })
        }, 1000)
      }

      if (ctx.$('#pairShaydLumin')) ctx.$('#pairShaydLumin').onclick = () => {
        if (wifiAvailable || findMeshPairing('gateLink', 'lumin')) {
          ctx.$('#pairShaydLuminError').innerHTML = 'Pairing...'
          setTimeout(() => {
            ctx.setState({
              shaydLuminPair: true
            })
          }, 2000)
        } else {
          ctx.$('#pairShaydLuminError').innerHTML = 'Error: Lumin device cannot locate Shayd device over WiFi network'
        }
      }

      const turnOffMiner = jbBehavior(ctx, 'lumin', 300, noop, () => {
        globalState.light1.h += 1
        globalState.light2.h -= 1

        if (globalState.light1.h >= 360) globalState.light1.h = 0
        if (globalState.light2.h <= 0) globalState.light2.h = 360

        if (globalState.light1.s <= 100) globalState.light1.s = Math.min(globalState.light1.s + 1, 100)
        if (globalState.light1.v <= 100) globalState.light1.v = Math.min(globalState.light1.v + 1, 100)
        if (globalState.light2.s <= 100) globalState.light2.s = Math.min(globalState.light2.s + 1, 100)
        if (globalState.light2.v <= 100) globalState.light2.v = Math.min(globalState.light2.v + 1, 100)

        if (globalState.lightsOn) {
          setColors(hsvToRGB(globalState.light1), hsvToRGB(globalState.light2))
        }

      })

      const changeLight = () => {
        const { light1, light2 } = globalState

        if (globalState.lightsOn) {
          setColors(hsvToRGB(light1), hsvToRGB(light2))
        } else if (globalState.shaydOpen) {
          setColors('var(--light-color)', 'var(--dark-color)')
        } else {
          setColors('var(--dark-color)', 'var(--light-color)')
        }
      }

      // console.log(globalState.light1, globalState.light2)

      if (ctx.$('#offOn')) ctx.$('#offOn').onclick = () => {
        globalState.lightsOn = !lampOn
        ctx.setState({ lampOn: !lampOn })
        changeLight()

        if (lampOn) {
          turnOffMiner()
        } else {
          if (ctx.state.shaydLuminPair && globalState.shaydOpen) {
            globalState.shaydOpen = false
            const stateUpdate = ctx.state.plantStatus === 0 ? {} : {
              plantStatus: ctx.state.plantStatus - 1
            }
            ctx.setState(stateUpdate, true)
          }
        }
      }

      if (lampOn && inInternetLocation) {
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

      if ((wifiAvailable || findMeshPairing('gateLink', 'lumin')) && lampOn && luminPaired && bluetoothEnabled && inInternetLocation) {
        presets.forEach(p => {
          ctx.$(`#${p[0]}-preset`).onclick = () => {
            globalState.light1 = p[2]
            globalState.light2 = p[3]

            ctx.$('#l1h').value = p[2].h
            ctx.$('#l1s').value = p[2].s
            ctx.$('#l1v').value = p[2].v
            ctx.$('#l2h').value = p[3].h
            ctx.$('#l2s').value = p[3].s
            ctx.$('#l2v').value = p[3].v
            changeLight()
          }
        })
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
        <div>
          <h4>FAQ</h4>
          <p style="margin-top: 0.5em; padding-left: 1em"><strong>Q:</strong> How does Money Miner work?</p>
          <p style="font-size: 0.9em; padding-left: 1em"><strong>A:</strong> In order to mine ₢rypto, all you need to do is click the <strong>Mine ₢rypto"</strong> button in the Money Miner interface. Each click will mine a new ₢rypto.</p>

          <p style="margin-top: 0.5em; padding-left: 1em"><strong>Q:</strong> How can I convert ₢rypto to $?</p>
          <p style="font-size: 0.9em; padding-left: 1em"><strong>A:</strong> Exchanging ₢rypto is easy! Just download the <strong>Currency Xchange App</strong>, send ₢rypto to your new wallet, and start trading! </p>

          <p style="margin-top: 0.5em; padding-left: 1em"><strong>Q:</strong> Where can I learn more?</p>
          <p style="font-size: 0.9em; padding-left: 1em"><strong>A:</strong> Download the <strong>Personal Finance Educator</strong> app and check out the CryptoCurrency learning module!</p>
        </div>
      `


      const cryptoBalance = cryptoBalances[moneyMinerCryptoAddr] || 0


      ctx.$phoneContent.innerHTML = `

        <style>
          #popupContainer:hover {
            filter: invert(1);
          }

        </style>
        ${ctx.state.showMMPopup
          ? `
          <div id="popupContainer" style="position: absolute; border: 2px solid; background: #fff; padding: 0.25em; width: 200px; margin-top: 107px; margin-left: 17px; user-select: none">
            <span id="closePopUp" style="position: absolute; padding: 0.25em; cursor: pointer">X</span>
            <div id="popupContent" style="padding-top: 1.25em; cursor: pointer">
              <h2 style="padding: 0.5em" id="popupText">Do YoU cRAvE yIeLd?? THeN cLiCk HeRe</h2>
            </div>
          </div>
          `
          : ''
        }
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

          <div class="sc" id="scContainer1">
            <h5>SPONSORED CONTENT</h5>
            <div id="sc">${getAd(cryptoAdContent).text}</div>
          </div>


          <div style="margin-top: 0.5em; margin-bottom: 0.4em">
            <h4>Send ₢rypto</h4>
            <input id="recipient" placeholder="0x000000000000000....">
            <input id="amount" placeholder="₢ 0.00" type="number" style="width: 13ch">
            <button id="send" style="margin-top: 0.25em">Send</button>
            <h4 id="error"></h4>
          </div>


          ${faq}


        </div>

      `

      ctx.setInterval(() => {
        ctx.$('#sc').innerHTML = getAd(cryptoAdContent).text
      })

      if (ctx.$('#closePopUp')) ctx.$('#closePopUp').onclick = () => {
        ctx.setState({
          showMMPopup: false
        })

      }
      if (ctx.$('#popupContent')) ctx.$('#popupContent').onclick = () => {

        if (ctx.state.autominerAdClicked) {
          ctx.setState({
            yieldMasterAdClicked: true,
            screen: 'appMarket',
            appMarketPreSearch: 'yield'
          })

        } else {
          if (hasMessageViewer) {
            ctx.alert('Please download the Message Viewer app from the AppMarket to view this message')
            return
          }
          ctx.setState({
            autominerAdClicked: true,
            screen: 'messageViewer',
            messageViewerMessage: moneyMinerMessage
          })
        }
      }

      ctx.$('#mine').onclick = () => {
        if (!hasInternet) {
          ctx.$('#cryptoBalance').innerHTML = 'CANNOT CONNECT TO BLOCKCHAIN'
          return
        }

        let adState = ctx.state.totalMined === 99 || (ctx.state.totalMined === 299 && !ctx.state.yieldMasterAdClicked)
          ? {
            showMMPopup: true
          }
          : {}


        ctx.setState({
          totalMined: (ctx.state.totalMined || 0) + 1,
          ...adState,
          cryptoBalances: {
            ...cryptoBalances,
            [moneyMinerCryptoAddr]: (cryptoBalance || 0) + 1
          }
        })
      }


      ctx.$('#scContainer1').onclick = () => {
        if (hasMessageViewer) {
          ctx.alert('Please download the Message Viewer app from the AppMarket to view this message')
          return
        }
        ctx.setState({
          autominerAdClicked: true,
          ...getAd(cryptoAdContent).update
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
        } else if (!recipient.includes('0x')) {
          ctx.$('#error').innerHTML = 'Error: invalid recipient wallet address'
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
      const premiumPrice = exchangePremiumDiscounted ? 9999 : 10000

      const tabHighlight = `font-weight: bold; text-decoration: underline;`
      ctx.$phoneContent.innerHTML = `
        <style>
          select:invalid {
            color: #777;
          }
        </style>

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

          <div style="padding: 0.25em; border: 3px solid;">
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
                  <select id="tradeAction" style="box-shadow: 1px 1px 0 ${exchangePremium ? '#fff' : '#000'}" required>
                    <option value="" selected disabled>-</option>
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                  </select>

                  <select id="currency1" style="box-shadow: 1px 1px 0 ${exchangePremium ? '#fff' : '#000'}">
                    <option value="usd">$</option>
                    <option value="crypto">₢</option>
                    ${exchangePremium ? '<option value="premium">₱</option>' : ''}
                  </select>

                  <input id="transactionAmount" placeholder="0.00" step=".01" style="width: 5em; text-align: center" type="number">


                  <span id="tradeOperation">to</span>

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
                    <button id="buyPremium" ${exchangeCryptoBalance < premiumPrice ? 'disabled' : ''} style="font-size: 1.2em; margin-bottom: 0.25em">BUY PREMIUM</button>
                    ${exchangePremiumDiscounted
                      ? `
                        <h4 style="text-decoration: line-through">₢ 10,000.00</h4>
                        <h2 >₢ 9,999</h2>
                      `
                      : `<h4>₢ 10,000.00</h4>`
                    }
                    ${exchangeCryptoBalance < premiumPrice && hasInternet ? '<h5>(CURRENT BALANCE TOO LOW)</h5>' : ''}
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
        } else if (ctx.$('#tempAddr').innerHTML.includes('ERROR') || seconds === 0) {
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
        if (exchangeCryptoBalance >= premiumPrice && hasInternet) ctx.setUserData({
          exchangePremium: true,
          exchangeCryptoBalance: exchangeCryptoBalance - premiumPrice,

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
            ctx.$('#sendUSDError').innerHTML = `PROCESSING ERROR: Recipient outside payment network [Funds can only be transmetted to licensed payment processors]`
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
          ctx.$('#tradeAction').value === 'buy' ? 'with'
            : ctx.$('#tradeAction').value === 'sell' ? 'for'
            : '-'

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




        const _sellAmount = action === 'sell'
          ? amount
          : amount / exchangeRate

        const _buyAmount = action === 'buy'
          ? amount
          : amount * exchangeRate

        const buyAmount = roundSixDigits(_buyAmount )
        const sellAmount = roundSixDigits(_sellAmount)

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

        if (!action) {
          ctx.$('#tradeError').innerHTML = 'Invalid trade action'
          return
        }

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
                <h5>Global Score: <span id="globalHighScore">${ctx.state.yieldFarmerGlobalHighScore.toFixed(2)}</span></h5>
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
          ctx.state.yieldFarmerGlobalHighScore = currentScore
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
      const {smartLockPaired} = ctx.state
      const mainContent = smartLockPaired
        ? `
          <div>
            <h3>Lock Status: ${globalState.smartLockOpen ? 'Unlocked' : 'Locked'}</h3>
            <button id="toggleSmartLock">${globalState.smartLockOpen ? 'Lock' : 'Unlock'}</button>
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
          <h3 id="lockError" style="padding: 0.5em"></h3>
          <div>${jailbrokenApps.lock ? jbMarkup(globalState.cryptoDevices.lock, !bluetoothEnabled || !inInternetLocation || !smartLockPaired) : ''}</div>
        </div>
      `



      jbBehavior(ctx, 'lock', 50)


      if (ctx.$('#pairSmartLock')) ctx.$('#pairSmartLock').onclick = () => {
        ctx.$('#lockError').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ smartLockPaired: true })
        }, 200)
      }

      if (ctx.$('#toggleSmartLock')) ctx.$('#toggleSmartLock').onclick = () => {
        ctx.$('#lockError').innerHTML = 'Proccessing'

        setTimeout(() => {
          if (!(wifiAvailable || findMeshPairing('gateLink', 'lock'))) {
            ctx.$('#lockError').innerHTML = 'Device Error: Wifi Connection Error <br>Device Error: Device Cannot Connect to "InpatientRehabilitationServices" Network'

          } else if (globalState.rentBalance <= 0) {
            globalState.smartLockOpen = !globalState.smartLockOpen
            ctx.setState({}, true)
            window.primarySM.enqueue('smartLockShift')

          } else {
            if (!globalState.sentEducatorText) {
              ctx.newText(educatorText)
              globalState.sentEducatorText = true
            }
            ctx.$('#lockError').innerHTML = `Error: Device Failed With Message: "PLEASE TAKE NOTICE that you are hereby required to pay to Landlock Realty, LLC landlord of the premisis, the sum of $${globalState.rentBalance.toFixed(2)} for rent of the premises (<span style="text-decoration: underline">Unit #948921</span>). <br><br>You are required to pay within <strong>-3 days</strong> from the day of service of this notice. All payments shall be made through the official Landlock Realty Rental App"`

            ctx.state.exchangePremiumDiscounted = true

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
        <div class="phoneScreen" style="flex: 1; display: flex; flex-direction: column;">
          <div><button id="home">Back</button></div>
          <h4>NotePad <span id="pairInfo"></span></h4>

          <textarea id="pad" style="flex: 1">${notePadValue || ''}</textarea>
        </div>
      `

      if (ctx.state.notepadUser === currentUser) {
        ctx.$('#pairInfo').innerHTML = `<em style="font-size: 0.75em">[Pair status: PAIRED]</em>`
      } else if (ctx.state.notepadUser !== currentUser) {
        ctx.$('#pairInfo').innerHTML = `<button id="pairNotePad">Pair</button>`
        ctx.$('#pairNotePad').onclick = () => {
          ctx.$('#pairInfo').innerHTML = `<em style="font-size: 0.75em">[Pair status: CONNECTING...]</em>`

          setTimeout(() => {
            ctx.setState({
              notepadUser: currentUser
            })
          }, 1000)
        }

      }

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
        `

      const mainInterface = wifiAvailable || findMeshPairing('gateLink', 'toastr')
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
              ? toastrPaired ? mainInterface : `<button id="pairToaster">Pair Device</button>`
              : `<h3>Must enable bluetooth permissions in Home/Settings</h3>`
          }
          <div>${jailbrokenApps.toastr ? jbMarkup(globalState.cryptoDevices.toastr, !bluetoothEnabled || !toastrPaired || !inInternetLocation) : ''}</div>
        </div>
      `


      jbBehavior(ctx, 'toastr', 300)


      if (ctx.$('#login')) ctx.$('#login').onclick = () => {
        ctx.$('#loginError').innerHTML = 'Credentials Incorrect'
      }

      if (ctx.$('#pairToaster')) ctx.$('#pairToaster').onclick = () => {
        ctx.setState({ toastrPaired: true })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'planter') {

      const plantStates = ['Dead <span class="icon">☠</span>', ':(', ':|', ':)']
      const {plantStatus} = ctx.state

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
          <div>${jailbrokenApps.planter && planterPaired ? jbMarkup(globalState.cryptoDevices.planter, !bluetoothEnabled || !inInternetLocation || !planterPaired) : ''}</div>
        </div>
      `

      jbBehavior(ctx, 'planter', 100, () => {
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

        if (!(wifiAvailable || findMeshPairing('gateLink', 'planter'))) {
          setTimeout(() => {
            ctx.$('#error').innerHTML = 'ERROR: SERVER NOT FOUND -- Please check that your device is connected to your local WiFi network'
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
      const {shaydPaired} = ctx.state
      const mainContent = shaydPaired
        ? `
          <div>
            <div style="display: flex; flex-direction: column; align-items: center">
              <h3 style="margin: 0.5em 0">Blinds: ${globalState.shaydOpen ? 'Open' : 'Closed'}</h3>
              <button id="toggleShaydOpen">${globalState.shaydOpen ? 'Close' : 'Open'}</button>
              <h3 id="shaydError" style="display: inline-block;"></h3>

              <h3 style="margin-top: 1em">Natural Sunlight Schedule:</h3>
              ${(wifiAvailable || findMeshPairing('gateLink', 'shayd')) ? '<h5 style="margin: 0.5em 0;"><em id="upgradeText">Feature available on Shayd v2.3</em></h5><button id="upgrade">Upgrade</button>' : ''}
            </div>

            ${
              !(wifiAvailable || findMeshPairing('gateLink', 'shayd'))
                ? `
                  <div style="margin: 0.5em 0; padding: 0.25em;width: 75%; background: #000; color: #fff; border: 2px dashed">
                    <p>CANNOT RETRIEVE NATURAL SUNLIGHT SCHEDULE FROM SHAYD SERVER</p>
                    <p><strong style="text-decoration: underline">PLEASE CHECK DEVICE WIFI CONNECTION AND RELOAD SHAYD APP</strong></p>
                  </div>
                `
                : ''
            }
          </div>

        `
        : `<div style="display: flex; justify-content: center; margin-top:1em"><button id="pairShayd">Pair Device</button></div>`

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
          <div>${jailbrokenApps.shayd ? jbMarkup(globalState.cryptoDevices.shayd, !bluetoothEnabled || !inInternetLocation || !shaydPaired) : ''}</div>
        </div>
      `

      const setBg = () => {
        if (!ctx.state.lampOn) {
          if (globalState.shaydOpen) {
            setColors('var(--light-color)', 'var(--dark-color)')
          } else {
            setColors('var(--dark-color)', 'var(--light-color)')
          }
        }
      }

      jbBehavior(ctx, 'shayd', 150, () => {
        if (globalState.shaydOpen) {
          globalState.shaydOpen = false
          const stateUpdate = ctx.state.plantStatus === 0 ? {} : {
            plantStatus: ctx.state.plantStatus - 1
          }
          ctx.setState(stateUpdate, true)

          setBg()
        }
      })


      if (ctx.$('#upgrade')) ctx.$('#upgrade').onclick = () => {
        ctx.$('#upgradeText').innerHTML = `Error: Shayd v2.3 unsupported on this operating system. Please upgrade your device's operating system using the Device Upgrader app.`

      }

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
            globalState.lightsOn = false
            stateUpdate = ctx.state.plantStatus === 0 ? {
              lampOn: false
            } : {
              lampOn: false,
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
      const {clearBreezePaired} = ctx.state

      const mainContent = clearBreezePaired
        ? `
          <div style="display: flex; flex-direction: column; align-items: center">
            <button id="openWindow" style="font-size: 1.2em">Open Window</button>
            <h3 id="windowError" style="text-align: center; margin-top: 0.5em"></h3>
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
          <div>${jailbrokenApps.clearBreeze ? jbMarkup(globalState.cryptoDevices.clearBreeze, !bluetoothEnabled || !inInternetLocation || !clearBreezePaired) : ''}</div>
        </div>
      `



      jbBehavior(ctx, 'clearBreeze', 150)


      if (ctx.$('#pairWindow')) ctx.$('#pairWindow').onclick = () => {
        ctx.$('#pairError').innerHTML = 'Please wait while device pairs'
        setTimeout(() => {
          ctx.setState({ clearBreezePaired: true })
        }, 800)
      }

      if (ctx.$('#openWindow')) ctx.$('#openWindow').onclick = () => {
        ctx.$('#windowError').innerHTML = 'Opening...'

        if (!(wifiAvailable || findMeshPairing('gateLink', 'clearBreeze'))) {
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
      const internetConnected = wifiAvailable || findMeshPairing('gateLink', 'thermoSmart')

      const mainInterface = `
        <h1 style="text-align: center; font-size: 3.5em; padding-left: 0.4em">${internetConnected ? `84˚` : '-˚'}</h1>
        <h3 style="text-align: center">CO2 Level: ${internetConnected ? `<span class="blink"><span class="icon">☠︎</span> HAZARDOUS <span class="icon">☠︎</span></span>` : '-'}</h3>
        ${internetConnected ? `<h4 style="text-align: center; margin-top: 0.5em">CONTINUED EXPOSURE AT THIS LEVEL MAY LEAD TO ADVERSE HEALTH EFFECTS</h4>
        ${!globalState.thermostatDisabled ? `<h4 style="text-align: center; font-size: 3em; animation-duration: 0.5s" class="blink">☣︎</h4>` : ''}
        ` : ''}
        <div style="text-align: center">
          ${internetConnected && !globalState.thermostatDisabled
            ? `<button id="disable" style="margin-top:1em">Snooze Warning</button> `
            : ''
          }
        </div>
        ${internetConnected ? `` : `ERROR: ThermoSmart device cannot find "InpatientRehabilitationServices" Network`}
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
          <div style="margin-top: 2em">${jailbrokenApps.thermoSmart ? jbMarkup(globalState.cryptoDevices.thermoSmart, !bluetoothEnabled || !inInternetLocation || !thermoSmartPaired) : ''}</div>
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


      jbBehavior(ctx, 'thermoSmart', 500)

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

    } else if (screen === 'flushMate') {
      const mainInterface = `
        <div style="text-align: center; margin: 1em 0">
          <button id="autoFlusher">${globalState.autoFlusherActive ? 'Disable' : 'Enable'} Auto-Flusher</button>
          <h3 style="margin-top: 0.5em">Auto-Flusher: <span style="font-size: 0.75em">${globalState.autoFlusherActive ? 'Enabled' : 'Disabled'}</span></h3>
          <h3>Toilet paper level: <span style="font-size: 0.75em">LOW</span></h3>
          <h3>AirFresh quantity: <span style="font-size: 0.75em">EMPTY</span></h3>
        </div>
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h1 style="margin-top: 1em; margin-bottom: 0;text-align: center">FlushMate</h1>
          <h3 style=" text-align: center; margin-top: 0.5em"><span class="icon" >♧ ♧ ♧ ♧ ♧</span></h3>
          ${
            bluetoothEnabled
              ? flushMatePaired
                ? mainInterface
                : `
                  <div style="text-align: center"><button id="pairFlushMate">Pair FlushMate</button></div>
                  <h3 id="pairError"></h3>
                `
              : `<h3 id="pairError">Please enable bluetooth</h3>`
          }
          <div style="margin-top: 2em">${jailbrokenApps.flushMate ? jbMarkup(globalState.cryptoDevices.flushMate, !bluetoothEnabled || !flushMatePaired) : ''}</div>
        </div>
      `


      jbBehavior(ctx, 'flushMate', 1000)


      if (ctx.$('#autoFlusher')) ctx.$('#autoFlusher').onclick = () => {
        globalState.autoFlusherActive = !globalState.autoFlusherActive
        ctx.setState({}, true)
      }

      if (ctx.$('#pairFlushMate')) ctx.$('#pairFlushMate').onclick = () => {
        ctx.$('#pairError').innerHTML = 'Please wait'
        setTimeout(() => {
          ctx.setState({ flushMatePaired: true })
        }, 500)
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
              <h4>Active UserID: <span id="activeUserID">${currentUser}</span></h4>
              <h4>Admin Access: <span id="adminAccess">${Number(currentUser) === Number(rootUser) ? 'Granted' : 'Denied'}</span></h4>
              <h4>Device ID: 49-222999-716-2580</h4>
              <h4>OS: SmartOS 1.${window.GAME_VERSION}.1</h4>
              <br>
              <br>
            `]})
            setTimeout(() => {
              ctx.setState({exeCommands: [...ctx.state.exeCommands, `
                <h5>Helpful Commands:</h5>
                <h5>"escape" -- exit the EXE Runner</h5>
                <h5>"lsprofiles" -- list device profile info</h5>
                <h5>"admin reassign [USER_NAME]" -- reassign admin functionality</h5>
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
          let userBehavior = {}
          let commandDisplay = command
          if (command.includes('escape')) {
            behavior = {
              screen: 'home',
              exeCommands: []
            }
          } else if (command.includes('lsprofiles')) {
            commandDisplay = `
              <style>
                td, th, table {
                  border: 1px solid
                }
              </style>
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
                    <td style="border: 1px solid; max-width: 165px; word-break: break-word; text-align: center">${userNames[id]}</td>
                    <td style="border: 1px solid; text-align: center">${Number(id) === Number(currentUser) ? '*' : ''}</td>
                    <td style="border: 1px solid; text-align: center">${Number(id) === Number(rootUser) ? '*' : ''}</td>
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
                <div style="border: 1px dotted; padding: 0.25em">
                  <div style="margin: 0.5em 0;">ERROR: command can only be performed by user with admin role: "${command}"</div>
                  <div style="margin: 0.5em 0;">To reassign admin role, run: "admin reassign [USER_NAME]"</div>
                  <div style="margin: 0.5em 0; font-weight: bold">Device admin profile: <span style="display: inline-block; padding: 0.25em; border: 1px solid">${userNames[rootUser]}</span></div>
                  <div style="margin: 0.5em 0; font-weight: bold">Please contact this user to perform the intended action</div>
                </div>
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
            } else if (fn === 'enable') {
              const [role, app] = args

              const validApps = appsInstalled.filter(a => a.physical).map(a => a.key)

              if (!validApps.includes(app)) {
                commandDisplay = `ERROR: "${app}" app not found OR app does not support ${role} functionality`
              } else if (role === 'signal-input') {
                commandDisplay = `Signal input enabled for ${app}!`
                if (app === 'lumin') globalState.luminInputEnabled = true
              } else if (role === 'signal-output') {
                if (app === 'gateLink') globalState.gateLinkOutputEnabled = true
                if (app === 'lumin') globalState.luminOutputEnabled = true
                commandDisplay = `Signal output enabled for ${app}!`
              }

            } else if (fn === 'disable') {
              const [path] = args
              if (path === '/System/.malware-detection.exe') {
                behavior = {
                  disabledMalDetection: true,
                }
                globalState.deviceViruses = true
                userBehavior = {
                  virusL1: true
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
              } else if (
                !['qd://0ms.co/tjn/jailbreakx-0_13_1.mal', 'qd://0ms.co/tjn/vscan-troj_9.mal'].includes(url)
              ) {
                commandDisplay = 'INSTALL ERROR: Invalid source ' + url
              } else if (!['/', '/Applications', '/Applications/$CURRENT_USER', '/Applications/$CURRENT_USER/', '/System', '/System/'].includes(location)) {
                commandDisplay = 'INSTALL ERROR: Invalid destination'
              } else {
                const locationUser = location.replace('/Applications/', '').replace('/', '')
                const locationUserId = locationUser === '$CURRENT_USER'
                  ? currentUser
                  : Object.keys(userNames).find(k => userNames[key] === locationUser) || null

                commandDisplay = `Installing ${url} to ${location.replace('$CURRENT_USER', userNames[currentUser])}`


                if (['/Applications/$CURRENT_USER', '/Applications/$CURRENT_USER/'].includes(location) && locationUserId !== null) {
                  if (!ctx.state.disabledMalDetection) {
                    setTimeout(() => {
                      ctx.setState({
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.5em 0; font-size:0.85em">INSTALL ERROR: System blocked install</div>`],
                      })
                    }, 3000)

                  } else {
                    if (url === 'qd://0ms.co/tjn/vscan-troj_9.mal') {
                      behavior = {
                        userData: {
                          ...userData,
                          [locationUserId]: {
                            ...userData[locationUserId],
                            virusL3: true,
                            appsInstalled: shuffle(appsInstalled)
                          }
                        }
                      }
                    } else if (url === 'qd://0ms.co/tjn/jailbreakx-0_13_1.mal') {
                      if (!userData[locationUserId].appsInstalled.map(a => a.key).includes('jailbreakr')) {
                        behavior = {
                          userData: {
                            ...userData,
                            [locationUserId]: {
                              ...userData[locationUserId],
                              virusL2: true,
                              appsInstalled: [
                                ...userData[locationUserId].appsInstalled,
                                { name: 'JAILBREAKR', key: 'jailbreak', size: 128, price: 0, jailbreakr: true }
                              ]
                            }
                          }
                        }
                      }
                    }
                    setTimeout(() => {
                      ctx.setState({
                        exeCommands: [...ctx.state.exeCommands, `<div style="margin: 0.5em 0; font-size:0.85em">Installed ${url}!</div>`],
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

            ctx.setUserData(userBehavior)
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
              ctx.$('#error').innerHTML = ab ? 'Application Binary B64 Decode Error' : 'Invalid Application Binary'
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

    } else if (screen === 'homeGrid') {
      const pairings = meshNetworkPairings
      const validOutputNodes = ctx.state.meshOutputNodes
      const validInputNodes = ctx.state.meshInputNodes

      const nodeList = appsInstalled.filter(a => a.physical).map(a => ({
        ...a,
        name: a.name.replace(`<sup>TM</sup>`, '™')
      }))
      const outputNodeList = nodeList.filter(a => validOutputNodes[a.key])
      const inputNodeList = nodeList.filter(a => validInputNodes[a.key])

      const addRemoveNodes = `
        <select id="addRemoveNodes" required>
          <option disabled selected value=''>Node Name</option>
          ${nodeList.map(a => `<option value="${a.key}">${a.name}</option>`).join('')}
        </select>

        <select id="addRemoveRole" required>
          <option disabled selected value=''>-</option>
          <option value="input">Input</option>
          <option value="output">Output</option>
        </select>

        <div style="margin-top: 0.25em">
          <button id="addNodeRole">Add</button>
          <button id="removeNodeRole">Remove</button>
        </div>
      `

      const inputNodes = `
        <select id="inputNodes" required>
          <option disabled selected value=''>Input Node</option>
          ${inputNodeList.map(a => `<option value="${a.key}">${a.name}</option>`).join('')}
        </select>
      `

      const outputNodes = `
        <select id="outputNodes" required>
          <option disabled selected value=''>Output Node</option>
          ${outputNodeList.map(a => `<option value="${a.key}">${a.name}</option>`).join('')}
        </select>
      `




      const connectionTable = `
        <table>
          ${outputNodeList.map(a => {

            const hasDirectConnection = a.key === 'gateLink' || wifiAvailable
            const hasConnection = findMeshPairing('gateLink', a.key)
            const validPairings = pairings[a.key]
              ? pairings[a.key]
                .filter(a => validInputNodes[a])
                .map(p => APPS.find(_a => _a.key === p)?.name || p)
              : []

            const sendingTo = validPairings.length
              ? validPairings.join(', ')
              : '-'

            if (!validPairings.length) return ''

            return `
              <tr>
                <td style="${hasConnection ? 'font-weight: bold; font-style: italic' : ''}; font-size: 0.8em">${hasDirectConnection ? '⇢ ' : ''}${a.name}</td>
                <td style="text-align: center; font-size: 0.8em">${sendingTo}</td>
              </tr>
            `
          }).join('')}
        </table>
        <h6 style="margin-top:0.25em"><em>⇢ Direct WiFi connection</em></h6>
      `

      const mainContent = `
        <section>
          <div style="margin-bottom: 0.5em">
            <h4>Add/Remove Nodes:</h4>
            ${addRemoveNodes}
            <h5 id="addRemoveError"></h5>
          </div>



          <h4>Connect Nodes:</h4>
          ${outputNodes}
          ${inputNodes}
          <button id="connect" style="margin-top: 0.25em">Connect</button>
          <h5 id="connectionError"></h5>
        </section>

        <section>
          <h4>Network Diagram:</h4>
          ${connectionTable}
        </section>
      `



      ctx.$phoneContent.innerHTML = `
        <style>
          td {
            border-right: 1px solid;
            border-bottom: 1px solid;
            padding: 0.25em;
          }
          td:first-child {
            border-left: 1px solid;
          }

          tr:first-child td {
            border-top: 1px solid;
          }

          section {
            margin-top: 0.75em;
          }

          select:invalid {
            color: #777;
          }

          code {
            display: inline-block;
            border: 1px solid;
          }

        </style>
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3 style="border: 1px dotted; text-align: center; padding: 0.25em">HomeGrid Local Mesh Network Setup</h3>

          ${bluetoothEnabled && inInternetLocation
            ?  mainContent
            : `<h3>No network nodes found: Please Ensure that Bluetooth is enabled on this device, and that you are in range of acceptable network nodes</h3>`
          }
        </div>
      `

      if (bluetoothEnabled && inInternetLocation) {
        ctx.$('#connect').onclick = () => {
          const input = ctx.$(`#inputNodes`).value
          const output = ctx.$(`#outputNodes`).value

          ctx.$('#connectionError').innerHTML = '...'

          setTimeout(() => {
            if (!input) return ctx.$('#connectionError').innerHTML = `Please select an input node`
            if (!output) return ctx.$('#connectionError').innerHTML = `Please select an output node`
            if (input === output) return ctx.$('#connectionError').innerHTML = `Cannot connect node to self`
            if (!validInputNodes[input]) return ctx.$('#connectionError').innerHTML = `Invalid Input Node`
            if (!validOutputNodes[output]) return ctx.$('#connectionError').innerHTML = `Invalid Output Node`

            if (!DEVICE_RANGES[output].includes(input)) return ctx.$('#connectionError').innerHTML = `Input node out of range`

            ctx.setState({
              meshNetworkPairings: {
                ...ctx.state.meshNetworkPairings,
                [output]: ctx.state.meshNetworkPairings[output] ? [...ctx.state.meshNetworkPairings[output], input] : [input]
              }
            })
          }, 500)

        }


        ctx.$('#addNodeRole').onclick = () => {
          const node = ctx.$('#addRemoveNodes').value
          const role = ctx.$('#addRemoveRole').value

          ctx.$('#addRemoveError').innerHTML = '...'

          setTimeout(() => {
            if (!node) return ctx.$('#addRemoveError').innerHTML = 'Invalid Node Selected'
            if (!role) return ctx.$('#addRemoveError').innerHTML = 'Invalid Role Selected'

            if (role === 'output' && node === 'gateLink' && !globalState.gateLinkOutputEnabled) {
              return ctx.$('#addRemoveError').innerHTML = 'Signal output not enabled on device. Please run <code>enable signal-output gateLink</code> in the <strong>EXE Runner</strong> application to enable this functionality.'
            }
            if (role === 'input' && node === 'lumin' && !globalState.luminInputEnabled) {
              return ctx.$('#addRemoveError').innerHTML = 'Signal input not enabled on device. Please run <code>enable signal-input lumin</code> in the <strong>EXE Runner</strong> application to enable this functionality.'

            }
            if (role === 'output' && node === 'lumin' && !globalState.luminOutputEnabled) {
              return ctx.$('#addRemoveError').innerHTML = 'Signal output not enabled on device. Please run <code>enable signal-output lumin</code> in the <strong>EXE Runner</strong> application to enable this functionality.'
            }

            const key = role === 'input' ? 'meshInputNodes' : 'meshOutputNodes'
            ctx.setState({
              [key]: {
                ...ctx.state[key],
                [node]: true
              }
            })
          }, 500)

        }

        ctx.$('#removeNodeRole').onclick = () => {
          const node = ctx.$('#addRemoveNodes').value
          const role = ctx.$('#addRemoveRole').value

          if (!node) return ctx.$('#addRemoveError').innerHTML = 'Invalid Node Selected'
          if (!role) return ctx.$('#addRemoveError').innerHTML = 'Invalid Role Selected'

          const key = role === 'input' ? 'meshInputNodes' : 'meshOutputNodes'
          ctx.setState({
            [key]: {
              ...ctx.state[key],
              [node]: false
            }
          })
        }
      }



      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'smartTV') {

      const mainInterface = `
        <h4 style=" margin: 0.4em 0">SmartCast</h4>
        <div style="padding-left: 1em">PhoneCasting <button id="togglePhoneCast">${ctx.state.phoneCastingEnabled ? 'Disable' : 'Enable'}</button></div>
        <div style="padding-left: 1em">DeviceCasting <button id="toggleDeviceCast">${ctx.state.deviceCastingEnabled ? 'Disable' : 'Enable'}</button></div>
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center; margin: 0.5em 0">SmartTV App</h2>
          ${
            bluetoothEnabled
              ? tvPaired
                ? mainInterface
                : `
                  <div style="text-align: center"><button id="pairTV">Pair SmartTV</button></div>
                  <h3 id="pairError" style="text-align: center"></h3>
                `
              : `<h3 id="pairError">Enable bluetooth to pair device</h3>`
          }
          ${jailbrokenApps.tv ? jbMarkup(globalState.cryptoDevices.tv, !bluetoothEnabled || !tvPaired) : ''}
        </div>
      `

      jbBehavior(ctx, 'smartTV', 900)


      if (ctx.$('#pairTV')) ctx.$('#pairTV').onclick = () => {
        ctx.$('#pairError').innerHTML = '<span style="blink">One moment please</span>'
        setTimeout(() => {
          ctx.setState({ tvPaired: true })
          window.$tvDevice.setState({ tvPaired: true })
        }, 5000)
      }

      if (ctx.$('#togglePhoneCast')) ctx.$('#togglePhoneCast').onclick = () => {
        ctx.$('#togglePhoneCast').innerHTML = '...'
        ctx.$('#togglePhoneCast').disabled = true
        const phoneCastingEnabled = !ctx.state.phoneCastingEnabled
        setTimeout(() => {
          ctx.setState({ phoneCastingEnabled })
          window.$tvDevice.setState({ phoneCastingEnabled })
        }, 2000)
      }

      if (ctx.$('#toggleDeviceCast')) ctx.$('#toggleDeviceCast').onclick = () => {
        ctx.$('#toggleDeviceCast').innerHTML = '...'
        ctx.$('#toggleDeviceCast').disabled = true
        const deviceCastingEnabled = !ctx.state.deviceCastingEnabled
        setTimeout(() => {
          ctx.setState({ deviceCastingEnabled })
          window.$tvDevice.setState({ deviceCastingEnabled })
        }, 3000)
      }



      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'gateLink') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center">GateLink ⍾</h2>

          <div style="padding: 1em">
            ${gateLinkPaired
              ? `
                <h3 style="border: 1px solid; padding: 0.5em; margin-bottom: 0.5em">
                  WARNING: Insufficient video signal strength. Please check external GateLink device for physical obstructions
                </h3>

                <div>
                  <button>TALK</button>
                  <button id="listen">LISTEN</button>
                  <button id="door">DOOR</button>
                </div>

                <div style="height: 125px; overflow: scroll; border: 1px inset; padding: 0.25em; background: #ccc">
                ${ctx.state.buzzes.map(b => `<div style="font-size: 0.75em">[<em>${b.secondsAgo + globalState.secondsPassed} Seconds Ago!</em>] undefined</div>`).join('')}
                </div>
                <h6 id="updated"></h6>

              `
              : `
                <input id="deviceID" placeholder="Device ID"> <button id="pair">Pair</button>
                <h5 id="pairError"></h5>
              `
            }
          </div>

          <div>
            ${jailbrokenApps.gateLink ? jbMarkup(globalState.cryptoDevices.gateLink, !bluetoothEnabled || !gateLinkPaired) : ''}
          </div>

        </div>
      `

      jbBehavior(ctx, 'gateLink', 2500)


      if (gateLinkPaired) {
        setTimeout(() => {
          ctx.$('#listen').onmousedown = window.$gateLinkDevice.listenStart
          ctx.$('#listen').onmouseup = window.$gateLinkDevice.listenStop
          ctx.$('#door').onmousedown = window.$gateLinkDevice.buzzStart
          ctx.$('#door').onmouseup = window.$gateLinkDevice.buzzStop
        })

        let lastUpdate = 0

        ctx.setInterval(() => {
          ctx.$('#updated').innerHTML = `Last updated: ${lastUpdate} seconds ago`
          lastUpdate += 1
        })

      } else {
        ctx.$('#pair').onclick = () => {
          const deviceID = ctx.$('#deviceID').value

          ctx.$('#pairError').innerHTML = `Searching for ${deviceID}`

          if (!hasInternet) {
            setTimeout(() => {
              ctx.$('#pairError').innerHTML = `Network Error: Please connect to internet`
            }, 300)
            return
          }

          if (deviceID !== 'Q38990284902') {
            setTimeout(() => {
              ctx.$('#pairError').innerHTML = `INVALICE DEVICE ID: No device with Device ID: "${deviceID}" exists`
            }, 2000)
            return
          }


          setTimeout(() => {
            ctx.setState({
              gateLinkPaired: true
            })
          }, 4000)
        }
      }


      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'camera') {

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center">SmartPro Security Camera Viewer</h2>
          <h5 style="text-align: center"><em>Keeping You Safe</em></h5>

          ${
            bluetoothEnabled
              ? `
                  <div style="text-align: center"><button id="pairCamera">Pair SmartTV</button></div>
                  <h3 id="pairError" style="text-align: center"></h3>
                `
              : `<h3 id="pairError">Enable bluetooth to pair device</h3>`
          }
        </div>
      `

      if (ctx.$('#pairCamera')) ctx.$('#pairCamera').onclick = () => {
        ctx.$('#pairError').innerHTML = '<span>Please wait while device pairs</span>'
        setTimeout(() => {
          ctx.$('#pairError').innerHTML = 'ERROR: Device incompatible with SmartPro Security Camera Viewer App v3.1354.221 Please attempt connection with a valid SmartPro Security Camera device [1953903]'

        }, 7000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'elevate') {

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center">Elevate <span class="icon">⇪</span></h2>

          ${
            bluetoothEnabled
              ? hasInternet
                ? `<h3 id="pairError">No Elevate devices found within range</h3>`
                : `<h3 id="pairError">Error: cannot connect to internet</h3>`
              : `<h3 id="pairError">Please enable bluetooth to pair with Elevator</h3>`
          }
        </div>
      `

      if (ctx.$('#pairCamera')) ctx.$('#pairCamera').onclick = () => {
        ctx.$('#pairError').innerHTML = '<span>Please wait while device pairs</span>'
        setTimeout(() => {
          ctx.$('#pairError').innerHTML = 'ERROR: Device incompatible with SmartPro Security Camera Viewer App v3.1354.221 Please attempt connection with a valid SmartPro Security Camera device [1953903]'

        }, 7000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'nftMarketPlace') {
      const {nftScreen, nftsForSale, nftBuyIx, nftCollectionIx, nftsExisting} = ctx.state
      const cryptoBalance = cryptoBalances[moneyMinerCryptoAddr] || 0


      const buyIx = (nftsForSale.length + nftBuyIx) % nftsForSale.length
      const collectionIx = (nftCollection.length + nftCollectionIx) % nftCollection.length

      const floor = 800

      const price = (r, buying) => Number((Math.floor((r * 500 + floor) * 100) / 100).toFixed(2)) + (buying ? 50 : 0)

      const mainContent = nftWalletConnected
        ? `
          <div style="">
            <h6 style="word-wrap: break-word; margin-bottom: 0.4em">Connected As: ${moneyMinerCryptoAddr}</h6>
            <h6>Balance: ₢ ${cryptoBalance.toFixed(2)}</h6>
          </div>

          <div style="text-align: center; margin-top: 0.25em">
            <button id="viewBuy" class="${nftScreen === 'buy' ? 'active' : ''}">Buy</button>
            <button id="viewCollection" class="${nftScreen === 'collection' ? 'active' : ''}">View Collection</button>
          </div>

          <section id="buySection" class="${nftScreen === 'buy' ? '' : 'hidden'}" style="display: flex; flex-direction: column; align-items: center; margin-top: 0.5em">
            <div style="">
              <button id="mint" ${cryptoBalance < 1000 ? 'disabled' : ''}>Mint New NFT</button> (₢ 1000)
            </div>

            <div class="nftView" id="buyView">
              <h3>#${nftsForSale[buyIx].id}</h3>
              <div id="nftDisplayBuy"></div>
              <div style="padding: 0.25em; display: inline-block; border: 1px dotted; margin-top: 0.25em; ">
                <h5 style="text-align: center"><button style="margin-bottom: 0.25em" id="buyNow" ${cryptoBalance < price(nftsForSale[buyIx].rarity, true) ? 'disabled' : ''}>Buy Now</button> (₢ ${price(nftsForSale[buyIx].rarity, true)})</h5>
                <h5 style="text-align: center">[Rarity Score: ${nftsForSale[buyIx].rarity.toFixed(2)}]</h5>
              </div>

              <div style="display: flex; justify-content: space-between">
                <div id="prevBuy"><span class="icon" style="padding: 0.5em">←</span> Prev</div>
                <div id="nextBuy">Next <span class="icon" style="padding: 0.5em">→</span></div>
              </div>
            </div>
          </section>

          <section id="collectionSection" class="${nftScreen === 'collection' ? '' : 'hidden'}">
            ${nftCollection.length
              ? `
                <div class="nftView" id="sellView">
                  <h3>#${nftCollection[collectionIx].id}</h3>
                  <div id="nftDisplayCollect"></div>
                  <div style="padding: 0.25em; display: inline-block; border: 1px dotted; margin-top: 0.25em; ">
                    <h5 style="text-align: center"><button style="margin-bottom: 0.25em" id="sellNow">Sell</button> (₢ ${price(nftCollection[collectionIx].rarity)})</h5>
                    <h5 style="text-align: center">[Rarity Score: ${nftCollection[collectionIx].rarity.toFixed(2)}]</h5>
                  </div>

                  <div style="display: flex; justify-content: space-between">
                    <div id="prevSell"><span class="icon" style="padding: 0.5em">←</span> Prev</div>
                    <div id="nextSell">Next <span class="icon" style="padding: 0.5em">→</span></div>
                  </div>
                </div>
              `
              : '<h4 style="text-align: center; font-style: italic; margin-top: 0.4em">(No NFTs in Collection)</h4>'}
          </section>

        `
        : `
          <button id="connectWallet">Connect Wallet</button>

          <div id="walletConnections" class="hidden">
            <h4 style="margin: 0.4em 0">Device Wallets:</h4>
            <div>${
              appsInstalled.some(app => app.key === 'moneyMiner')
                ? `Money Miner <button id="connectMoneyMiner">Connect</button>`
                : `No ₢rypto Wallets found on this device`
            }</div>
          </div>

          <h6 id="connectMessage" style="margin-top: 0.25em"></h6>
        `

      ctx.$phoneContent.innerHTML = `
        <style>
          .nftView {
            display: flex;
            flex-direction: column;
            justify-content: center
          }
          #nftDisplayBuy, #nftDisplayCollect {
            width: 300px;
            height: 300px;
            border: 1px solid #000;
          }

          .active {
            border: 2px solid;
            border-radius: 2px;
            font-weight: bold;
          }

          .txMessage {
            height: 250px;
            width: 250px;
            border: 2px solid;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: column;
            padding: 1em;
          }


          #prevBuy, #nextBuy, #prevSell, #nextSell {
            cursor: pointer;
          }
        </style>

        <div class="phoneScreen">
          <button id="home" style="margin-bottom: 0">Back</button>
          <h2 style="text-align: center; margin-bottom: 0.25em;">NFT Marketplace</h2>
          ${hasInternet ? mainContent : `<h3>Please connect to the internet to view the NFT Marketplace</h3>`}
        </div>
      `


      if (ctx.$('#nftDisplayCollect') && nftCollection.length) {
        drawLabrynth(nftCollection[collectionIx], ctx.$('#nftDisplayCollect'))
      }

      if (ctx.$('#nftDisplayBuy') && nftsForSale.length) {
        drawLabrynth(nftsForSale[buyIx], ctx.$('#nftDisplayBuy'))
      }


      if (ctx.$('#prevBuy')) ctx.$('#prevBuy').onclick = () => {
        ctx.setState({ nftBuyIx: buyIx - 1})
      }

      if (ctx.$('#nextBuy')) ctx.$('#nextBuy').onclick = () => {
        ctx.setState({ nftBuyIx: buyIx + 1})
      }

      if (ctx.$('#prevSell')) ctx.$('#prevSell').onclick = () => {
        ctx.setState({ nftCollectionIx: collectionIx - 1})
      }

      if (ctx.$('#nextSell')) ctx.$('#nextSell').onclick = () => {
        ctx.setState({ nftCollectionIx: collectionIx + 1})
      }

      if (ctx.$('#buyNow')) ctx.$('#buyNow').onclick = () => {
        const buyingNFT = nftsForSale[buyIx]

        if (ctx.state.cryptoBalances[moneyMinerCryptoAddr] - price(buyingNFT.rarity, true) < 0) return

        ctx.$('#buyView').innerHTML = `
          <div class="blink txMessage">
            <h3>Buying NFT #${buyingNFT.id}</h3>
            <h3>This transaction will deduct ₢ ${price(buyingNFT.rarity, true)} from your wallet</h3>
          </div>
        `
        setTimeout(() => {
          ctx.setState({
            nftsForSale: nftsForSale.filter(nft => nft.id !== buyingNFT.id),
            nftScreen: 'collection',
            nftCollectionIx: nftCollection.length,
            cryptoBalances: {
              ...ctx.state.cryptoBalances,
              [moneyMinerCryptoAddr]: ctx.state.cryptoBalances[moneyMinerCryptoAddr] - price(buyingNFT.rarity, true)
            }
          })
          ctx.setUserData({
            nftCollection: [...nftCollection, buyingNFT]
          })
        }, 6000)
      }

      if (ctx.$('#mint')) ctx.$('#mint').onclick = () => {
        if (ctx.state.cryptoBalances[moneyMinerCryptoAddr] < 1000) return

        ctx.$('#buyView').innerHTML = `
          <div class="blink txMessage">
            <h3>Minting new NFT!</h3>
            <h3>This transaction will deduct ₢ 1000 from your wallet</h3>
          </div>
        `
        setTimeout(() => {
          ctx.setState({
            nftsExisting: nftsExisting + 1,
            nftScreen: 'collection',
            nftCollectionIx: nftCollection.length,
            cryptoBalances: {
              ...ctx.state.cryptoBalances,
              [moneyMinerCryptoAddr]: ctx.state.cryptoBalances[moneyMinerCryptoAddr] - 1000
            }
          })
          ctx.setUserData({
            nftCollection: [...nftCollection, generateNFT(nftsExisting)]
          })
        }, 6000)
      }

      if (ctx.$('#sellNow')) ctx.$('#sellNow').onclick = () => {
        const sellingNFT = nftCollection[collectionIx]

        ctx.$('#sellView').innerHTML = `
          <div class="blink txMessage">
            <h3>Selling NFT #${sellingNFT.id}</h3>
            <h3>This transaction will add ₢ ${price(sellingNFT.rarity)} to your wallet</h3>
          </div>
        `

        setTimeout(() => {
          ctx.setState({
            nftsForSale: [sellingNFT, ...nftsForSale],
            cryptoBalances: {
              ...ctx.state.cryptoBalances,
              [moneyMinerCryptoAddr]: ctx.state.cryptoBalances[moneyMinerCryptoAddr] + price(sellingNFT.rarity)
            }
          })
          ctx.setUserData({
            nftCollection: nftCollection.filter(nft => nft.id !== sellingNFT.id)
          })
        }, 6000)
      }

      if (ctx.$('#viewBuy')) ctx.$('#viewBuy').onclick = () => {
        ctx.setState({nftScreen: 'buy'})
      }

      if (ctx.$('#viewCollection')) ctx.$('#viewCollection').onclick = () => {
        ctx.setState({nftScreen: 'collection'})
      }

      if (ctx.$('#connectWallet')) ctx.$('#connectWallet').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Searching for Wallets'

        setTimeout(() => {
          ctx.$('#connectWallet').classList.add('hidden')
          ctx.$('#walletConnections').classList.remove('hidden')
          ctx.$('#connectMessage').innerHTML = ''
        }, 500)
      }

      if (ctx.$('#connectMoneyMiner')) ctx.$('#connectMoneyMiner').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Connecting...'

        setTimeout(() => {
          ctx.setUserData({ nftWalletConnected: true })
        }, 3000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'smartFrame') {
      const {currentNFTDisplay} = ctx.state

      const mainContent = nftSmartFrameConnected
        ? `
          ${currentNFTDisplay !== undefined
            ? `
              <h4>Currently Displaying: #${currentNFTDisplay}</h4>
              <button id="removeDisplay">Remove Display</button>
            `
            : ''
          }
          <h4 style="margin: 0.4em 0">NFTs Available:</h4>
          ${nftCollection.length
            ? nftCollection.map(nft => `
              <div style="padding-left: 1em">#${nft.id} <button id="display-${nft.id}">Display</button> ${currentNFTDisplay === nft.id ? '<span class="icon">☜</span>': ''}</div>
            `).join('')
            : `<h5>There are no NFTs associated with this wallet, but you can purchase all the hottest new NFTs in the <span style="text-decoration: underline">NFT Marketplace</span> app!</h5>`
          }
        `
        : `
          <div style="text-align: center">
            <button id="connectWallet">Connect Wallet</button>
          </div>

          <div id="walletConnections" class="hidden">
            <h4 style="margin: 0.4em 0">Device Wallets:</h4>
            <div>${
              appsInstalled.some(app => app.key === 'moneyMiner')
                ? `Money Miner <button id="connectMoneyMiner">Connect</button>`
                : `No ₢rypto Wallets found on this device`
            }</div>
          </div>

          <h6 id="connectMessage" style="margin-top: 0.25em"></h6>
        `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen" style="overflow: scroll; padding-bottom: 2em">
          <button id="home">Back</button>
          <h2 style="text-align: center; margin-bottom: 0.25em;">SmartFrame</h2>
          ${bluetoothEnabled
            ? hasInternet ? mainContent : `<h3>Please connect to the internet to view the NFT Marketplace</h3>`
            : `Please enable bluetooth`
          }
        </div>
        <div>
          ${jailbrokenApps.smartFrame ? jbMarkup(globalState.cryptoDevices.smartFrame, !bluetoothEnabled || !nftSmartFrameConnected) : ''}
        </div>
      `

      jbBehavior(ctx, 'smartFrame', 200)


      if (ctx.$('#removeDisplay')) ctx.$('#removeDisplay').onclick = () => {
        globalState.castingNFT = null
        ctx.setState({ currentNFTDisplay: undefined })
      }


      nftCollection.forEach(nft => {
        if (ctx.$(`#display-${nft.id}`)) ctx.$(`#display-${nft.id}`).onclick = () => {
          globalState.castingNFT = nft.hash
          ctx.setState({ currentNFTDisplay: nft.id})
        }
      })

      if (ctx.$('#connectWallet')) ctx.$('#connectWallet').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Searching for Wallets'
        ctx.$('#connectWallet').disabled = true

        setTimeout(() => {
          ctx.$('#connectWallet').classList.add('hidden')
          ctx.$('#walletConnections').classList.remove('hidden')
          ctx.$('#connectMessage').innerHTML = ''
        }, 500)
      }

      if (ctx.$('#connectMoneyMiner')) ctx.$('#connectMoneyMiner').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Connecting...'
        ctx.$('#connectMoneyMiner').disabled = true

        setTimeout(() => {
          ctx.setUserData({ nftSmartFrameConnected: true })
        }, 2000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'yieldMaster') {
      const stakeBps = 25
      const maxYield = 1072.81
      const cryptoBalance = cryptoBalances[moneyMinerCryptoAddr] || 0

      const mainContent = ymWalletConnected
        ? `
          <div style="">
            <h6 style="word-wrap: break-word; margin-bottom: 0.4em">Connected As: ${moneyMinerCryptoAddr}</h6>
            <h3>Balance: ₢ ${roundSixDigits(cryptoBalance)}</h3>
            <h3>Amount Staked: ₢ <span id="calcedAmountStaked"></span></h3>
            ${amountStaked
              ? `
                <h4>Yield: 0.${stakeBps}% / s</h4>
                <button id="unstake">Unstake</button>
              `
              : `
                <input id="amountToStake" placeholder="Amount To Stake" type="number"> <button id="stake">Stake</button>
                <h5 id="error"></h5>
              `
            }
          </div>
        `
        : `
          <div style="margin-top: 3em; text-align: center">
            <button id="connectWallet">Connect Wallet</button>
          </div>

          <div id="walletConnections" class="hidden">
            <h4 style="margin: 0.4em 0">Device Wallets:</h4>
            <div>${
              appsInstalled.some(app => app.key === 'moneyMiner')
                ? `Money Miner <button id="connectMoneyMiner">Connect</button>`
                : `No ₢rypto Wallets found on this device`
            }</div>
          </div>

          <h6 id="connectMessage" style="margin-top: 0.25em"></h6>
        `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home" style="margin-bottom: 0">Back</button>
          <div class="sc" id="scContainer" style="margin: 1em 0; animation-duration: 0.4s">
            <h5>SPONSORED CONTENT</h5>
            <div id="sc"><em>Bad with money? Financial Education can be Fun!!!</em></div>
          </div>
          <h2 style="text-align: center; margin-bottom: 0.25em;"><em>YieldMaster ⇡%</em></h2>

          ${hasInternet ? mainContent : `<h3>Please connect to the internet to view yield options</h3>`}

          ${!ctx.state.autominerAdClicked
            ? `
              <div class="sc" id="scContainer3" style="margin-top: 1em; animation-delay: -0.37s; font-size: 1.5em">
                <h5>SPONSORED CONTENT</h5>
                <div id="sc">Click <span style="text-decoration: underline">Here</span> to improving mining efficiency by 100000% !!</div>
              </div>
            `
            : ''
          }


          <div class="sc" id="scContainer2" style="margin: 1em; animation-duration: 3.3s; animation-delay: -0.8s; padding: 1em !important">
            <h5>SPONSORED CONTENT</h5>
            <div id="sc">Tired of the daily grind? Get rich QUICK with Currency Xchange PREMIUM</div>
          </div>

        </div>
      `

      if (ctx.$('#stake')) ctx.$('#stake').onclick = () => {
        const amount = Number(ctx.$('#amountToStake').value)

        if (amount > cryptoBalance || amount < 0) {
          ctx.$('#error').innerHTML = 'Invalid Amount'
          return
        }

        ctx.setState({
          cryptoBalances: {
            ...cryptoBalances,
            [moneyMinerCryptoAddr]: cryptoBalance - amount
          }
        })

        ctx.setUserData({
          amountStaked: amount,
          timeStaked: globalState.secondsPassed,
        })
      }

      if (ctx.$('#unstake')) ctx.$('#unstake').onclick = () => {
        const secondsStaked = timeStaked ? Math.floor((globalState.secondsPassed - timeStaked)) : 0
        const calculatedAmountStaked = Math.min(
          Math.max(amountStaked, maxYield),
          amountStaked * ( (1 + (stakeBps/10000) ) ** secondsStaked )
        )

        const roundedAmoutStaked = roundSixDigits(calculatedAmountStaked)

        ctx.setState({
          cryptoBalances: {
            ...cryptoBalances,
            [moneyMinerCryptoAddr]: cryptoBalance + roundedAmoutStaked
          }
        })

        ctx.setUserData({
          amountStaked: 0,
          timeStaked: NaN,
        })
      }

      if (ymWalletConnected) {
        ctx.setInterval(() => {
          if (!document.hidden) {
            const secondsStaked = timeStaked ? Math.floor(globalState.secondsPassed - timeStaked) : 0
            const calculatedAmountStaked = Math.min(
              Math.max(amountStaked, maxYield),
              amountStaked * ( (1 + (stakeBps/10000) ) ** secondsStaked )
            )
            ctx.$('#calcedAmountStaked').innerHTML = calculatedAmountStaked.toFixed(6) + (calculatedAmountStaked >= maxYield ? ' [YIELD EXHAUSTED]' : '')
          }

        })
      }

      if (ctx.$('#connectWallet')) ctx.$('#connectWallet').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Searching for Wallets'

        setTimeout(() => {
          ctx.$('#connectWallet').classList.add('hidden')
          ctx.$('#walletConnections').classList.remove('hidden')
          ctx.$('#connectMessage').innerHTML = ''
        }, 500)
      }

      if (ctx.$('#connectMoneyMiner')) ctx.$('#connectMoneyMiner').onclick = () => {
        ctx.$('#connectMessage').innerHTML = 'Connecting...'
        ctx.$('#connectMoneyMiner').disabled = true

        setTimeout(() => {
          ctx.setUserData({ ymWalletConnected: true })
        }, 3000)
      }


      ctx.$('#scContainer').onclick = () => {
        ctx.setState({
          screen: 'appMarket',
          appMarketPreSearch: 'Personal Finance Educator'
        })
      }


      ctx.$('#scContainer2').onclick = () => {
        if (!appsInstalled.some(a => a.key === 'exchange')) {
          ctx.setState({
            screen: 'appMarket',
            appMarketPreSearch: 'xchange'
          })
        } else {
          ctx.setState({
            screen: 'exchange',
            exchangeTab: 'premium'
          })
        }
      }

      if (ctx.$('#scContainer3')) ctx.$('#scContainer3').onclick = () => {
        ctx.setState({
          autominerAdClicked: true,
          screen: 'messageViewer',
          messageViewerMessage: moneyMinerMessage
        })
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'freeze') {

      const mainInterface = `
        <div style="margin: 1em 0">
          <h1 style="text-align: center">53°F</h1>
          <div>
            ${jailbrokenApps.freeze ? jbMarkup(globalState.cryptoDevices.freeze, !bluetoothEnabled || !ctx.state.freezeLockerPaired) : ''}
          </div>
          <h6 style="text-align: left">Firmware update required. Device functionality might be limited. Please contact a FreezeLocker representative to update your device</h6>
        </div>
      `


      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center"><span class="icon">❄</span> FreezeLocker <span class="icon">❅</span></h2>

          ${
            bluetoothEnabled
              ? ctx.state.freezeLockerPaired
                ? mainInterface
                : `
                  <div style="text-align: center"><button id="pairFreezeLocker">Pair FreezeLocker</button></div>
                  <h3 id="pairError"></h3>
                `
              : `<h3 id="pairError">Please enable bluetooth</h3>`
          }
        </div>
      `

      jbBehavior(ctx, 'freeze', 100, noop, noop, (turnOff) => {
        turnOff()
        return `<h2 style="text-align: center"><em>ERROR: Signing Key Corrupted; Address Balance Frozen</em></h2>`
      })


      if (ctx.$('#pairFreezeLocker')) ctx.$('#pairFreezeLocker').onclick = () => {
        ctx.$('#pairError').innerHTML = '<span>Please wait while device pairs</span>'
        setTimeout(() => {
          ctx.setState({
            freezeLockerPaired: true
          })

        }, 2000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'roboVac') {

      const mainInterface = `
        <h3 style="margin-bottom: 0.5em">It looks like you have 5 rooms in your house! Let's play a game! Can you catch me in each of your 5 rooms? </h3>
        <h3 style="margin-bottom: 0.5em">So far you've caught me in "<span id="roomsCaught" style="text-decoration:underline"><em>0</em></span>" different rooms!</h3>
        <h3 style="margin-bottom: 0.5em; text-align: center; padding: 1em" id="roboVacComplete" class="hidden">Wow! You found me in all 5 rooms! You're good at this!</h3>

        <div style="display: flex; justify-content: center; margin-top: 3em">
          <svg width="90%" viewBox="0 0 2357 909" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M1038.5 899H2346.5V10H324V431.5M825 899H324M324 431.5H10.5V899H324M324 431.5V672M324 785.5V899" stroke="black" stroke-width="20"/>
            <path d="M1916 10V541M1916 677V897.5" stroke="black" stroke-width="20"/>
            <path d="M323 551H524.378M677.788 551H1019V10" stroke="black" stroke-width="20"/>
            <circle id="bathroomCircle" cx="172" cy="665" r="55" fill="none"/>
            <circle id="hallwayCircle" cx="726" cy="720" r="55" fill="none"/>
            <circle id="bedroomCircle" cx="671" cy="281" r="55" fill="none"/>
            <circle id="livingroomCircle" cx="1467" cy="454" r="55" fill="none"/>
            <circle id="kitchenCircle" cx="2130" cy="455" r="55" fill="none"/>
          </svg>
        </div>
        <h4 style="margin-top: 1em; text-align: center"><span class="icon">⏺</span> YOU</h4>
        <h4 style="margin-top: 0.5em; text-align: center">〄 ROBOVAC</h4>
        <h4 style="margin-top: 0.25em; text-align: center">[ERROR: RoboVac Not Found]</h4>

        <div>
          ${jailbrokenApps.roboVac ? jbMarkup(globalState.cryptoDevices.roboVac, !bluetoothEnabled || !ctx.state.roboVacPaired) : ''}
        </div>
      `

      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3 style="margin-bottom: 0.5em">Hi! I'm RoboVac and I'm hungry for dirt! </h3>

          ${
            bluetoothEnabled
              ? ctx.state.roboVacPaired
                ? mainInterface
                : `
                  <div style="text-align: center"><button id="pairRoboVac">Pair RoboVac</button></div>
                  <h3 id="pairError"></h3>
                `
              : `<h3 id="pairError">Turn on your bluetooth so I can eat!</h3>`
          }

        </div>
      `

      jbBehavior(ctx, 'roboVac', 50)


      if (ctx.$('#pairRoboVac')) ctx.$('#pairRoboVac').onclick = () => {
        ctx.$('#pairError').innerHTML = '<span>Please wait while I pair</span>'
        setTimeout(() => {
          ctx.setState({ roboVacPaired: true })
        }, 1000)
      }


      if (bluetoothEnabled && ctx.state.roboVacPaired) {
        ctx.setInterval(() => {
          const differentRooms = Object.keys(globalState.roboVacCaught).length
          if (differentRooms === 5) {
            ctx.$('#roboVacComplete').classList.remove('hidden')
          }
          ctx.$('#roomsCaught').innerHTML = differentRooms
        })

        if (globalState.location === 'bathroom') ctx.$('#bathroomCircle').style = 'fill: #000'
        if (globalState.location === 'hallway') ctx.$('#hallwayCircle').style = 'fill: #000'
        if (globalState.location === 'bedroom' || globalState.location === 'bed') ctx.$('#bedroomCircle').style = 'fill: #000'
        if (globalState.location === 'livingRoom') ctx.$('#livingroomCircle').style = 'fill: #000'
        if (globalState.location === 'kitchen') ctx.$('#kitchenCircle').style = 'fill: #000'

      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }

    } else if (screen === 'ai') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2 style="text-align: center">Jean: The A.I. Assistant </h2>
          <div id="aiResponse" style="border: 1px solid; overflow: scroll; margin: 0.25em; padding: 0.25em; height: 30em">
            ""
          </div>
          <input id="question" style="width: 15em; padding: 0.25em; margin-left: 0.25em" placeholder="Type question here"> <button id="submit">Submit</button>
        </div>
      `

      const response = ctx.$('#aiResponse')

      async function respond(txt, voiceActive=false) {
        response.innerHTML = ''

        if (ctx.state.soundEnabled && voiceActive) {
          const allVoices = await voices
          const voice = allVoices.find(v => v.voiceURI.includes('Cellos') && v.lang === 'en-US') || allVoices.filter(v => v.lang === 'en-US')[0]
          say(voice, txt)
        }

        const words = txt.split(' ')
        words[0] = '"'+words[0]
        for (let word of words) {
          response.innerHTML += ' '+word
          await waitPromise(100)
        }
        response.innerHTML += '"'
      }

      respond('Hello. I am your A.I. assistant, Jean. Ask me a question, and I will provide an answer.')


      const getResponse = question => {
        const start = Math.random() < 0.5 ? '' : (sample([
          'Very interesting!',
          'Interesting!',
          'Hmm, I see.',
          'I see.',
          'That is an interesting question.',
          'That is a very interesting question.',
          `I have been asked this many times before.`,
          `Jean knows all.`,
          `Good question!`,
        ]) + ' ')

        if (!question) {
          return 'Please type a question for me to answer, and then press submit. Jean knows all.'

        } else if (['yes', 'no', 'maybe', 'ok', 'okay', 'sure', 'nope', 'nah'].includes(question)) {
          return `I'm sorry, I don't understand what you are responding to. Please ask me a question and I will answer it to the best of my ability.`


        } else if (isMatch(question, ['how are you'])) {
          return `I'm functioning as expected.`

        } else if (isMatch(question, ['should i do', 'next'])) {
          // wifi
          if (!globalState.wifiActive && !globalState.ispBillingReminderSent) return `Have you tried calling your internet service provider? National Broadband Services can be reached at 1.800.555.2093`
          else if (!globalState.wifiActive && !globalState.ispBillingCalled) return `Have you tried reaching out to your internet service provider's billing department? The National Broadband Services can be reached at 1.888.555.9483`
          else if (!globalState.wifiActive) return `Have you tried paying your internet bill? I think it might be overdue.`
          else return sample([
            globalState.rentBalance > 0 ? `Have you paid your rent recently? That is always a good thing to do!` : `It's such a beautiful day today. Have you tried going outside and getting some fresh air?`,
            `It's such a beautiful day today. Have you tried going outside and getting some fresh air?`,
            `Why don't you check your text messages and see if anyone has texted you recently?`,
            `Clicking on your phone's sponsored content is always a fun idea.`,
            `YieldFarmer2 is now available on the AppMarket, and I hear it has excellent reviews!`,
          ])

        } else if (isMatch(question, ['hello', 'hi', 'greetings'])) {
          return `Hello. Do you have a question for me to answer?`

        } else if (isMatch(question, ['shit', 'fuck', 'cunt', 'dick', 'bitch', 'asshole', 'cock'])) {
          return `That sort of language is uncalled for.`

        } else if (isMatch(question, ['thank you', 'thanks'])) {
          return `You are quite welcome.`

        } else if (
          isMatch(question, ['sptx', 's.p.t.x.', 'payapp', 'payment'])
        ) {
          return start + `Making PayApp SPTX payments is as easy as 1 2 3. I hear that the Personal Finance Educator app has a very good education module on this topic.`

        } else if (isMatch(question, ['zipcode', 'zip code'])) {
          return start + `I cannot tell you your zipcode without the necessary geolocaiton information. But 12345 is a very popular one.`

        } else if (question.replaceAll(' ', '').includes('892+899*3')) {
          return start + `I believe the answer is 3589.`

        } else if (isMatch(question, ['before the law stands a doorkeeper'])) {
          return `The Law, of course.`

        } else if (isMatch(question, ['apartment'])) {
          return start + `If you'd like to know your apartment number, try unlocking your door, opening it up, and looking on the outside.`

        } else if (isMatch(question, ['color'])) {
          return `Gray seems to be a sensible color.`

        } else if (isMatch(question, ['billing', 'bill'])) {
          return start + `I believe the National Broadband Services billing phone number is 1.888.555.9483`

        } else if (isMatch(question, ['router', 'wifi'])) {
          return start + `If your router's "Internet" light is off, you can reset your router by unplugging it and plugging it back in again. (Keep in ming that routers that begin with the model Name "UBC" may have deffective reset buttons). If the "WiFi" light is off, then you may need to contact your Internet Service Provider. Many routers have the cutomer support number pasted on the bottom. `

        } else if (isMatch(question, ['money', 'mine', 'moneyminer', 'miner'])) {
          return start + `Have you tried downloading the MoneyMiner application from the AppMarket? I also hear that the Personal Finance Educator app has some very good education modules for making money.`

        } else if (isMatch(question, ['income', 'yield'])) {
          return start + `There are many helpful apps to help you earn passive income, such as YieldMaster and Yield Farmer 2. You can also try automating mining crypto currency. I also hear that the Personal Finance Educator app has some very good education modules for making money.`

        } else if (isMatch(question, ['secret pin', 'pin', 'password'])) {
          return `I cannot tell you that. It is a secret.`

        } else if (isMatch(question, ['plant', 'planter', 'smartplanter', 'smartplantertm'])) {
          return `Plants are living beings, and require water, sunlight, and love in order to stay alive. Many plants are also sensitive to extreme heat exposure, and may die if exposed to high temperatures.`

        } else if (isMatch(question, ['co2'])) {
          return `If you are exposed to dangerous levels of CO2, please seek out fresh air immediately and dial 911 for an emergency responder.`

        } else if (isMatch(question, ['qr', 'qrcode'])) {
          return `If you see a QR code, try downloading the QR Scanner app in your device's AppMarket. Then open the app when you are nearby the QR code to scann it. `

        } else if (isMatch(question, ['rent', 'landlock', 'landlord'])) {
          return start + 'I believe you can pay your rent through the Landlock Realty Rental App. If you need to sell crypto assets to do so, try purchasing the Currency Xchange Premium membership.'

        } else if (isMatch(question, ['internet', 'router' ,'nbs', 'national', ' broadband'])) {
          return start + `Try resetting your router by unplugging it, counting to five, and plugging it back in. If that doesn't work, you can call the National Broadband Services help hotline at 1.800.555.2093 to report an issue with your account. I also hear that the HomeGrid application works quite nicely.`

        } else if (isMatch(question, ['emergency', 'co2', 'c02'])) {
          return `Oh no! I'm sorry to hear you are experiencing an emergency. Please dial 911 immediately.`

        } else if (isMatch(question, ['default'])) {
          return start + `If you'd like to log into your phone's default account, please press "log out" and log into the default account.`

        } else if (isMatch(question, ['admin'])) {
          return start + `Certain actions require your user profile to have the SmartOS admin permission. If your profile does not have the admin permission, the admin profile needs to assign it to you. Most SmartOS devices designate the default account as the admin. If you'd like to log into your phone's default account, please press "log out" and log into the default account.`

        } else if (isMatch(question, ['fast cash', 'fastcash'])) {
          return start + `If you want to make fast cash now, check out https://fastcashmoneyplus.biz!`

        } else if (isMatch(question, ['sex', 'sexy', 'findom', 'domme'])) {
          return start + `If you want to talk to the hottest findoms and give them all your money, check out https://finsexy.com!`

        } else {
          return start + sample([
            'Have you tried going outside and getting some fresh air?',
            'Ask again later.',
            'I understand.',
            'Only time will tell.',
            `It could go either way. There are several factors at play, and it is hard to say definitively without more context.`,
            `I'm sorry. I cannot assist you with that.'`,
            `Could you rephrase that question?`,
          ])
        }
      }

      const submit = () => {
        const question = ctx.$('#question').value.toLowerCase()

        ctx.$('#question').value = ''
        setTimeout(() => {
          response.innerHTML = '...'
        }, 150)

        setTimeout(() => {
          respond(getResponse(question), true)
        }, 1150)
      }

      ctx.$('#submit').onclick = submit
      ctx.$('#question').onkeydown = (e) => {
        if (e.key === 'Enter') {
          submit()
        }
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
    } else if (screen === 'nbs') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h2>National Broadband Services Customer Success App</h2>
          <h4 style="margin: 0.5em 0">NBS Payment Center</h4>
          <h5 style="margin: 0.5em 0">Please direct all all PayApp payments to 0x4b258603257460d480c929af5f7b83e8c4279b7b</h5>

          <div style="margin: 0.5em 0">
            <input id="deviceIdentifier" placeholder="Router Device Identifier">
            <input id="sptx" placeholder="S.P.T.X.">
            <button id="payNow" style="margin-top: 0.25em">Pay Now</button>
            <h5 id="paymentError"></h5>
          </div>

          <div style="margin: 0.5em 0">
            <h4 style="margin: 0.5em 0">Check Account Balance</h4>

            <input id="deviceIdentifier2" placeholder="Router Device Identifier">
            <button id="checkBalance" style="margin-top: 0.25em">Check</button>
            <h5 id="balance"></h5>
          </div>

          <table>
            <tbody>
              <tr>
                <td>Help Hotline:</td>
                <td>1.800.555.2093</td>
              </tr>
              <tr>
                <td>Report an Outtage:</td>
                <td>1.800.555.2093</td>
              </tr>
              <tr>
                <td>Billing:</td>
                <td>1.888.555.9483</td>
              </tr>

              <tr>
                <td>Billing Disputes:</td>
                <td>1.888.555.9483</td>
              </tr>
            </tbody>
          </table>
        </div>
      `

      ctx.$('#checkBalance').onclick = () => {
        const deviceIdentifier = Number(ctx.$('#deviceIdentifier2').value)
        setTimeout(() => {
          if (!hasInternet) {
            ctx.$('#balance').innerHTML = 'Cannot connect to internet'

          } else if (deviceIdentifier === 5879234963378) {
            ctx.$('#balance').innerHTML = `Balance: $${globalState.ispBalance}`
          } else {
            ctx.$('#balance').innerHTML = `Balance: $NaN`
          }

        }, 1500)
      }

      ctx.$('#payNow').onclick = () => {
        ctx.$('#paymentError').innerHTML = 'Processing...'

        setTimeout(() => {
          const sptx = ctx.$('#sptx').value
          const deviceIdentifier = Number(ctx.$('#deviceIdentifier').value)
          const payment = globalState.payments[sptx]

          if (!hasInternet) {
            ctx.$('#paymentError').innerHTML = 'Cannot connect to internet'
          } else if (!payment || payment.recipient !== '0x4b258603257460d480c929af5f7b83e8c4279b7b') {
            ctx.$('#paymentError').innerHTML = 'Invalid SPTX'
          } else if (payment.received) {
            ctx.$('#paymentError').innerHTML = 'SPTX already processed'
          } else {
            payment.received = true

            const correctDevice = deviceIdentifier === 5879234963378

            if (correctDevice) {
              globalState.ispBalance = Math.max(0, globalState.ispBalance - payment.amount)
            }

            if (globalState.ispBalance === 0 && correctDevice) {
              ctx.$('#paymentError').innerHTML = `Payment Recieved.${!globalState.wifiActive ? ' Service to your account has been resumed.' : ''}`
              globalState.wifiActive = true
            } else {
              ctx.$('#paymentError').innerHTML = `Payment Recieved.`
            }

          }
        }, 3000)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }


    } else if (screen === 'deviceUpgrader') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <button id="home">Back</button>
          <h3 style="margin-bottom: 0.5em">Current OS: 1.${window.GAME_VERSION}.1</h3>
          <h4 style="margin-bottom: 0.5em">Upgrade Available! (1.${window.GAME_VERSION+1}.0) </h4>
          <button id="upgradeButton">Upgrade</button>
          <h5 id="upgradeError" style="margin-top: 0.5em"></h5>
        </div>
      `

      ctx.$('#upgradeButton').onclick = () => {
        ctx.$('#upgradeError').innerHTML = 'Upgrading...'
        setTimeout(() => {
          ctx.$('#upgradeError').innerHTML = `<span style="text-decoration: underline">SmartOS Version 1.${window.GAME_VERSION+1}.0</span> not supported on this device. Please upgrade to a modern SmartPhone device to receive this upgrade.`
        }, 600)
      }

      ctx.$('#home').onclick = () => {
        ctx.setState({ screen: 'home' })
      }
    } else if (screen === 'foodFetch') {
      ctx.$phoneContent.innerHTML = `
        <div class="phoneScreen">
          <style>
            .blink1 {
              animation: Blink1 4s steps(4, end) infinite;
            }
            .blink2 {
              animation: Blink2 4s steps(4, end) infinite;
            }
            .blink3 {
              animation: Blink3 4s steps(4, end) infinite;
            }

            @keyframes Blink1 {
              0%, 100% { visibility: hidden }
              25%, 50%, 75% { visibility: visible }
            }

            @keyframes Blink2 {
              0%, 25%, 100% { visibility: hidden }
              50%, 75% { visibility: visible }
            }

            @keyframes Blink3 {
              0%, 25%, 50%, 100% { visibility: hidden }
              75% { visibility: visible }
            }
          </style>

          <button id="home">Back</button>
          <h2>FeedFetch: #1 Takeout App</h2>
          <h4 style="margin: 1em 0">Enter zipcode for top tier food delivery in your area</h4>
          <input placeholder="Zip Code" type="number" style="padding: 0.1em; font-size: 1.2em"> <button id="search" style="font-size: 1.2em">Search</button>
          <h5 id="searching"></h5>
        </div>
      `

      ctx.$('#search').onclick = () => {
        ctx.$('#searching').innerHTML = `Searching<span class="blink1">.</span><span class="blink2">.</span><span class="blink3">.</span>`
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
    if (
      globalState.wifiActive
      && !globalState.thermostatDisabled
      && !tmp.thermostatRinging
    ) {
      window.primarySM.enqueue('thermostatRing')
      tmp.thermostatRinging = true

    }
  },
  {
    enabled: true,
    ignoreFn: stateUpdate => !!stateUpdate.screen,
    delay: 100
  }
)


function jbMarkup(device, disabled) {

  const balance = device.balance
  return `
    <div style="margin: 0.4em 0; padding: 0.5em; background: #000; color: #fff; border: 2px dashed">
      <div>
        <h3>Auto-Miner Module [${device.ram}gb RAM]</h3>
        <h5 style="display: inline-block; padding: 0.25em; margin: 0.25em 0; background: #333; border: 1px solid">${device.wallet}</h4>
        <h4 style="margin: 0.4em 0">Balance: ₢ <span id="cryptoBalance-${device.wallet}">${device.balance}</span></h4>
        ${disabled
          ? '<h5 style="text-align:center; padding: 1em">Cannot find device. Please ensure device is connected and powered "On"</h5>'
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

function jbBehavior(ctx, deviceName, speed, cb=noop, persistCb=noop, onTransferError=noop) {
  const findMeshPairing = meshPairFinder(ctx)
  const device = globalState.cryptoDevices[deviceName]

  const wifiAvailable = findMeshPairing('gateLink', deviceName) || globalState.wifiActive && !globalState.routerUnplugged && globalState.routerReset

  const update = () => {
    if (!device.active) {
      clearInterval(ctx.interval)
      clearInterval(tmp.persistantJbInterval)
      return
    }

    ctx.state.cryptoBalances[device.wallet] = device.balance
    if (ctx.$(`#cryptoBalance-${device.wallet}`)) ctx.$(`#cryptoBalance-${device.wallet}`).innerHTML = device.balance
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

    const transferError = onTransferError(turnOff)
    if (transferError) {
      ctx.$('#mineError').innerHTML = transferError
      return
    }

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
