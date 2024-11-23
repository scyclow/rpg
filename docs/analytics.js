import {ls} from './$.js'



if (!ls.get('__SESSION_ID')) {
  ls.set('__SESSION_ID', Math.random().toString().slice(2))
}

const ENV = window.location.href.includes('smarthome.steviep.xyz') ? 'prod' : 'dev'
const ANALYTICS_URL = {
  dev: `http://127.0.0.1:54321/functions/v1`,
  prod: `https://godxjnuwaujsfqkqghue.supabase.co/functions/v1`
}
const TEST_ANALYTICS = false

export function setupAnalytics() {
  if (ENV == 'prod' || TEST_ANALYTICS) {
    setRunInterval(async () => {
      if (!document.hidden) {
        try {
          const res = await postSnapshot()
        } catch (e) {
          console.log(e)
        }
      }
    }, 30000)

    window.addEventListener('error', async (e) => {
      console.log('Logging Error:')
      console.log(e)
      try {
        console.log(e.message)
        const res = await post({
          session_id: ls.get('__SESSION_ID').toString(),
          error: {
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            message: e.message ?? e?.error?.message,
          }
        }, `${ANALYTICS_URL[ENV]}/errors`)
      } catch (_e) {
        console.log('DID NOT LOG ERROR')
        console.log(_e)
      }
    })
  }
}

export async function postSnapshot() {
  return post({
    id: ls.get('__SESSION_ID').toString(),
    snapshot: getStateSnapshot()
  }, `${ANALYTICS_URL[ENV]}/snapshots`)
}




function getStateSnapshot() {
  const gs = ls.get('__GLOBAL_STATE')
  const ms = ls.get('__MOBILE_STATE')
  const irls = ls.get('__PRIMARY_SM_CTX')


  return {
    SESSION_ID: ls.get('__SESSION_ID'),
    GAME_VERSION: ls.get('__GAME_VERSION'),
    IRL_STATE: {
      history: irls.history.reverse().slice(0, 10),
      lastNode: irls.lastNode,
      currentNode: irls.currentNode,
      currentKey: irls.currentKey,
      state: {
        router: irls.state.router,
        stairwayLevel: irls.state.stairwayLevel,
        roboVacLocation: irls.state.roboVacLocation,
        routerChecked: irls.state.routerChecked,
        wokenUp: irls.state.wokenUp,
        checkedBlinds: irls.state.checkedBlinds,
        urine: irls.state.urine,
        envelope1PickedUp: irls.state.envelope1PickedUp,
        envelope2PickedUp: irls.state.envelope2PickedUp,
        checkedAlarmClock: irls.state.checkedAlarmClock,
      }
    },
    GLOBAL_STATE: {
      referrer: gs.referrer,
      location: gs.location,
      routerReset: gs.routerReset,
      routerUnplugged: gs.routerUnplugged,
      wifiActive: gs.wifiActive,
      smartLockOpen: gs.smartLockOpen,
      rentBalance: gs.rentBalance,
      ispBalance: gs.ispBalance,
      ispBillingCalled: gs.ispBillingCalled,
      ispBillingReminderSent: gs.ispBillingReminderSent,
      plantWatered: gs.plantWatered,
      thermostatDisabled: gs.thermostatDisabled,
      soundMuted: gs.soundMuted,
      wokenUp: gs.wokenUp,
      secondsPassed: gs.secondsPassed,
      defaultUnlocked: gs.defaultUnlocked,
      checkedAlarmClock: gs.checkedAlarmClock,
      firstSeen: gs.eventLoopStartTime,
      completionTime: gs.completionTime,
      cryptoDevices: Object.keys(gs.cryptoDevices).reduce((a, c) => {
        a[c] = gs.cryptoDevices[c].activated
        return a
      }, {})
    },
    MOBILE_STATE: {
      userNames: ms.userNames,
      bluetoothEnabled: ms.bluetoothEnabled,
      a11yEnabled: ms.a11yEnabled,
      devMode: ms.devMode,
      soundEnabled: ms.soundEnabled,
      nightModeEnabled: ms.nightModeEnabled,
      distractionMode: ms.distractionMode,
      started: ms.started,
      screen: ms.screen,
      internet: ms.internet,
      dataPlanActivated: ms.dataPlanActivated,
      wifiNetwork: ms.wifiNetwork,
      currentUser: ms.currentUser,
      plantStatus: ms.plantStatus,
      plantName: ms.plantName,
      totalMined: ms.totalMined,
      autominerAdClicked: ms.autominerAdClicked,
      yieldMasterAdClicked: ms.yieldMasterAdClicked,
      usdBalances: ms.usdBalances,
      cryptoBalances: ms.cryptoBalances,
      userData: Object.values(ms.userData).map(d => ({
        educatorModulesCompleted: d.educatorModulesCompleted,
        moneyMinerCryptoAddr: d.moneyMinerCryptoAddr,
        exchangeUSDAddr: d.exchangeUSDAddr,
        exchangePremium: d.exchangePremium,
        exchangeCryptoBalance: d.exchangeCryptoBalance,
        exchangePremiumCryptoBalance: d.exchangePremiumCryptoBalance,
        password: d.password,
        appCreditBalance: d.appCreditBalance,
        appsInstalled: d.appsInstalled.map(a => a.key),
      }))
    },
    timstamp: Date.now(),
    navigator: {
      userAgent: navigator?.userAgent,
      language: navigator?.language,
      mobile: navigator?.userAgentData?.mobile

    }
  }
}

console.log(getStateSnapshot())

async function post(_body, url) {
  const method = 'POST';
  const headers = { 'Content-Type': 'application/json' }
  const body = JSON.stringify(_body)

  const response = await fetch(
    url,
    {
      headers,
      body,
      method
    }
  )

  return response.json()
}
