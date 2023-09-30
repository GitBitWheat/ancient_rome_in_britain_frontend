import { useCallback } from "react";
import { SelectBox } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { isColumnRequired } from "../../utils/iscolumnrequired";

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} props.data Data prop
 */
const SelectEditCell = ({ data, options, valueExpr=null, displayExpr=null }) => {

    // Is the column required
    const required = isColumnRequired(data);

    const handleSelectionChanged = useCallback(() => {
        data.component.updateDimensions();
    }, [data]);
    const onValueChange = useCallback(value => {
        data.setValue(value);
    }, [data]);

    const displayExpressions = valueExpr && displayExpr ? {
        valueExpr: valueExpr, displayExpr: displayExpr
    } : {};

    return (
        <SelectBox
            dataSource={options}
            {...displayExpressions}
            showDataBeforeSearch={true}
            defaultValue={data.value}
            searchEnabled={true}
            onSelectionChanged={handleSelectionChanged}
            onValueChange={onValueChange}
        >
            {required && (
                <Validator>
                    <RequiredRule/>
                </Validator>
            )}
        </SelectBox>
    );
};

export default SelectEditCell;