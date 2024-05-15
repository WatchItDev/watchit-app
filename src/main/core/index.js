/**
 * IPFS movies interface
 */

const log = require("logplease").create("CORE");
const { concat } = require("uint8arrays/concat");
const { toString } = require("uint8arrays/to-string");
const all = require("it-all");

module.exports = async (ipcMain, { Helia }) => {
  const { node, fs } = await Helia();
  log.info(`Running helia with peer ${node.libp2p.peerId}`);

  /**
   * Collect data from ipfs using `cat` and deserialize it to json object
   * @param {*} cid - The cid for the content to fetch
   * @returns {Promise<object>} A promise that resolves with the fetched json object
   */
  async function catJSON(cid) {
    const bufferedData = concat(await all(fs.cat(cid)));
    const jsonString = toString(bufferedData);
    return JSON.parse(jsonString);
  }

  ipcMain.on("node-start", async (e, key) => {
    const parsedData = await catJSON(key);
    if (!parsedData.manifest) {
      throw new Error("Fetched content with invalid manifest.");
    }
    
    log.info(`Collecting ${parsedData.count} entries`);
    const event = await Promise.all(parsedData.manifest.map(async (content) => ({
      ...(await catJSON(content.data)),
      ...{ type: "watchit/data" },
    })));


    log.info(event)

    // notify to renderer process
    e.reply("notification", event);
  });

  ipcMain.on("online-status-changed", async (e, isOnline) => {
    log.info("Going " + (isOnline ? "online" : "offline"));
    // if (!isOnline) await orbit.close()
    // if (isOnline) await orbit.start()
  });

  ipcMain.on("node-close", async () => {
    log.warn("Closing orbit");
    // await orbit.close()
  });

  ipcMain.on("node-flush", async () => {
    log.warn("Flushing orbit");
    // ingest.cleanInterval()
  });

  return node;
};
