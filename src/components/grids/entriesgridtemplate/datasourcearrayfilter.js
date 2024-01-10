export const dataSourceArrayFilter = (dataField, filters) => {
    if (filters.length) {
        let filterExpr = [];
        for (const filter of filters) {
            filterExpr.push([dataField, 'contains', filter])
            filterExpr.push('or')
        }
        filterExpr.pop();

        if (filterExpr.length === 1) {
            filterExpr = filterExpr[0];
        }

        return filterExpr;
    } else {
        return null;
    }
};