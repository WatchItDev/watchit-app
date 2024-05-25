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
        minWidth = 170,
        maxWidth = 210,
        aspectRatio = 1.5, // Aspect ratio of the poster (e.g., 3:2)
        containerPadding = 16,
        itemGap = 16
      } = {}
  ) => {
    // Calculate the available width inside the container
    const availableWidth = width - (2 * containerPadding);

    // Calculate the maximum number of items per row based on minWidth
    let itemsPerRow = Math.floor(availableWidth / (minWidth + itemGap));

    // Ensure at least one item per row
    itemsPerRow = Math.max(itemsPerRow, 1);

    // Calculate the width of each item based on the number of items per row
    let itemWidth = (availableWidth - (itemsPerRow - 1) * itemGap) / itemsPerRow;

    // Adjust item width to be within minWidth and maxWidth
    if (itemWidth > maxWidth) {
      itemWidth = maxWidth;
      itemsPerRow = Math.floor(availableWidth / (itemWidth + itemGap));
    } else if (itemWidth < minWidth) {
      itemWidth = minWidth;
      itemsPerRow = Math.floor(availableWidth / (itemWidth + itemGap));
    }

    // Calculate the height of each item based on the aspect ratio
    const itemHeight = itemWidth * aspectRatio;

    // Return the calculated values
    return {
      width,
      height,
      chunkSize: itemsPerRow,
      chunkHeight: itemHeight + itemGap,
      itemWidth,
      itemHeight
    };
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
