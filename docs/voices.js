import {globalState} from './global.js'
import {queryParams} from './$.js'

window.speechSynthesis?.cancel?.()


let syncVoices = []

export const voices = new Promise((res, rej) => {
  setTimeout(() => {
    let i = 0
    const getVoices = () => {
      i++
      try {
        if (i >= 50) return res([])
        const voices = window.speechSynthesis.getVoices()
        setTimeout(() => {
          if (!voices.length) getVoices()
          else {
            syncVoices = voices
            res(voices)
          }
        }, 200)
      } catch(e) {
        rej(e)
      }
    }
    getVoices()
  })
})


export function say(voice, txt) {
  if (globalState.soundMuted) return

    let v

  try {
    v = queryParams.voice
      ? syncVoices.find(v => v.voiceURI.toLowerCase().includes(queryParams.voice.toLowerCase())) || voice
      : voice
  } catch (e) {
    v = voice
  }



  const utterance = new window.SpeechSynthesisUtterance(txt)
  utterance.volume = 0.7
  utterance.voice = v
  window.speechSynthesis.speak(utterance)
}