import { Tabs, Tab } from "react-bootstrap";
import BooksGrid from "../grids/booksgrid/booksgrid";
import WebsitesGrid from "../grids/websitesgrid/websitesgrid";
import AudiovisualGrid from "../grids/audiovisualgrid/audiovisualgrid";
import RecreationalGrid from "../grids/recreationalgrid/recreationalgrid";
import SearchBar from "../searchbar/searchbar";
import './entrygridspage.css';

const EntryGridsPage = () => {

    return (
        <div className="entry-grids-container">
            <SearchBar/>
            <div className="entry-grids-tab-panel">
                <Tabs
                  defaultActiveKey="books"
                  className="mb-3"
                >
                    <Tab eventKey="books" title="Books">
                        <BooksGrid/>
                    </Tab>
                    <Tab eventKey="websites" title="Websites">
                        <WebsitesGrid/>
                    </Tab>
                    <Tab eventKey="audiovisual" title="Audiovisual">
                        <AudiovisualGrid/>
                    </Tab>
                    <Tab eventKey="reactional" title="Recreational Products">
                        <RecreationalGrid/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default EntryGridsPage;