/**
 * IPFS movies interface
 */

const log = require("logplease").create("CORE");
const { concat } = require("uint8arrays/concat");
const { toString } = require("uint8arrays/to-string");
const all = require("it-all");

/**
 * The manifest entry shape.
 *
 * {
 *   video: 'bafybeidxvztbrha74yrbetf3zkc7hjkfi2mln6hht6xm5pmpcsgm2ucqgi',
 *   data: 'bafkreih3yoh652amfvj6livc5enaozpxc4xt2bed3huyrpzm5syn7itzoe'm
 *   images: {
 *    small: 'bafkreierapri53q5564hook7xknhqou3phptq2glzwk5fy3n5htlyribyu',
 *     medium: 'bafkreibfqeuhl2xmsaabkixyptoy26fppqqnrh2ytykoaclzawqumdjoqa',
 *     large: 'bafkreign3lpz4ckhma76wntti6ughu56nhullknwux6f7swzgqhqnr23je'
 *   }
 */

module.exports = async (ipcMain, { Helia }) => {
  const { node, fs } = await Helia();

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
    for await (const [key, content] of Object.entries(parsedData.manifest)) {
      // collect data stored in
      const fetchedData = await catJSON(content.data);
      const event = Object.assign(content, {
        count: parsedData.count,
        progress: ((+key + 1) / parsedData.count) * 100,
        type: "watchit/data",
        data: fetchedData,
      });

      log.info(`Processing ${+key + 1}/${event.count} ${event.progress}%`);
      e.reply("notification", event);
    }
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
