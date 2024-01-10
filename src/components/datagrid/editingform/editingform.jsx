import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { EditCellProps } from "./editcells/editcellprops";
import TextEditCell from "./editcells/texteditcell";
import NumberEditCell from "./editcells/numbereditcell";
import "./editingform.css";

/**
 * @param {Object} props
 * @param {import('../configs').ColumnProps} props.col
 */
const DefaultEditCell = ({ col, ...props }) => {
    switch (col.dataType) {
        case 'string':
            return <TextEditCell {...props}/>
        case 'number':
            return <NumberEditCell {...props}/>
        default:
            return null;
    }
};

/**
 * @param {Object} params
 * @param {String} params.type 'updating' or 'adding'
 * @param {import('../../datasource/datasource').DataSource} params.dataSource
 * @param {Array<import('../configs').ColumnProps>} params.cols
 * @param {Object} params.record
 * @param {String} params.recordKey
 * @param {function(): *} params.close
 */
export const RenderedEditingForm = ({ type, dataSource, cols, record, recordKeyField, close }) => {
    const editableCols = cols.filter(col => col.allowEditing);

    const [formData, setFormData] = useState(record || {});

    /** @param {import('../configs').ColumnProps} col */
    const generateEditCellProps = col => new EditCellProps({
        record: record || {},
        value: (record || {})[col.dataField],
        setValue: value => {
            setFormData({ ...formData, [col.dataField]: value });
        }, 
        required: col.required,
        dataField: col.dataField
    });

    const submit = () => {
        switch (type) {
            case 'adding':
                dataSource.insert(formData);
                break;
            case 'updating':
                dataSource.update(record[recordKeyField], formData);
                break;
            default:
                console.error('Invalid editing form type')
                break;
        }
        setFormData({});
        close();
    };

    const isSubmitDisabled = (
        cols
        .filter(col => col.required)
        .map(col => formData[col.dataField])
        .filter(value => !(!!value))
        .length
    ) > 0;

    return <Form noValidate>
        {editableCols.map(col => (
            <Form.Group
                key={col.dataField}
                className="mb-3"
                controlId={`editing-form-${col.dataField}`}
            >
                <Form.Label className={col.required ? "required" : ""}>{col.caption}</Form.Label>
                {col.editCellComponent ?
                 col.editCellComponent(generateEditCellProps(col)) :
                 <DefaultEditCell col={col} data={generateEditCellProps(col)}/>}
            </Form.Group>
        ))}
        <Button
            onClick={submit}
            disabled={isSubmitDisabled}
            variant="secondary"
        >
            Submit
        </Button>
        <Button
            onClick={close}
            variant="secondary"
        >
            Close
        </Button>
    </Form>;
};

export default RenderedEditingForm;