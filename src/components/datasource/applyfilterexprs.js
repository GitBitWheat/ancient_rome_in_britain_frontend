import { isString } from "../../utils/isstring";

/**
 * @param {Array<Object>} data 
 * @param {Map<Number, Array>} filterExprs 
 * @returns {Boolean}
 */
export const applyFilterExprs = (data, filterExprs) => {
    return data.filter(record => {
        for (const filterExpr of filterExprs.values()) {
            if (!checkFilterExprOnRecord(record, filterExpr)) {
                return false;
            }
        }
        return true;
    });
};

const isFilterExprLeaf = filterExpr =>
    Array.isArray(filterExpr) && filterExpr.length === 3 && !Array.isArray(filterExpr[0]);

const checkFilterExprLeafOnRecord = (record, filterExprLeaf) => {
    const [dataField, condition, value] = filterExprLeaf;
    
    if (!(!!record[dataField]) || !(!!value)) {
        return false;
    }

    switch (condition) {
        case '<': {
            if (!(record[dataField] < value)) {
                return false;
            }
            break;
        }
        case '<=': {
            if (!(record[dataField] <= value)) {
                return false;
            }
            break;
        }
        case '>': {
            if (!(record[dataField] > value)) {
                return false;
            }
            break;
        }
        case '>=': {
            if (!(record[dataField] >= value)) {
                return false;
            }
            break;
        }
        case 'contains': {
            if (isString(record[dataField]) && isString(value.toLowerCase()) &&
                !(record[dataField].toLowerCase().includes(value.toLowerCase()))) {
                return false;
            } else if (Array.isArray(record[dataField]) &&
                !(record[dataField].some(element =>
                    (isString(element) && isString(value) &&
                    element.toLowerCase().includes(value.toLowerCase())) ||
                    element === value))) {
                return false;
            } else if (!isString(record[dataField]) && !Array.isArray(record[dataField])) {
                return false;
            }
            break;
        }
        case 'equals': {
            if (!isString(record[dataField]) && !(record[dataField] === value)) {
                return false;
            } else if (isString(record[dataField]) &&
                !(record[dataField].toLowerCase() === value.toLowerCase())) {
                return false;
            }
            break;
        }
        default:
            break;
    }

    return true;
};

const checkFilterExprOnRecord = (record, filterExpr) => {
    // A full filterExpr must be an array
    if (!Array.isArray(filterExpr)) {
        console.error('Not a valid filter expression')
        return false;
    }

    if (isFilterExprLeaf(filterExpr)) {
        return checkFilterExprLeafOnRecord(record, filterExpr);
    }

    // Note that filterExpr expects an individual array to have either ands or ors,
    // not both in the same array
    if (filterExpr[1] === 'and') {
        return filterExpr
        .filter((_val, index) => index % 2 === 0)
        .reduce(
            (accumulator, currentValue) => checkFilterExprOnRecord(record, currentValue) && accumulator,
            true,
        );
    } else if (filterExpr[1] === 'or') {
        return filterExpr
        .filter((_val, index) => index % 2 === 0)
        .reduce(
            (accumulator, currentValue) => checkFilterExprOnRecord(record, currentValue) || accumulator,
            false,
        );
    } else {
        return false;
    }
};