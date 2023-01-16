class Collection {
    /**
     * Create a new Collection instance.
     */
    constructor(items = []) {
        this.items = items;
    }

    /**
     * Get all of the items in the collection.
     */
    all() {
        return this.items;
    }

    /**
     * Alias for the avg method.
     */
    average(key) {
        return this.avg(key);
    }

    /**
     * Get all of the items in the collection.
     */
    avg(key) {
        return this.sum(key) / this.count();
    }

    /**
     * Split the collection to groups by the given size.
     */
    chunk(size) {
        let sets = [],
            chunks, i = 0,
            items = this.items;
        chunks = this.count() / size;

        while (i < chunks) {
            sets[i] = new this.constructor(items.splice(0, size));
            i++;
        }

        return new this.constructor(sets);
    }

    /**
     * Clear the collection.
     */
    clear() {
        this.items = [];

        return this;
    }

    /**
     * Clone the collection.
     */
    clone() {
        return new this.constructor(this.items);
    }

    /**
     * Concat the given values with the collection items.
     */
    concat(items) {
        return (new this.constructor(this.items.concat(items)));
    }

    /**
     * Determines if the index / value pair exists.
     */
    contains(index, value) {
        if (value && this.items.hasOwnProperty(index)) {
            return JSON.stringify(this.items[index]) === JSON.stringify(value);
        }

        for (let i in this.items) {
            if (JSON.stringify(index) === JSON.stringify(this.items[i])) return true;
        }

        return false;
    }

    /**
     * Count the number of items in the collection.
     */
    count() {
        return this.items.length;
    }

    /**
     * Search the difference between the given items and the collection items.
     */
    diff(items) {
        return new this.constructor(this.items.filter((item, index) => items.indexOf(item) < 0));
    }

    /**
     * Iterate over the collection items.
     */
    each(callback) {
        for (let i in this.items) {
            if (callback(this.items[i], i) === false) return false;
        }
    }

    /**
     * Determine if every item pass a given truth test.
     */
    every(callback) {
        return this.items.every(callback);
    }

    /**
     * Remove the given keys from the items.
     */
    except(keys) {
        keys = Array.isArray(keys) ? keys : [keys];

        return this.map(item => {
            keys.forEach(key => { if (item.hasOwnProperty(key)) delete item[key] });

            return item;
        });
    }

    /**
     * Fill the collection.
     */
    fill(items) {
        this.items = items;

        return this;
    }

    /**
     * Filter trough the collection items.
     */
    filter(callback) {
        if (!callback) return new this.constructor(this.items.filter(item => item));

        return new this.constructor(this.items.filter((item, index) => callback(item, index)));
    }

    /**
     * Get the first item from the collection.
     */
    first(callback) {
        if (!callback) return this.items[0] || null;

        return this.filter(callback).first();
    }

    /**
     * Remove items from the collection by keys.
     */
    forget(index) {
        index = Array.isArray(index) ? index : [index];

        index.forEach(index => this.items.splice(index, 1));

        return this;
    }

    /**
     * Get an item from the collection by key.
     */
    get(index, value) {
        if (typeof value === 'function') value = value();

        return this._extract(index, this.items, value)
    }

    /**
     * Determine if the collection has item by the given key.
     */
    has(index) {
        return this.items.hasOwnProperty(index);
    }

    /**
     * Implode the collection by the given glue.
     */
    implode(key, glue = null) {
        if (!glue) return this.items.join(key);

        return this.items.map(item => this._extract(key, item)).join(glue);
    }

    /**
     * Determine if the collection is empty.
     */
    isEmpty() {
        return this.count() < 1;
    }

    /**
     * Determine if the collection is not empty.
     */
    isNotEmpty() {
        return !this.isEmpty();
    }

    /**
     * Get the keys of the collection.
     */
    keys() {
        return Object.keys(this.items);
    }

    /**
     * Get the last element in the collection.
     */
    last(callback) {
        if (!callback) return this.items[this.count() - 1] || null;

        return this.filter(callback).last();
    }

    /**
     * Map trought the items.
     */
    map(callback) {
        return new this.constructor(this.items.map((item, index) => callback(item, index)));
    }

    /**
     * Get the max value by the given key.
     */
    max(key) {
        if (!key) return Math.max(...this.items);

        return this.pluck(key).max();
    }

    /**
     * Get the median value of the given key.
     */
    median(key) {
        key ? this.sortBy(key) : this.sort();

        let middle = Math.floor(this.count() / 2);
        let item = this.items[middle];

        if (this.count() % 2) {
            return key ? this._extract(key, item) : item;
        } else {
            return (key ?
                (this._extract(key, this.items[middle - 1]) + this._extract(key, item)) :
                (this.items[middle - 1] + item)
            ) / 2.0;
        }
    }

    /**
     * Merge the items to the collection.
     */
    merge(items) {
        return this.concat(items).unique();
    }

    /**
     * Get the min value by the given key.
     */
    min(key) {
        if (!key) return Math.min(...this.items);

        return this.pluck(key).min();
    }

    /**
     * Get the mode value by the given key.
     *
     * https://stackoverflow.com/questions/40410470/highest-occurrence-in-an-array-or-first-selected/40410898#40410898
     */
    mode(key) {
        let map = this.items.map(
            (a) => this.items.filter(
                (b) => key ? (this._extract(key, a) === this._extract(key, b)) : (a === b)
            ).length
        );

        return key ?
            this._extract(key, this.items[map.indexOf(Math.max.apply(null, map))]) :
            this.items[map.indexOf(Math.max.apply(null, map))];
    }

    /**
     * Get the nt-h element in the collection.
     */
    nth(n, offset = 0) {
        return this.filter((item, key) => (key + offset) % n === 0);
    }

    /**
     * Leave only the given keys in the collection items.
     */
    only(keys) {
        keys = Array.isArray(keys) ? keys : [keys];

        return this.map(item => {
            Object.keys(item).forEach(key => { if (!keys.includes(key)) delete item[key] });

            return item;
        });
    }

    /**
     * Pluck the values by the given keys.
     */
    pluck(key) {
        return this.map(item => this._extract(key, item)).filter();
    }

    /**
     * Get and remove the last item from the collection.
     */
    pop() {
        return this.items.pop();
    }

    /**
     * Push an item onto the beginning of the collection.
     */
    prepend(item) {
        this.items.unshift(item);

        return this;
    }

    /**
     * Get and remove an item from the collection.
     */
    pull(index) {
        return this.items.splice(index, 1);
    }

    /**
     * Push an item onto the end of the collection.
     */
    push(item) {
        this.items.push(item);

        return this;
    }

    /**
     * Get a random item from the collection.
     */
    random() {
        return this.items[Math.floor(Math.random() * this.count())];
    }

    /**
     * Reduce the values to a single value.
     */
    reduce(callback, initial = null) {
        return this.items.reduce((carry, item) => callback(carry, item), initial);
    }

    /**
     * Reject the items what does not pass the truth test.
     */
    reject(callback) {
        if (!callback) return new this.constructor(this.items.filter(item => item));

        return new this.constructor(this.items.filter((item, index) => !callback(item, index)));
    }

    /**
     * Reverse items order.
     */
    reverse() {
        this.items.reverse();

        return this;
    }

    /**
     * Search the collection for a given value and return the corresponding key if successful.
     */
    search(item) {
        for (let i in this.items) {
            if (typeof item === 'function') {
                if (item(this.items[i], i)) return i;
            } else if (JSON.stringify(this.items[i]) === JSON.stringify(item)) {
                return i;
            }
        }

        return false;
    }

    /**
     * Get and remove the first item from the collection.
     */
    shift() {
        return this.items.shift();
    }

    /**
     * Shuffle the collection in a random order.
     */
    shuffle() {
        let items = this.items;

        for (let i = items.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [items[i - 1], items[j]] = [items[j], items[i - 1]];
        }

        return new this.constructor(items);
    }

    /**
     * Slice the collection by the given index and size.
     */
    slice(index, size) {
        if (size) size = size + index;

        return new this.constructor(this.items.slice(index, size));
    }

    /**
     * Sort the collection.
     */
    sort(callback) {
        this.items.sort((a, b) => callback ? callback(a, b) : a - b);

        return this;
    }

    /**
     * Sort the collection in desc order.
     */
    sortDesc(callback) {
        return this.sort(callback).reverse();
    }

    /**
     * Sort the collection by the given key.
     */
    sortBy(key) {
        return this.sort((a, b) => (this._extract(key, a, 0) - this._extract(key, b, 0)));
    }

    /**
     * Sort the collection by the given key in desc order.
     */
    sortByDesc(key) {
        return this.sortBy(key).reverse();
    }

    /**
     * Splice the collection by the index and the count and add exrta items to it.
     */
    splice(index, count, items = []) {
        return new this.constructor(this.items.splice(index, count ||  this.count() - index, ...items));
    }

    /**
     * Split the collection to the given amount of groups.
     */
    split(groups) {
        let chunks = [],
            items = this.items;

        while (items.length) {
            let chunkSize = Math.ceil(items.length / groups--);
            let chunk = items.slice(0, chunkSize);

            chunks.push(chunk);
            items = items.slice(chunkSize);
        }

        return new this.constructor(chunks);
    }

    /**
     * Sum the values of the items or the callback.
     */
    sum(key) {
        if (typeof key === 'function') return this.reduce((carry, item) => key(item) + carry);

        return this.reduce((carry, item) => (key ? this._extract(key, item, 0) : item) + carry);
    }

    /**
     * Take the given amout of items from the collection.
     */
    take(limit) {
        if (limit < 0) return new this.constructor(this.items.slice(limit));

        return new this.constructor(this.items.slice(0, limit));
    }

    /**
     * Tap the collection.
     */
    tap(callback) {
        callback(this.clone());

        return this;
    }

    /**
     * Static way to create collections.
     */
    times(number, callback) {
        let items = [];

        for (let i = 1; i <= number; i++) {
            items.push(callback(i));
        }

        return this.fill(items);
    }

    /**
     * Toggle an item in the collection.
     */
    toggle(item) {
        if (this.contains(item)) {
            this.forget(this.search(item));
        } else {
            this.push(item);
        }

        return this;
    }

    /**
     * Convert the collection to JSON.
     */
    toJson() {
        return JSON.stringify(this.items);
    }

    /**
     * Transforms the collection by the given callback.
     */
    transform(callback) {
        this.items = this.items.map((item, index) => callback(item, index));

        return this;
    }

    /**
     * Filter only unique items in the collection.
     */
    unique(key) {
        let counts = [];

        let items = this.items.reduce((items, item) => {
            if (!items.contains(item)) {
                items.push(item);
                if (key) counts.push({
                    [key]: 1 });
            } else if (key) {
                counts[items.search(item)][key]++;
            }

            return items;
        }, new this.constructor);

        if (key) items.transform((item, index) => Object.assign({}, item, counts[index]));

        return items;
    }

    /**
     * Return a new collection with the items what pass the condition.
     */
    where(key, value) {
        return this.filter(item => this._extract(key, item) == value);
    }

    /**
     * Return a new collection with the items what pass the condition.
     */
    whereIn(key, values) {
        return this.filter(item => values.includes(this._extract(key, item)));
    }

    /**
     * Return a new collection with the items what do not pass the condition.
     */
    whereNotIn(key, values) {
        return this.filter(item => !values.includes(this._extract(key, item)));
    }

    /**
     * The extract helper.
     */
    _extract(key, item, value = null) {
        return key.toString().split('.').reduce((t, i) => t[i] || value, item);
    }
}

const collect = (items = []) => new Collection(items);

export { Collection as default, collect, Collection };