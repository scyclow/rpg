import {persist} from './persist.js'
import {setFavicon} from './$.js'


export const globalState = persist('__GLOBAL_STATE', {
  referrer: document.referrer,
  modelBgMode: 1,
  routerRestartTime: 0,
  location: 'nothing',
  lastGlobalUpdate: Date.now(),
  routerReset: false,
  routerUnplugged: false,
  lightsOn: false,
  eNotepadBattery: 97,
  eNotepadOpen: false,
  eNotepadContent: 'ERROR: Cannot access Library ',
  rand: Math.random(),
  wifiActive: false,
  smartLockOpen: false,
  rentBalance: 6437.98,
  ispBalance: 0.37,
  ispBillingCalled: false,
  ispBillingReminderSent: false,
  castingNFT: null,
  plantWatered: false,
  plantsDead: false,
  shaydOpen: false,
  shaydEverOpen: false,
  hideClose: false,
  thermostatDisabled: false,
  autoFlusherActive: false,
  sentEducatorText: false,
  payments: {},
  eventLog: [],
  eventLoopStartTime: Date.now(),
  eventLoopDuration: 1000,
  totalAccountsCreated: 1,
  gateLinkOutputEnabled: false,
  luminInputEnabled: false,
  luminOutputEnabled: false,
  soundMuted: false,
  sentFunTimeText: false,
  wokenUp: false,

  secondsPassed: 0,
  completionTime: null,
  deviceViruses: false,
  defaultUnlocked: false,
  pauseCurrency: false,
  checkedAlarmClock: false,
  countdownTimeLeft: 1780000, // 00:29:32
  countdownIntervalTime: 900,
  roboVacCaught: {},
  cryptoDevices: {
    freeze: newCryptoDevice(32),
    planter: newCryptoDevice(8),
    toastr: newCryptoDevice(4),
    thermoSmart: newCryptoDevice(2),
    wake: newCryptoDevice(2),
    smartTV: newCryptoDevice(2),
    lumin: newCryptoDevice(1),
    clearBreeze: newCryptoDevice(1),
    shayd: newCryptoDevice(1),
    lock: newCryptoDevice(1),
    flushMate: newCryptoDevice(1),
    gateLink: newCryptoDevice(1),
    smartFrame: newCryptoDevice(1),
    roboVac: newCryptoDevice(1),
  },
  light1: {
    h: 0, s: 0, v: 100
  },
  light2: {
    h: 180, s: 0, v: 0
  },
})



window.globalState = globalState

export const tmp = {}
window.tmp = tmp


setInterval(() => {
  if (Date.now() >= globalState.lastGlobalUpdate + 60000) globalState.lastGlobalUpdate = Date.now()
  globalState.rand = Math.random()

  if (!document.hidden && globalState.wokenUp) {
    globalState.secondsPassed += 1
  }

}, globalState.eventLoopDuration)


function newCryptoDevice (ram) {
  return {
    wallet: rndAddr(),
    balance: 0,
    interval: null,
    active: false,
    activated: false,
    ms: null,
    amount: 0,
    totalTime: 0,
    ram
  }
}

export function setMiningInterval(device, amount, ms) {
  device.amount = amount
  device.ms = ms
  device.active = true
  device.activated = true
  device.interval = setRunInterval(() => {
    if (!document.hidden) {
      device.totalTime += ms
      device.balance += amount * 2 * Math.random()
    }
  }, ms)
}

export function clearMiningInterval(device) {
  device.active = false
  clearInterval(device.interval)

}


for (let device of Object.values(globalState.cryptoDevices)) {
  const { active, amount, ms } = device
  if (active) {
    device.interval = setRunInterval(() => {
      if (!document.hidden) {
        device.totalTime += ms
        device.balance += amount * 2 * Math.random()
      }
    }, ms)
  }
}

export const calcIdVerifyCode = id => {
  const out = (globalState.lastGlobalUpdate * (17 + id) + 1) % 100000
  return out < 10000 ? '0'+out : ''+out
}

export const calcAddr = seed => {
  return (
    '0x'
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.20).toString(16).slice(-7)
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.21).toString(16).slice(-7)
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.22).toString(16).slice(-7)
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.23).toString(16).slice(-7)
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.24).toString(16).slice(-7)
    + Math.floor((globalState.lastGlobalUpdate + seed)**1.25).toString(16).slice(-5)
  )
}

export function rndAddr() {
  return (
    '0x'
    + Math.floor(Math.random()*100000000000000000).toString(16)
    + Math.floor(Math.random()*100000000000000000).toString(16)
    + Math.floor(Math.random()*100000000000000000).toString(16).slice(-10)

  )
}

// 1 Crypto === X USD
export const calcCryptoUSDExchangeRate = () => {
  const base = 0.001
  const cycle = globalState.pauseCurrency ? 1 : Math.sin(Date.now()/8000)
  const rand = globalState.pauseCurrency ? 1 : globalState.rand

  const modifier = (1 + cycle / 10)

  return base + (cycle / 30000) + (rand - 0.5)/80000
}


// 1 Prem === X Crypto
export const calcPremiumCryptoUSDExchangeRate = () => {
  const base = 0.001
  const cycle = globalState.pauseCurrency ? 1 : Math.sin(Date.now()/40000)
  const rand = globalState.pauseCurrency ? 1 : globalState.rand
  const modifier = (1.45 + cycle) ** 2

  return (1.45 - cycle) * (base / modifier) * (0.85 + rand * 0.3)
}


export const setColor = (c, v) => {
  const r = document.querySelector(':root')
  r.style.setProperty(c, v)
}


const getColor = c => {
  const r = document.querySelector(':root')
  if (c === 'var(--light-color)') {
    return r.style.getPropertyValue('--light-color') || '#c1bf9f'
  } else if (c === 'var(--dark-color)') {
    return r.style.getPropertyValue('--dark-color') || '#19120b'
  } else {
    return c
  }
}

export const setColors = (c1, c2) => {
  setColor('--bg-color', c1)
  setColor('--primary-color', c2)

  setFavicon(getColor(c1), getColor(c2))
}



if (globalState.lightsOn) {
  setColors('#fff','#000')
}