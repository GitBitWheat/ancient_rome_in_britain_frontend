/** @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} data Data prop */
export const isColumnRequired = data => {
    if (data.column && data.column.validationRules) {
        return data.column.validationRules.some(rule => rule.type === 'required');
    } else {
        return false;
    }
};