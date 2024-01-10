export class EditCellProps {
    constructor({ record, value, setValue, required, dataField }) {
        /** @type {Object} */
        this.record = record;
        this.value = value;
        /** @type {function(*): void} */
        this.setValue = setValue;
        /** @type {Boolean} */
        this.required = required;
        /** @type {String} */
        this.dataField = dataField;
    }
};