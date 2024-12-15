import {createSource, MAX_VOLUME} from '../audio.js'
import { globalState } from '../global.js'

let SOURCE1, SOURCE2



export const ispCSNodes = {
  start: {
    handler: 'intro'
  },

  ...group({
    intro: {
      before() {
        globalState.ispCalled = true
      },
      text: `Hello, and welcome to N B S customer support. This call may be recorded for quality and security purposes. If you're calling about becoming a new customer, press 1. To add service to an existing account, press 2. If you'd like to pay an outstanding bill, press 3. For all other inquiries, press 4. To hear these options again, press star`,
    },
    mainMenu: {
      text: `If you're calling about becoming a new customer, press 1. To add service to an existing account, press 2. If you'd like to pay an outstanding bill, press 3. For all other inquiries, press 4. To hear these options again, press star`,
    }
  }, {
    handler: options({
      0: 'representative',
      1: 'newCustomer',
      2: 'existingAccount',
      3: 'outstandingBill',
      4: 'somethingElse',
      5: 'issueWithAccount',
      6: 'issueWithAccount',
      7: 'issueWithAccount',
      8: 'issueWithAccount',
      9: 'issueWithAccount',
      '*': 'mainMenu'
    })
  }),

  representative: {
    text: 'There are currently N A N customers in front of you in line. Please stay on the line and a representative will be with you shortly',
    handler: x => 'representative',
    wait: 8000,
    follow: ({ctx}) => {
      const note = 300 * sample([1, 1.125, 1.2, 1.33333, 1.5, 1.6, 1.75])
      // const note = 300 * sample([1, 1.122, 1.189, 1.334, 1.498, 1.588, 1.782])

      const SOURCE1 = createSource('sine', note)
      const SOURCE2 = createSource('sine', note*2)

      ctx.tmp.srcs.push(SOURCE1)
      ctx.tmp.srcs.push(SOURCE2)

      setRunInterval(() => {
        SOURCE1.smoothFreq(note)
        SOURCE2.smoothFreq(note*2)

        SOURCE1.smoothGain(MAX_VOLUME)
        SOURCE2.smoothGain(MAX_VOLUME)

        setTimeout(() => {
          SOURCE1.smoothGain(0)
          SOURCE2.smoothGain(0)
        }, 80)
      }, 1000 + Math.random()*2)

      return 'representativeRing'
    }
  },

  representativeRing: {
    text: '',
    handler: 'representative',
  },


  newCustomer: {
    text: `You'd like to sign up for N B S service. N B S is the leading internet service provider among customers seeking high quality internet connection. I just need to ask you a few questions before we can get started. Do you currently have an N B S router? If so press 1. Otherwise press 2.`,
    handler: options({
      1: 'newCustomerRouter',
      2: 'newCustomerZipCode'
    })
  },

  newCustomerRouter: {
    text: `Please input the device identifier located on the bottom of your router, followed by the pound key`,
    follow: ({ctx}) => {
      ctx.state.routerIdentifer = []
      ctx.state.routerNotFound = 'newCustomerZipCode'
      return 'routerIdentifier'
    }
  },


  newCustomerZipCode: {
    text: 'Please enter your zip code, followed by the pound key',
    handler: ({ur}) => {
      if (ur === '#') return 'newCustomerPending'
      else return 'newCustomerEntry'
    }
  },
  newCustomerEntry: {
    text: ({ur}) => ur === '*' ? 'When you are finished entering your zip code, please press the pound key' : '',
    handler: ({ur}) => {
      if (ur === '#') return 'newCustomerPending'
      else return 'newCustomerEntry'
    }
  },

  newCustomerPending: {
    text: `One moment please`,
    wait: 3000,
    follow: 'newCustomerFail'
  },

  newCustomerFail: {
    text: `I'm sorry. But we don't currently provide service to this zip code`,
    follow: 'mainMenu'
  },


  outstandingBill: {
    text: `To contact our billing department, please dial 1 8 8 8 5 5 5 9 4 8 3`,
    follow: 'mainMenu'
  },

  // outstandingBill: {
  //   text: 'Please input your Pay App. S.P.T.X. code, followed by the pound key',
  //   follow: ({ctx}) => {
  //     ctx.state.paymentCode = []
  //     return 'outstandingBillPaying'
  //   }
  // },

  // outstandingBillPaying: {
  //   text: '',
  //   handler: ({ur}) => {
  //     if (ur === '#') return 'outstandingBillPending'
  //     else {
  //       ctx.state.paymentCode.push(ur)
  //       return 'outstandingBillPaying'
  //     }
  //   }
  // },

  // outstandingBillPending: {
  //   text: `One moment please`,
  //   wait: 3000,
  //   follow: ({ctx}) => {
  //     const paymentCode = ctx.state.paymentCode.join('')
  //     // TODO
  //     return 'outstandingBillFail'
  //   }
  // },

  // outstandingBillFail: {
  //   text: `I'm sorry, but the Pay App SPTX you entered is invalid`,
  //   follow: 'mainMenu'
  // },

  existingAccount: {
    text: 'Error: This option does not exist',
    follow: 'mainMenu'
  },


  somethingElse: {
    text: `To report an internet outtage in your area, press 1. To report an issue with your account, press 2. To talk to a representative, press 0. To return to the main menu, press star.`,
    handler: options({
      0: 'representative',
      1: 'internetOuttage',
      2: 'issueWithAccount',
      3: 'issueWithAccount',
      4: 'issueWithAccount',
      5: 'issueWithAccount',
      6: 'issueWithAccount',
      7: 'issueWithAccount',
      8: 'issueWithAccount',
      9: 'issueWithAccount',
      '*': 'mainMenu',
    })
  },

  issueWithAccount: {
    text: `You'd like to report an issue with your account. One moment while I look for the account associated with your phone number`,
    follow: 'cannotFindAccount',
    wait: 3000
  },

  cannotFindAccount: {
    text: `I can't find an account associated with this phone number. Please input the device identifier located on the bottom of your router, followed by the pound key`,
    follow: ({ctx}) => {
      ctx.state.routerIdentifer = []
      ctx.state.routerNotFound = 'routerIdentifierFail'
      return 'routerIdentifier'
    }
  },

  routerIdentifier: {
    text: ({ur}) => ur === '*' ? `When you are finished entering your router's device identifier, please press the pound key` : '',
    handler: ({ur, ctx}) => {
      if (!ur) return
      else if (ur === '#') return 'routerIdentifierPending'
      else {
        ctx.state.routerIdentifer.push(ur)
        return 'routerIdentifier'
      }
    }
  },

  routerIdentifierPending: {
    text: `One moment please`,
    wait: 3000,
    follow: ({ctx}) => {
      if (ctx.state.routerIdentifer.join('') === '5879234963378') return 'routerIdentifierSucceed'
      else return ctx.state.routerNotFound
    }
  },

  routerIdentifierFail: {
    text: `I'm sorry, but I could not find an account associated with your router's device identifier`,
    follow: 'newCustomerRouter'
  },

  routerIdentifierSucceed: {
    text: `I've found an account associated with your device`,
    follow: 'verifyIdentity'
  },

  // TODO mention that account belongs to default

  verifyIdentity: {
    text: () => globalState.wifiActive
      ? `This account is currently active. If you would like to be transferred to our billing department, press 1. To return to the main menu, press star`
      : `Service to this account has been suspended due to an unpaid balance. Service will be restored to this account upon payment of this balance. If you would like to be transferred to our billing department, press 1. To return to the main menu, press star`,
    handler: options({
      1: 'outstandingBill',
      '*': 'mainMenu'
    })
  },

  internetOuttage: {
    text: `You'd like to report an internet outtage. Please enter your zip code, followed by the pound key`,
    handler: ({ur}) => {
      if (ur === '#') return 'internetOuttagePending'
      else return 'internetOuttageEntry'
    }
  },

  internetOuttageEntry: {
    text: ({ur}) => ur === '*' ? 'When you are finished entering your zip code, please press the pound key' : '',
    handler: ({ur}) => {
      if (ur === '#') return 'internetOuttagePending'
      else return 'internetOuttageEntry'
    }
  },

  internetOuttagePending: {
    text: `One moment please`,
    wait: 3000,
    follow: 'internetOuttageFail'
  },

  // TODO: input router model number
  internetOuttageFail: {
    text: `I don't see an internet outtage in your area. You may need to reboot your router manually. For instructions on how to reboot your router manually, press 1. If you are experiencing another issue with your account, press 2. To return to the main menu, press 3.`,
    handler: options({
      0: 'representative',
      1: 'unplugRouter',
      2: 'issueWithAccount',
      3: 'mainMenu',
    })
  },

  unplugRouter: {
    text: `I can walk you through the steps to reboot your router. First, unplug the power chord from the back of your router. When you've unplugged your router, press 1`,
    handler: options({
      0: 'representative',
      1: 'routerUnplugged',
      2: 'issueWithAccount',
      3: 'mainMenu',
      4: 'issueWithAccount',
      5: 'issueWithAccount',
      6: 'issueWithAccount',
      7: 'issueWithAccount',
      8: 'issueWithAccount',
      9: 'issueWithAccount',
    })
  },

  routerUnplugged: {
    text: 'when all the lights are off press 1',
    handler: options({
      0: 'representative',
      1: 'routerLightsOff',
      2: 'issueWithAccount',
      3: 'mainMenu',
      4: 'issueWithAccount',
      5: 'issueWithAccount',
      6: 'issueWithAccount',
      7: 'issueWithAccount',
      8: 'issueWithAccount',
      9: 'issueWithAccount',
    })
  },

  routerLightsOff: {
    text: `i'll let you know when you can plug it back in. In the meantime, please make sure that all of the other cables are pluged in`,
    wait: 12000, // this is a little fucky since the timer starts when the voice starts talking
    follow: 'routerPlugIn'
  },

  routerPlugIn: {
    text: `You can plug it back in now. It may take up to 5 minutes for your router to reboot. If you are still having issues with your account press 1. To return to the main menu, press 2`,
    handler: options({
      0: 'representative',
      1: 'issueWithAccount',
      2: 'mainMenu',
      3: 'issueWithAccount',
      4: 'issueWithAccount',
      5: 'issueWithAccount',
      6: 'issueWithAccount',
      7: 'issueWithAccount',
      8: 'issueWithAccount',
      9: 'issueWithAccount',
    })
  }

}