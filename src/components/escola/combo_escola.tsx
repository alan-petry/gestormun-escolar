import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { EscolaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboEscola () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<EscolaProps>({ESC_CODIGO: 0, ESC_NOME: ''});
    const [lista, setLista] = useState<EscolaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.escola > 0) {
            if (context.escola !== aux_combo.ESC_CODIGO) {
                buscarCodigo(context.escola)
            }
        }
    }, [context.escola]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/escola/${codigo}`);
            await setaux_combo({ ...aux_combo, ESC_CODIGO: codigo, ESC_NOME: response.data.ESC_NOME })
            if (codigo !== context.escola) {
                context.alterEscola(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, ESC_CODIGO: 0, ESC_NOME: "" })
            const response = await api.post('/cadastros/escola_listar', { ESC_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.ESC_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.ESC_NOME) {
            let aux = aux_combo.ESC_NOME;
            if (aux.length > 2)
            {
            clearTimeout(timer);
            setTimer(setTimeout(function () {
                buscarNome(aux)
            }, 1000) as unknown as number);
            }
        }
    }

    function Selecionar(codigo: number, nome: string) {
        setaux_combo({ ...aux_combo, ESC_CODIGO: codigo, ESC_NOME: nome })
        context.alterEscola(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Escola</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="ESC_CODIGO" value={aux_combo.ESC_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="ESC_NOME" value={aux_combo.ESC_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Escola</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Escola</h4>
                            <Input name="ESC_NOME" placeholder="Informe algo para consultar"
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
                                    <tr key={item.ESC_CODIGO} onClick={() => Selecionar(item.ESC_CODIGO, item.ESC_NOME)} >
                                        <td>{item.ESC_CODIGO}</td>
                                        <td>{item.ESC_NOME}</td>
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

