import React from "react";
import { Filter, FilterSquareFill } from "react-bootstrap-icons";
import { OverlayTrigger, Popover, Form } from "react-bootstrap";
import useDataSource from "../../datasource/usedatasource";

const FilterButton = React.forwardRef(({ isFiltered, ...props }, ref) =>
    <div ref={ref} {...props}>
        {isFiltered ? <FilterSquareFill/> : <Filter/>}
    </div>
);

const HeaderFilterPopoverContent = React.forwardRef(
    /**
     * @param {Object} param0
     * @param {Set} param0.checked
     * @param {React.RefObject} ref
     */
    ({ records, checked, addChecked, deleteChecked, ...props }, ref) => {

    const generateChangeEventHandler = idx => event => {
        const isChecked = event.target.checked;
        if (isChecked) {
            addChecked(idx);
        } else {
            deleteChecked(idx);
        }
    };

    return <Popover ref={ref} {...props}>
        <Form className="header-filter-popover-form">
            {records.length > 0 ? records.map(({ text }, idx) => (
                <Form.Check
                    key={text}
                    type='checkbox'
                    label={text}
                    onChange={generateChangeEventHandler(idx)}
                    defaultChecked={checked.has(idx)}
                />
            )) : <div>No data</div>}
        </Form>
    </Popover>
});

export const HeaderFilterButton = ({ col, checked, addChecked, deleteChecked, isFiltered }) => {
    const records = useDataSource(col.headerFilterDataSource);

    const overlay =
        <HeaderFilterPopoverContent
            records={records}
            checked={checked}
            addChecked={addChecked}
            deleteChecked={deleteChecked}
        />;

    const onClickContainer = event => {event.stopPropagation();};

    return (
        <span onClick={onClickContainer}>
            <OverlayTrigger
                trigger='click'
                rootClose={true}
                placement='bottom'
                overlay={overlay}
            >
                <FilterButton isFiltered={isFiltered}/>
            </OverlayTrigger>
        </span>
    );
};

export default HeaderFilterButton;