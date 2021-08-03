import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { Nivel_de_ensinoProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboNivel_de_ensino () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<Nivel_de_ensinoProps>({NIV_CODIGO: 0, NIV_DESC: ""})
    const [lista, setLista] = useState<Nivel_de_ensinoProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.nivel_de_ensino > 0) {
            if (context.nivel_de_ensino !== aux_combo.NIV_CODIGO) {
                buscarCodigo(context.nivel_de_ensino)
            }
        }
    }, [context.nivel_de_ensino]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/nivel_de_ensino/${codigo}`);
            await setaux_combo({ ...aux_combo, NIV_CODIGO: codigo, NIV_DESC: response.data.NIV_DESC })
            if (codigo !== context.nivel_de_ensino) {
                context.alterNivel_de_ensino(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, NIV_CODIGO: 0, NIV_DESC: "" })
            const response = await api.post('/cadastros/nivel_de_ensino_listar', { NIV_DESC: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.NIV_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.NIV_DESC) {
            let aux = aux_combo.NIV_DESC;
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
        setaux_combo({ ...aux_combo, NIV_CODIGO: codigo, NIV_DESC: nome })
        context.alterNivel_de_ensino(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Nivel_de_ensino</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="NIV_CODIGO" value={aux_combo.NIV_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="NIV_DESC" value={aux_combo.NIV_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Nivel_de_ensino</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Nivel_de_ensino</h4>
                            <Input name="NIV_DESC" placeholder="Informe algo para consultar"
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
                                    <tr key={item.NIV_CODIGO} onClick={() => Selecionar(item.NIV_CODIGO, item.NIV_DESC)} >
                                        <td>{item.NIV_CODIGO}</td>
                                        <td>{item.NIV_DESC}</td>
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

