



export const ispCSNodes = {
  start: {
    handler: 'intro'
  },

  ...group({
    intro: {
      text: `Hello, and welcome to internet customer support. This call may be recorded for quality and security purposes. If you're calling about becoming a new customer, press 1. To add service to an existing account, press 2. If you'd like to ask about a recent order, press 3. For all other inquiries, press 4. To hear these options again, press star`,
    },
    mainMenu: {
      text: `If you're calling about becoming a new customer, press 1. To add service to an existing account, press 2. If you'd like to pay an outstanding bill, press 3. For all other inquiries, press 4. to hear these options again, press star`,
    }
  }, {
    handler: options({
      0: 'representative',
      1: 'newCustomer',
      2: 'existingAccount',
      3: 'outstandingBill',
      4: 'somethingElse',
      '*': 'mainMenu'
    })
  }),


  representative: {
    text: 'a representative is not available at this time',
    follow: 'mainMenu'
  },

  newCustomer: {
    text: 'Please enter your zip code, followed by the pound key',
    handler: ({ur}) => {
      if (ur === '#') return 'newCustomerPending'
      else return 'newCustomerEntry'
    }
  },
  newCustomerEntry: {
    text: '',
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
    text: `To report an internet outtage in your area, press 1. To report an issue with your account, press 2. To talk to a representative, press 0. To return to the main menu, press 9.`,
    handler: options({
      0: 'representative',
      1: 'internetOuttage',
      2: 'issueWithAccount',
      9: 'mainMenu',
      '*': 'somethingElse'
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
      return 'routerIdentifier'
    }
  },

  routerIdentifier: {
    text: '',
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
      else return 'routerIdentifierFail'
    }
  },

  routerIdentifierFail: {
    text: `I'm sorry, but I could not find an account associated with your router's device identifier`,
    follow: 'mainMenu'
  },

  routerIdentifierSucceed: {
    text: `I've found an account associated with your device`,
    follow: 'verifyIdentity'
  },

  verifyIdentity: {
    text: 'Service to this account has been suspended due to an unpaid balance of. zero. dollars. and. thirty. seven. cents... Service will be restored to this account upon payment of this balance. If you would like to be transferred to our billing department, press 1. To return to the main menut, press star',
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
    text: '',
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
    text: `I don't see an internet outtage in your area. You may need to reboot your router manually. I can walk you through the steps. First, unplug the power chord from the back of your router. When you've unplugged your router, press 1`,
    handler: options({ 1: 'routerUnplugged' })
  },

  routerUnplugged: {
    text: 'when all the lights are off press 1',
    handler: options({ 1: 'routerLightsOff' })
  },

  routerLightsOff: {
    text: `i'll let you know when you can plug it back in. In the meantime, please make sure that all of the other cables are pluged in`,
    wait: 12000, // this is a little fucky since the timer starts when the voice starts talking
    follow: 'routerPlugIn'
  },

  routerPlugIn: {
    text: `You can plug it back in now. It may take up to 5 minutes for your router to reboot. Is there anything else I can help you with?`,
    handler: 'mainMenu'
  }

}