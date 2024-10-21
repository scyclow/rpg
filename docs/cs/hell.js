const standardOptions = x => ({
  0: 'representative',
  1: 'gatesOfHell',
  2: 'heavensGate',
  3: 'continueExploring',
  4: 'walkTowardsAbyss',
  '*': 'repeatOptions'
})[x.ur]

export const hellNodes = {
    start: {
      handler: 'intro'
    },

    intro: {
      text: `You arrive at the Gates of Hell, unsure of how you got here. Fire rains down beyond the entrance but you feel no danger from where you stand. Unbounded suffering waits ahead of you, but behind you lies Heaven's Gate, across which is the tantalizing promise of boundless pleasure and never ending bliss. The tepid air around you hangs still as if time has frozen. You are surrounded by neither lightness nor darkness, but rather a thick twilight. Lost souls move about but no one seems to make any progress. Press 1 to approach the Gates of Hell. Press 2 to approach Heaven's Gate. Press 3 to continue exploring the space you inhabit. Press 0 to speak with a representative. Press star to repeat your options.`,
      handler: standardOptions,
      wait: 1000,
    },

    repeatOptions: {
      text: x => `Press 1 to approach the Gates of Hell. Press 2 to approach Heaven's Gate. Press 3 to continue exploring the space you inhabit. ${x.ctx.state.abyss ? 'Press 4 to walk towards the abyss.' : ''} Press 0 to speak with a representative. Press star to repeat your options.`,
      handler: standardOptions,
      wait: 1000,
    },

    gatesOfHell: {
      text: `As you near the threshold of the Gates of Hell you become seized by a visceral fear. It prevents you from pushing any further`,
      handler: standardOptions,
      follow: 'repeatOptions'
    },

    continueExploring: {
      text: `You continue exploring this unfamiliar space. Barren ground. The faint smell of rotting flesh. Oppressive humidity. You feel simultaneously claustrophobic and exposed. As you stare into the abyss an abstract terror slowly builds inside you growing from imperceptible to un ignorable. You have to find a way out of this place. `,
      after: x => x.ctx.state.abyss = true,
      handler: standardOptions,
      follow: 'repeatOptions'
    },

    representative: {
      text: `The current wait time to speak with a representative is, four thousand eight hundred ninety-seven years, eleven months, thirteen days, nine hours, forty three minutes, and twelve seconds. Please stay on the line`,
      handler: 'repeatOptions',
    },

    walkTowardsAbyss: {
      text: `You walk further into the abyss, but you don't seem to cover much distance. Press 1 to continue wandering into the abyss. Press 2 to return`,
      handler: options({
        1: 'walkTowardsAbyss',
        2: 'repeatOptions'
      })
    },

    heavensGate: {
      text: `You walk up to Heaven's Gate and attempt to open it. It is locked. You notice a keypad on your right. Please enter the unlock code to enter the Kingdom of Heaven, followed by the pound key`,
      handler: x => {
        if (x.ur === '#') return 'incorrectCode'
        x.ctx.state.heavenCode = [x.ur]
        return 'enterCode'
      }
    },

    incorrectCode: {
      text: 'The code you have entered is incorrect.',
      follow: 'repeatOptions'
    },

    enterCode: {
      text: '',
      handler: x => {
        if (x.ur === '#') return 'incorrectCode'
        x.ctx.state.heavenCode.push(x.ur)
        return 'enterCode'
      }
    }
  }
