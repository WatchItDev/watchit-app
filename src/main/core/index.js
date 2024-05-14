/**
 * IPFS movies interface
 */

const log = require("logplease").create("CORE");
const { concat } = require("uint8arrays/concat");
const { toString } = require("uint8arrays/to-string");
const all = require("it-all");

module.exports = async (ipcMain, { Helia }) => {
  log.info("Start helia..");
  const helia = await Helia();
  log.info(`Running helia with peer ${helia.node.libp2p.peerId}`);

  async function catJSON(key) {
    const bufferedData = concat(await all(helia.fs.cat(key)));
    const jsonString = toString(bufferedData);
    return JSON.parse(jsonString);
  }

  ipcMain.on("node-start", async (e, key) => {
    console.log("starting");
    const parsedData = await catJSON(key);
    log.info(`Collecting ${parsedData.count}`);

    for (const content of parsedData.manifest) {
      log.info(content.data);
      const data = await catJSON(content.data);
      e.reply("notification", data);
    }

    // initEvents(e); // Init listener on node ready

    // Node events to handle progress and ready state
    // "node-step" handle event to keep tracking states of node
    // orbit.on('node-progress', (_, hash) => setTimeout(() => { ingest.queue = hash }), 0)
    //   .on('node-step', (step) => e.reply('node-step', step))
    //   .on('node-loaded', () => e.reply('node-loaded'))
    //   .on('node-ready', () => {
    //     // FIFO queue processing
    //     ingest.queueProcessor()
    //     e.reply('node-ready')
    //   })
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

  return helia.node;
};
