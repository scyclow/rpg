import {CTX} from '../stateMachine.js'
import {globalState} from '../global.js'


export const ssoCTX = new CTX({
  currentNode: 'start',
  state: {

  }
})
export const ssoNodes = {
  start: {
    handler: 'intro'
  },

  intro: {
    text: `You have reached the S S O identity management support line. Quality customer service is our goal, so this call may be recorded for training purposes. What can I help you with? If you'd like to create a new account press 1., If you've been locked out of an existing account press 2., If you are calling to, press 3., To speak with a representative press 0., To repeat this message press star`,
    handler: options({
      0: 'representative',
      1: 'newAccount',
      2: 'accountLockout',
      3: 'thankYou',
      '*': 'intro'
    }),
  },

  representative: {
    text: `We are experiencing unusual call volume at the moment. All of our representatives are busy`,
    follow: 'intro'
  },

  thankYou: {
    text: `Thank you`,
    async follow() {
      await waitPromise(2000)
      return 'hangup'
    }
  },
  hangup: {
    action: 'hangup'
  },
  newAccountError: {
    text: `I'm sorry. There was an error creating your new account`,
    follow: 'intro'
  },

  newAccount: {
    text: `You'd like to create a new account. I can help you with that. Please enter your mobile device's device id, which can be located in the settings app. And then press the pound key`,
    handler({ur}) {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountId'
    }
  },

  newAccountId: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountFirstName'
      else return 'newAccountId'
    }
  },

  newAccountFirstName: {
    text: `Please enter your first name, and then press the pound key`,
    handler({ur}) {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountFirstNamePending'
    }
  },

  newAccountFirstNamePending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountLastName'
      else return 'newAccountFirstNamePending'
    }
  },

  newAccountLastName: {
    text: `Please enter your last name, and then press the pound key`,
    handler({ur}) {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountLastNamePending'
    }
  },

  newAccountLastNamePending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountBirthday'
      else return 'newAccountLastNamePending'
    }
  },

  newAccountBirthday: {
    text: `Please enter your birthday, and then press the pound key`,
    handler({ur})  {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountBirthdayPending'
    }
  },

  newAccountBirthdayPending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountGender'
      else return 'newAccountBirthdayPending'
    }
  },

  newAccountGender: {
    text: `Please enter your Gender, and then press the pound key`,
    handler({ur})  {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountGenderPending'
    }
  },

  newAccountGenderPending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountSexualOrientation'
      else return 'newAccountGenderPending'
    }
  },

  newAccountSexualOrientation: {
    text: `Please enter your Sexual Orientation, and then press the pound key`,
    handler({ur})  {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountSexualOrientationPending'
    }
  },

  newAccountSexualOrientationPending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountHeight'
      else return 'newAccountSexualOrientationPending'
    }
  },

  newAccountHeight: {
    text: `Please enter your height, and then press the pound key`,
    handler({ur})  {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountHeightPending'
    }
  },

  newAccountHeightPending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountWeight'
      else return 'newAccountHeightPending'
    }
  },

  newAccountWeight: {
    text: `Please enter your Weight, and then press the pound key`,
    handler({ur})  {
      if (ur === '#') return 'newAccountError'
      else return 'newAccountWeightPending'
    }
  },

  newAccountWeightPending: {
    text: '',
    handler({ur}) {
      if (ur === '#') return 'newAccountFirstName'
      else return 'newAccountWeightPending'
    }
  },

  accountLockout: {
    text: `You have been locked out of your account. I'm sorry to hear that. I can help you with that. Please enter your mobile device's device id, which can be located in the settings app. And then press the pound key.`,
    handler: ({ur, ctx}) => {
      ctx.state.deviceID = []
      if (ur === '#') return 'accountLockoutError'
      else {
        ctx.state.deviceID.push(ur)
        return 'accountLockoutDeviceIDInput'
      }
    }
  },
  accountLockoutDeviceIDInput: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'accountLockoutDeviceIDPending'
      else {
        ctx.state.deviceID.push(ur)
        return 'accountLockoutDeviceIDInput'
      }
    }
  },

  accountLockoutDeviceIDPending: {
    text: `One moment please while I try to find a device associated with that device id`,
    follow({ur, ctx}) {
      if (ctx.state.deviceID.join('') === '492229997162580') return 'deviceFound'
      else return 'deviceNotFound'
    }
  },

  deviceNotFound: {
    text: `I'm sorry. I could not locate a device associated with that device ID`,
    follow: 'accountLockoutError'
  },

  accountLockoutError: {
    text: `I'm sorry. There was an error recovering your account`,
    follow: 'intro'
  },


  deviceFound: {
    text: () => `Okay. I found a device associated with the device ID you gave me. There are ${globalState.totalAccountsCreated} accounts associated with this device. Which account would you like to recover?`,
    handler({ur}) {

      if (ur === '*') return 'intro'
      else if (ur === '0' && !globalState.defaultUnlocked) return 'violation'
      else if (Number(ur) >= globalState.totalAccountsCreated) return 'invalidAccount'
      else return 'noViolation'
    }
  },

  invalidAccount: {
    text: ({ur}) => `You've selected an invalid account number`,
    handler({ur}) {
      if (ur === '*') return 'intro'
      else if (ur === '0' && !globalState.defaultUnlocked) return 'violation'
      else if (Number(ur) >= globalState.totalAccountsCreated) return 'invalidAccount'
      else return 'noViolation'
    }
  },

  noViolation: {
    text: ({ur}) =>`You've selected account number ${ur}, which is currently active. Is there another account I can help you with?`,
    handler({ur}) {
      if (ur === '*') return 'intro'
      else if (ur === '0' && !globalState.defaultUnlocked) return 'violation'
      else if (Number(ur) >= globalState.totalAccountsCreated) return 'invalidAccount'
      else return 'noViolation'
    }
  },

  violation: {
    text: `This account is in violation of our terms of service. To continue, please input your account's secret PIN., Then press the pound key`,
    follow: 'violationPIN'
  },

  violationPIN: {
    text: '',
    handler({ur, ctx}) {
      if (ur === '#') return 'invalidPIN'
      else return 'violationPIN'
    }
  },

  invalidPIN: {
    text: `I'm sorry, but the PIN you have entered is incorrect. If you'd like to verify your identity by answering your account's security question then press 1. To return to the main menu press 2.`,
    handler: options({
      1: 'securityQuestion',
      2: 'intro'
    })
  },

  securityQuestion: {
    text: `I can verify your identity with a valid answer to your security question. Your security question is, what color was your first car? For red press 1. For orange press 2. For brown press 3. For yellow press 4. For green press 5. For teal press 6. For blue press 7. For purple press 8. For white press 9. For black press 0. For gray press star.`,
    handler({ur}) {
      if (ur === '*') return 'correctSecurityQuestion'
      else return 'incorrectSecurityQuestion'
    }
  },

  incorrectSecurityQuestion: {
    text: `I'm sorry, but you've selected the wrong answer to your security question`,
    follow: 'securityQuestion'
  },

  correctSecurityQuestion: {
    text: `You've selected the correct answer to your security question! Your account has been suspended for violation of our terms of service. If you would like to appeal this decision press 1. If you'd like to return to the main menu press 2`,
    handler: options({
      1: 'appeal',
      2: 'intro'
    })
  },

  appeal: {
    text: `You've requested to appeal your account suspension. One moment while I submit the appeal request`,
    async follow() {
      await waitPromise(3000)
      return 'appealDenied'
    }
  },
  appealDenied: {
    text: `I'm sorry, but your account suspension appeal has been denied. Would you like to escalate your account suspension appeal? If you'd like to escalate your account suspension appeal press 1. To return to the main menu press 2.`,
    handler: options({
      1: 'escalate',
      2: 'intro'
    })
  },
  escalate: {
    text: `You've requested to escalate your account suspension appeal. One moment while I submit the escalation request`,
    async follow() {
      await waitPromise(10000)
      globalState.defaultUnlocked = true
      return 'escalateSuccess'
    }
  },
  escalateSuccess: {
    text: `Your suspension appeal escalation was successful. Account 0 has been reactivated. Is there anything else I can help you with?`
  }

}