import axios from "axios";

const removeTrailingSlash = str => {
    if (str.length === 0) {
        return str;
    }
    if (str.slice(-1) === '/') {
        return str.slice(0, -1);
    } else {
        return str;
    }
};

export class RemoteStore {
    constructor({ serviceURL, data2records, token=null, field2field=[], keyField='_id' }) {
        this.key = keyField;
        this.load =  this.load.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);

        this.data = [];
        this.serviceURL = removeTrailingSlash(serviceURL);
        this.data2records = data2records;
        this.token = token;
        this.field2field = field2field;

        this.jsonConfig = token ? {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            timeout: 60 * 1000 // 60 seconds
        } : {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000 // 60 seconds
        };

        this.authorizedNoBodyConfig = token ? {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            timeout: 60 * 1000 // 60 seconds
        } : {
            timeout: 60 * 1000 // 60 seconds
        };
    }

    async load() {
        return axios.get(this.serviceURL)
        .then((response) => {
            const data = this.data2records(response.data).map(record => {
                for (const [backendField, frontendField] of this.field2field) {
                    record[frontendField] = record[backendField];
                }
                return record;
            });
            this.data = data;
            return data;
        });
    }

    async insert(values) {
        for (const [backendField, frontendField] of this.field2field) {
            values[backendField] = values[frontendField];
        }
        return axios.post(this.serviceURL, JSON.stringify(values), this.jsonConfig)
        .then((response) => {
            this.data = this.data.concat(values);
            return response.data;
        });
    }

    async update(key, newValues) {
        const oldValues = this.data.find(record => record[this.key] === key)
        if (!(!!oldValues)) {
            console.error('During an update operation, could not find already existing record');
            return;
        }
        const values = { ...oldValues, ...newValues };
        for (const [backendField, frontendField] of this.field2field) {
            values[backendField] = values[frontendField];
        }
        return axios.put(`${this.serviceURL}/${key}`, JSON.stringify(values), this.jsonConfig)
        .then((response) => {
            this.data = this.data.concat(values);
            return response.data;
        });
    }

    async remove(key) {
        return axios.delete(`${this.serviceURL}/${key}`, this.authorizedNoBodyConfig)
        .then((response) => {
            this.data = this.data.filter(record => record[this.key] !== key);
            return response.data;
        });
    }
};