import { useState, useCallback, useContext, Children } from "react";

import { DataGrid } from "../../datagrid/datagrid";
import { Editing, Paging, Column, Toolbar } from "../../datagrid/configs";
import { DataSource } from "../../datasource/datasource";
import { RemoteStore } from "../../datasource/remotestore";

import SelectEditCell from "../../datagrid/editingform/editcells/selecteditcell";
import TagBoxEditCell from "../../datagrid/editingform/editcells/tagboxeditcell";
import TextAreaEditCell from "../../datagrid/editingform/editcells/textareaeditcell";

import settings from '../../../static/settings.json';
import TagBox from "../../tagbox/tagbox";
import { dataSourceArrayFilter } from "./datasourcearrayfilter";
import { SearchFiltersContext } from "../../contexts/searchfilterscontext";
import { LoginContext } from "../../contexts/logincontext";
import './entriesgridtemplate.css';

const tagsStore = new RemoteStore({
    serviceURL: 'actions/lists/tag/',
    data2records: responseData => responseData.list,
});
const ageGroupsStore = new RemoteStore({
    serviceURL: 'actions/lists/agegroup/',
    data2records: responseData => responseData.list,
});

const TagsEditCellComponent = data => (
    <TagBoxEditCell
        data={data}
        dataSource={new DataSource({
            store: tagsStore,
            map: ({ value }) => value,
            sortBy: 'value'
        })}
        typeaheadId="tags-edit-cell-component"
    />
);

const AgeGroupsEditCellComponent = data => (
    <SelectEditCell
        data={data}
        dataSource={new DataSource({
            store: ageGroupsStore,
            map: ({ value }) => value,
            sortBy: 'value'
        })}
        typeaheadId="tags-edit-cell-component"
    />
);

const SummaryEditCellComponent = data => (
    <TextAreaEditCell data={data}/>
);

const ageGroupsHeaderFilters = new DataSource({
    store: ageGroupsStore,
    map: ({ value }) => ({ text: value, value: ['ageGroup', 'equals', value] })
});

const yearHeaderFilters = [{
        text: 'Before 1945',
        value: ['year', '<', 1945],
    }, {
        text: '1945-1960',
        value: [['year', '>=', 1945], 'and', ['year', '<=', 1960]],
    }, {
        text: '1961-1970',
        value: [['year', '>=', 1961], 'and', ['year', '<=', 1970]],
    }, {
        text: '1971-1980',
        value: [['year', '>=', 1971], 'and', ['year', '<=', 1980]],
    }, {
        text: '1981-1990',
        value: [['year', '>=', 1981], 'and', ['year', '<=', 1990]],
    }, {
        text: '1991-2000',
        value: [['year', '>=', 1991], 'and', ['year', '<=', 2000]],
    }, {
        text: '2001-present',
        value: ['year', '>=', 2001],
    }
];

const tagBoxDataSource = new DataSource({
    store: tagsStore,
    map: ({ value }) => value,
    sortBy: 'value'
})

export const EntriesGridTemplateBefore = () => {};
export const EntriesGridTemplateAfter = () => {};

const EntriesGridTemplate = ({ children, store, dataRowRender, defaultSortBy }) => {

    const loginCtx = useContext(LoginContext);

    // The books data source is filtered by tags, and by the search term
    const [tagsFilters, setTagsFilters] = useState([]);
    const tagsFilterExpr = dataSourceArrayFilter('tags', tagsFilters);

    const searchFiltersCtx = useContext(SearchFiltersContext);
    
    let filterExpr = null;
    if (tagsFilterExpr && searchFiltersCtx && searchFiltersCtx.filterExpr) {
        filterExpr = [tagsFilterExpr, 'and', searchFiltersCtx.filterExpr];
    } else if (tagsFilterExpr) {
        filterExpr = tagsFilterExpr;
    } else if (searchFiltersCtx && searchFiltersCtx.filterExpr) {
        filterExpr = searchFiltersCtx.filterExpr;
    }

    const DS = new DataSource({
        store: store,
        filter: filterExpr
    });

    const TagBoxChangeSelectionEventHandler = selectionArray => {
        setTagsFilters(selectionArray);
    };

    // Can change tag selection by clicking on the tags in each row
    const addTagFilter = useCallback(tag => {
        if (tagsFilters.every(existingTag => existingTag !== tag)) {
            setTagsFilters(tagsFilters.concat(tag));
        }
    }, [tagsFilters]);
    const dataRowRenderAddTag = useCallback(
        data => dataRowRender(data, addTagFilter, loginCtx.isLoggedIn),
        [addTagFilter, dataRowRender, loginCtx]
    );

    const before = Children.toArray(children).find(child => child.type === EntriesGridTemplateBefore);
    const after = Children.toArray(children).find(child => child.type === EntriesGridTemplateAfter);
    const beforeChildren = before ? before.props.children : null;
    const afterChildren = after ? after.props.children : null;

    return (
        <div className="entries-grid-container">
            <DataGrid
                dataSource={DS}
                keyField='_id'
                dataRowRender={dataRowRenderAddTag}
                defaultSortBy={defaultSortBy}
            >
                <Toolbar>
                    <TagBox
                        typeaheadId="tag-box"
                        selected={tagsFilters}
                        dataSource={tagBoxDataSource}
                        placeholder="Select tags..."
                        onChangeSelection={TagBoxChangeSelectionEventHandler}
                    />
                </Toolbar>
                <Paging
                    enabled={true}
                    pageSize={settings.dataGridPageSize}
                />
                <Editing
                    allowUpdating={loginCtx.isLoggedIn || false}
                    allowAdding={loginCtx.isLoggedIn || false}
                    allowDeleting={loginCtx.isLoggedIn || false}
                />

                {beforeChildren}
                <Column
                    dataField="year"
                    dataType="number"
                    caption="Year"
                    width={100}
                    headerFilterDataSource={yearHeaderFilters}
                    required
                />
                <Column
                    dataField="ageGroup"
                    dataType="string"
                    caption="Age Group"
                    editCellComponent={AgeGroupsEditCellComponent}
                    headerFilterDataSource={ageGroupsHeaderFilters}
                    required
                />
                {afterChildren}
                <Column
                    dataField="tags"
                    caption="Tags"
                    visible={false}
                    editCellComponent={TagsEditCellComponent}
                />
                <Column
                    dataField="summary"
                    dataType="string"
                    caption="Summary"
                    visible={false}
                    editCellComponent={SummaryEditCellComponent}
                /> 
            </DataGrid>
        </div>
    );
};

export default EntriesGridTemplate;