import { useState, useContext } from "react";
import { FormControl } from "react-bootstrap";
import { SearchFiltersContext } from "../contexts/searchfilterscontext";
import './searchbar.css';

const nop = _event => {};

/**
 * @param {Object} params
 */
const SearchBar = ({ className='', onEnterKey=nop }) => {
    const [localInput, setLocalInput] = useState('');
    
    const searchFiltersCtx = useContext(SearchFiltersContext);

    const ChangeEventHandler = event => {
        if (searchFiltersCtx) {
            searchFiltersCtx.setSearchText(event.target.value);
            setLocalInput(event.target.value);
        };
    };

    const KeyDownEventHandler = keydownEvent => {
        if (keydownEvent.key === 'Enter') {
            onEnterKey();
        }
    };

    return (
        <FormControl
            type="text"
            value={localInput}
            onChange={ChangeEventHandler}
            onKeyDown={KeyDownEventHandler}
            placeholder="Search..."
            className={`search-bar ${className}`}
        />
    );
};

export default SearchBar;