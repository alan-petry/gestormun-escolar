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
const FormNivel_de_ensino = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [nivel_de_ensino, setnivel_de_ensino] = useState([]);
    const [dialog, setDialog] = useState({alert: null});

    useEffect(() => {
        async function loadnivel_de_ensino(busca) {
            if (busca > 0){
            const response = await api.get(`/cadastros/nivel_de_ensino/${busca}`);
            await setnivel_de_ensino(response.data);
            formRef.current.setData(response.data);

        }
        }
        loadnivel_de_ensino(props.match.params.NIV_CODIGO);
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
            formRef.current.setErrors({}); //limpar as mensagens de erros
            const validations = yup.object().shape({
                NIV_DESC: yup.string().required('Campo obrigatorio').min(3, "Informe coretamente").max(100, 'Maximo 100 caracteres'),
                // CID_CODIGO: yup.number().required('Campo obrigat?rio').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if (aux_validar === false){
                showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
            } else {
                try {
                    await api.post('/cadastros/nivel_de_ensino', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/nivel_de_ensino/${data.NIV_CODIGO}`);
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
                                <CardTitle tag="h4">Editar Nivel_de_ensino</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="NIV_CODIGO" label="Codigo" disabled />
                                <Input name="NIV_DESC" label="NIV_DESC" />

                {/* <Select
                    obrigatorio
                    label="CAMPO"
                    name="CAMPO"
                    selected={nivel_de_ensino.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/nivel_de_ensino')}>Voltar</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormNivel_de_ensino)
