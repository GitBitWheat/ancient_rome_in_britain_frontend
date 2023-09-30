import { useContext } from "react";

import { Column, HeaderFilter, RequiredRule } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import { RemoteStore } from "../../../store/remotestore";
import { LoginContext } from "../../contexts/logincontext";
import SelectEditCell from "../../customcells/selecteditcell";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import booksRowRender from "./booksrowrender";
import ImageEditCell from "../../customcells/imageeditcell";
import { valueByKey } from "../../../utils/valuebykey";

import './booksgrid.css';

const genresStore = new RemoteStore({
    serviceURL: 'http://localhost:8080/lists/genre/',
    data2records: responseData => responseData.list,
    byKey: valueByKey
});

const GenresEditCellComponent = ({ data }) => (
    <SelectEditCell
        data={data}
        options={new DataSource({
            store: genresStore
        })}
        valueExpr='value'
        displayExpr='value'
    />
);

const genresHeaderFilters = {
    store: genresStore,
    map: ({ _id, value }) => ({ _id: _id, text: value, value: value })
};

const BooksGrid = () => {

    const loginCtx = useContext(LoginContext);

    const booksStore = new RemoteStore({
        serviceURL: 'http://localhost:8080/feed/book/',
        data2records: responseData => responseData.books,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={booksStore}
            dataRowRender={booksRowRender}
            storageKey='booksDataGridState'
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="pic"
                    caption="Cover"
                    allowFiltering={false}
                    allowSorting={false}
                    width='10vw'
                    editCellComponent={ImageEditCell}
                />
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Title"
                    allowHeaderFiltering={false}
                    sortOrder="asc"
                >
                    <RequiredRule />
                </Column> 
                <Column
                    dataField="author"
                    dataType="string"
                    caption="Author"
                    allowHeaderFiltering={false}
                >
                    <RequiredRule />
                </Column>
                <Column
                    dataField="publisher"
                    dataType="string"
                    caption="Publisher"
                    allowHeaderFiltering={false}
                >
                    <RequiredRule />
                </Column>
                <Column
                    dataField="genre"
                    dataType="string"
                    caption="Genre"
                    editCellComponent={GenresEditCellComponent}
                >
                    <HeaderFilter dataSource={genresHeaderFilters} />
                    <RequiredRule />
                </Column>
            </EntriesGridTemplateBefore>
        </EntriesGridTemplate>
    );
};

export default BooksGrid;