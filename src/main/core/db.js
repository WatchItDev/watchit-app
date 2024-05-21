const logplease = require("logplease");
const log = logplease.create("DB", { color: logplease.Colors.Yellow });

const LinvoDB = require("linvodb3");
const engine = require(process.env.RUNTIME === "web"
  ? "level-js"
  : "leveldown");

LinvoDB.defaults.store = { db: engine };
LinvoDB.defaults.autoIndexing = false;
log.info(`Using ${engine.name}`);

class DB {
  constructor() {
    // db is a collection of databases
    this.db = {};
    this.id = null;
  }

  /**
   * Set the context database to exec subsequent operations and initialize the database with the provided name.
   * If the database exist or is initialized, then return the existing.
   *
   * @param {string} id - The database identifier
   * @returns {DB} The database interface
   */
  connect(id) {
    log.warn(`Creating local db for ${id}`);
    if (!(id in this.db)) {
      this.db[id] = new LinvoDB(id);
    }

    this.id = id
    return this;
  }

  /**
   * Add data to underlying db.
   *
   * @async
   * @param {*} collection - The data to store in db.
   * @param {string} id - The id of the db.
   * @returns {Promise<{status: string, db: object}>} A promise that resolves with an object containing the status and the database interface.
   */
  insert(collection, id) {
    return new Promise((resolve, reject) => {
      if (!((id ?? this.id) in this.db)) {
        return reject(new Error('No id in db'));
      }
      this.db[id ?? this.id].insert(collection, () => {
        console.log(`item ${collection?._id} inserted in ${(id ?? this.id)}`)
        resolve({ status: 'ready', db: this });
      }); // Save in local
    });
  }

  /**
   * Update data in the underlying db.
   *
   * @async
   * @param {object} query - The query object to find the document to update.
   * @param {object} update - The update object.
   * @param {object} options - The update options.
   * @param {string} id - The id of the db.
   * @returns {Promise<object>} A promise that resolves with the update result.
   */
  update(query, update, options = {}, id) {
    return new Promise((resolve, reject) => {
      if (!((id ?? this.id) in this.db)) {
        return reject(new Error('No id in db'));
      }
      this.db[id ?? this.id].update(query, update, options, (err, numReplaced) => {
        if (err) {
          return reject(err);
        }
        resolve({ numReplaced });
      });
    });
  }

  /**
   * Clear all database entries
   * @param {string} id - The database identifier
   * @returns {DB} The database interface
   */
  clear(id) {
    if (!((id ?? this.id) in this.db)) return;
    // clear all the content in database
    this.db[id ?? this.id].remove({}, { multi: true }, (err, numRemoved) => {
      if (err) log.error(err);
      log.info("Flushed db entries: ", numRemoved);
      // communicate the event the main thread to handle the it
      // this.ipc.send("node-flush");
    });

    return this;
  }

  /**
   * Get all data from the database.
   *
   * @returns {Promise<object[]>} A promise that resolves with all the movies.
   */
  getAllData(id) {
    return new Promise((resolve, reject) => {
      if (!((id ?? this.id) in this.db)) {
        return reject(new Error('No id in db'));
      }
      this.db[(id ?? this.id)].find({}, (err, docs) => {
        if (err) {
          return reject(err);
        }
        resolve(docs);
      });
    });
  }

  /**
   * Start a search based on regular expression in db entries
   *
   * @param {string} term - The term used to search for entries.
   * @returns {Promise<object>} A promise that will be resolved with the results.
   */
  search(term) {
    if (!(this.id in this.db)) return;
    return new Promise((resolve) => {
      // Filter by genres

      // Find data in collection
      const re = new RegExp(`${term}`, "gi");
      this.db[this.id].find({ title: { $regex: re } }).exec((e, r) => {
        resolve(r);
      });
    });
  }

  /**
   * Return filtered entries from the database.
   *
   * @param {*} filters - The filter used during filtering process
   * @returns {Promise<object>} A promise that will be resolved with the results.
   */
  filter(filters = {}) {
    if (!(this.id in this.db)) return;
    return new Promise((resolve) => {
      // Filter by genres
      const sortedDescAsc = Object.is(filters.order, "desc") ? -1 : 1;
      // const selectors = {
      //   ...("genres" in filters && { genres: { $in: [filters.genres] } }),
      // };

      // Find data in collection
      this.db[this.id]
        .find(filters.selectors)
        .sort({ [filters.sort_by]: sortedDescAsc })
        .limit(filters.limit)
        .skip(filters.skip)
        .exec((e, r) => {
          resolve(r);
        });
    });
  }

  /**
   * Get content from id.
   * @param {*} id - The content id to retrieve from db.
   * @param {string} db - The db id.
   * @returns {Promise<object>} A promise that will be resolved with the result.
   */
  get(id, db) {
    if (!((db ?? this.id) in this.db)) return;
    return new Promise((resolve) => {
      this.db[(db ?? this.id)].findOne({ _id: id }, (e, r) => {
        console.log(`get item with id ${id} from db: ${db ?? this.id}}`)
        console.log(e)
        console.log(r)
        resolve(r);
      });
    });
  }
}

// Construct broker with renderer
module.exports = function DBFactory() {
  return new DB();
};
