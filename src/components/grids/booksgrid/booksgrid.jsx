import { useContext } from "react";

import { Column } from "../../datagrid/configs";
import { DataSource } from "../../datasource/datasource";
import { RemoteStore } from "../../datasource/remotestore";

import { LoginContext } from "../../contexts/logincontext";
import SelectEditCell from "../../datagrid/editingform/editcells/selecteditcell";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import booksRowRender from "./booksrowrender";
import ImageEditCell from "../../datagrid/editingform/editcells/imageeditcell";

import './booksgrid.css';

const genresStore = new RemoteStore({
    serviceURL: 'actions/lists/genre/',
    data2records: responseData => responseData.list,
});

const GenresEditCellComponent = data => (
    <SelectEditCell
        data={data}
        dataSource={new DataSource({
            store: genresStore,
            map: ({ value }) => value,
            sortBy: 'value'
        })}
        typeaheadId="genres-edit-cell-component"
    />
);

const genresHeaderFilters = new DataSource({
    store: genresStore,
    map: ({ value }) => ({ text: value, value: ['genre', 'equals', value] })
});

const BooksGrid = () => {

    const loginCtx = useContext(LoginContext);

    const booksStore = new RemoteStore({
        serviceURL: 'actions/feed/book/',
        data2records: responseData => responseData.books,
        token: loginCtx.token
    });

    const PicEditCellComponent = data => (
        <ImageEditCell
            data={data}
            serviceURL="actions/files/images"
            token={loginCtx.token}
        />
    );

    return (
        <EntriesGridTemplate
            store={booksStore}
            dataRowRender={booksRowRender}
            storageKey='booksDataGridState'
            defaultSortBy='name'
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="pic"
                    caption="Cover"
                    allowSorting={false}
                    width={100}
                    editCellComponent={PicEditCellComponent}
                />
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Title"
                    required
                />
                <Column
                    dataField="author"
                    dataType="string"
                    caption="Author"
                    required
                />
                <Column
                    dataField="publisher"
                    dataType="string"
                    caption="Publisher"
                    required
                />
                <Column
                    dataField="genre"
                    dataType="string"
                    caption="Genre"
                    editCellComponent={GenresEditCellComponent}
                    headerFilterDataSource={genresHeaderFilters}
                    required
                />
            </EntriesGridTemplateBefore>
        </EntriesGridTemplate>
    );
};

export default BooksGrid;