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
import ComboCidade from '../cidade/combo_cidade';

const FormEscola = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [escola, setescola] = useState([]);
    const [dialog, setDialog] = useState({alert: null});
    //const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        async function loadescola(busca) {
            if (busca > 0){
            const response = await api.get(`/cadastros/escola/${busca}`);
            await setescola(response.data);
            formRef.current.setData(response.data);

            //await delay(300);
            context.alterCidade(response.data.CID_CODIGO);

        }
        }
        loadescola(props.match.params.ESC_CODIGO);
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
                ESC_NOME: yup.string().required('Campo obrigatorio').min(3, "Informe coretamente").max(100, 'Maximo 100 caracteres'),
                // CID_CODIGO: yup.number().required('Campo obrigat�rio').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if ((context.cidade === null) || (context.cidade === "0") ){
                aux_validar = false;
                showDialog('error', 'Informe corretamente', 'Erro');
            } else {
                data.CID_CODIGO = context.cidade;
            }

            if (aux_validar === false){
                showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
            } else {
                try {
                    await api.post('/cadastros/escola', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/escola/${data.ESC_CODIGO}`);
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
                                <CardTitle tag="h4">Editar Escola</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="ESC_CODIGO" label="Codigo" disabled />
                                <Input name="ESC_NOME" label="Nome" />
                                <Input name="ESC_NOMEABREVIADO" label="Nome Abreviado" />
                                <Input name="ESC_ENDERECO" label="Endereço" />
                                <Input name="ESC_CEP" label="CEP" />
                                <ComboCidade />
                                <Input name="ESC_FONE" label="Fone" />
                                <Input name="ESC_LEMA" label="Lema" />
                                <Input name="ESC_INEP" label="INEP" />

                {/* <Select
                    obrigatorio
                    label="CAMPO"
                    name="CAMPO"
                    selected={escola.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/escola')}>Voltar</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormEscola)
