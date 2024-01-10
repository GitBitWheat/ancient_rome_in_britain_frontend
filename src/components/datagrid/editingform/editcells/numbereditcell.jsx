import { useState } from 'react';
import { FormControl } from 'react-bootstrap';

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import('./editcellprops').EditCellProps} props.data
 */
export const NumberEditCell = ({ data }) => {
    const [input, setInput] = useState(data.value || '');
    const onChange = event => {
        const value = event.target.value;
        const numericValue = parseInt(value);
        if (numericValue) {
            setInput(numericValue);
            data.setValue(numericValue);
        } else if (value === '') {
            setInput('');
            data.setValue(null);
        }
    };

    return (
        <FormControl
            type='text'
            pattern='[0-9]*'
            onChange={onChange}
            style={{ width: '200px' }}
            value={input}
        />
    );
};

export default NumberEditCell;