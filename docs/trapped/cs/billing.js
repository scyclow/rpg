export const billingCSNodes = {
  start: {
    handler: 'intro'
  },

  intro: {
    text: `Hello. You have reached the N B S billing department`,
    follow: () => {
      globalState.ispBillingCalled = true
      return 'mainMenu'
    }
  },

  mainMenu: {
    text: `To pay an outstanding bill, press 1., To check on your account's balance, press 2., To dispute an outstanding balance, press 3., To reactivate your account, press 4., To speak with a representative, press 0. To hear this options again press star.`,
    handler: options({
      1: 'payOutstandingBalance',
      2: 'checkBalance',
      3: 'disputeBalance',
      4: 'reactivateAccount',
      0: 'representative',
      '*': 'mainMenu'
    })
  },

  checkBalance: {
    text: `You'd like to check your outstanding balance. Is that correct? If that is correct, press 1. If that is incorrect, press 2`,
    handler: x => x.ur === 1 ? 'payBalanceContinue' : 'mainMenu'
  },

  reactivateAccount: {
    text: `You'd like to reactivate your account. Is that correct? If that is correct, press 1. If that is incorrect, press 2`,
    handler: x => x.ur === 1 ? 'payBalanceContinue' : 'mainMenu'
  },

  disputeBalance: {
    text: `To dispute an unpaid balance, please contact our dispute resolutions administrator at 1 8 0 0 7 7 7 0 8 3 6`,
    handler: 'mainMenu'
  },

  payOutstandingBalance: {
    text: `You'd like to pay an outstanding balance. Is that correct? If that is correct, press 1. If that is incorrect, press 2`,
    handler: x => x.ur === 1 ? 'payBalanceContinue' : 'mainMenu'
  },


  payBalanceContinue: {
    text: `I'll need to find your account. Press 1 to look up your account with your N B S customer identification number. Press 2 to look up your account with your router's device identifier. Press 3 to repeat these options`,
    handler: options({
      1: 'nbsCustomerIdentifier',
      2: 'routerId',
      3: 'payBalanceContinue',
    })
  },

  nbsCustomerIdentifier: {
    text: 'Please enter your N B S customer identification number, followed by the pound key',
    follow({ctx}) {
      ctx.state.idNumber = []
      return 'idNumberEnter'
    }
  },

  idNumberEnter: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'idNumberCheck'
      else {
        ctx.state.idNumber.push(ur)
        return 'idNumberEnter'
      }
    }
  },

  idNumberCheck: {
    text: 'One moment, please',
    wait: 2000,
    follow: 'idNumberFail'
  },

  idNumberFail: {
    text: `I'm sorry. I couldn't find an account associated with that number. `,
    follow: 'routerId'
  },

  routerId: {
    text: `I can find your account if you give me your router device identifier. Please enter your router's device identifier followed by the pound key`,
    follow({ctx}) {
      ctx.state.routerId = []
      return 'routerIdEnter'
    }
  },


  routerIdEnter: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'routerIdCheck'
      else {
        ctx.state.routerId.push(ur)
        return 'routerIdEnter'
      }
    }
  },

  routerIdCheck: {
    text: 'One moment, please',
    wait: 2000,
    follow({ctx}) {
      if (ctx.state.routerId.join('')  === '5879234963378') return 'routerIdSuccess'
      else return 'routerIdFail'
    }
  },

  routerIdFail: {
    text: `I'm sorry, but I could not find an account associated with that router`,
    follow: 'routerId'
  },

  routerIdSuccess: {
    text: `I've found an account associated with your router.`,
    follow: () => globalState.ispBalance === 0 && !globalState.wifiActive ? 'serviceIsSuspended' : 'readBalance'
  },

  readBalance: {
    text: () => `You have an unpaid balance of, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., To pay this balance, press 1. To dispute this balance, press 2. To return to the main menu, press 3. To repeat these options, press 4`,
    handler: options({
      1: 'payBalance',
      2: 'disputeBalance',
      3: 'mainMenu',
      4: 'readBalance',
    })
  },

  payBalance: {
    // text: () => `To pay your unpaid balance of, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., Download the Pay App application from the AppMarket. Enter the following pay app address into the recipient box: 0, x, 4, b, 2, 5, 8, 6, 0, 3, 2, 5, 7, 4, 6, 0, d, 4, 8, 0, c, 9, 2, 9, a, f, 5, f, 7, b, 8, 3, e, 8, c, 4, 2, 7, 9, b, 7, b.,,, Then enter ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., into the amount box. Then press the sign transaction button. Finally, provide us with the resulting S P T X. identifier , To repeat this message press 1. , To enter a Pay App S P T X identifier press 2,. To dispute this balance press 3., To return to the main menu press 4`,
    text: () => `To pay your unpaid balance of, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., with a Pay App S P T X identifier press 1,. For instructions on how to generate a valid Pay App S P T X identifier press 2., To dispute your balance of, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., press 3., To return to the main menu press 4., To repeat this message press 5`,
    handler: options({
      1: 'enterSPTX',
      2: 'sptxInstructions1',
      3: 'disputeBalance',
      4: 'mainMenu',
      5: 'payBalance',
    })
  },

  sptxInstructions1: {
    text: `Please download the Pay App application from your device's App Market. When you have downloaded the Pay App application from your device's App Market press 1., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'sptxInstructions2',
      2: 'sptxInstructions1',
      3: 'payBalance',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },

  sptxInstructions2: {
    text: `Once you have downloaded the Pay App application from your device's App Market, fund your Pay App balance with ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., Once you have funded your Pay App balance with ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., press 1., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'sptxInstructions3',
      2: 'sptxInstructions2',
      3: 'sptxInstructions1',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },


  sptxInstructions3: {
    text: `Once you have funded your Pay App balance with ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., please enter, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., into the send amount input box. Once you have entered, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., into the send amount input box press 1., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'sptxInstructions4',
      2: 'sptxInstructions3',
      3: 'sptxInstructions2',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },

  sptxInstructions4: {
    text: `Once you have entered, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents., into the send amount input box, please enter 0, x, 4, b, 2, 5, 8, 6, 0, 3, 2, 5, 7, 4, 6, 0, d, 4, 8, 0, c, 9, 2, 9, a, f, 5, f, 7, b, 8, 3, e, 8, c, 4, 2, 7, 9, b, 7, b.,,, into the recipient address input box. Once you have entered 0, x, 4, b, 2, 5, 8, 6, 0, 3, 2, 5, 7, 4, 6, 0, d, 4, 8, 0, c, 9, 2, 9, a, f, 5, f, 7, b, 8, 3, e, 8, c, 4, 2, 7, 9, b, 7, b.,,, into the recipient address input box press 1., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'sptxInstructions5',
      2: 'sptxInstructions4',
      3: 'sptxInstructions3',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },

  sptxInstructions5: {
    text: `Once you have entered 0, x, 4, b, 2, 5, 8, 6, 0, 3, 2, 5, 7, 4, 6, 0, d, 4, 8, 0, c, 9, 2, 9, a, f, 5, f, 7, b, 8, 3, e, 8, c, 4, 2, 7, 9, b, 7, b.,,, into the recipient address input box. Please click the sign transaction button. Once you have clicked the sign transaction button press 1., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'sptxInstructions6',
      2: 'sptxInstructions5',
      3: 'sptxInstructions4',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },

  sptxInstructions6: {
    text: `Clicking the sign transaction button will generate a S P T X identifier. Please write down the resulting S P T X identifier. Press 1 to enter your S P T X identifier., To repeat this message press 2., To go back press 3., To dispute your unpaid balance press 4., To go back to the main menu press 5`,
    handler: options({
      1: 'enterSPTX',
      2: 'sptxInstructions6',
      3: 'sptxInstructions5',
      4: 'disputeBalance',
      5: 'mainMenu'
    })
  },

  enterSPTX: {
    text: `Please enter your Pay App S P T X identifier followed by the pound key`,
    follow({ctx}) {
      ctx.state.sptx = []
      return 'sptxEntry'
    }
  },

  sptxEntry: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'sptxCheck'
      else {
        ctx.state.sptx.push(ur)
        return 'sptxEntry'
      }
    }
  },

  sptxCheck: {
    text: 'One moment, please',
    async follow({ctx}) {
      await waitPromise(5000)
      const sptxInput = ctx.state.sptx.join('')
      const payment = globalState.payments[sptxInput]

      if (!payment || payment.recipient !== '0x4b258603257460d480c929af5f7b83e8c4279b7b') return 'sptxFail1'
      else if (payment.received) return 'sptxFail2'

      payment.received = true

      globalState.ispBalance = Math.max(0, globalState.ispBalance - payment.amount)


      return 'sptxSuccess'

// TODO: if you'd like to reactivate your service, call this number:
    }
  },

  sptxSuccess: {
    text: () => `Thank you. Your payment has been received. Your current balance is, ${Math.floor(globalState.ispBalance)}., Dollars., And., ${100*(globalState.ispBalance % 1)}., Cents.`,
    follow: () => globalState.ispBalance === 0 ? 'reactivateQuestion' : 'payBalance'
  },

  reactivateQuestion: {
    text: `If you would like to reactivate your account, press 1., If you would like to return to the main menu, press 2.`,
    handler: options({
      1: 'payBalanceContinue',
      2: 'mainMenu'
    })
  },

  sptxFail1: {
    text: `I'm sorry, but the S P T X identifier you provided was invalid. `,
    follow: 'sptxFailMessage'
  },

  sptxFail2: {
    text: `I'm sorry, but the S P T X identifier you provided has already been processed. `,
    follow: 'sptxFailMessage'
  },

  sptxFailMessage: {
    text: `For instructions on how to generate a valid S P T X identifier press 1., To input another S P T X identifier press 2., To return to the main menu press 3`,
    handler: options({
      1: 'sptxInstructions1',
      2: 'enterSPTX',
      3: 'mainMenu'
    })
  },

  serviceIsSuspended: {
    text: `Your current account was suspended due to an unpaid balance. To resume service press 1., To return to the main menu press 2`,
    handler: options({
      1: 'resumeServiceWait',
      2: 'mainMenu'
    })
  },

  resumeServiceWait: {
    text: `One moment please`,
    async follow() {
      await waitPromise(7000)
      globalState.wifiActive = true
      return 'serviceResumed'
    }
  },

  serviceResumed: {
    text: `Service to your account has been resumed`,
    follow: 'mainMenu'
  },




  // identityVerifier: {
  //   text: `Please download the Identity Verifier Application on your Device's App Market, and provide a valid I V C, followed by the pound key`,
  //   follow({ctx}) {
  //     ctx.state.ivc = []
  //     return 'ivcEnter'
  //   }
  // },


  // ivcEnter: {
  //   text: '',
  //   handler({ur, ctx}) {
  //     if (ur === '#') return 'ivcCheck'
  //     else {
  //       ctx.state.ivc.push(ur)
  //       return 'ivcEnter'
  //     }
  //   }
  // },

  // ivcCheck: {
  //   text: 'One moment, please',
  //   wait: 2000,
  //   follow({ctx}) {
  //     if (ctx.state.ivc.join('')  === 'TODO') return 'ivcSuccess'
  //     else return 'ivcFail'
  //   }
  // },

  // ivcSuccess: {
  //   text: 'TODO'
  // },

  // ivcFail: {
  //   text: `I'm sorry, but the I V C you provided was invalid`,
  //   follow: 'identityVerifier'
  // },




  representative: {
    text: 'a representative is not available at this time. Press 1 to return to the main menu',
    follow: 'mainMenu'
  },

}