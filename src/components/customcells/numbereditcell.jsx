import { useCallback } from "react";
import { NumberBox } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { isColumnRequired } from "../../utils/iscolumnrequired";

/**
 * Numeric value custom edit cell
 * @param {Object} props Component props
 * @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} props.data Data prop
 */
const NumberEditCell = ({ data }) => {

    const required = isColumnRequired(data);

    const onValueChanged = useCallback(event => {
        data.setValue(event.value);
    }, [data]);

    return (
        <NumberBox
            defaultValue={data.value}
            showSpinButtons={true}
            showClearButton={true}
            onValueChanged={onValueChanged}
        >
            {required && (
                <Validator>
                    <RequiredRule/>
                </Validator>
            )}
        </NumberBox>
    );
};

export default NumberEditCell;