export const billingCSNodes = {
  start: {
    handler: 'intro'
  },

  ...group({
    intro: {
      text: `Hello. You have reached the I S P billing department`,
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

}