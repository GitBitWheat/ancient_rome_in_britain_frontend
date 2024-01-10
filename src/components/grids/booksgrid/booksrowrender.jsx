import EntriesRowRenderTemplate from '../entriesrowrendertemplate/entriesrowrendertemplate';
import ModalImage from '../../modalimage/modalimage';

const imagesServiceURL = 'actions/files/images';

const booksRowRender = (data, addTagFilter, editingEnabled) => {
    return (
        <EntriesRowRenderTemplate
            data={data}
            addTagFilter={addTagFilter}
            editingEnabled={editingEnabled}
        >
            <td rowSpan={2} className='cover-cell'>
                {data.record.pic ? (
                    <ModalImage
                        src={`${imagesServiceURL}/${data.record.pic}`}
                        alt='None'
                    />
                ) : (
                    <span>None</span>
                )}
            </td>
            <td>{data.record.name}</td>
            <td>{data.record.author}</td>
            <td>{data.record.publisher}</td>
            <td>{data.record.genre}</td>
            <td>{data.record.year}</td>
            <td>{data.record.ageGroup}</td>
        </EntriesRowRenderTemplate>
    );
};

export default booksRowRender;