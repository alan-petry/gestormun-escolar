import React from 'react';

import DatePicker from "react-datepicker";
import ReactDatetime from "react-datetime";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import moment from 'moment';
import 'moment/locale/pt-br';

registerLocale('ptBR', ptBR)
function Datas(props) {
    return (
        <>
            <label>{props.label}</label>
            <br></br>
            {/* <DatePicker 
                className="form-control"
                name={props.name}
                dateFormat="dd/MM/yyyy"
                selected={props.selected}
                onChange={props.onChange}
                placeholderText="Informe a data"
                locale={ptBR}
                todayButton="Hoje"
                /> */}
            <ReactDatetime className='col-lg-3 md-3 sm-12'         
                name={props.name}
                onChange={props.onChange}
                value={new Date(props.selected)}
                selected={props.selected}
                inputProps={{
                    className: "form-control",
                    placeholder: "Informe a data",
                }}
                timeFormat={false}
                locale='pt-br'
                todayButton="Hoje"
                />
        </>
    )
}

export default Datas