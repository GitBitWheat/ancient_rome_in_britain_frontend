import { useState, useEffect, createContext } from "react";

const yearRangeRegex = /^\d+-\d+$/;

export const SearchFiltersContext = createContext();

export const SearchFiltersContextProvider = ({ children }) => {

    const [searchText, setSearchText] = useState('');
    const [filterExpr, setFilterExpr] = useState(null);

    useEffect(() => {
        // A tag needs to be written exactly right in the search box.
        // For any other field, it is enough for the field to contain it.
        const searchDataFields = [
            'name', 'ageGroup', 'year', 'author', 'publisher', 'genre', 'type', 'tags'
        ];
        const tokens = searchText.split(/ +/);

        if (tokens.length) {
            let expr = [];
            for (const token of tokens) {
                if (yearRangeRegex.test(token)) {
                    const [begin, end] = token.split('-');
                    expr.push([['year', '>=', begin], ['year', '<=', end]]);
                } else {
                    const tokenFilterExpr = [];
                    for (const dataField of searchDataFields) {
                        tokenFilterExpr.push([dataField, 'contains', token])
                        tokenFilterExpr.push('or')
                    }
                    tokenFilterExpr.pop();
                    expr.push(tokenFilterExpr);
                }
                expr.push('or')
            }
            expr.pop();
            if (expr.length === 1) {
                expr = expr[0];
            }
            setFilterExpr(expr);
        } else {
            setFilterExpr(null);
        }
    }, [searchText]);

    const [value, setValue] = useState(null);
    useEffect(() => {
        setValue({
            searchText: searchText,
            setSearchText: setSearchText,
            filterExpr: filterExpr
        });
    }, [searchText, filterExpr]);

    return (
        <SearchFiltersContext.Provider value={value}>
            {children}
        </SearchFiltersContext.Provider>
    );
};