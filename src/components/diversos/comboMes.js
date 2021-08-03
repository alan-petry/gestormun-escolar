import React from 'react';

const ComboMes = props => {
    return (
        <select className="custom-select"
            name={props.name}
            value={props.value}
            onChange={props.onChange}>
            <option key="" value="" disabled hidden>Selecione um Mês</option>
            <option key='1' value="1">Janeiro</option>
            <option key='2' value="2">Fevereiro</option>
            <option key='3' value="3">Março</option>
            <option key='4' value="4">Abril</option>
            <option key='5' value="5">Maio</option>
            <option key='6' value="6">Junho</option>
            <option key='7' value="7">Julho</option>
            <option key='8' value="8">Agosto</option>
            <option key='9' value="9">Setembro</option>
            <option key='10' value="10">Outubro</option>
            <option key='11' value="11">Novembro</option>
            <option key='12' value="12">Dezembro</option>
        </select>
    )
}

export default ComboMes;