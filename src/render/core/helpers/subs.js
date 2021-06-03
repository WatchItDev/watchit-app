import utilHelper from './util'
import setting from 'settings'

const subs = window.bridge.Subs

export default {
  * interCues (video) {
    for (const track of video.textTracks) {
      if (track.label === this.currentLang) {
        for (const cue of track.cues) { yield cue }
        break
      }
    }
  },

  addOffset (offset) {
    if (!this.currentSub || !this.v) return
    subs.reSync(this.srtSub, offset * 1000).then(() => {
      for (const cue of this.interCues(this.v.video)) {
        cue.startTime += offset || 0.5
        cue.endTime += offset || 0.5
      }
    })
  },

  removeOffset (offset) {
    if (!this.currentSub || !this.v) return
    subs.reSync(this.srtSub, (offset * -1) * 1000).then(() => {
      for (const cue of this.interCues(this.v.video)) {
        cue.startTime -= offset || 0.5
        cue.endTime -= offset || 0.5
      }
    })
  },
  preSubs (subs, collection = {}) {
    Object.values(subs).forEach((el) => {
      Object.keys(el).reduce((o, i) => {
        const sIndex = utilHelper.sanitizeSubIndex(i)
        if (sIndex in o) o[sIndex] = [...o[sIndex], ...el[i]]
        if (!(sIndex in o)) o[sIndex] = el[i]
        return o
      }, collection)
    })
  },

  subs (res) {
    const subs = {}
    const s = res?.subtitles
    if (!s) return subs
    this.preSubs(s, subs)

    // Filter and get better sub rate
    return Object.keys(subs).filter(
      (k) => setting.subs.available.includes(k)
    ).reduce((obj, key) => {
      obj[key] = this.getBetterSub(subs[key])
      return obj
    }, {})
  },

  getBetterSub (subtitles) {
    // Get better sub
    return subtitles.sort((a, b) => {
      a = parseFloat(a.score || a.rating)
      b = parseFloat(b.score || b.rating)
      return a - b
    }).slice(-1)[0]
  }
}
