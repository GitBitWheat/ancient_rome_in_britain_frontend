import { useState, useEffect } from "react";

export const useColumnWidths = (headerRef, cols) => {
    const [columnWidths, setColumnWidths] = useState(cols.map(col => col.width || null));

    useEffect(() => {
        const noCustomWidthCnt = columnWidths.filter(width => !(!!width)).length;

        if (noCustomWidthCnt > 0 && headerRef && headerRef.current) {
            /** @type {HTMLTableRowElement} */
            const headerTr = headerRef.current;
            
            const sumCustomWidths = columnWidths
                .filter(width => width)
                .reduce((prev, curr) => prev + curr, 0);

            const difference = headerTr.clientWidth - sumCustomWidths;

            const columnDefaultWidth = difference / noCustomWidthCnt;
            setColumnWidths(columnWidths.map(width => width || columnDefaultWidth));
        }
    }, [headerRef, columnWidths]);

    return columnWidths;
};

export default useColumnWidths;