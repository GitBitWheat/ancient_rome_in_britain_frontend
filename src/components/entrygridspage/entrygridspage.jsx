import { useState, useCallback } from "react";

import { TabPanel } from "devextreme-react"

import BooksGrid from "../grids/booksgrid/booksgrid";
import WebsitesGrid from "../grids/websitesgrid/websitesgrid";
import AudiovisualGrid from "../grids/audiovisualgrid/audiovisualgrid";
import RecreationalGrid from "../grids/recreationalgrid/recreationalgrid";
import SearchBar from "../searchbar/searchbar";
import './entrygridspage.css';

const grids = [{
    title: 'Books',
    component: BooksGrid
}, {
    title: 'Websites',
    component: WebsitesGrid
}, {
    title: 'Audiovisual',
    component: AudiovisualGrid
}, {
    title: 'Recreational Products',
    component: RecreationalGrid
}];

const itemTitleRender = entry => entry.title;
const itemComponent = params => <params.data.component/>;

const EntryGridsPage = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelectionChanged = useCallback(event => {
        if (event.name === 'selectedIndex') {
            setSelectedIndex(event.value);
        }
    }, []);

    return (
        <div className="entry-grids-container">
            <SearchBar/>
            <div className="entry-grids-tab-panel">
                <TabPanel
                    dataSource={grids}
                    selectedIndex={selectedIndex}
                    onOptionChanged={onSelectionChanged}
                    itemTitleRender={itemTitleRender}
                    itemComponent={itemComponent}
                />
            </div>
        </div>
    );
};

export default EntryGridsPage;