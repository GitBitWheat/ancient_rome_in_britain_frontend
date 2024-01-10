import { useState } from 'react';
import { Typeahead, TypeaheadInputMulti } from 'react-bootstrap-typeahead';
import { Badge } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import './combobox.css';

const Token = ({ option, removeToken, children }) => {
    return (
        <Badge bg='secondary'>
            {children}
            <X onClick={() => removeToken(option)}/>
        </Badge>
    );
};

export const ControlledMultiComboBox = ({ options, onSelect, labelKey = val => `${val}`, selected,
    width = null, placeholder = '', className, typeaheadId }) => {

    const onChange = selectionArr => {
        onSelect(selectionArr);
    };

    const removeToken = option => {
        const newSelected = selected.filter(token => option !== token);
        onSelect(newSelected);
    };

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

    const style = { display: 'inline-block' };
    if (width) {
        style.width = width;
    }

    const renderInput = (inputProps, _props) => (
        <TypeaheadInputMulti {...inputProps} selected={selected}>
            <div className='tokens-row'>
                {selected.map(option => (
                    <Token
                        key={labelKey(option)}
                        option={option}
                        removeToken={removeToken}
                    >
                        <span>{labelKey(option)}</span>
                    </Token>
                ))}
            </div>
        </TypeaheadInputMulti>
    );

    return (
        <Typeahead
            id={typeaheadId}
            style={style}
            placeholder={placeholder}
            labelKey={labelKey}
            options={options}
            onChange={onChange}
            {...extraProps}
            multiple
            renderInput={renderInput}
            selected={selected}
            onMenuToggle={menuToggleEventHandler}
        />
    );
};

export default ControlledMultiComboBox;