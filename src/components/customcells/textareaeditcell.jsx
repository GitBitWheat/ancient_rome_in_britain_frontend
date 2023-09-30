import { useCallback } from "react";
import { TextArea } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { isColumnRequired } from "../../utils/iscolumnrequired";

/**
 * Combo box like custom edit cell
 * @param {Object} props Component props
 * @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} props.data Data prop
 */
const TextAreaEditCell = ({ data }) => {

    // Is the column required
    const required = isColumnRequired(data);

    const handleSelectionChanged = useCallback(() => {
        data.component.updateDimensions();
    }, [data]);
    const onValueChange = useCallback(value => {
        data.setValue(value);
    }, [data]);

    return (
        <TextArea
            defaultValue={data.value}
            onSelectionChanged={handleSelectionChanged}
            onValueChange={onValueChange}
            spellcheck={true}
            autoResizeEnabled={true}
            minHeight='100px'
        >
            {required && (
                <Validator>
                    <RequiredRule/>
                </Validator>
            )}
        </TextArea>
    );
};

export default TextAreaEditCell;