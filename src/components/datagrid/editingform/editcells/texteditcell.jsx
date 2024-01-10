import { FormControl } from 'react-bootstrap';

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import('./editcellprops').EditCellProps} props.data
 */
export const TextEditCell = ({ data }) => {
    const onChange = event => {
        data.setValue(event.target.value);
    };

    return (
        <FormControl
            type='text'
            onChange={onChange}
            required={data.required}
            defaultValue={data.value || ''}
        />
    );
};

export default TextEditCell;