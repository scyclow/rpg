window.speechSynthesis.cancel()
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
          else res(voices)
        }, 200)
      } catch(e) {
        rej(e)
      }
    }
    getVoices()
  })
})


export function say(voice, txt) {
  const utterance = new window.SpeechSynthesisUtterance(txt)
  utterance.volume = 0.88
  utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}