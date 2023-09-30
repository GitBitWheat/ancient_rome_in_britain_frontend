export const dataSourceArrayFilter = (dataField, filters) => {
    if (filters.length) {
        const filterExpr = [];
        for (const filter of filters) {
            filterExpr.push([dataField, 'contains', filter])
            filterExpr.push('or')
        }
        filterExpr.pop();
        return filterExpr;
    } else {
        return null;
    }
};