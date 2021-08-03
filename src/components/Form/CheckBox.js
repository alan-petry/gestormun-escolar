import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core';
import { Label, FormText } from 'reactstrap';
import './styles.css';



export default function Checkbox({ name, label, obrigatorio = false, ...rest }) {

    const inputRef = useRef(null);  
    const { fieldName, defaultChecked = false, registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value"
        });
    }, [fieldName, registerField]);

    return (
        <div className="custom-control custom-checkbox">
            <input
                type="checkbox"
                id={fieldName}
                ref={inputRef}
                className={error ? 'custom-control-input is-invalid' : 'custom-control-input'}
                onFocus={clearError}
                name={fieldName}
                defaultChecked={(defaultChecked ? 'checked' : '')}
                {...rest} />
                <Label className="custom-control-label" for={fieldName}>{label} {obrigatorio && <span className="required">*</span>}</Label>

            {error && <FormText color="danger">{error}</FormText>}
        </div>
    )
} 