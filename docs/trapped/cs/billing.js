export const billingCSNodes = {
  start: {
    handler: 'intro'
  },

  intro: {
    text: `Hello. You have reached the I S P billing department`,
    follow: 'mainMenu'
  },

  mainMenu: {
    text: `To pay an outstanding bill, press 1. To check on your account's balance, press 2. To dispute an outstanding balance, press 3. To speak with a representative, press 0. To hear this options again press star.`,
    handler: options({
      1: 'payBalance',
      2: 'checkBalance',
      3: 'disputeBalance',
      0: 'representative',
      '*': 'mainMenu'
    })
  },

  checkBalance: {
    text: 'TODO',
    follow: 'mainMenu'
  },

  disputeBalance: {
    text: `To dispute an unpaid balance, please contact our dispute resolutions administrator at 1 8 0 0 7 7 7 0 8 3 6`,
    handler: 'mainMenu'
  },

  payBalance: {
    text: `You'd like to pay an outstanding balance. Is that correct? If that is correct, press 1. If that is incorrect, press 2`,
    handler: x => x.ur === 1 ? 'payBalanceContinue' : 'mainMenu'
  },

  payBalanceContinue: {
    text: 'Please enter your ISP customer identification number, followed by the pound key',
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
    text: `I've found an account associate with your router.`,
    follow: 'identityVerifier'
  },

  identityVerifier: {
    text: `Please download the Identity Verifier Application on your Device's App Market, and provide a valid I V C, followed by the pound key`,
    follow({ctx}) {
      ctx.state.ivc = []
      return 'ivcEnter'
    }
  },


  ivcEnter: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'ivcCheck'
      else {
        ctx.state.ivc.push(ur)
        return 'ivcEnter'
      }
    }
  },

  ivcCheck: {
    text: 'One moment, please',
    wait: 2000,
    follow({ctx}) {
      if (ctx.state.ivc.join('')  === 'TODO') return 'ivcSuccess'
      else return 'ivcFail'
    }
  },

  ivcSuccess: {
    text: 'TODO'
  },

  ivcFail: {
    text: `I'm sorry, but the I V C you provided was invalid`,
    follow: 'identityVerifier'
  },




  representative: {
    text: 'a representative is not available at this time. Press 1 to return to the main menu',
    follow: 'mainMenu'
  },

}