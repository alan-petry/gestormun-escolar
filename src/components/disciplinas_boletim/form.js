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
import ComboDisciplinas_da_turma from '../disciplinas_da_turma/combo_disciplinas_da_turma';

const FormDisciplinas_boletim = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [disciplinas_boletim, setdisciplinas_boletim] = useState([]);
    const [dialog, setDialog] = useState({alert: null});
    //const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        async function loaddisciplinas_boletim(busca) {
            if (busca > 0){
            const response = await api.get(`/cadastros/disciplinas_boletim/${busca}`);
            await setdisciplinas_boletim(response.data);
            formRef.current.setData(response.data);

            //await delay(300);
            context.alterDisciplinas_da_turma(response.data.DI_TUR_CODIGO);

        }
        }
        loaddisciplinas_boletim(props.match.params.DI_BOL_CODIGO);
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
                BOL_CODIGO: yup.string().required('Campo obrigatorio').min(3, "Informe coretamente").max(100, 'Maximo 100 caracteres'),
                // CID_CODIGO: yup.number().required('Campo obrigatório').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if ((context.disciplinas_da_turma === null) || (context.disciplinas_da_turma === "0") ){
                aux_validar = false;
                showDialog('error', 'Informe corretamente', 'Erro');
            } else {
                data.DI_TUR_CODIGO = context.disciplinas_da_turma;
            }

            if (aux_validar === false){
                showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
            } else {
                try {
                    await api.post('/cadastros/disciplinas_boletim', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/disciplinas_boletim/${data.DI_BOL_CODIGO}`);
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
                                <CardTitle tag="h4">Editar Disciplinas_boletim</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="DI_BOL_CODIGO" label="Codigo" disabled />
                                <Input name="BOL_CODIGO" label="BOL_CODIGO" />
                                <ComboDisciplinas_da_turma />
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
                    selected={disciplinas_boletim.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/disciplinas_boletim')}>Voltar</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormDisciplinas_boletim)
