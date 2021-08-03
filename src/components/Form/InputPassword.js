import React, { useEffect, useState, useRef } from 'react'
import { useField } from '@unform/core';

// Bootsrap
import {
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button,
    FormText
} from 'reactstrap';


// Styles
import './styles.css';

// Icones
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


export default function InputPassword({ name, label, obrigatorio = false, ...rest }) {

    const inputRef = useRef(null);
    const { fieldName, defaultValue = "", registerField, error } = useField(name);
    const [isVisibled, setIsVisibled] = useState(false);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value"
        });
    }, [fieldName, registerField]);

    return (
        <FormGroup >
            <Label for={fieldName}>{label} {obrigatorio && <span className="required">*</span>}</Label>
            <InputGroup>
                <input
                    className={error ? 'form-control is-invalid' : 'form-control'}
                    type={isVisibled ? 'text' : 'password'}
                    id={fieldName}
                    ref={inputRef}
                    defaultValue={defaultValue}
                    name={fieldName}
                    {...rest} />
                <InputGroupAddon addonType="append">
                    <InputGroupText>
                        <Button color="link" className="btn-group" onClick={() => setIsVisibled(!isVisibled)} >
                            {isVisibled ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </Button>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {error && <FormText color="danger">{error}</FormText>}

        </FormGroup>
    )
}