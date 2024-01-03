import { useState, useCallback, useRef, useContext, Children } from "react";

import { DataGrid } from "devextreme-react";
import { Editing, Paging, Column, HeaderFilter, FilterRow, Toolbar, Item, RequiredRule }
from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { ValidationGroup } from "devextreme-react";

import { RemoteStore } from "../../../store/remotestore";
import settings from '../../../static/settings.json';
import SelectEditCell from "../../customcells/selecteditcell";
import NumberEditCell from "../../customcells/numbereditcell";
import TagBoxEditCell from "../../customcells/tagboxeditcell";
import TextAreaEditCell from "../../customcells/textareaeditcell";
import { dataSourceArrayFilter } from "../../../utils/datasourcearrayfilter";
import { SearchFiltersContext } from "../../contexts/searchfilterscontext";
import { LoginContext } from "../../contexts/logincontext";
import { valueByKey } from "../../../utils/valuebykey";
import './entriesgridtemplate.css';

const tagsStore = new RemoteStore({
    serviceURL: 'actions/lists/tag/',
    data2records: responseData => responseData.list,
    byKey: valueByKey
});
const ageGroupsStore = new RemoteStore({
    serviceURL: 'actions/lists/agegroup/',
    data2records: responseData => responseData.list,
    byKey: valueByKey
});

const TagsEditCellComponent = ({ data }) => (
    <TagBoxEditCell
        data={data}
        options={new DataSource({
            store: tagsStore
        })}
        valueExpr='value'
        displayExpr='value'
    />
);

const AgeGroupsEditCellComponent = ({ data }) => (
    <SelectEditCell
        data={data}
        options={new DataSource({
            store: ageGroupsStore,
        })}
        valueExpr='value'
        displayExpr='value'
    />
);

const ageGroupsHeaderFilters = {
    store: ageGroupsStore,
    map: ({ _id, value }) => ({ _id: _id, text: value, value: value })
};

const yearHeaderFilters = [{
        text: 'Before 1945',
        value: ['year', '<', 3000],
    }, {
        text: '1945-1960',
        value: [['year', '>=', 1945], ['year', '<=', 1960]],
    }, {
        text: '1961-1970',
        value: [['year', '>=', 1961], ['year', '<=', 1970]],
    }, {
        text: '1971-1980',
        value: [['year', '>=', 1971], ['year', '<=', 1980]],
    }, {
        text: '1981-1990',
        value: [['year', '>=', 1981], ['year', '<=', 1990]],
    }, {
        text: '1991-2000',
        value: [['year', '>=', 1991], ['year', '<=', 2000]],
    }, {
        text: '2001-present',
        value: ['year', '>=', 2001],
    }
];

const tagsTagBoxOptions = {
    dataSource: new DataSource({
        store: tagsStore
    }),
    valueExpr: 'value',
    displayExpr: 'value',
    searchEnabled: true,
    multiline: false,
    showClearButton: true,
    showSelectionControls: true,
    applyValueMode: 'useButtons',
    placeholder: 'Select tags...',
    width: '50vw',
};

const toggleRowFilterButtonOptions = {
    switchedOffText: 'Show Advanced Filtering',
    switchedOnText: 'Hide Advanced Filtering',
    width: '130px'
};

export const EntriesGridTemplateBefore = () => {};
export const EntriesGridTemplateAfter = () => {};

