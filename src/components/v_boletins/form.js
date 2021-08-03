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
const FormV_boletins = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [v_boletins, setv_boletins] = useState([]);
    const [dialog, setDialog] = useState({alert: null});

    useEffect(() => {
        async function loadv_boletins(busca) {
            if (busca > 0){
            const response = await api.get(`/cadastros/v_boletins/${busca}`);
            await setv_boletins(response.data);
            formRef.current.setData(response.data);

        }
        }
        loadv_boletins(props.match.params.BOL_CODIGO);
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
                ALU_NOME: yup.string().required('Campo obrigatorio').min(3, "Informe coretamente").max(100, 'Maximo 100 caracteres'),
                // CID_CODIGO: yup.number().required('Campo obrigatório').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if (aux_validar === false){
                showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
            } else {
                try {
                    await api.post('/cadastros/v_boletins', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/v_boletins/${data.BOL_CODIGO}`);
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
                                <CardTitle tag="h4">Editar V_boletins</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="BOL_CODIGO" label="Codigo" disabled />
                                <Input name="MAT_CODIGO" label="MAT_CODIGO" />
                                <Input name="BOL_PARECER" label="BOL_PARECER" />
                                <Input name="TUR_CODIGO" label="TUR_CODIGO" />
                                <Input name="TUR_ANO" label="TUR_ANO" />
                                <Input name="TUR_DESC" label="TUR_DESC" />
                                <Input name="ALU_NOME" label="ALU_NOME" />
                                <Input name="DISC_DESC" label="DISC_DESC" />
                                <Input name="DI_BOL_CODIGO" label="DI_BOL_CODIGO" />
                                <Input name="DI_TUR_CODIGO" label="DI_TUR_CODIGO" />
                                <Input name="DI_BOL_NOTA1SEMESTRE" label="DI_BOL_NOTA1SEMESTRE" />
                                <Input name="DI_BOL_NOTA2SEMESTRE" label="DI_BOL_NOTA2SEMESTRE" />
                                <Input name="DI_BOL_MEDIAANUAL" label="DI_BOL_MEDIAANUAL" />
                                <Input name="DI_BOL_TOTALFALTAS" label="DI_BOL_TOTALFALTAS" />
                                <Input name="DI_BOL_RECUPERACAO" label="DI_BOL_RECUPERACAO" />
                                <Input name="DI_BOL_MEDIAFINAL" label="DI_BOL_MEDIAFINAL" />
                                <Input name="DI_BOL_RESULTADO" label="DI_BOL_RESULTADO" />

                {/* <Select
                    obrigatorio
                    label="CAMPO"
                    name="CAMPO"
                    selected={v_boletins.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/v_boletins')}>Voltar</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormV_boletins)
