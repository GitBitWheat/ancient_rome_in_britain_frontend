export class LocalStore {
    constructor({ data, keyField='_id' }) {
        this.key = keyField;
        this.load =  this.load.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);

        this.data = data || [];

        this.idCntr = this.data.length-1;
    }

    async load() {
        return [...this.data];
    }

    async insert(values) {
        this.idCntr++;
        this.data = this.data.concat({...values, "_id": this.idCntr});
        return null;
    }

    async update(key, newValues) {
        const oldValues = this.data.find(record => record[this.key] === key)
        if (!(!!oldValues)) {
            console.error('During an update operation, could not find already existing record');
            return;
        }
        const values = { ...oldValues, ...newValues };
        this.data = this.data.map(record => record[this.key] === key ? values : record);
        return null;
    }

    async remove(key) {
        this.data = this.data.filter(record => record[this.key] !== key);
        return null;
    }
};