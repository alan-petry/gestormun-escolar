import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '../../services/api';
import { Link, withRouter } from 'react-router-dom';
import { GlobalContext } from '../../contexts/context';
import * as yup from 'yup';
import { Form } from '@unform/web'
import Input from '../Form/Input';
import TextArea from '../Form/TextArea';
import Select from '../Form/Select';
// import { useSnackbar } from 'notistack';
import Datas from '../diversos/datas';
import { DatetimeToJSDate, DateJSToDatetime } from '../../functions/functions';
import ComboCidade from '../cidade/combo_cidade';
import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Label,
    FormGroup,
    // Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";

function FormAluno(props) {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [aluno, setaluno] = useState([]);
    const [aux_data, setaux_data] = useState();
    // const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        async function loadaluno(busca) {
            if (busca > 0) {
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

    // const { enqueueSnackbar } = useSnackbar();

    // function mensagemPersonalizada(msg, variant) {
    //     // variant could be success, error, warning, info, or default
    //     enqueueSnackbar(msg, { variant });
    // };

    async function handleSubmit(data) {
        // console.log(data);

        var aux_validar;
        const errorMessages = {};
        aux_validar = true;
        try {
            formRef.current.setErrors({}); //limpar as mensagens de erros
            const validations = yup.object().shape({
                ALU_NOME: yup.string().required('Campo obrigatório').min(3, "Informe coretamente").max(100, 'Máximo 100 caracteres'),
                // CID_CODIGO: yup.number().required('Campo obrigat�rio').min(1),
            });
            await validations.validate(data, {
                abortEarly: false,
            })

            if ((aux_data === null) || (aux_data === undefined) || (aux_data === "")) {
                aux_validar = false;
                // mensagemPersonalizada('Informe corretamente a data', "warning");
            } else {
                data.ALU_NASCIMENTO = DateJSToDatetime(aux_data);
            }

            if ((context.cidade === null) || (context.cidade === "0")) {
                aux_validar = false;
                // mensagemPersonalizada('Informe corretamente', "warning");
            } else {
                data.CID_CODIGO = context.cidade;
            }

            if (aux_validar === false) {
                // mensagemPersonalizada('Verifique os campos com erro de preenchimento', 'error')
            } else {
                try {
                    await api.post('/cadastros/aluno', data);
                    props.history.push(`/admin/aluno/${data.ALU_CODIGO}`);
                    // mensagemPersonalizada("Salvo com sucesso" , "success")
                } catch (erro) {
                    // mensagemPersonalizada("Erro ao realizar o cadastro" , "error")
                }
            }



        } catch (err) {

            if (err instanceof yup.ValidationError) {

                err.inner.forEach(error => {
                    errorMessages[error.path] = error.message;
                })

                formRef.current.setErrors(errorMessages);
                // mensagemPersonalizada("Verifique o preenchimento dos campos", "error");
            }
        }
    }

    const sim_nao = [{ value: "S", descricao: 'Sim' },
    { value: "N", descricao: 'Nao' },];

    const situacao = [{ value: "normal", descricao: 'Normal' },
    { value: "transferido", descricao: 'Transferido' },
    { value: "bloqueado", descricao: 'Bloqueado' },];

    return (
        <div className="content">
            {/* {dialog.alert} */}
            <Row>
            <Col lg="12" md="12" sm="12">
                    <Form ref={formRef} onSubmit={handleSubmit} className="form__group" >
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Editar Aluno</CardTitle>
                            </CardHeader>
                            <CardBody>





                                <Input name="ALU_CODIGO" label="Código" disabled />
                                <ComboCidade />
                                <Input name="ALU_NOME" label="Nome" />
                                <Input name="ALU_ENDERECO" label="Endereço" />
                                {/* <Datas name="AUX_DATA" label="Data de nascimento " selected={aux_data} onChange={date => setaux_data(date)} /> */}
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
