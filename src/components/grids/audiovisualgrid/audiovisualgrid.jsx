import { useContext } from "react";

import { Column, HeaderFilter, RequiredRule } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import { RemoteStore } from "../../../store/remotestore";
import SelectEditCell from "../../customcells/selecteditcell";
import { LoginContext } from "../../contexts/logincontext";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
from "../entriesgridtemplate/entriesgridtemplate";
import audiovisualRowRender from "./audiovisualrowrender";
import { valueByKey } from "../../../utils/valuebykey";

const typesStore = new RemoteStore({
    serviceURL: 'http://localhost:8080/lists/audiovisualtype/',
    data2records: responseData => responseData.list,
    byKey: valueByKey
});

const TypesEditCellComponent = ({ data }) => (
    <SelectEditCell
        data={data}
        options={new DataSource({
            store: typesStore
        })}
        valueExpr='value'
        displayExpr='value'
    />
);

const typesHeaderFilters = {
    store: typesStore,
    map: ({ _id, value }) => ({ _id: _id, text: value, value: value })
};

const AudiovisualGrid = () => {

    const loginCtx = useContext(LoginContext);

    const audiovisualStore = new RemoteStore({
        serviceURL: 'http://localhost:8080/feed/audiovisual/',
        data2records: responseData => responseData.audiovisuals,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={audiovisualStore}
            dataRowRender={audiovisualRowRender}
            storageKey='websitesDataGridState'
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Title"
                    allowHeaderFiltering={false}
                    sortOrder="asc"
                >
                    <RequiredRule/>
                </Column>
                <Column
                    dataField="type"
                    dataType="string"
                    caption="Type"
                    editCellComponent={TypesEditCellComponent}
                >
                    <HeaderFilter dataSource={typesHeaderFilters}/>
                    <RequiredRule/>
                </Column>
            </EntriesGridTemplateBefore>
        </EntriesGridTemplate>
    );
};

export default AudiovisualGrid;