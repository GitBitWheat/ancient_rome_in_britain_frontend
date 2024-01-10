import { useContext } from "react";

import { Column } from "../../datagrid/configs";
import { DataSource } from "../../datasource/datasource";
import { RemoteStore } from "../../datasource/remotestore";

import SelectEditCell from "../../datagrid/editingform/editcells/selecteditcell";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import websitesRowRender from "./websitesrowrender.jsx";
import { LoginContext } from "../../contexts/logincontext";

const typesStore = new RemoteStore({
    serviceURL: 'actions/lists/websitetype/',
    data2records: responseData => responseData.list,
});

const TypesEditCellComponent = ({ data }) => (
    <SelectEditCell
        data={data}
        options={new DataSource({
            store: typesStore,
            map: ({ value }) => value,
            sortBy: 'value'
        })}
        valueExpr='value'
        displayExpr='value'
    />
);

const typesHeaderFilters = new DataSource({
    store: typesStore,
    map: ({ value }) => ({ text: value, value: ['type', 'equals', value] })
});

const WebsitesGrid = () => {

    const loginCtx = useContext(LoginContext);

    const websitesStore = new RemoteStore({
        serviceURL: 'actions/feed/website/',
        data2records: responseData => responseData.websites,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={websitesStore}
            dataRowRender={websitesRowRender}
            defaultSortBy="name"
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Name"
                    allowHeaderFiltering={false}
                    required
                />
                <Column
                    dataField="url"
                    dataType="string"
                    caption="URL"
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

export default WebsitesGrid;