import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';

const websitesRowRender = (data, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            data={data}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td>{data.record.name}</td>
            <td>
                <a href={data.record.url}>{data.record.url}</a>
            </td>
            <td>{data.record.type}</td>
            <td>{data.record.year}</td>
            <td>{data.record.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default websitesRowRender;