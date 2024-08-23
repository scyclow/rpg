import {persist} from './persist.js'


export const globalState = persist('__GLOBAL_STATE', {
  routerRestartTime: 0,
  location: 'nothing',
  idVerifierUpdate: Date.now(),
  routerReset: false,
  lightsOn: false,
  rand: Math.random(),
  wifiActive: false,
  smartLockOpen: false,
  rentBalance: 6437.98,
  ispBalance: 0.37,
  plantWatered: false,
  payments: {},
  eventLog: [],
  eventLoopStartTime: Date.now(),
  eventLoopDuration: 1000,
  totalAccountsCreated: 1,
  defaultUnlocked: false,
  cryptoDevices: {
    planter: newCryptoDevice(4),
    lumin: newCryptoDevice(1),
    toastr: newCryptoDevice(1),
    // bathe
    // shayd
    // refrigerator
  },

})

window.globalState = globalState



globalState.eventLoopStartTime = Date.now()

setInterval(() => {
  if (Date.now() >= globalState.idVerifierUpdate + 60000) globalState.idVerifierUpdate = Date.now()
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
  const out = (globalState.idVerifierUpdate * (17 + id) + 1) % 100000
  return out < 10000 ? '0'+out : ''+out
}

export const calcAddr = seed => {
  return (
    '0x'
    + Math.floor((globalState.idVerifierUpdate + seed)**1.20).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + seed)**1.21).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + seed)**1.22).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + seed)**1.23).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + seed)**1.24).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + seed)**1.25).toString(16).slice(-5)
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

export const calcCryptoUSDExchangeRate = () => {
  const base = 0.001
  const cycle = Math.sin(Date.now()/8000)

  const modifier = (1 + cycle / 10)

  return base + (cycle / 30000) + (globalState.rand - 0.5)/80000
}


export const calcPremiumCryptoUSDExchangeRate = () => {
  const base = 0.001
  const cycle = Math.sin(Date.now()/40000)

  const modifier = (1.45 + cycle) ** 2

  return (base / modifier) * (0.85 + globalState.rand * 0.3)
}


export const setColor = (c, v) => {
  const r = document.querySelector(':root')
  r.style.setProperty(c, v)
}



if (globalState.lightsOn) {
  setColor('--bg-color', '#fff')
  setColor('--primary-color', '#000')
}