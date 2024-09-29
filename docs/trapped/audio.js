export const MAX_VOLUME = 0.04

export const allSources = []
export function createSource(waveType = 'square', startingFreq=3000) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioContext()

  const source = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = new StereoPannerNode(ctx)

  source.connect(gain)
  gain.connect(panner)
  panner.connect(ctx.destination)

  gain.gain.value = 0
  source.type = waveType
  source.frequency.value = startingFreq
  source.start()

  const smoothFreq = (value, timeInSeconds=0.001) => {
    source.frequency.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  const smoothPanner = (value, timeInSeconds=0.001) => {
    panner.pan.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  const smoothGain = (value, timeInSeconds=0.001) => {
    gain.gain.setTargetAtTime(
      Math.min(value, MAX_VOLUME),
      ctx.currentTime,
      timeInSeconds
    )
  }

  const stop = () => {
    source.stop()

  }

  const src = { source, gain, panner,smoothFreq, smoothGain, smoothPanner, originalSrcType: source.type, stop }

  allSources.push(src)

  return src
}


window.allSources = allSources


// EXPERIMENTAL


export class SoundSrc {
  constructor(waveType='sine', startingFreq=440) {
    Object.assign(this, createSource(waveType, startingFreq))
  }

  max() {
    this.smoothGain(MAX_VOLUME)
  }

  silent() {
    this.smoothGain(0)
  }

  async note(freq, ms) {
    this.smoothGain(MAX_VOLUME)
    this.smoothFreq(freq)
    await waitPromise(ms)
    this.smoothGain(0)
  }
}