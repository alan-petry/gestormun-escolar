import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { Dias_letivosProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboDias_letivos () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<Dias_letivosProps>({DIA_CODIGO: 0, DIA_REGISTRODIARIO: "", DIA_DATA:0, DIA_PERIODOS:0,DI_TUR_CODIGO:0})
    const [lista, setLista] = useState<Dias_letivosProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.dias_letivos > 0) {
            if (context.dias_letivos !== aux_combo.DIA_CODIGO) {
                buscarCodigo(context.dias_letivos)
            }
        }
    }, [context.dias_letivos]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/dias_letivos/${codigo}`);
            await setaux_combo({ ...aux_combo, DIA_CODIGO: codigo, DIA_REGISTRODIARIO: response.data.DIA_REGISTRODIARIO })
            if (codigo !== context.dias_letivos) {
                context.alterDias_letivos(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, DIA_CODIGO: 0, DIA_REGISTRODIARIO: "" })
            const response = await api.post('/cadastros/dias_letivos_listar', { DIA_REGISTRODIARIO: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.DIA_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.DIA_REGISTRODIARIO) {
            let aux = aux_combo.DIA_REGISTRODIARIO;
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
        setaux_combo({ ...aux_combo, DIA_CODIGO: codigo, DIA_REGISTRODIARIO: nome })
        context.alterDias_letivos(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Dias_letivos</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="DIA_CODIGO" value={aux_combo.DIA_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="DIA_REGISTRODIARIO" value={aux_combo.DIA_REGISTRODIARIO} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Dias_letivos</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Dias_letivos</h4>
                            <Input name="DIA_REGISTRODIARIO" placeholder="Informe algo para consultar"
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
                                    <tr key={item.DIA_CODIGO} onClick={() => Selecionar(item.DIA_CODIGO, item.DIA_REGISTRODIARIO)} >
                                        <td>{item.DIA_CODIGO}</td>
                                        <td>{item.DIA_REGISTRODIARIO}</td>
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

