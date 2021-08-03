import React, { useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from 'contexts/context';
import api from 'services/api';
import { SuccessAlert, ErrorAlert, InfoAlert, ConfirmationAlert } from 'functions/functions';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
    Table,
    Input,
    Modal,
    Label,

} from "reactstrap";

import ComboDisciplinas_da_turma from 'components/disciplinas_da_turma/combo_disciplinas_da_turma';
import {TextareaAutosize} from '@material-ui/core';

export default function Boletim(props) {
    const context = useContext(GlobalContext);
    const formRef = useRef(null);
    const [disciplinas, setDisciplinas] = useState([]);
    const [boletim, setBoletim] = useState();
    const [boletimCompleto, setBoletimCompleto] = useState();
    const [disciplinas_boletim, setdisciplinas_boletim] = useState([]);
    const [disciplina_turma, setDisciplina_Turma] = useState([]);
    const [dialog, setDialog] = useState({ alert: null });
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        async function loadboletim(busca) {
            if (busca > 0) {
                const response = await api.get(`/cadastros/boletim/${busca}`);
                await setBoletim(response.data);
                getDisciplinas(busca);
            }
        }
        loadboletim(props.match.params.BOL_CODIGO);
    }, []);

    useEffect(() => {
        setdisciplinas_boletim({ ...disciplinas_boletim, DI_TUR_CODIGO: context.disciplinas_da_turma })
    }, [context.disciplinas_da_turma]);

    async function getDisciplinas(busca) {
        if (busca > 0) {
            try {
                const response = await api.post('/cadastros/v_boletins_listar', { BOL_CODIGO: busca });
                // console.log(response.data);
                await setDisciplinas(response.data);
                await setBoletimCompleto(response.data[0]);
                await context.alterTurma(response.data[0].TUR_CODIGO);
            } catch (error) {
                showDialog({ type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...' });
            }
        }
    }

    async function getDisciplina_Turma() {
        console.log(boletimCompleto.TUR_CODIGO)
        // if (turma > 0) {
        try {
            const response = await api.post('/cadastros/disciplinas_da_turma_view', { TUR_CODIGO: boletimCompleto.TUR_CODIGO });
            console.log(response.data);
            const itens = [];
            response.data.map(item => (
                itens.push({ value: item.DI_TUR_CODIGO, label: item.DISC_DESC + '-' + item.PRO_NOME })
            ))
            await setDisciplina_Turma(itens);
        } catch (error) {
            showDialog({ type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...' });
        }
        // }
    }

    function hideDialog() {
        setDialog({ alert: null });
    };
    function onConfirmation(id) {
        //function to be performed after confirmation of the dialog
        handleDelete(id);
        hideDialog();
    }
    function showDialog(props) {
        switch (props.type) {
            case 'success':
                return setDialog({
                    alert: SuccessAlert({
                        onCancel: hideDialog,
                        onConfirm: hideDialog,
                        title: props.title,
                        text: props.msg
                    })
                })
            case 'error':
                return setDialog({
                    alert: ErrorAlert({
                        onCancel: hideDialog,
                        onConfirm: hideDialog,
                        title: props.title,
                        text: props.msg
                    })
                })
            case 'confirmation':
                return setDialog({
                    alert: ConfirmationAlert({
                        onCancel: hideDialog,
                        onConfirm: () => onConfirmation(props.id),
                        title: props.title,
                        text: props.msg,
                        confirmBtnText: props.confirmBtnText,
                        cancelBtnText: props.cancelBtnText,
                    })
                })
            default:
                return setDialog({
                    alert: InfoAlert({
                        onCancel: hideDialog,
                        onConfirm: hideDialog,
                        title: props.title,
                        text: props.msg
                    })
                })
        }
    }

    async function handleSelect(id) {
        try {
            console.log(id)
            if (id > 0) {
                const response = await api.post('/cadastros/DISCIPLINAS_BOLETIM_listar', { DI_BOL_CODIGO: id });
                const aux_data = response.data[0];
                await setdisciplinas_boletim(aux_data);
                console.log(aux_data.DI_TUR_CODIGO);
                context.alterDisciplinas_da_turma(aux_data.DI_TUR_CODIGO);

                toggleModalDialog();
            }
        } catch (error) {
            showDialog({ type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...' });
        }
    }

    async function handleDelete(id) {
        // try {
        //     // console.log(`delete ${id}`);
        //     await api.delete(`/cadastros/matricula/${id}`);
        //     getMatriculas(turma.TUR_CODIGO);
        //     showDialog({type: 'success', title: 'Informacao', msg: 'Registro excluido com sucesso'});
        // } catch (erro) {
        //     showDialog({type: 'error', title: 'Erro', msg: 'Erro ao excluir o registro'});
        // }
    }

    async function handleAddMatricula() {
        // const data = {MAT_CODIGO: 0, TUR_CODIGO: turma.TUR_CODIGO, ALU_CODIGO: context.aluno, };
        // // console.log(data);
        // if ((context.aluno > 0)) {
        //     try {
        //         await api.post('/cadastros/matricula', data);
        //         showDialog( {type: 'success', title: 'Salvo com sucesso', msg: 'Informacao'});
        //         getMatriculas(turma.TUR_CODIGO);
        //         toggleModalDialog();
        //     } catch (erro) { 
        //         showDialog({ type: 'error', title: 'Erro', msg: 'Erro ao realizar a matrícula.' })
        //     } 
        // } else {showDialog({ type: 'error', title: 'Erro', msg: 'Selecione um aluno.' });}
    }

    async function handleSubmit() {
        console.log(disciplinas_boletim);
        // var aux_validar;
        // const errorMessages = {};
        // aux_validar = true;
        // try
        // {


        //     if ((context.disciplinas_da_turma === null) || (context.disciplinas_da_turma === "0") ){
        //         aux_validar = false;
        //         showDialog('error', 'Informe corretamente', 'Erro');
        //     } else {
        //         data.DI_TUR_CODIGO = context.disciplinas_da_turma;
        //     }

        //     if (aux_validar === false){
        //         showDialog('error', 'Verifique os campos com erro de preenchimento', 'Erro');
        //     } else {
        //         try {
        //             await api.post('/cadastros/disciplinas_boletim', data);
        //             showDialog('success', 'Salvo com sucesso', 'Informacao');
        //             // props.history.push(`/admin/disciplinas_boletim/${data.DI_BOL_CODIGO}`);
        //         } catch (erro) { 
        //             showDialog('error', 'Erro ao salvar os dados', 'Erro');
        //         } 
        //     }



        // } catch (err) {

        //     showDialog('error', 'Verifique o preenchimento dos campos', 'Erro');
        // } 
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div className="content">
            {dialog.alert}
            <Row>
                <Col lg="12" md="12" sm="12">
                    <Card>
                        <CardHeader>
                            {boletimCompleto &&
                                <>
                                    <CardTitle tag="h4">Boletim: {boletimCompleto.BOL_CODIGO} - {boletimCompleto.ALU_NOME}</CardTitle>
                                    <CardTitle tag="h5">Turma: {boletimCompleto.TUR_DESC} - {boletimCompleto.TUR_ANO}</CardTitle>
                                </>
                            }
                            <CardTitle tag="h5">Disciplinas:</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {disciplinas.length > 0 ?
                                <>
                                    <Table >
                                        <thead className="text-primary">
                                            <tr>
                                                {/* <th>Código</th> */}
                                                <th>Disciplina</th>
                                                <th>Nota1</th>
                                                <th>Nota2</th>
                                                <th>Faltas</th>
                                                <th>Média Anual</th>
                                                <th>Exame Final</th>
                                                <th>Média Final</th>
                                                <th>Resultado</th>
                                                {/* <th>Data</th> */}
                                                <th className="text-right">ACOES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disciplinas.map(item => (
                                                <tr key={item.DI_BOL_CODIGO}>
                                                    <td>{item.DISC_DESC}</td>
                                                    <td>{item.DI_BOL_NOTA1SEMESTRE}</td>
                                                    <td>{item.DI_BOL_NOTA2SEMESTRE}</td>
                                                    <td>{item.DI_BOL_TOTALFALTAS}</td>
                                                    <td>{item.DI_BOL_MEDIAANUAL}</td>
                                                    <td>{item.DI_BOL_RECUPERACAO}</td>
                                                    <td>{item.DI_BOL_MEDIAFINAL}</td>
                                                    <td>{item.DI_BOL_RESULTADO}</td>
                                                    {/* <td>{item.MAT_DATA}</td> */}
                                                    <td className="text-right">
                                                        <Button
                                                            className="btn-icon"
                                                            color="success"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => handleSelect(item.DI_BOL_CODIGO)}
                                                        >
                                                            <i className="fa fa-edit" />
                                                        </Button>
                                                        {" "}
                                                        <Button
                                                            className="btn-icon"
                                                            color="danger"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => showDialog({
                                                                type: 'confirmation',
                                                                msg: 'Deseja excluir o registro: ' + item.DISC_DESC,
                                                                title: 'Confirmacao',
                                                                cancelBtnText: 'Cancelar',
                                                                confirmBtnText: 'Confirmar',
                                                                id: item.DI_BOL_CODIGO
                                                            })}
                                                        >
                                                            <i className="fa fa-times" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                                : <h5>Nenhuma disciplina encontrada</h5>
                            }
                        </CardBody>
                        <CardFooter>
                            {boletim &&
                                <>
                                    <CardTitle tag="h5">Parecer:</CardTitle>
                                    <p>
                                        {boletim.BOL_PARECER}
                                    </p>
                                    <Button className="btn-round" color="info" >Gravar Parecer</Button>
                                    <h4>Edite o parecer no campo abaixo e após clique em gravar...</h4>
                                    <TextareaAutosize aria-label="minimum height" rowsMin={10} placeholder='Informe o parecer' className='form-control' 
                                        onChange={(event) => setBoletim({...boletim, BOL_PARECER: event.target.value})}>
                                        {boletim.BOL_PARECER}
                                    </TextareaAutosize>
                                </>
                            }
                            &nbsp;&nbsp;
                            {/* <Button className="btn-round" color="danger" outline onClick={() => props.history.push(`/admin/turma_edit/${props.match.params.TUR_CODIGO}`)}>Voltar</Button> */}
                        </CardFooter>
                    </Card>
                </Col>
            </Row>


            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                {/* <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Editar Disciplina do Boletim</h4>

                        </div>
                    </div>
                </div> */}
                <div className="modal-body">


                    {disciplinas_boletim &&
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Editar Disciplina do boletim</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Label>Código</Label>
                                    <Input className='form-control' name="DI_BOL_CODIGO"
                                        value={disciplinas_boletim.DI_BOL_CODIGO}
                                        placeholder="Informe o código" disabled ></Input>

                                    <ComboDisciplinas_da_turma />

                                    <Label>Nota 1</Label>
                                    <Input className='form-control' name="DI_BOL_NOTA1SEMESTRE"
                                        value={disciplinas_boletim.DI_BOL_NOTA1SEMESTRE}
                                        placeholder="Informe a Nota 1"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_NOTA1SEMESTRE: event.target.value })}></Input>

                                    <Label>Nota 2</Label>
                                    <Input className='form-control' name="DI_BOL_NOTA2SEMESTRE"
                                        value={disciplinas_boletim.DI_BOL_NOTA2SEMESTRE}
                                        placeholder="Informe a Nota 2"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_NOTA2SEMESTRE: event.target.value })}></Input>

                                    <Label>Total de Faltas</Label>
                                    <Input className='form-control' name="DI_BOL_TOTALFALTAS"
                                        value={disciplinas_boletim.DI_BOL_TOTALFALTAS}
                                        placeholder="Informe o Total de Faltas"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_TOTALFALTAS: event.target.value })}></Input>

                                    <Label>Média Anual</Label>
                                    <Input className='form-control' name="DI_BOL_MEDIAANUAL"
                                        value={disciplinas_boletim.DI_BOL_MEDIAANUAL}
                                        placeholder="Informe a Média Anual"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_MEDIAANUAL: event.target.value })}></Input>

                                    <Label>Exame Final</Label>
                                    <Input className='form-control' name="DI_BOL_RECUPERACAO"
                                        value={disciplinas_boletim.DI_BOL_RECUPERACAO}
                                        placeholder="Informe o Exame Final"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_RECUPERACAO: event.target.value })}></Input>

                                    <Label>Média Final</Label>
                                    <Input className='form-control' name="DI_BOL_MEDIAFINAL"
                                        value={disciplinas_boletim.DI_BOL_MEDIAFINAL}
                                        placeholder="Informe a Média Final"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_MEDIAFINAL: event.target.value })}></Input>

                                    <Label>Resultado</Label>
                                    <Input className='form-control' name="DI_BOL_RESULTADO"
                                        value={disciplinas_boletim.DI_BOL_RESULTADO}
                                        placeholder="Informe o Resultado"
                                        onChange={event => setdisciplinas_boletim({ ...disciplinas_boletim, DI_BOL_RESULTADO: event.target.value })}></Input>


                                    {/*                                 
                                <Input name="DI_BOL_NOTA1SEMESTRE" label="Nota 1"  />
                                <Input name="DI_BOL_NOTA2SEMESTRE" label="Nota 2" />
                                <Input name="DI_BOL_MEDIAANUAL" label="Média Anual" />
                                <Input name="DI_BOL_TOTALFALTAS" label="Total de Faltas" />
                                <Input name="DI_BOL_RECUPERACAO" label="Exame Final" />
                                <Input name="DI_BOL_MEDIAFINAL" label="Média Final" />
                                <Input name="DI_BOL_RESULTADO" label="Resultado" /> */}
                                </CardBody>
                                <CardFooter>
                                    <div className="row">
                                        <Button className="btn-round" color="info" onClick={handleSubmit}>Confirmar</Button>
                                    &nbsp;&nbsp;
                                    <Button className="btn-round" color="danger" outline onClick={() => toggleModalDialog()}>Voltar</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </>
                    }


                </div>

            </Modal>

        </div>
    )
}
