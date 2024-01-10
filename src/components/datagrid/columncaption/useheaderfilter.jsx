import { useState } from "react";
import useDataSource from "../../datasource/usedatasource";

/**
 * @param {import('../configs').ColumnProps} col 
 * @param {import('../../datasource/datasource').DataSource} gridDataSource 
 */
export const useHeaderFilter = (col, gridDataSource) => {
    const [checked, setChecked] = useState(new Set());
    const [lastExprId, setLastExprId] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);

    const headerFilters = useDataSource(col.headerFilterDataSource || []);

    const updateFilters = newChecked => {
        if (newChecked.size > 0) {
            let filterExpr = [];

            if (newChecked.size === 1) {
                newChecked.forEach(idx => { filterExpr = headerFilters[idx].value; });
            } else {
                for (const idx of newChecked) {
                    filterExpr = filterExpr.concat([headerFilters[idx].value, 'or']);
                }
                // Removing trailing 'or'
                filterExpr.pop();
            }

            if (lastExprId || lastExprId === 0) {
                gridDataSource.removeFilterExpr(lastExprId);
            }
            const exprId = gridDataSource.addFilterExpr(filterExpr);
            setLastExprId(exprId);

            setIsFiltered(true);
        } else {
            if (lastExprId || lastExprId === 0) {
                gridDataSource.removeFilterExpr(lastExprId);
                setLastExprId(null);
            }
            setIsFiltered(false);
        }
    };

    // The index in the headerFilters
    const addChecked = (checkIdx) => {
        const newChecked = new Set(checked);
        newChecked.add(checkIdx);
        setChecked(newChecked);
        updateFilters(newChecked);
    };

    const deleteChecked = (checkIdx) => {
        const newChecked = new Set(checked);
        newChecked.delete(checkIdx);
        setChecked(newChecked);
        updateFilters(newChecked);
    };

    return { checked, addChecked, deleteChecked, isFiltered };
};

export default useHeaderFilter;