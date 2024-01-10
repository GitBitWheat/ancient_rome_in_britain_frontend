import { generateCompare } from "./generatecompare";
import { applyFilterExprs } from "./applyfilterexprs";

export class PagingConfig {
    constructor({ enabled=false, pagingIndex=null, pageSize=null }) {
        this.enabled = enabled;
        this.pagingIndex = pagingIndex;
        this.pageSize = pageSize;
    }
}

export class DataSource {
    constructor({ store, filter, map, sortBy }) {
        this.store = store;
        // Optional filter expression
        this.filter = filter;
        // Optional map function for the loaded data
        this.map = map;

        this.paging = new PagingConfig({ enabled: false });
        // When paging is enabled and only the paging index is changed,
        // there is no need to reload the data from the store again.
        // This property stores all of the unpaged data for use in the load method.
        this.unpagedData = null;

        this.reloadingHandler = null;

        this.sortBy = sortBy || null;
        this.sortAscending = true;
        this.setSortHandlers = [];

        this.filterExprs = new Map();
        this.filterExprCntr = -1;
        if (filter) {
            this.filterExprCntr++;
            this.filterExprs.set(this.filterExprCntr, filter);
        }

        this.setPaging = this.setPaging.bind(this);
        this.setPagingIndex = this.setPagingIndex.bind(this);
        this.getNumPages = this.getNumPages.bind(this);
        this.load = this.load.bind(this);
        this.reload = this.reload.bind(this);
        this.onReload = this.onReload.bind(this);
        this.setSort = this.setSort.bind(this);
        this.addSetSortEventHandler = this.addSetSortEventHandler.bind(this);
        this.removeSetSortEventHandler = this.removeSetSortEventHandler.bind(this);
        this.addFilterExpr = this.addFilterExpr.bind(this);
        this.removeFilterExpr = this.removeFilterExpr.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    /**
     * Loading data from the store and handling sorting, filtering, paging and mapping data
     * @returns The loaded data
     */
    async load() {
        /** @type {Array} */
        let data = [];

        data = await this.store.load();

        // Sorting
        if (this.sortBy) {
            data.sort(generateCompare(this.sortBy, this.sortAscending));
        }

        // Filtering
        data = applyFilterExprs(data, this.filterExprs);

        // Custom mapping
        if (this.map) {
            data = data.map(record => this.map(record));
        }

        // Paging
        if (this.paging.enabled) {
            // Save unpaged data for potential use in reload as "customData"
            this.unpagedData = data;
            data = this.#sliceData(data);
        }

        return data;
    }

    // Handling reloading

    /**
     * Activating the reloading handler.
     * Reload can get the data as a prop instead of loading it again from the store. Useful for paging.
     * @param {Array} customData Optional: Data to be used instead of loading from the store.
     * Used for saved unpaged data which has already been loaded from the store.
     * @returns The reloaded data
     */
    async reload(customData) {
        const data = customData ? customData : await this.load();
        if (this.reloadingHandler) {
            this.reloadingHandler(data);
        }
        return data;
    }

    /**
     * Setting a reloading handler
     * Note the handler is only activated after loading has been completed
     * and unpaged data has been saved
     * @param {function(Array): *} handler Gets reloaded data and performs an action on it
     */
    onReload(handler) {
        this.reloadingHandler = handler;
    }

    // Core store actions

    /**
     * Inserts a record to the store and reloads the data accordingly
     * @param {Object} values Inserted record
     */
    async insert(values) {
        const returnVal = await this.store.insert(values);
        this.reload();
        return returnVal;
    }

    /**
     * Updates an existing record in the store and reloads the data accordingly
     * @param {Number} key Updated record id
     * @param {Object} values New record values
     */
    async update(key, newValues) {
        const returnVal = await this.store.update(key, newValues);
        this.reload();
        return returnVal;
    }

    /**
     * Removes an existing record in the store and reloads the data accordingly
     * @param {Number} key Removed record id
     */
    async remove(key) {
        const returnVal = await this.store.remove(key);
        this.reload();
        return returnVal;
    }

    // Handling paging

    /** Setting a paging configuration
     *  @param {PagingConfig} paging New configuration
     **/
    setPaging(paging) {
        if (paging.enabled &&
            (!(!!paging.pageSize) || (paging.pagingIndex !== 0 && !(!!paging.pagingIndex)))) {
            console.error('Invalid paging configuration');
        } else {
            this.paging = paging;

            if (!paging.enabled) {
                this.unpagedData = null;
            }
        }
    }

    /**
     * Changing the paging index and reloading with saved unpaged data (if possible)
     * @param {Number} pagingIndex 
     */
    setPagingIndex(pagingIndex) {
        if (this.paging.enabled) {
            this.setPaging({ ...this.paging, pagingIndex });
            if (this.unpagedData !== null) {
                this.reload(this.#sliceData(this.unpagedData));
            } else {
                this.reload();
            }
        } else {
            console.error('Tried to set paging index when paging is not enabled');
        }
    }

    /**
     * Calculates number of pages if the paging is enabled and unpaged data has been loaded
     * @returns Number of pages
     */
    getNumPages() {
        return !this.paging.enabled || this.unpagedData === null ?
            null : Math.ceil(this.unpagedData.length / this.paging.pageSize);
    }

    /**
     * Slicing the data by the paging configuration
     * @param {Array} data Unpaged data
     * @returns Data page
     */
    #sliceData(data) {
        const startIndex = this.paging.pagingIndex * this.paging.pageSize;
        const endIndex = startIndex + this.paging.pageSize;
        return data.slice(startIndex, endIndex);
    }

    // Handling filtering

    /**
     * Adds a filter expression and reloads the data accordingly
     * @param {Array} filterExpr 
     * @returns Id of the new filter expression
     */
    addFilterExpr(filterExpr) {
        this.filterExprCntr++;
        this.filterExprs.set(this.filterExprCntr, filterExpr);
        this.reload();
        return this.filterExprCntr;
    }

    /**
     * Removes a filter expression and reloads the data accordingly
     * @param {Number} filterExprId Id of the removed filter expression
     */
    removeFilterExpr(filterExprId) {
        this.filterExprs.delete(filterExprId);
        this.reload();
    }

    // Handling sorting

    /**
     * Adds a sorting configuration and reloads the data accordingly.
     * Activates the sorting event handlers.
     * @param {String} sortBy Property by which the records are sorted
     * @param {Boolean} sortAscending Is the sort order ascending or descending
     */
    setSort(sortBy, sortAscending) {
        this.sortBy = sortBy;
        this.sortAscending = sortAscending;
        for (const handler of this.setSortHandlers) {
            handler(sortBy, sortAscending);
        }
        this.reload();
    }

    /**
     * Adds a handler for the event where a new sorting configuration is set
     * @param {function(String, Boolean): *} handler
     */
    addSetSortEventHandler(handler) {
        this.setSortHandlers = this.setSortHandlers.concat(handler);
    }

    /**
     * Removes an existing sort event handler
     * @param {function(String, Boolean): *} removedHandler The sort event handler to be removed
     */
    removeSetSortEventHandler(removedHandler) {
        this.setSortHandlers = this.setSortHandlers.filter(handler => handler === removedHandler);
    }
};