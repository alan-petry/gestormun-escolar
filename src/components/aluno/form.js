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

import ComboCidade from '../cidade/combo_cidade';

const FormAluno = props => {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [aluno, setaluno] = useState([]);
    const [dialog, setDialog] = useState({alert: null});
    const [aux_data, setaux_data] = useState();
    //const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        async function loadaluno(busca) {
            if (busca > 0){
            const response = await api.get(`/cadastros/aluno/${busca}`);
            await setaluno(response.data);
            formRef.current.setData(response.data);

            //await delay(300);
            context.alterCidade(response.data.CID_CODIGO);

            setaux_data(DatetimeToJSDate(response.data.ALU_NASCIMENTO));
        }
        }
        loadaluno(props.match.params.ALU_CODIGO);
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
                // CID_CODIGO: yup.number().required('Campo obrigat�rio').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if ((aux_data === null) || (aux_data === undefined) || (aux_data === "")){
                aux_validar = false;
                showDialog('error', 'Informe corretamente a data', 'Erro');
            } else {
                data.ALU_NASCIMENTO = DateJSToDatetime(aux_data);
            }

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
                    await api.post('/cadastros/aluno', data);
                    showDialog('success', 'Salvo com sucesso', 'Informacao');
                    props.history.push(`/admin/aluno/${data.ALU_CODIGO}`);
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
    const situacao = [{ value: "normal", descricao: 'Normal' },
                   { value: "transferido", descricao: 'Transferido' },
                   { value: "bloqueado", descricao: 'Bloqueado' },];                   
    return (
        <div className="content">
            {dialog.alert}
            <Row>
                <Col lg="12" md="12" sm="12">
                    <Form ref={formRef} onSubmit={handleSubmit} className="form__group" >
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Editar Aluno</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input name="ALU_CODIGO" label="Código" disabled />
                                <Input name="ALU_NOME" label="Nome" />
                                <Input name="ALU_ENDERECO" label="Endereço" />
                                <ComboCidade />
                                <Datas name="AUX_DATA" label="Data de nascimento " selected={aux_data} onChange={date => setaux_data(date._d)}/>
                                <Input name="ALU_FONE" label="Fone:" />
                                <Select
                                    obrigatorio
                                    label="Situação"
                                    name="ALU_SITUACAO"
                                    selected={aluno.ALU_SITUACAO || ''}
                                    datasource={situacao} >
                                </Select>
                                <Input name="ALU_TRANSFERENCIA" label="Transferência" disabled />
                                <TextArea name="ALU_OBSERVACOES" label="Observações" />

                {/* <Select
                    obrigatorio
                    label="CAMPO"
                    name="CAMPO"
                    selected={aluno.CAMPO || ''}
                    datasource={sim_nao} >
                </Select> */}

                            </CardBody>
                            <CardFooter>
                                <div className="row">
                                    <Button className="btn-round" color="info" type="submit" onSubmit={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => props.history.push('/admin/aluno')}>Voltar</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
        )
    }

export default withRouter(FormAluno)
