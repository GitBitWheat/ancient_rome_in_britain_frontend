import { useState, useEffect, useCallback } from "react";

/**
 * @param {import('../configs').ColumnProps} col
 * @param {import('../../datasource/datasource').DataSource} dataSource 
 */
export const useSortByCol = (col, dataSource) => {
    const [isSort, setIsSort] = useState(false);
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        const setSortEventHandler = (sortBy, sortAscParam) => {
            setIsSort(col.dataField === sortBy);
            setSortAsc(sortAscParam);
        };
        dataSource.addSetSortEventHandler(setSortEventHandler);
        return () => {
            dataSource.removeSetSortEventHandler(setSortEventHandler);
        }
    }, [dataSource, col.dataField]);

    const sortByColumn = useCallback(() => {
        if (col.allowSorting) {
            const currSortAsc = isSort ? sortAsc : false;
            setSortAsc(!currSortAsc);
            dataSource.setSort(col.dataField, !currSortAsc);
        }
    }, [col.allowSorting, col.dataField, isSort, sortAsc, dataSource]);

    return { isSort, sortAsc, sortByColumn };
};

export default useSortByCol;