import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core';

import './styles.css';



export default function Select({ name, label, obrigatorio = false, selected, datasource = [], ...rest }) {

    const inputRef = useRef(null);
    const { fieldName, registerField, error, clearError } = useField(name);
 

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value"
        });
    }, [fieldName, registerField]);

    return (
        <div className='FormGroup' >
            <label for={fieldName}>{label} {obrigatorio && <span className="required">*</span>}</label>
            <select
                id={fieldName}
                ref={inputRef}
                className={`form-control ${error && 'form-control--has-error'}`}
                onFocus={clearError}
                name={fieldName}
                {...rest} >

                {datasource.map(function (item, i) {
                    return selected === item.value ? renderOptionSelected(item, i) : renderOption(item, i)
                })}
            </select>
            { error && <span style={{ color : '#f00' }}>{error}</span>}
        </div>
    )


    function renderOptionSelected(item, i) {
        return (
            <option
                selected="selected"
                key={"select-" + "-" + i}
                value={item.value} >
                {item.descricao}
            </option>
        );
    }

    function renderOption(item, i) {
        return (
            <option
                key={"select-" + "-" + i}
                value={item.value}>
                {item.descricao}
            </option>
        );
    }



} 