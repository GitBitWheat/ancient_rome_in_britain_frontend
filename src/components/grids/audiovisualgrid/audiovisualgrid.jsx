import { useContext } from "react";

import { Column } from "../../datagrid/configs";
import { DataSource } from "../../datasource/datasource";
import { RemoteStore } from "../../datasource/remotestore";

import SelectEditCell from "../../datagrid/editingform/editcells/selecteditcell";
import { LoginContext } from "../../contexts/logincontext";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
from "../entriesgridtemplate/entriesgridtemplate";
import audiovisualRowRender from "./audiovisualrowrender";

const typesStore = new RemoteStore({
    serviceURL: 'actions/lists/audiovisualtype/',
    data2records: responseData => responseData.list,
});

const TypesEditCellComponent = data => (
    <SelectEditCell
        data={data}
        dataSource={new DataSource({
            store: typesStore,
            map: ({ value }) => value,
            sortBy: 'value'
        })}
        typeaheadId="types-edit-cell-component"
    />
);

const typesHeaderFilters = new DataSource({
    store: typesStore,
    map: ({ value }) => ({ text: value, value: ['type', 'equals', value] })
});

const AudiovisualGrid = () => {

    const loginCtx = useContext(LoginContext);

    const audiovisualStore = new RemoteStore({
        serviceURL: 'actions/feed/audiovisual/',
        data2records: responseData => responseData.audiovisuals,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={audiovisualStore}
            dataRowRender={audiovisualRowRender}
            storageKey="websitesDataGridState"
            defaultSortBy="name"
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Title"
                    required
                />
                <Column
                    dataField="type"
                    dataType="string"
                    caption="Type"
                    editCellComponent={TypesEditCellComponent}
                    headerFilterDataSource={typesHeaderFilters}
                    required
                />
            </EntriesGridTemplateBefore>
        </EntriesGridTemplate>
    );
};

export default AudiovisualGrid;