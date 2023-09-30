import { useCallback, useContext } from "react";
import { TextBox } from "devextreme-react";
import { SearchFiltersContext } from "../contexts/searchfilterscontext";
import './searchbar.css';

const nop = _event => {};

/**
 * @param {Object} params
 */
const SearchBar = ({ className='', onEnterKey=nop }) => {
    
    const searchFiltersCtx = useContext(SearchFiltersContext);

    const onValueChangedSearch = useCallback(event => {
        if (searchFiltersCtx) {
            searchFiltersCtx.setSearchText(event.value);
        };
    }, [searchFiltersCtx]);

    return (
        <TextBox
            value={searchFiltersCtx ? searchFiltersCtx.searchText : ''}
            onValueChanged={onValueChangedSearch}
            onEnterKey={onEnterKey}
            placeholder="Search..."
            width='70vw'
            className={`search-bar ${className}`}
        />
    );
};

export default SearchBar;