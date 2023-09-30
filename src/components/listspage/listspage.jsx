import { useState, useCallback, useContext } from "react";

import { DataGrid, TabPanel } from "devextreme-react";
import { Column, Editing, RequiredRule } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";

import { RemoteStore } from "../../store/remotestore";
import { LoginContext } from "../contexts/logincontext";
import './listspage.css';

const lists = [{
    title: 'Tags',
    serviceURL: 'http://localhost:8080/lists/tag/'
}, {
    title: 'Age Groups',
    serviceURL: 'http://localhost:8080/lists/agegroup/'
}, {
    title: 'Genres',
    serviceURL: 'http://localhost:8080/lists/genre/'
}, {
    title: 'Website Types',
    serviceURL: 'http://localhost:8080/lists/websitetype/'
}, {
    title: 'Audiovisual Types',
    serviceURL: 'http://localhost:8080/lists/audiovisualtype/'
}, {
    title: 'Recreational Types',
    serviceURL: 'http://localhost:8080/lists/recreationaltype/'
}];

const itemTitleRender = entry => entry.title;

const ItemComponent = ({ data }) => {

    const loginCtx = useContext(LoginContext);

    const store = new RemoteStore({
        serviceURL: data.serviceURL,
        data2records: responseData => responseData.list,
        token: loginCtx.token
    });
    const DS = new DataSource({
        store: store,
    });

    return (
        <DataGrid
            dataSource={DS}
            key='_id'
        >
            <Editing
                mode='form'
                allowAdding={true}
                allowDeleting={true}
                allowUpdating={false}
            />
            <Column
                dataField="value"
                dataType="string"
                caption="Value"
                sortOrder="asc"
            >
                <RequiredRule/>
            </Column>
        </DataGrid>
    )
};

const ListsPage = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelectionChanged = useCallback(event => {
        if (event.name === 'selectedIndex') {
            setSelectedIndex(event.value);
        }
    }, []);

    return (
        <div className="lists-page-tab-panel">
            <TabPanel
                dataSource={lists}
                selectedIndex={selectedIndex}
                onOptionChanged={onSelectionChanged}
                itemTitleRender={itemTitleRender}
                itemComponent={ItemComponent}
                showNavButtons={true}
            />
        </div>
    );
};

export default ListsPage;