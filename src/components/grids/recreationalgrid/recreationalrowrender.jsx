import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';

/**
 * @param {import('devextreme/ui/data_grid').RowTemplateData} template
 */
const recreationalRowRender = (template, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            template={template}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td>{template.data.name}</td>
            <td>{template.data.type}</td>
            <td>{template.data.year}</td>
            <td>{template.data.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default recreationalRowRender;