/** @param {import('./configs').RowRenderProps} props */
export const defaultRowRender = ({ record, cols, editRow, deleteRow }) =>
    <tr className='default-row-render-tr'>
        {cols.map(col => (
            <td key={col.dataField}>{record[col.dataField]}</td>
        ))}
        {(editRow || deleteRow) && (
            <td className='edit-cell'>
                {editRow && (
                    <span
                        onClick={editRow}
                        className='edit-controls'
                    >
                        edit
                    </span>
                )}
                &nbsp;
                {deleteRow && (
                    <span
                        onClick={deleteRow}
                        className='edit-controls'
                    >
                        delete
                    </span>
                )}
            </td>
        )}
    </tr>;