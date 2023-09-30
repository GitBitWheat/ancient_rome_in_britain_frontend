import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';
import ModalImage from '../../modalimage/modalimage';

const imagesServiceURL = 'http://localhost:8080/files/images';

/**
 * @param {import('devextreme/ui/data_grid').RowTemplateData} template
 */
const booksRowRender = (template, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            template={template}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td rowSpan={2} className='cover-cell'>
                {template.data.pic ? (
                    <ModalImage
                        src={`${imagesServiceURL}/${template.data.pic}`}
                        alt='None'
                    />
                ) : (
                    <span>None</span>
                )}
            </td>
            <td>{template.data.name}</td>
            <td>{template.data.author}</td>
            <td>{template.data.publisher}</td>
            <td>{template.data.genre}</td>
            <td>{template.data.year}</td>
            <td>{template.data.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default booksRowRender;