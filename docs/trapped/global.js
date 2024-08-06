import {persist} from './persist.js'

export const globalState = persist('__GLOBAL_STATE', {
  routerRestartTime: 0,
  location: 'bed',
  idVerifierUpdate: Date.now(),
  routerReset: false,
  lightsOn: false
})

window.globalState = globalState

setInterval(() => {
  if (Date.now() >= globalState.idVerifierUpdate + 60000) globalState.idVerifierUpdate = Date.now()
}, 1000)


export const calcIdVerifyCode = id => {
  const out = (globalState.idVerifierUpdate * (17 + id) + 1) % 100000
  return out < 10000 ? '0'+out : ''+out
}

export const setColor = (c, v) => {
  const r = document.querySelector(':root')
  r.style.setProperty(c, v)

  console
}

console.log(globalState)

if (globalState.lightsOn) {
  setColor('--bg-color', '#fff')
  setColor('--primary-color', '#000')
}