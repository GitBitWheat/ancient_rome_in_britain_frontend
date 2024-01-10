import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import './combobox.css';

export const ComboBox = ({ options, onSelect, labelKey = val => `${val}`, defaultSelected,
    noneSelectedValue = null, width = null, placeholder = '', className, typeaheadId }) => {

    const [open, setOpen] = useState(false);
    const menuToggleEventHandler = isOpen => {
        setOpen(isOpen);
    };

    const extraProps = {};

    const extraPropsClassName = [];
    if (className) {
        extraPropsClassName.push(className);
    }
    if (open) {
        extraPropsClassName.push('open-combo-box');
    }
    if (extraPropsClassName.length > 0) {
        extraProps.className = extraPropsClassName.join(' ');
    }

    if (defaultSelected) {
        extraProps.defaultSelected = [defaultSelected];
    }

    const style = { display: 'inline-block' };
    if (width) {
        style.width = width;
    }

    const onChange = selectionArr => {
        if (selectionArr.length !== 0) {
            onSelect(selectionArr[0]);
        } else {
            onSelect(noneSelectedValue);
        }
    };

    return (
        <Typeahead
            id={typeaheadId}
            style={style}
            placeholder={placeholder}
            labelKey={labelKey}
            options={options}
            onChange={onChange}
            onMenuToggle={menuToggleEventHandler}
            {...extraProps}
        />
    );
};

export default ComboBox;