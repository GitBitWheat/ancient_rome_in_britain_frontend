import { FormControl } from 'react-bootstrap';

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import('./editcellprops').EditCellProps} props.data
 */
export const TextAreaEditCell = ({ data }) => {
    const onChange = event => {
        data.setValue(event.target.value);
    };

    return (
        <FormControl
            as='textarea'
            type='text'
            onChange={onChange}
            rows={4}
            defaultValue={data.value || ''}
        />
    );
};

export default TextAreaEditCell;