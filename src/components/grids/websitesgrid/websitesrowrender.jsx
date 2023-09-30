import LinkCell from '../../customcells/linkcell';
import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';

/**
 * @param {import('devextreme/ui/data_grid').RowTemplateData} template
 */
const websitesRowRender = (template, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            template={template}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td>{template.data.name}</td>
            <td>
                <LinkCell data={{ value: template.data.url }} />
            </td>
            <td>{template.data.type}</td>
            <td>{template.data.year}</td>
            <td>{template.data.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default websitesRowRender;