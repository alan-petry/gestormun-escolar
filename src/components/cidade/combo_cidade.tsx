import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { CidadeProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboCidade () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<CidadeProps>({CID_CODIGO: 0, CID_NOME: ""})
    const [lista, setLista] = useState<CidadeProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.cidade > 0) {
            if (context.cidade !== aux_combo.CID_CODIGO) {
                buscarCodigo(context.cidade)
            }
        }
    }, [context.cidade]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/cidade/${codigo}`);
            await setaux_combo({ ...aux_combo, CID_CODIGO: codigo, CID_NOME: response.data.CID_NOME })
            if (codigo !== context.cidade) {
                context.alterCidade(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, CID_CODIGO: 0, CID_NOME: "" })
            const response = await api.post('/cadastros/cidade_listar', { CID_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.CID_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.CID_NOME) {
            let aux = aux_combo.CID_NOME;
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
        setaux_combo({ ...aux_combo, CID_CODIGO: codigo, CID_NOME: nome })
        context.alterCidade(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Cidade</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="CID_CODIGO" value={aux_combo.CID_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="CID_NOME" value={aux_combo.CID_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Cidade</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Cidade</h4>
                            <Input name="CID_NOME" placeholder="Informe algo para consultar"
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
                                    <tr key={item.CID_CODIGO} onClick={() => Selecionar(item.CID_CODIGO, item.CID_NOME)} >
                                        <td>{item.CID_CODIGO}</td>
                                        <td>{item.CID_NOME}</td>
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

