import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import HeaderFilterButton from "./headerfilterbutton";
import useSortByCol from "./usesortbycol";
import useHeaderFilter from "./useheaderfilter";
import './columncaption.css';

export const ColumnCaption = ({ col, dataSource, width }) => {
    const { isSort, sortAsc, sortByColumn } = useSortByCol(col, dataSource);
    const { checked, addChecked, deleteChecked, isFiltered } = useHeaderFilter(col, dataSource);

    return (
        <td
            onClick={sortByColumn}
            width={width}
            className="column-caption"
        >
            <div className="column-caption-text">
                {col.caption}
            </div>
            <div className="column-caption-options">
                {isSort && (sortAsc ? <ArrowUp/> : <ArrowDown/>)}
                {col.headerFilterDataSource &&
                <HeaderFilterButton
                    col={col}
                    checked={checked}
                    addChecked={addChecked}
                    deleteChecked={deleteChecked}
                    isFiltered={isFiltered}
                />}
            </div>
        </td>
    );
};

export default ColumnCaption;