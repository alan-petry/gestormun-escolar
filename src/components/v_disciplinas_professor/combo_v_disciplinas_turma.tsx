import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { V_disciplinas_turmaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboV_disciplinas_turma () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<V_disciplinas_turmaProps>({DI_TUR_CODIGO: 0, DISC_DESC: ""})
    const [lista, setLista] = useState<V_disciplinas_turmaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.v_disciplinas_turma.codigo > 0) {
            if (context.v_disciplinas_turma.codigo !== aux_combo.DI_TUR_CODIGO) {
                buscarCodigo(context.v_disciplinas_turma.codigo)
            }
        }
    }, [context.v_disciplinas_turma]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/v_disciplinas_turma/${codigo}`);
            await setaux_combo({ ...aux_combo, DI_TUR_CODIGO: codigo, DISC_DESC: response.data.DISC_DESC })
            if (codigo !== context.v_disciplinas_turma.codigo) {
                context.alterV_disciplinas_turma({codigo});
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, DI_TUR_CODIGO: 0, DISC_DESC: "" })
            const response = await api.post('/cadastros/v_disciplinas_turma_listar', { DISC_DESC: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.DI_TUR_CODIGO)
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
        setaux_combo({ ...aux_combo, DI_TUR_CODIGO: codigo, DISC_DESC: nome })
        context.alterV_disciplinas_turma({codigo});
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>V_disciplinas_turma</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="DI_TUR_CODIGO" value={aux_combo.DI_TUR_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="DISC_DESC" value={aux_combo.DISC_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar V_disciplinas_turma</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar V_disciplinas_turma</h4>
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
                                    <tr key={item.DI_TUR_CODIGO} onClick={() => Selecionar(item.DI_TUR_CODIGO, item.DISC_DESC)} >
                                        <td>{item.DI_TUR_CODIGO}</td>
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

