/**
 * Created by gmena on 04-20-17.
 */

export default ({
  getMemoryLogWebFrame (webFrame) {
    // `console.log` omitted  (pads + limits to 15 characters for the output)
    const logMemDetails = (x) => {
      const toMb = (bytes) => (bytes / (1000.0 * 1000)).toFixed(2)
      console.log('object', x[0])
      console.log('count', x[1].count)
      console.log('size', toMb(x[1].size) + 'MB')
      console.log('liveSize', toMb(x[1].liveSize) + 'MB')
    }

    Object.entries(webFrame.getResourceUsage()).map(logMemDetails)
    console.log('------')
  },

  calcHealth: ({ peers, seeds }) => {
    const ratio = peers > 0 ? (seeds / peers) : seeds
    const normalizedRatio = Math.min(ratio / 5 * 100, 100)
    const normalizedSeeds = Math.min(seeds / 30 * 100, 100)
    const weightedRatio = normalizedRatio * 0.6
    const weightedSeeds = normalizedSeeds * 0.4
    const weightedTotal = weightedRatio + weightedSeeds
    return ((weightedTotal * 3) / 100) | 0
  },

  /**
     * Calculate screen size and pics using screen dim
     * @type {HTMLElement}
  */
  calcScreenSize: (
    {
      width = window.screen.width,
      height = window.screen.height,
      imageSize = 200, mp = 20
    } = {}
  ) => {
  
    // Avoid full fill row with small images
    imageSize = width > 1800 ? Math.floor(width / 10) : imageSize
    // chunkSize = how many movies reach in each row
    const chunkSize = Math.ceil(width / imageSize)
    // Formula to get the height of rows based on chunkSizes
    const chunkHeight = ((width - (chunkSize * mp)) / chunkSize) * 1.66
    return { width, height, chunkSize, chunkHeight }
  },

  sanitizeSubIndex: (k) => {
    return k.split(' ')[0].trim()
  },

  /**
     * Check for invalid string
     * @param {string} string
     * @return {boolean} invalid or valid string
  */
  invalidString: (string) => {
    return (typeof string !== 'string' ||
            !string || /^\s*$/.test(string) ||
            string.length === 0)
  },

  reduceByIndex: (xs, key) => {
    return xs.reduce((o, n) => {
      o.push(n[key])
      return o
    }, [])
  },

  groupBy: (xs, key, init = {}) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, init)
  },

  isMobile: () => {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)))
  }
})
