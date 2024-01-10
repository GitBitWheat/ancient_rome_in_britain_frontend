/** @param {ToolbarProps} _props */
export const Toolbar = _props => null;


export class PagingProps {
    constructor({ enabled, pageSize }) {
        /** @type {Boolean} */
        this.enabled = enabled;
        /** @type {Number} */
        this.pageSize = pageSize;
    }
};
/** @param {PagingProps} _props */
export const Paging = _props => null;


export class EditingProps {
    constructor({ allowUpdating=false, allowAdding=false, allowDeleting=false }) {
        /** @type {Boolean} */
        this.allowUpdating = allowUpdating;
        /** @type {Boolean} */
        this.allowAdding = allowAdding;
        /** @type {Boolean} */
        this.allowDeleting = allowDeleting;
    }
};
/** @param {EditingProps} _props */
export const Editing = _props => null;


export class ColumnProps {
    constructor({
        dataField, dataType, caption, allowSorting=true, visible=true,
        editCellComponent, required=false, width, headerFilterDataSource, allowEditing=true
    }) {
        /** @type {String} */
        this.dataField = dataField;
        /** @type {String} */
        this.dataType = dataType;
        /** @type {String} */
        this.caption = caption;
        /** @type {Boolean} */
        this.allowSorting = allowSorting;
        /** @type {Boolean} */
        this.visible = visible;
        /** @type {*} */
        this.editCellComponent = editCellComponent;
        /** @type {Boolean} */
        this.required = required;
        /** @type {Number} */
        this.width = width;
        /** @type {import('../datasource/datasource').DataSource} */
        this.headerFilterDataSource = headerFilterDataSource;
        /** @type {Boolean} */
        this.allowEditing = allowEditing;
    }
};
/** @param {ColumnProps} _props */
export const Column = _props => null;


export class RowRenderProps {
    constructor({ record, cols, editRow, deleteRow }) {
        /** @type {Object} */
        this.record = record;
        /** @type {Array<ColumnProps>} */
        this.cols = cols;
        /** @type {function(): *} */
        this.editRow = editRow;
        /** @type {function(): *} */
        this.deleteRow = deleteRow;
    }
};