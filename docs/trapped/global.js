import {persist} from './persist.js'


export const globalState = persist('__GLOBAL_STATE', {
  modelBgMode: 1,
  routerRestartTime: 0,
  location: 'nothing',
  lastGlobalUpdate: Date.now(),
  routerReset: false,
  routerUnplugged: false,
  lightsOn: false,
  ebookBattery: 97,
  ebookOpen: false,
  ebookContent: 'ERROR: Cannot acccess Library ',
  rand: Math.random(),
  wifiActive: false,
  smartLockOpen: false,
  rentBalance: 6437.98,
  ispBalance: 0.37,
  plantWatered: false,
  plantsDead: false,
  shaydOpen: false,
  shaydEverOpen: false,
  hideClose: false,
  thermostatDisabled: false,
  autoFlusherActive: false,
  payments: {},
  eventLog: [],
  eventLoopStartTime: Date.now(),
  eventLoopDuration: 1000,
  totalAccountsCreated: 1,
  defaultUnlocked: false,
  pauseCurrency: false,
  checkedAlarmClock: false,
  countdownTimeLeft: 1780000, // 00:29:32
  countdownIntervalTime: 900,
  cryptoDevices: {
    planter: newCryptoDevice(8),
    freeze: newCryptoDevice(8),
    toastr: newCryptoDevice(4),
    thermoSmart: newCryptoDevice(2),
    wake: newCryptoDevice(2),
    lumin: newCryptoDevice(1),
    clearBreeze: newCryptoDevice(1),
    shayd: newCryptoDevice(1),
    lock: newCryptoDevice(1),
    flushMate: newCryptoDevice(1),
    gateLink: newCryptoDevice(1),
  },
  light1: {
    h: 0, s: 0, v: 100
  },
  light2: {
    h: 180, s: 0, v: 0
  },
})

// globalState.cryptoDevices.flushMate = newCryptoDevice(1)

window.globalState = globalState

export const tmp = {}
window.tmp = tmp


setInterval(() => {
  if (Date.now() >= globalState.lastGlobalUpdate + 60000) globalState.lastGlobalUpdate = Date.now()
  globalState.rand = Math.random()

}, globalState.eventLoopDuration)


function newCryptoDevice (ram) {
  return {
    wallet: rndAddr(),
    balance: 0,
    interval: null,
    active: false,
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
  device.interval = setRunInterval(() => {
    device.totalTime += ms
    device.balance += amount * 2 * Math.random()
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
      device.totalTime += ms
      device.balance += amount * 2 * Math.random()
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

  return (base / modifier) * (0.85 + rand * 0.3)
}


export const setColor = (c, v) => {
  const r = document.querySelector(':root')
  r.style.setProperty(c, v)
}



if (globalState.lightsOn) {
  setColor('--bg-color', '#fff')
  setColor('--primary-color', '#000')
}