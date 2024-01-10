import { Children } from 'react';
import { Button } from 'react-bootstrap';
import TextButtonModal from '../../textbuttonmodal/textbuttonmodal';
import './entriesrowrendertemplate.css';

/**
 * @param {Object} props
 * @param {import('../../datagrid/configs').RowRenderProps} props.data
 */
const EntriesRowRenderTemplate = ({ children, data, addTagFilter, editingEnabled }) => {

    const editRow = event => {
        data.editRow();
        event.stopPropagation();
        event.preventDefault();
    };

    const deleteRow = event => {
        data.deleteRow();
        event.stopPropagation();
        event.preventDefault();
    };

    const tdChildren = Children.toArray(children).filter(child => child.type === 'td');
    const tagsColSpan = tdChildren.filter(child => (child.props.rowSpan || 1) <= 1).length
        + (editingEnabled ? 1 : 0);

    return <>
        <tr className='data-row-no-border'>
            {tdChildren}
            {editingEnabled && (
                <td className='edit-cell' rowSpan={2}>
                    <span
                        onClick={editRow}
                        className='edit-controls'
                    >
                        edit
                    </span>
                    &nbsp;
                    <span
                        onClick={deleteRow}
                        className='edit-controls'
                    >
                        delete
                    </span>
                </td>
            )}
        </tr>
        <tr className='data-row-bottom-border'>
            <td colSpan={tagsColSpan}>
                <h4 className='tag-row'>
                    {data.record.summary && (
                        <TextButtonModal
                            btnText='Summary'
                            modalHeaderText={data.record.name}
                            modalBodyText={data.record.summary}
                        />
                    )}
                    {(data.record.tags || []).map(tag => (
                        <Button
                            key={tag}
                            variant='secondary'
                            className='tag-button'
                            onClick={() => {addTagFilter(tag);}}
                        >
                            {tag}
                        </Button>
                    ))}
                </h4>
            </td>
        </tr>
    </>;
};

export default EntriesRowRenderTemplate;