import React, { useContext } from 'react';
import { parseISO, format } from 'date-fns';
import ReactBSAlert from "react-bootstrap-sweetalert";
import { GlobalContext } from 'contexts/context';





export function DateJSToDatetime(dt?: Date) {
    if ((dt !== undefined) && (dt !== null)) {
        // const firstDate = parseISO(dt);   // converte do formato "2020-07-25 00:00:00" para data em JS
        // const formattedDate = format(firstDate, 'dd/MM/yyyy');

        const formattedDate = format(dt, 'dd/MM/yyyy');
        return formattedDate;
        // const ano = dt.getFullYear();
        // const mes = dt.getMonth();
        // const dia = dt.getDate();
        // console.log(mes);
        // if (mes === 0){return (ano+'-01-'+dia);}
        // if (mes === 1){return (ano+'-02-'+dia);}
        // if (mes === 2){return (ano+'-03-'+dia);}
        // if (mes === 3){return (ano+'-04-'+dia);}
        // if (mes === 4){return (ano+'-05-'+dia);}
        // if (mes === 5){return (ano+'-06-'+dia);}
        // if (mes === 6){return (ano+'-07-'+dia);}
        // if (mes === 7){return (ano+'-08-'+dia);}
        // if (mes === 8){return (ano+'-09-'+dia);}
        // if (mes === 9){return (ano+'-10-'+dia);}
        // if (mes === 10){return (ano+'-11-'+dia);}
        // if (mes === 11){return (ano+'-12-'+dia);}
    }
}

export function DatetimeToJSDate(data?: number) {
    if (data !== undefined) {
        const aux = new Date((data - 25568) * 1000 * 24 * 60 * 60);
        return aux;
    } else { return "" }
}

export function ValidaToken() {
    // const getExpirationDate = (jwtToken?: string): number | null => {
    function getExpirationDate(jwtToken?: string): number | null {
        if (!jwtToken) {
            return null;
        }

        const jwt = JSON.parse(atob(jwtToken.split('.')[1]));
        // multiply by 1000 to convert seconds into milliseconds
        return jwt && jwt.exp && jwt.exp * 1000 || null;
    };
    // const isExpired = (exp?: number) => {
    function isExpired(exp: number) {
        // diminuir tempo referente ao fuso horário
        if ((Date.now() - 10800000) > exp) {
            return true;
        } else {
            return false;
        }
    };

    var isValid = false;

    try {
        var token = localStorage.getItem('app-token');
        if (!token) {
            isValid = false;
        } else {
            var aux = getExpirationDate(token);
            if (!aux) {
                isValid = false;
            } else {
                if (isExpired(aux)) {
                    isValid = false;
                } else {
                    console.log('Token válido');
                    isValid = true;
                }
            }
        }
    } catch (error) {
        console.log('Erro em ValidaToken')
        isValid = false;
    }
    return isValid;
}

interface AlertProps {
    onConfirm: (param: number) => void,
    onCancel: () => void,
    title?: string,
    text?: string,
    confirmBtnText?: string,
    cancelBtnText?: string,
}

export function InfoAlert(props: AlertProps) {
    return (
        <ReactBSAlert
            style={{ display: "block", marginTop: "-100px" }}
            title={props.title}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            confirmBtnBsStyle="info"
            btnSize=""
        >
            {props.text}
        </ReactBSAlert>
    )
}

export function SuccessAlert(props: AlertProps) {
    return (
        <ReactBSAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title={props.title}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            confirmBtnBsStyle="info"
            btnSize=""
        >
            {props.text}
        </ReactBSAlert>
    )
};
export function ErrorAlert(props: AlertProps) {
    return (
        <ReactBSAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            title={props.title}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            confirmBtnBsStyle="info"
            btnSize=""
        >
            {props.text}
        </ReactBSAlert>
    )
}
export function ConfirmationAlert(props: AlertProps) {
    return (
        <ReactBSAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title={props.title}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            confirmBtnBsStyle="info"
            cancelBtnBsStyle="danger"
            confirmBtnText={props.confirmBtnText}
            cancelBtnText={props.cancelBtnText}
            showCancel
            btnSize=""
        >
            {props.text}
        </ReactBSAlert>
    )
};