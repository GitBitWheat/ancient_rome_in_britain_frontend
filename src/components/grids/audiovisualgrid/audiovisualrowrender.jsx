import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';

const audiovisualRowRender = (data, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            data={data}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td>{data.record.name}</td>
            <td>{data.record.type}</td>
            <td>{data.record.year}</td>
            <td>{data.record.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default audiovisualRowRender;