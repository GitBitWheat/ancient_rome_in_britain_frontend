import { isString } from "../../utils/isstring";

export const generateCompare = (sortBy, sortAscending) => (elem1, elem2) => {
    const val1 = elem1[sortBy];
    const val2 = elem2[sortBy];

    // Push null values to the bottom, regardless of sortAsc
    if (!(!!val1) && !(!!val2)) {
        return 0;
    } else if (!(!!val1) && val2) {
        return 1;
    } else if (val1 && !(!!val2)) {
        return -1;
    }
    
    else if (sortAscending) {
        if (isString(val1) && isString(val2)) {
            return val1.localeCompare(val2);
        } else {
            if (val1 < val2){
                return -1;
            }
            if (val1 > val2){
                return 1;
            }
            return 0;
        }
    } else {
        if (isString(val1) && isString(val2)) {
            return -val1.localeCompare(val2);
        } else {
            if (val1 > val2){
                return -1;
            }
            if (val1 < val2){
                return 1;
            }
            return 0;
        }
    }
};