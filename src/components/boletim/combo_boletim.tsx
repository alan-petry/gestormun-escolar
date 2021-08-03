import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { BoletimProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboBoletim () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<BoletimProps>({BOL_CODIGO: 0, BOL_PARECER: ""})
    const [lista, setLista] = useState<BoletimProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.boletim > 0) {
            if (context.boletim !== aux_combo.BOL_CODIGO) {
                buscarCodigo(context.boletim)
            }
        }
    }, [context.boletim]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/boletim/${codigo}`);
            await setaux_combo({ ...aux_combo, BOL_CODIGO: codigo, BOL_PARECER: response.data.BOL_PARECER })
            if (codigo !== context.boletim) {
                context.alterBoletim(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, BOL_CODIGO: 0, BOL_PARECER: "" })
            const response = await api.post('/cadastros/boletim_listar', { BOL_PARECER: nome });
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
        if (aux_combo.BOL_PARECER) {
            let aux = aux_combo.BOL_PARECER;
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
        setaux_combo({ ...aux_combo, BOL_CODIGO: codigo, BOL_PARECER: nome })
        context.alterBoletim(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Boletim</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="BOL_CODIGO" value={aux_combo.BOL_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="BOL_PARECER" value={aux_combo.BOL_PARECER} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Boletim</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Boletim</h4>
                            <Input name="BOL_PARECER" placeholder="Informe algo para consultar"
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
                                    <tr key={item.BOL_CODIGO} onClick={() => Selecionar(item.BOL_CODIGO, item.BOL_PARECER)} >
                                        <td>{item.BOL_CODIGO}</td>
                                        <td>{item.BOL_PARECER}</td>
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

