import React from 'react';

const ComboAno = props => {
    return (
        <select className="custom-select"
            name={props.name}
            value={props.value}
            onChange={props.onChange}>
            <option key="" value={undefined} disabled hidden>Selecione um Ano</option>
            <option key="2020" value="2020">2020</option>
            <option key="2019" value="2019">2019</option>
            <option key="2018" value="2018">2018</option>
            <option key="2017" value="2017">2017</option>
            <option key="2016" value="2016">2016</option>
            <option key="2015" value="2015">2015</option>
            <option key="2014" value="2014">2014</option>
            <option key="2013" value="2013">2013</option>
            <option key="2012" value="2012">2012</option>
            <option key="2011" value="2011">2011</option>
            <option key="2010" value="2010">2010</option>
            <option key="2009" value="2009">2009</option>
            <option key="2008" value="2008">2008</option>
            <option key="2007" value="2007">2007</option>
            <option key="2006" value="2006">2006</option>
            <option key="2005" value="2005">2005</option>
            <option key="2004" value="2004">2004</option>
            <option key="2003" value="2003">2003</option>
            <option key="2002" value="2002">2002</option>
            <option key="2001" value="2001">2001</option>
            <option key="2000" value="2000">2000</option>
        </select>
    )
}

export default ComboAno;