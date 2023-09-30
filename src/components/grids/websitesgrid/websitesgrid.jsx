import { useContext } from "react";

import { Column, HeaderFilter, RequiredRule } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import { RemoteStore } from "../../../store/remotestore";
import SelectEditCell from "../../customcells/selecteditcell";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import websitesRowRender from "./websitesrowrender.jsx";
import { LoginContext } from "../../contexts/logincontext";
import { valueByKey } from "../../../utils/valuebykey";

const typesStore = new RemoteStore({
    serviceURL: 'http://localhost:8080/lists/websitetype/',
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

const WebsitesGrid = () => {

    const loginCtx = useContext(LoginContext);

    const websitesStore = new RemoteStore({
        serviceURL: 'http://localhost:8080/feed/website/',
        data2records: responseData => responseData.websites,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={websitesStore}
            dataRowRender={websitesRowRender}
            storageKey='websitesDataGridState'
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Name"
                    allowHeaderFiltering={false}
                    sortOrder="asc"
                >
                    <RequiredRule/>
                </Column>
                <Column
                    dataField="url"
                    dataType="string"
                    caption="URL"
                    allowHeaderFiltering={false}
                >
                    <RequiredRule/>
                </Column>
                <Column
                    dataField="type"
                    dataType="string"
                    caption="Type"
                    editCellComponent={TypesEditCellComponent}
                >
                    <HeaderFilter dataSource={typesHeaderFilters} />
                    <RequiredRule/>
                </Column>
            </EntriesGridTemplateBefore>
        </EntriesGridTemplate>
    );
};

export default WebsitesGrid;