import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { GlobalContext } from 'contexts/context';
import api from 'services/api';
import * as yup from 'yup';
import { Form } from '@unform/web'
import Input from '../Form/Input';
import TextArea from '../Form/TextArea';
import Select from '../Form/Select';
import {SuccessAlert, ErrorAlert, InfoAlert, ConfirmationAlert} from 'functions/functions';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import Datas from '../diversos/datas';
import { DatetimeToJSDate, DateJSToDatetime } from 'functions/functions';
import V_dias_letivos_presencasList from '../v_dias_letivos_presencas/list';



const FormDias_letivos = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [dias_letivos, setdias_letivos] = useState([]);
    const [dialog, setDialog] = useState({alert: null});
    const [aux_data, setaux_data] = useState();

    useEffect(() => {
        async function loaddias_letivos(busca) {
            
            if (busca > 0){
            const response = await api.get(`/cadastros/dias_letivos/${busca}`);
            await setdias_letivos(response.data);
            formRef.current.setData(response.data);

            setaux_data(DatetimeToJSDate(response.data.DIA_DATA));
        } else {
            setaux_data(new Date());
            setdias_letivos({DIA_PERIODOS: 1});
        }
        }
        loaddias_letivos(props.match.params.DIA_CODIGO);
    }, []);

    function hideDialog () {
        setDialog({ alert: null });
    };
    function onConfirmation (){
        //function to be performed after confirmation of the dialog
        console.log('Confirmation selected');
        hideDialog();
    }
    function showDialog(type, msg, title, confirmBtnText, cancelBtnText){
        switch(type){
            case 'success' :
                return setDialog({alert: SuccessAlert({
                    onCancel:hideDialog, 
                    onConfirm:hideDialog,
                    title: title,
                    text: msg})})
            case 'error' :
                return setDialog({alert: ErrorAlert({
                    onCancel:hideDialog, 
                    onConfirm:hideDialog,
                    title: title,
                    text: msg})})
            case 'confirmation' :
                return setDialog({alert: ConfirmationAlert({
                    onCancel:hideDialog, 
                    onConfirm:onConfirmation,
                    title: title,
                    text: msg,
                    confirmBtnText: confirmBtnText,
                    cancelBtnText: cancelBtnText,
                    })})
            default :
                return setDialog({alert: InfoAlert({
                    onCancel:hideDialog, 
                    onConfirm:hideDialog,
                    title: title,
                    text: msg})})
        }
    }    

    async function handleSubmit(data) {
        // console.log(data);
        var aux_validar;
        const errorMessages = {};
        aux_validar = true;
        try
        {
            data.DI_TUR_CODIGO = context.v_disciplinas_turma.codigo;
            data.PROFESSOR = context.usuarioLogado.codigo_professor;
            
            formRef.current.setErrors({}); //limpar as mensagens de erros
            const validations = yup.object().shape({
                DIA_PERIODOS: yup.number().required('Campo obrigatorio').min(1, "Mínimo 1 período").max(5, 'Máximo 5 períodos'),
                // CID_CODIGO: yup.number().required('Campo obrigat�rio').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if ((aux_data === null) || (aux_data === undefined) || (aux_data === "")){
                aux_validar = false;
                showDialog('error', 'Informe corretamente a data', 'Erro');
            } else {
                data.DIA_DATA = DateJSToDatetime(aux_data);
            }

            if (aux_validar === false){
                showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
            } else {
                try {
                    await api.post('/cadastros/dias_letivos', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/dias_letivos/${data.DIA_CODIGO}`);
                } catch (erro) { 
                    showDialog('error', 'Erro ao salvar os dados', 'Erro');
                } 
            }



    } catch (err) {
        
        if (err instanceof yup.ValidationError) {
    
            err.inner.forEach(error => {
                errorMessages[error.path] = error.message;
            })
    
            formRef.current.setErrors(errorMessages);
            showDialog('error', 'Verifique o preenchimento dos campos', 'Erro');
        } 
    }
    }
    const sim_nao = [{value: "S", descricao: 'Sim'},
                   {value: "N", descricao: 'Nao'},];
    return (
        <div className="content">
            {dialog.alert}
            <Row>
                <Col lg="12" md="12" sm="12">
                    <Form ref={formRef} onSubmit={handleSubmit} className="form__group" >
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Editar Dia Letivo</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="DIA_CODIGO" label="Código" disabled />
                                {/* <Input name="DI_TUR_CODIGO" label="Turma" disabled/> */}
                                <Datas name="AUX_DATA" label="Data: " selected={aux_data} onChange={date => setaux_data(date._d)} />
                                <Input name="DIA_PERIODOS" label="Períodos" />
                                <Input name="DIA_REGISTRODIARIO" label="Registro Diário" />

                {/* <Select
                    obrigatorio
                    label="CAMPO"
                    name="CAMPO"
                    selected={dias_letivos.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/dias_letivos')}>Voltar</Button>
                                </div>

                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
            <Row>
            <Col lg="12" md="12" sm="12">
                {dias_letivos.DIA_CODIGO > 0 &&
                    <div>
                        <V_dias_letivos_presencasList/>
                    </div>
                }                        
            </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormDias_letivos)
