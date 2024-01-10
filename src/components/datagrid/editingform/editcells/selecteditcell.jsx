import ComboBox from '../../../combobox/combobox';
import useDataSource from '../../../datasource/usedatasource';

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import('./editcellprops').EditCellProps} props.data
 * @param {import('../../../datasource/datasource').DataSource | Array} props.dataSource
 * @param {String} props.typeaheadId
 */
export const SelectEditCell = ({ data, dataSource, typeaheadId }) => {
    const options = useDataSource(dataSource);

    const onValueChange = value => {
        data.setValue(value);
    };

    return (
        <ComboBox
            options={options}
            onSelect={onValueChange}
            typeaheadId={typeaheadId}
            width='100%'
            defaultSelected={data.value}
        />
    );
};

export default SelectEditCell;