const EntriesGridTemplate = ({ children, store, dataRowRender }) => {

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

    const tagsValueChanged = useCallback(event => {
        setTagsFilters(event.value);
    }, []);

    const statefulTagsTagBoxOptions = {
        ...tagsTagBoxOptions,
        value: tagsFilters,
        onValueChanged: tagsValueChanged
    };

    // Can change tag selection by clicking on the tags in each row
    const addTagFilter = useCallback(tag => {
        if (tagsFilters.every(existingTag => existingTag !== tag)) {
            setTagsFilters(tagsFilters.concat(tag));
        }
    }, [tagsFilters]);
    const dataRowRenderAddTag = useCallback(
        template => dataRowRender(template, addTagFilter, loginCtx.isLoggedIn),
        [addTagFilter, dataRowRender, loginCtx]
    );

    // Referencing the data grid so its state could be reset
    const dgRef = useRef(null);

    // Show an hide the FilterRow
    const [showFilterRow, setShowFilterRow] = useState(false);
    const toggleRowFilter = useCallback(event => {
        setShowFilterRow(event.value);
    }, []);
    const statefulToggleRowFilterButtonOptions = {
        ...toggleRowFilterButtonOptions,
        value: showFilterRow,
        onValueChanged: toggleRowFilter,
    };
    
    // Validate the fields before inserting/editing records
    // Combining the datagrid validation functionality with Validator components
    // in custom edit cell components (represented by the validation group)
    const validationGroup = useRef(null);
    const onRowValidating = useCallback(
        /** @param {import("devextreme/ui/data_grid").RowValidatingEvent} event */
        event => {
            if (validationGroup && validationGroup.current) {
                /** @type {ValidationGroup} */
                const vgCurr = validationGroup.current;
                const validationRes = vgCurr.instance.validate();
                if (!validationRes.isValid) {
                    event.isValid = false;
                }
            } else {
                event.isValid = false;
            }
        },
    [validationGroup]);
    
    // Stop hitting the enter key from closing the editing form
    const onEditingFormContentReady = useCallback(
        /** @param {import("devextreme/ui/form").ContentReadyEvent} event */
        event => {
            event.element.addEventListener('keydown', keydownEvent => {
                if (keydownEvent.key === 'Enter') {
                    keydownEvent.stopPropagation();
                }
            })
        },
    []);

    const before = Children.toArray(children).find(child => child.type === EntriesGridTemplateBefore);
    const after = Children.toArray(children).find(child => child.type === EntriesGridTemplateAfter);
    const beforeChildren = before ? before.props.children : null;
    const afterChildren = after ? after.props.children : null;

    return (
        <div className="entries-grid-container">
            <ValidationGroup ref={validationGroup}>
                <DataGrid
                    ref={dgRef}
                    dataSource={DS}
                    key='_id'
                    dataRowRender={dataRowRenderAddTag}
                    onRowValidating={onRowValidating}
                >
                    <Toolbar>
                        <Item
                            widget='dxTagBox'
                            options={statefulTagsTagBoxOptions}
                            location='before'
                        />
                        <Item
                            widget='dxSwitch'
                            options={statefulToggleRowFilterButtonOptions}
                            location='after'
                        />
                        <Item name='addRowButton'/>
                    </Toolbar>
                    <Paging
                        enabled={true}
                        pageSize={settings.dataGridPageSize}
                        defaultPageIndex={0}
                    />
                    <Editing
                        mode="form"
                        allowUpdating={loginCtx.isLoggedIn || false}
                        allowAdding={loginCtx.isLoggedIn || false}
                        allowDeleting={loginCtx.isLoggedIn || false}
                        form={{ onContentReady: onEditingFormContentReady }}
                    />
                    <HeaderFilter visible={true} />
                    <FilterRow visible={showFilterRow} />

                    {beforeChildren}
                    <Column
                        dataField="year"
                        dataType="number"
                        caption="Year"
                        editCellComponent={NumberEditCell}
                        width='5vw'
                    >
                        <HeaderFilter dataSource={yearHeaderFilters} />
                        <RequiredRule />
                    </Column> 
                    <Column
                        dataField="ageGroup"
                        dataType="string"
                        caption="Age Group"
                        editCellComponent={AgeGroupsEditCellComponent}
                    >
                        <HeaderFilter dataSource={ageGroupsHeaderFilters} />
                        <RequiredRule />
                    </Column>
                    {afterChildren}
                    <Column
                        dataField="tags"
                        visible={false}
                        editCellComponent={TagsEditCellComponent}
                    />
                    <Column
                        dataField="summary"
                        dataType="string"
                        caption="Summary"
                        allowFiltering={false}
                        allowSorting={false}
                        visible={false}
                        editCellComponent={TextAreaEditCell}
                    /> 
                </DataGrid>
            </ValidationGroup>
        </div>
    );
};

export default EntriesGridTemplate;