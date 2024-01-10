import { useContext } from "react";

import { Column } from "../../datagrid/configs";
import { DataSource } from "../../datasource/datasource";
import { RemoteStore } from "../../datasource/remotestore";

import SelectEditCell from "../../datagrid/editingform/editcells/selecteditcell";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import recreationalRowRender from "./recreationalrowrender";
import { LoginContext } from "../../contexts/logincontext";

const typesStore = new RemoteStore({
    serviceURL: 'actions/lists/recreationaltype/',
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
    />
);

const typesHeaderFilters = new DataSource({
    store: typesStore,
    map: ({ value }) => ({ text: value, value: ['type', 'equals', value] })
});

const RecreationalGrid = () => {

    const loginCtx = useContext(LoginContext);

    const websitesStore = new RemoteStore({
        serviceURL: 'actions/feed/recreational/',
        data2records: responseData => responseData.recreational,
        token: loginCtx.token
    });

    return (
        <EntriesGridTemplate
            store={websitesStore}
            dataRowRender={recreationalRowRender}
            defaultSortBy="name"
        >
            <EntriesGridTemplateBefore>
                <Column
                    dataField="name"
                    dataType="string"
                    caption="Name"
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

export default RecreationalGrid;