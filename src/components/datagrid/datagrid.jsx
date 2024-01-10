import { Fragment, useState, useEffect, useRef } from "react";
import { Children } from "react";
import { Button, Table } from "react-bootstrap";
import {
    Toolbar, Paging, PagingProps, Editing, EditingProps, Column, ColumnProps
} from "./configs";
import ColumnCaption from "./columncaption/columncaption";
import EditingForm from "./editingform/editingform";
import DeleteModal, { defaultDeleteRecord } from "./deletemodal";
import useColumnWidths from "./usecolumnwidths";
import { defaultRowRender } from "./defaultrowrender";
import './datagrid.css';
import { PagingConfig } from "../datasource/datasource";
import PagingBar from "./pagingbar";

/**
 * @param {Object} props
 * @param {import('../datasource/datasource').DataSource} props.dataSource
 * @param {String} props.keyField
 * @param {String} props.defaultSortBy
 * @param {function(import('./configs').RowRenderProps): React.Component} props.dataRowRender
 */
export const DataGrid = ({ children, dataSource, keyField, defaultSortBy : defaultSortByProp,
    dataRowRender=defaultRowRender }) => {
    // Get all the children
    let toolbarItems = null;
    let paging = null;
    let editing = new EditingProps({});
    let cols = [];

    for (const child of Children.toArray(children)) {
        switch (child.type) {
            case Toolbar:
                toolbarItems = child.props.children;
                break;
            case Paging:
                paging = new PagingProps(child.props);
                break;
            case Editing:
                editing = new EditingProps(child.props);
                break;
            case Column:
                cols = cols.concat(new ColumnProps(child.props));
                break;
            default:
                break;
        }
    }

    // Handle paging
    if (paging && paging.enabled) {
        dataSource.setPaging(new PagingConfig({
            enabled: paging.enabled,
            pagingIndex: 0,
            pageSize: paging.pageSize
        }));
    } 

    const setPagingIndex = idx => {
        dataSource.setPagingIndex(idx);
    };
    const [numPages, setNumPages] = useState(null);

    // Handle default sorting
    useEffect(() => {
        if (defaultSortByProp) {
            dataSource.setSort(defaultSortByProp, true);
        }
    }, [defaultSortByProp, dataSource]);

    // Load records from dataSource
    const [records, setRecords] = useState([]);
    useEffect(() => {
        (async () => {
            setRecords(await dataSource.load());
            setNumPages(dataSource.getNumPages());
        })();

        dataSource.onReload(data => {
            setRecords(data);
            setNumPages(dataSource.getNumPages());
        });
        return () => {
            dataSource.onReload(null);
        };
    }, [dataSource]);

    // The amount of visible columns in the rendered table
    const visibleColsCnt = cols.length;

    // Calculating column widths
    const headerRef = useRef(null);
    const visibleCols = cols.filter(col => col.visible);
    const columnWidths = useColumnWidths(headerRef, visibleCols);

    // Activate and close editing form
    const [editingForm, setEditingForm] = useState({
        show: false, type: 'adding', record: null
    });
    const openAdding = () => {
        setEditingForm({
            show: true, type: 'adding', record: null
        });
    };
    const openUpdating = record => {
        setEditingForm({
            show: true, type: 'updating', record
        });
    };
    const closeEditingForm = () => {
        setEditingForm({
            show: false, type: 'adding', record: null
        });
    };

    // Activate and close delete modal
    const [deleteModal, setDeleteModal] = useState({
        show: false, deleteRecord: defaultDeleteRecord
    });
    const openDeleteModal = record => {
        const deleteRecord = editing.allowDeleting ?
            () => {dataSource.remove(record[keyField]);} :
            () => {console.error('Deleting not allowed');};
        setDeleteModal({
            show: true, deleteRecord: deleteRecord
        });
    };
    const closeDeleteModal = () => {
        setDeleteModal({
            show: false, deleteRecord: defaultDeleteRecord
        });
    };

    const generateRecordEditingFunc = record => editing.allowUpdating ? () => {openUpdating(record);} : null;
    const generateRecordDeletingFunc = record => editing.allowDeleting ?
        () => {openDeleteModal(record);} : null;

    const amountOfTds = visibleColsCnt + ((editing.allowUpdating || editing.allowDeleting) ? 1 : 0);

    return <div className="datagrid-container">
        <div className="datagrid-toolbar">
            {editing.allowAdding && (
                <Button
                    onClick={openAdding}
                    variant="secondary"
                >
                    Add
                </Button>
            )}
            {toolbarItems}
        </div>
        <PagingBar
            setPagingIndex={setPagingIndex}
            numPages={numPages}
        />
        <Table bordered>
            <thead>
                <tr ref={headerRef}>
                    {visibleCols.map((col, idx) => (
                        <ColumnCaption
                            key={col.dataField}
                            col={col}
                            dataSource={dataSource}
                            width={columnWidths[idx]}
                        />
                    ))}
                    {(editing.allowUpdating || editing.allowDeleting) && <td/>}
                </tr>
            </thead>
            <tbody className="no-border">
                {editingForm && editingForm.show && <tr>
                    <td colSpan={amountOfTds}>
                        <EditingForm
                            type={editingForm.type}
                            dataSource={dataSource}
                            cols={cols}
                            record={editingForm.record}
                            recordKeyField={keyField}
                            close={closeEditingForm}
                        />
                    </td>
                </tr>}
                {records.length > 0 ? records.map(record => (
                    <Fragment key={record[keyField]}>
                        {dataRowRender({
                            record,
                            cols: visibleCols,
                            editRow: generateRecordEditingFunc(record),
                            deleteRow: generateRecordDeletingFunc(record)
                        })}
                    </Fragment>
                )) : <tr><td colSpan={amountOfTds}>No data</td></tr>}
            </tbody>
        </Table>
        <DeleteModal
            show={deleteModal.show}
            deleteRecord={deleteModal.deleteRecord}
            handleClose={closeDeleteModal}
        />
    </div>;
};

export default DataGrid;