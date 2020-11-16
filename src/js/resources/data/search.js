/**
 * Created by gmena on 04-19-17.
 */

export default class Search {

    constructor(indexer) {
        this.i = indexer
        this.e = this.i.e
    }

    async find(textSearch = '') {
        /**
         * Return movies
         * @param textSearch
         */
        let results = this.search(textSearch);
        return results.map((e) => this.e.documentStore.getDoc(e.ref))
    }

    search(text) {

        try {
            return this.e.search(
                text
            );
        } catch (e) {
            console.log(e);
        }
    }


    async loadCollection() {
        // Loop over data
        await this.i.initFile(); // Check file exists
        await this.i.loadCollection();
    }

    clearIndex() {
        this.e = null;
    }
}
