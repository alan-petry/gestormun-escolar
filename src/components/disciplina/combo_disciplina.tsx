import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { DisciplinaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboDisciplina () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<DisciplinaProps>({DISC_CODIGO: 0, DISC_DESC: ""})
    const [lista, setLista] = useState<DisciplinaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.disciplina > 0) {
            if (context.disciplina !== aux_combo.DISC_CODIGO) {
                buscarCodigo(context.disciplina)
            }
        }
    }, [context.disciplina]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/disciplina/${codigo}`);
            await setaux_combo({ ...aux_combo, DISC_CODIGO: codigo, DISC_DESC: response.data.DISC_DESC })
            if (codigo !== context.disciplina) {
                context.alterDisciplina(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, DISC_CODIGO: 0, DISC_DESC: "" })
            const response = await api.post('/cadastros/disciplina_listar', { DISC_DESC: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.DISC_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.DISC_DESC) {
            let aux = aux_combo.DISC_DESC;
            if (aux.length > 2)
            {
            clearTimeout(timer);
            setTimer(setTimeout(function () {
                buscarNome(aux)
            }, 1000) as unknown as number);
            }
        }
    }

    function Selecionar(codigo: number, nome?: string) {
        setaux_combo({ ...aux_combo, DISC_CODIGO: codigo, DISC_DESC: nome })
        context.alterDisciplina(codigo);
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
                        name="DISC_CODIGO" value={aux_combo.DISC_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="DISC_DESC" value={aux_combo.DISC_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Disciplina</Button>
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
                            <Input name="DISC_DESC" placeholder="Informe algo para consultar"
                                onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                                className="form-control" onKeyUp={keyUpNome} />
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
                                    <tr key={item.DISC_CODIGO} onClick={() => Selecionar(item.DISC_CODIGO, item.DISC_DESC)} >
                                        <td>{item.DISC_CODIGO}</td>
                                        <td>{item.DISC_DESC}</td>
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

