/**
 * IPFS movies interface
 */

const log = require("logplease").create("CORE");

module.exports = async (ipcMain, helia) => {
  

  log.info("Start helia..");
  const node = await helia.createNode();
  log.info(`Running helia with peer ${node.libp2p.peerId}`);

  /**
   * Initialize events for orbit and ingesting process
   * @param {object} e ipcMain
   */
  const initEvents = (e) => {
    // // Remove listener before add new
    // orbit.removeAllListeners()
    // ingest.removeAllListeners()

    // // Orbit node listeners
    // orbit.on('node-error', (m) => e.reply('node-error', m))
    // orbit.on('node-peer', (peerSize) => e.reply('node-peer', peerSize))
    // orbit.on('node-chaos', () => {
    //   // Stop queue processor
    //   ingest.cleanInterval()
    //   ipcMain.emit('party')
    // })

    // orbit.on('node-raised', async () => {
    //   // Node raised and ready to work with it
    //   ipcMain.on('node-broadcast', (e, message) => {
    //     // On new message broadcast message
    //     orbit.pubsub.broadcast(message)
    //   })
    // })

    // Ingest process listener
    // ingest.on('ingest-step', (step) => e.reply('node-step', step))
    // ingest.on('ingest-replicated', (c, s, t) => e.reply('node-replicated', c, s, t))

    // On party success ready then logout
    ipcMain.removeAllListeners("party-success");
    ipcMain.on("party-success", () => {
      log.warn("Party success");
      e.reply("node-chaos");
    });
  };

  ipcMain.on("node-start", async (e) => {
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

  ipcMain.on("node-seed", async (e) => {
    // initEvents(e);
    log.info("Starting seed");
    // orbit.setInSeedMode(true)
    // await orbit.start()
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

  return node
};
