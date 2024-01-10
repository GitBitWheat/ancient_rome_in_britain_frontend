import { useState, useEffect } from "react";
import { DataSource } from "./datasource";

/**
 * Loads and reloads records from dataSource
 * @param {DataSource | Array} dataSource
 */
export const useDataSource = (dataSource) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (Array.isArray(dataSource)) {
            setRecords([...dataSource]);
        }

        else if (dataSource instanceof DataSource) {
            (async () => {
                setRecords(await dataSource.load());
            })();
            dataSource.onReload(data => {
                setRecords(data);
            });
            return () => {
                dataSource.onReload(null);
            };
        }

        else {
            console.error('Invalid data source. Needs to be either a DataSource instance or an array.');
        }
    }, [dataSource]);

    return records;
};

export default useDataSource;