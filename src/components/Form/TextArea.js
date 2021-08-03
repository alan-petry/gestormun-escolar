import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core';
import './styles.css';



export default function Textarea({ name, label, obrigatorio = false, ...rest }) {

    const inputRef = useRef(null);  
    const { fieldName, defaultValue = "", registerField, error, clearError } = useField(name);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value"
        });
    }, [fieldName, registerField]);

    return (
        <div className="Form" >
            <label for={fieldName}>{label} {obrigatorio && <span className="required">*</span>}</label>
            <textarea
                id={fieldName}
                ref={inputRef}
                className={error ? 'form-control is-invalid' : 'form-control'}
                onFocus={clearError}
                defaultValue={defaultValue}
                name={fieldName}
                {...rest} />

            {error && <span color="danger">{error}</span>}
        </div>
    )
} 