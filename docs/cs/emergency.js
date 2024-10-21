import {createSource, MAX_VOLUME} from '../audio.js'

export const emergencyNodes = {
  start: {
    handler: 'intro'
  },

  intro: {
    text: `Hello, you have reached the Turbo Connect emergency hotline. All of our mobile and data plan emergency dispatchers are currenctly busy. Please stay on the line.`,
    follow: 'shortly'
  },

  shortly: {
    text: `An emergency dispatcher will be with you shortly to help you resolve`,
    follow: ({ctx}) => {
      const note = 440 * sample([1, 1.125, 1.2, 1.33333, 1.5, 1.6, 1.75])
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
    handler: 'shortly',
  },
}