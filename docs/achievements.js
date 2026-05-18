import {persist} from './persist.js'
import {globalState} from './global.js'
import {ls} from './$.js'

const state = persist('__ACHIEVEMENTS', {
  sleepy:          { name: 'Sleepy Head', description: 'Go back to sleep', status: false },
  plantHappy:      { name: 'Green Thumb', description: 'Make your plant happy', status: false },
  lightsOn:        { name: 'Let There Be :ight!', description: 'Turn the lights on', status: false },
  flushToilet:     { name: 'Royal Flush', description: 'Flush the toilet', status: false },
  dreamJournal:    { name: 'Dream Weaver', description: 'Submit an entry to your dream journal', status: false },
  twoFACodes:      { name: 'Super Secure', description: 'Create 10 unique 2FA codes', status: false },
  funTime:         { name: 'One Hell of a Good time', description: 'Explore evrey option on the Gates of Hell', status: false },
  finEducator:     { name: 'Financial Literacy', description: 'Complete the Personal Finance Educator', status: false },
  premiumPhone:    { name: 'Call Me, Maybe', description: 'Upgrade to premium Phone App', status: false },
  roboVacRooms:    { name: 'Spring Cleaning', description: 'Catch RoboVac in every room', status: false },
  downloadApps:    { name: 'Well Prepared', description: 'Download every app', status: false },
  phoneCast:       { name: 'On the Big Screen', description: 'PhoneCast to the TV', status: false },
  toastrLogin:     { name: 'Toasted', description: 'Log in to your Toastr account', status: false },
  yieldMaster:     { name: 'Diamond Hands', description: 'Stake and unstake with Yield Master Pro', status: false },
  displayNFT:      { name: 'Right-Click Save', description: 'Display an NFT on your SmartFrame', status: false },
  resetPhonePwd:   { name: 'Clean Slate', description: 'Reset a phone user password', status: false },
  hacker:          { name: 'Hacker', description: 'Execute a sudo command', status: false },
  jailbreakr:      { name: 'Terms of Service: Voided', description: 'Install JAILBREAKR on 5 different phone profiles', status: false },
  scanViruses:     { name: 'Trojan Horse', description: 'Scan your phone for viruses', status: false },
  inboxZero:       { name: 'Inbox Zero', description: 'Mark every default profile text message as read', status: false },
  mineEverywhere:  { name: 'Crypto Bro', description: 'Mine ₢rypto on every smart device', status: false },
  beatYieldFarmer: { name: 'Infinity and Beyond', description: 'Beat YieldFarmer2', status: false },
  meshNetwork:     { name: 'Meshtastic', description: 'Set up a mesh network', status: false },
  payNBS:          { name: 'Paid in Full', description: 'Pay NBS with with the NBS Customer Success App', status: false },
  scanQRCodes:     { name: 'A Scanner Darkly', description: 'Scan 17 unique QR codes', status: false },
  openFrontDoor:   { name: 'Open Sesame', description: 'Open the Front Door', status: false },
  visitMazeRooms:  { name: 'Splunker', description: 'Visit every maze room', status: false },

  escapeStairway:  { name: 'Free at Last...', description: 'Escape the stairway', status: false, completions: [], bestTime: null },
  escapeMaze:      { name: 'Escape Artist', description: 'Sleep in the elevator', status: false, completions: [], bestTime: null },
})


export const achievements = state

export function achievement(key, value) {
  if (arguments.length > 1) {
    state[key].status = value
  }

  console.log(`${state[key].name}: Unlocked!`)
  return state[key].status
}


export function completeGame(key, time) {
  const entry = state[key]
  entry.status = true
  if (!entry.completions) entry.completions = []
  entry.completions.push(time)
  if (entry.bestTime == null || time < entry.bestTime) {
    entry.bestTime = time
  }
}

export function clearLocalStorage() {
  const saved = localStorage.getItem('__ACHIEVEMENTS')
  localStorage.clear()
  if (saved !== null) localStorage.setItem('__ACHIEVEMENTS', saved)
}

function retroDeduce() {
  if (globalState.shaydOpen && globalState.plantWatered && !globalState.plantsDead) {
    achievement('plantHappy', true)
  }
  if (globalState.lightsOn) achievement('lightsOn', true)
  if (Object.keys(globalState.roboVacCaught || {}).length >= 5) {
    achievement('roboVacRooms', true)
  }
  if (globalState.castingNFT != null) achievement('displayNFT', true)
  if (globalState.smartLockOpen) achievement('openFrontDoor', true)
  if (Object.values(globalState.cryptoDevices || {}).every(d => d?.activated)) {
    achievement('mineEverywhere', true)
  }


  if (globalState.completionTime && !state.escapeStairway.completions?.length) {
    completeGame('escapeStairway', globalState.completionTime)
  }
  if (globalState.elevatorCompletionTime && !state.escapeMaze.completions?.length) {
    completeGame('escapeMaze', globalState.elevatorCompletionTime)
  }

  const mobileState = ls.get('__MOBILE_STATE')
  if (mobileState?.userData) {
    const users = Object.values(mobileState.userData)

    if (users.some(u => u?.previouslyDialedUnlocked)) achievement('premiumPhone', true)
    if (users.some(u => u?.toastrLoggedIn)) achievement('toastrLogin', true)
    if (users.some(u => u?.virusL3)) achievement('scanViruses', true)

    if (users.some(u => new Set((u?.keyPairs || []).map(k => k.securityKey)).size >= 10)) {
      achievement('twoFACodes', true)
    }

    if (users.some(u => {
      const m = u?.educatorModulesCompleted || {}
      return m.intro && m.history && m.system && m.sptx && m.crypto
    })) achievement('finEducator', true)

    const jbCount = users.filter(u => u?.appsInstalled?.some(a => a.key === 'jailbreak')).length
    if (jbCount >= 5) achievement('jailbreakr', true)

    const user0 = mobileState.userData[0]
    if (user0?.textMessages?.length && user0.textMessages.every(tm => tm.read)) {
      achievement('inboxZero', true)
    }
    if (Object.keys(user0?.qrsScanned || {}).length >= 17) {
      achievement('scanQRCodes', true)
    }
  }

  // yieldFarmerHighScore = Infinity serializes to null through JSON
  if (globalState.yieldFarmerGlobalHighScore === null) {
    achievement('beatYieldFarmer', true)
  }
}

retroDeduce()

window.__achievements = state
window.clearLocalStorage = clearLocalStorage
