import { useCallback } from "react";
import { TagBox } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { isColumnRequired } from "../../utils/iscolumnrequired";

/**
 * TagBox based custom edit cell
 * @param {Object} props Component props
 * @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} props.data Data prop
 */
const TagBoxEditCell = ({ data, options, valueExpr=null, displayExpr=null }) => {

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
        <TagBox
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
        </TagBox>
    );
};

export default TagBoxEditCell;