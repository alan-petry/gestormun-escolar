import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { Disciplinas_da_turmaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboDisciplinas_da_turma () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<Disciplinas_da_turmaProps>({DI_TUR_CODIGO: 0})
    const [lista, setLista] = useState<Disciplinas_da_turmaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.disciplinas_da_turma > 0) {
            if (context.disciplinas_da_turma !== aux_combo.DI_TUR_CODIGO) {
                buscarCodigo(context.disciplinas_da_turma)
            }
        }
    }, [context.disciplinas_da_turma]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.post('/cadastros/DISCIPLINAS_DA_TURMA_View', { DI_TUR_CODIGO: codigo });
            console.log(response.data[0]);
            await setaux_combo({ ...aux_combo, DI_TUR_CODIGO: codigo, DISC_DESC: response.data[0].DISC_DESC+' - '+response.data[0].PRO_NOME})
            if (codigo !== context.disciplinas_da_turma) {
                context.alterDisciplinas_da_turma(codigo);
            }
        }
    }

    async function buscarDisciplina() {
        if (context.turma > 0) { 
            // setaux_combo({ ...aux_combo, DI_TUR_CODIGO: 0, DISC_DESC: ''})
            const response = await api.post('/cadastros/DISCIPLINAS_DA_TURMA_View', { TUR_CODIGO: context.turma });
            setLista(response.data);
            toggleModalDialog();
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.DI_TUR_CODIGO)
        }, 1000) as unknown as number);
    }

    function Selecionar(codigo: number, nome?: string) {
        setaux_combo({ ...aux_combo, DI_TUR_CODIGO: codigo,  DISC_DESC: nome})
        context.alterDisciplinas_da_turma(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Disciplina</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="DI_TUR_CODIGO" value={aux_combo.DI_TUR_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="DISC_DESC" value={aux_combo.DISC_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={buscarDisciplina}>Buscar Disciplina</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Disciplina</h4>
                            {/* <Input name="DI_TUR_CODIGO" placeholder="Informe algo para consultar"
                                onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                                className="form-control" onKeyUp={keyUpNome} /> */}
                        </div>
                    </div>
                </div>
                {lista.length > 0 ?
                    <div className="modal-body">
                        <Table >
                            <thead className="text-primary">
                                <tr>
                                    <th>Codigo</th>
                                    <th>Descricao</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(item => (
                                    <tr key={item.DI_TUR_CODIGO} onClick={() => Selecionar(item.DI_TUR_CODIGO, item.DISC_DESC+' - '+item.PRO_NOME)} >
                                        <td>{item.DI_TUR_CODIGO}</td>
                                        <td>{item.DISC_DESC+' - '+item.PRO_NOME}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    : <h5></h5>
                }
            </Modal>
        </div>
    )
}

