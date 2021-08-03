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
} from "reactstrap";
import Combo_disciplina from 'components/disciplina/combo_disciplina';
import Combo_professor from 'components/professor/combo_professor';

export default function Disciplina_da_Turma(props) {
    const context = useContext(GlobalContext);
    const [disciplina_turma, setDisciplina_Turma] = useState([]);
    const [turma, setTurma] = useState();
    const [dialog, setDialog] = useState({ alert: null });
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        async function loadturma(busca) {
            if (busca > 0) {
                const response = await api.get(`/cadastros/turma/${busca}`);
                await setTurma(response.data);

                getDisciplina_Turma(busca);
            }
        }
        loadturma(props.match.params.TUR_CODIGO);
    }, []);

    async function getDisciplina_Turma(turma) {
        if (turma > 0) {
            try {
                const response = await api.post('/cadastros/disciplinas_da_turma_view', { TUR_CODIGO: turma });
                // console.log(response.data);
                await setDisciplina_Turma(response.data);
            } catch (error) {
                showDialog({ type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...' });
            }
        }
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

    function handleSelect(id) {
        // history.push(`/admin/turma_edit/${id}`);
    }

    async function handleDelete(id){
        try {
            // console.log(`delete ${id}`);
            await api.delete(`/cadastros/disciplinas_da_turma/${id}`);
            getDisciplina_Turma(turma.TUR_CODIGO);
            showDialog({type: 'success', title: 'Informacao', msg: 'Registro excluido com sucesso'});
        } catch (erro) {
            showDialog({type: 'error', title: 'Erro', msg: 'Erro ao excluir o registro'});
        }
    }

    async function handleAddDisciplina() {
        const data = {DI_TUR_CODIGO: 0, TUR_CODIGO: turma.TUR_CODIGO, PRO_CODIGO: context.professor, DISC_CODIGO: context.disciplina};
        // console.log(data);
        if ((context.professor > 0) && (context.disciplina > 0)) {
            try {
                await api.post('/cadastros/disciplinas_da_turma', data);
                showDialog( {type: 'success', title: 'Salvo com sucesso', msg: 'Informacao'});
                getDisciplina_Turma(turma.TUR_CODIGO);
                toggleModalDialog();
            } catch (erro) { 
                showDialog({ type: 'error', title: 'Erro', msg: 'Erro ao cadastrar a disciplina.' })
            } 
        } else {showDialog({ type: 'error', title: 'Erro', msg: 'Selecione um professor e disciplina.' });}
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
                            {turma &&
                                <CardTitle tag="h5">Turma: {turma.TUR_DESC} - {turma.TUR_ANO}</CardTitle>
                            }
                            <h4>Disciplinas da Turma:</h4>
                        </CardHeader>
                        <CardBody>
                            {disciplina_turma.length > 0 ?
                                <>
                                    <Table >
                                        <thead className="text-primary">
                                            <tr>
                                                <th>Código</th>
                                                <th>Turma</th>
                                                <th>Disciplina</th>
                                                <th>Professor</th>
                                                <th className="text-right">ACOES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disciplina_turma.map(item => (
                                                <tr key={item.DI_TUR_CODIGO}>
                                                    <td>{item.DI_TUR_CODIGO}</td>
                                                    <td>{item.TUR_CODIGO}</td>
                                                    <td>{item.DISC_DESC}</td>
                                                    <td>{item.PRO_NOME}</td>
                                                    <td className="text-right">
                                                        <Button
                                                            className="btn-icon"
                                                            color="success"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => handleSelect(item.DI_TUR_CODIGO)}
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
                                                                msg: 'Deseja excluir o registro: ' + item.DI_TUR_CODIGO,
                                                                title: 'Confirmacao',
                                                                cancelBtnText: 'Cancelar',
                                                                confirmBtnText: 'Confirmar',
                                                                id: item.DI_TUR_CODIGO
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
                                : <h5>Nenhuma disciplina cadastrada</h5>
                            }
                        </CardBody>
                        <CardFooter>
                            <Button className="btn-round" color="info" onClick={toggleModalDialog}>Adicionar Disicplina</Button>
                            &nbsp;&nbsp;
                            <Button className="btn-round" color="danger" outline onClick={() => props.history.push(`/admin/turma_edit/${props.match.params.TUR_CODIGO}`)}>Voltar</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>


            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Adicionar Disciplina a turma</h4>

                        </div>
                    </div>
                </div>
                <div className="modal-body">
                    <Combo_disciplina />
                    <Combo_professor />

                </div>
                <div className='modal-footer'>
                    <Button className="btn-round" color="info" onClick={() => handleAddDisciplina()}>Cadastrar</Button>
                    &nbsp;&nbsp;
                    <Button className="btn-round" color="danger" outline onClick={() => toggleModalDialog()}>Voltar</Button>
                </div>
            </Modal>

        </div>
    )
}
