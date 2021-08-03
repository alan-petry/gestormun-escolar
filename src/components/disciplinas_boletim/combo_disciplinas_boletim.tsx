import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { Disciplinas_boletimProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboDisciplinas_boletim () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<Disciplinas_boletimProps>({DI_BOL_CODIGO: 0, BOL_CODIGO: ""})
    const [lista, setLista] = useState<Disciplinas_boletimProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.disciplinas_boletim > 0) {
            if (context.disciplinas_boletim !== aux_combo.DI_BOL_CODIGO) {
                buscarCodigo(context.disciplinas_boletim)
            }
        }
    }, [context.disciplinas_boletim]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/disciplinas_boletim/${codigo}`);
            await setaux_combo({ ...aux_combo, DI_BOL_CODIGO: codigo, BOL_CODIGO: response.data.BOL_CODIGO })
            if (codigo !== context.disciplinas_boletim) {
                context.alterDisciplinas_boletim(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, DI_BOL_CODIGO: 0, BOL_CODIGO: "" })
            const response = await api.post('/cadastros/disciplinas_boletim_listar', { BOL_CODIGO: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.DI_BOL_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.BOL_CODIGO) {
            let aux = aux_combo.BOL_CODIGO;
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
        setaux_combo({ ...aux_combo, DI_BOL_CODIGO: codigo, BOL_CODIGO: nome })
        context.alterDisciplinas_boletim(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Disciplinas_boletim</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="DI_BOL_CODIGO" value={aux_combo.DI_BOL_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="BOL_CODIGO" value={aux_combo.BOL_CODIGO} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Disciplinas_boletim</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Disciplinas_boletim</h4>
                            <Input name="BOL_CODIGO" placeholder="Informe algo para consultar"
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
                                    <tr key={item.DI_BOL_CODIGO} onClick={() => Selecionar(item.DI_BOL_CODIGO, item.BOL_CODIGO)} >
                                        <td>{item.DI_BOL_CODIGO}</td>
                                        <td>{item.BOL_CODIGO}</td>
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

