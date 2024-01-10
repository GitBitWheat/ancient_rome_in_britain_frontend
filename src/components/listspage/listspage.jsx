import { useContext } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { DataGrid } from "../datagrid/datagrid";
import { Editing, Column } from "../datagrid/configs";
import { DataSource } from "../datasource/datasource";
import { RemoteStore } from "../datasource/remotestore";
import { LoginContext } from "../contexts/logincontext";
import './listspage.css';

const lists = [{
    title: 'Tags',
    serviceURL: 'actions/lists/tag/'
}, {
    title: 'Age Groups',
    serviceURL: 'actions/lists/agegroup/'
}, {
    title: 'Genres',
    serviceURL: 'actions/lists/genre/'
}, {
    title: 'Website Types',
    serviceURL: 'actions/lists/websitetype/'
}, {
    title: 'Audiovisual Types',
    serviceURL: 'actions/lists/audiovisualtype/'
}, {
    title: 'Recreational Types',
    serviceURL: 'actions/lists/recreationaltype/'
}];

const ItemComponent = ({ serviceURL }) => {

    const loginCtx = useContext(LoginContext);

    const store = new RemoteStore({
        serviceURL: serviceURL,
        data2records: responseData => responseData.list,
        token: loginCtx.token
    });
    const DS = new DataSource({
        store: store,
    });

    return (
        <DataGrid
            dataSource={DS}
            keyField='_id'
            defaultSortBy="value"
        >
            <Editing
                allowAdding={true}
                allowDeleting={true}
                allowUpdating={false}
            />
            <Column
                dataField="value"
                dataType="string"
                caption="Value"
                required
            />
        </DataGrid>
    )
};

const ListsPage = () => {

    return (
        <div className="lists-page-tab-panel">
            <Tabs
              defaultActiveKey="Tags"
              className="mb-3"
            >
                {lists.map(({ title, serviceURL }) => (
                    <Tab eventKey={title} title={title} key={title}>
                        <ItemComponent serviceURL={serviceURL}/>
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
};

export default ListsPage;