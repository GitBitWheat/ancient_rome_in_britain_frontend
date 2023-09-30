import { useCallback, Children } from 'react';
import { Button } from 'react-bootstrap';
import TextButtonModal from '../../textbuttonmodal/textbuttonmodal';
import './entriesrowrendertemplate.css';

/**
 * @param {import('devextreme/ui/data_grid').RowTemplateData} template
 */
const EntriesRowRenderTemplate = ({ children, template, addTagFilter, editingEnabled }) => {

    const editRow = useCallback(event => {
        template.component.editRow(template.rowIndex);
        event.stopPropagation();
        event.preventDefault();
    }, [template]);

    const deleteRow = useCallback(event => {
        template.component.deleteRow(template.rowIndex);
        event.stopPropagation();
        event.preventDefault();
    }, [template]);

    const tdChildren = Children.toArray(children).filter(child => child.type === 'td');
    const tagsColSpan = tdChildren.filter(child => (child.props.rowSpan || 1) <= 1).length
        + (editingEnabled ? 1 : 0);

    return (
        <>
            <tr>
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
                        {template.data.summary && (
                            <TextButtonModal
                                btnText='Summary'
                                modalHeaderText={template.data.name}
                                modalBodyText={template.data.summary}
                            />
                        )}
                        {(template.data.tags || []).map(tag => (
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
        </>
    );
};

export default EntriesRowRenderTemplate;