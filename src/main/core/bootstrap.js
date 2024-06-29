import { concat } from 'uint8arrays/concat'
import { toString } from 'uint8arrays/to-string'
import all from 'it-all'
import log from '@/main/logger'

/**
 * Exports a function that initializes the IPFS movies interface.
 *
 * @param {Electron.IpcMain} ipcMain - The IPC main interface
 * @param {Object} options - The options object
 * @param {Function} options.Helia - The Helia function
 * @param {Object} options.runtime - The runtime object
 * @returns {Promise<Object>} A promise that resolves with the IPFS node
 */
export default async (ipcMain, { Helia, runtime = 'node' }) => {
  const { node, fs } = await Helia(runtime)

  /**
   * Collect data from IPFS using `cat` and deserialize it to JSON object.
   *
   * @param {string} cid - The CID for the content to fetch
   * @returns {Promise<Object>} A promise that resolves with the fetched JSON object
   */
  async function catJSON(cid) {
    const bufferedData = concat(await all(fs.cat(cid)))
    const jsonString = toString(bufferedData)
    return JSON.parse(jsonString)
  }

  ipcMain.on('node-start', async (e, key) => {
    log.info(`Processing ${key}`)
    const parsedData = await catJSON(key)
    if (!parsedData.manifest) {
      throw new Error('Fetched content with invalid manifest.')
    }

    log.info(`Collecting ${parsedData.count} entries`)
    for await (const [key, content] of Object.entries(parsedData.manifest)) {
      // collect data stored in
      const fetchedData = await catJSON(content.data)
      const event = Object.assign(content, {
        meta: fetchedData,
        type: 'watchit/data',
        count: parsedData.count,
        progress: ((+key + 1) / parsedData.count) * 100,
        end: (+key + 1) === parsedData.count
      })

      log.info(`Processing ${+key + 1}/${event.count} ${event.progress}%`)
      e.reply('notification', event)
    }
  })

  ipcMain.on('online-status-changed', async (e, isOnline) => {
    log.info('Going ' + (isOnline ? 'online' : 'offline'))
  })

  return node
}