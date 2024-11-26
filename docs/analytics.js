import {ls} from './$.js'



if (!ls.get('__SESSION_ID')) {
  ls.set('__SESSION_ID', `"S${Math.random().toString().slice(2)}"`)
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

    PROGRESS: {
      firstSeen: gs.eventLoopStartTime,
      secondsPassed: gs.secondsPassed,
      wokenUp: gs.wokenUp,
      userNames: ms.userNames,
      screen: ms.screen,
      location: gs.location,
      appsInstalled: ms.userData?.[1]?.appsInstalled.map(a => a.key),

      envelope1PickedUp: irls?.state?.envelope1PickedUp,
      dataPlanActivated: ms.dataPlanActivated,
      nbsCalled: gs.ispCalled,
      nbsBillingCalled: gs.ispBillingCalled,
      nbsBillingReminderSent: gs.ispBillingReminderSent,
      wifiActive: gs.wifiActive,
      nbsBalance: gs.ispBalance,
      ssoCalled: gs.ssoCalled,
      defaultUnlocked: gs.defaultUnlocked,
      totalMined: ms.totalMined,
      exchangePremium: ms.userData?.[1]?.exchangePremium,
      rentBalance: gs.rentBalance,
    },
    IRL_STATE: {
      history: irls?.history?.reverse()?.slice?.(0, 10),
      lastNode: irls?.lastNode,
      currentNode: irls?.currentNode,
      currentKey: irls?.currentKey,
      state: {
        router: irls?.state?.router,
        wokenUp: irls?.state?.wokenUp,
        stairwayLevel: irls?.state?.stairwayLevel,
        roboVacLocation: irls?.state?.roboVacLocation,
        routerChecked: irls?.state?.routerChecked,
        checkedBlinds: irls?.state?.checkedBlinds,
        urine: irls?.state?.urine,
        envelope1PickedUp: irls?.state?.envelope1PickedUp,
        envelope2PickedUp: irls?.state?.envelope2PickedUp,
        checkedAlarmClock: irls?.state?.checkedAlarmClock,
      }
    },
    GLOBAL_STATE: {
      secondsPassed: gs.secondsPassed,
      wokenUp: gs.wokenUp,
      ispBalance: gs.ispBalance,
      ispBillingCalled: gs.ispBillingCalled,
      wifiActive: gs.wifiActive,
      defaultUnlocked: gs.defaultUnlocked,
      location: gs.location,
      nbsCalled: gs.ispCalled,
      ssoCalled: gs.ssoCalled,

      referrer: gs.referrer,
      routerReset: gs.routerReset,
      routerUnplugged: gs.routerUnplugged,
      smartLockOpen: gs.smartLockOpen,
      rentBalance: gs.rentBalance,
      ispBillingReminderSent: gs.ispBillingReminderSent,
      plantWatered: gs.plantWatered,
      thermostatDisabled: gs.thermostatDisabled,
      soundMuted: gs.soundMuted,
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
      userData: Object.values(ms.userData).map((d, id) => ({
        id,
        educatorModulesCompleted: d.educatorModulesCompleted,
        moneyMinerCryptoAddr: d.moneyMinerCryptoAddr,
        exchangeUSDAddr: d.exchangeUSDAddr,
        exchangePremium: d.exchangePremium,
        exchangeCryptoBalance: d.exchangeCryptoBalance,
        exchangePremiumCryptoBalance: d.exchangePremiumCryptoBalance,
        password: d.password,
        appCreditBalance: d.appCreditBalance,
        appsInstalled: d.appsInstalled.map(a => a.key),
      })),
      screen: ms.screen,
      internet: ms.internet,
      dataPlanActivated: ms.dataPlanActivated,
      totalMined: ms.totalMined,

      bluetoothEnabled: ms.bluetoothEnabled,
      a11yEnabled: ms.a11yEnabled,
      devMode: ms.devMode,
      soundEnabled: ms.soundEnabled,
      nightModeEnabled: ms.nightModeEnabled,
      distractionMode: ms.distractionMode,
      started: ms.started,
      wifiNetwork: ms.wifiNetwork,
      currentUser: ms.currentUser,
      plantStatus: ms.plantStatus,
      plantName: ms.plantName,
      autominerAdClicked: ms.autominerAdClicked,
      yieldMasterAdClicked: ms.yieldMasterAdClicked,
      usdBalances: ms.usdBalances,
      cryptoBalances: ms.cryptoBalances,
    },
    timestamp: Date.now(),
    navigator: {
      userAgent: navigator?.userAgent,
      language: navigator?.language,
      mobile: navigator?.userAgentData?.mobile

    }
  }
}

// setTimeout(() => {

// console.log(getStateSnapshot())
// }, 100)

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
