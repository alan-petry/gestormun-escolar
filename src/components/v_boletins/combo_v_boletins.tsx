import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { V_boletinsProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboV_boletins () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<V_boletinsProps>({BOL_CODIGO: 0, ALU_NOME: ""})
    const [lista, setLista] = useState<V_boletinsProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.v_boletins > 0) {
            if (context.v_boletins !== aux_combo.BOL_CODIGO) {
                buscarCodigo(context.v_boletins)
            }
        }
    }, [context.v_boletins]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/v_boletins/${codigo}`);
            await setaux_combo({ ...aux_combo, BOL_CODIGO: codigo, ALU_NOME: response.data.ALU_NOME })
            if (codigo !== context.v_boletins) {
                context.alterV_boletins(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, BOL_CODIGO: 0, ALU_NOME: "" })
            const response = await api.post('/cadastros/v_boletins_listar', { ALU_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.BOL_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.ALU_NOME) {
            let aux = aux_combo.ALU_NOME;
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
        setaux_combo({ ...aux_combo, BOL_CODIGO: codigo, ALU_NOME: nome })
        context.alterV_boletins(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>V_boletins</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="BOL_CODIGO" value={aux_combo.BOL_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="ALU_NOME" value={aux_combo.ALU_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar V_boletins</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar V_boletins</h4>
                            <Input name="ALU_NOME" placeholder="Informe algo para consultar"
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
                                    <tr key={item.BOL_CODIGO} onClick={() => Selecionar(item.BOL_CODIGO, item.ALU_NOME)} >
                                        <td>{item.BOL_CODIGO}</td>
                                        <td>{item.ALU_NOME}</td>
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

