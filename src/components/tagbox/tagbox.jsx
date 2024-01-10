import { useState, useEffect } from "react";
import ControlledMultiComboBox from "../combobox/controlledcombobox";
import useDataSource from "../datasource/usedatasource";

/**
 * Multi combo box through which tags can be chosen
 * @param {Object} props
 * @param {String} props.typeaheadId
 * @param {DataSource} props.dataSource
 * @param {function(Array<Object>): *} props.onChangeSelection
 * @param {String} props.placeholder
 * @param {function(Object): String} props.labelKey Takes a record and converts it
 * to a string for the combo box
 */
export const TagBox = ({ typeaheadId, selected : selectedProp, dataSource,
    onChangeSelection=()=>{}, placeholder='' }) => {

    const [selected, setSelected] = useState(selectedProp || []);
    useEffect(() => {
        setSelected(selectedProp || []);
    }, [selectedProp]);

    const records = useDataSource(dataSource);

    return (
        <ControlledMultiComboBox
            typeaheadId={typeaheadId}
            selected={selected}
            options={records}
            onSelect={onChangeSelection}
            placeholder={placeholder}
            width='50vw'
        />
    );
};

export default TagBox;