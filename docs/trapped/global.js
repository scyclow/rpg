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
  eventLoopDuration: 1000
})

window.globalState = globalState



globalState.eventLoopStartTime = Date.now()

setInterval(() => {
  if (Date.now() >= globalState.idVerifierUpdate + 60000) globalState.idVerifierUpdate = Date.now()
  globalState.rand = Math.random()

}, globalState.eventLoopDuration)


export const calcIdVerifyCode = id => {
  const out = (globalState.idVerifierUpdate * (17 + id) + 1) % 100000
  return out < 10000 ? '0'+out : ''+out
}

export const calcExchangeRecipientAddr = id => {
  return (
    '0x'
    + Math.floor((globalState.idVerifierUpdate + id)**1.20).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + id)**1.21).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + id)**1.22).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + id)**1.23).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + id)**1.24).toString(16).slice(-7)
    + Math.floor((globalState.idVerifierUpdate + id)**1.25).toString(16).slice(-5)
  )
}

export const calcCryptoUSDExchangeRate = () => {
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