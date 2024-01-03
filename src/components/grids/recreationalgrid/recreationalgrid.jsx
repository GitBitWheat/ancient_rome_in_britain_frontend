import { useContext } from "react";

import { Column, HeaderFilter, RequiredRule } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import SelectEditCell from "../../customcells/selecteditcell";
import { RemoteStore } from "../../../store/remotestore";
import EntriesGridTemplate, { EntriesGridTemplateBefore }
    from "../entriesgridtemplate/entriesgridtemplate";
import recreationalRowRender from "./recreationalrowrender";
import { LoginContext } from "../../contexts/logincontext";
import { valueByKey } from "../../../utils/valuebykey";

const typesStore = new RemoteStore({
    serviceURL: 'actions/lists/recreationaltype/',
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

export default RecreationalGrid;