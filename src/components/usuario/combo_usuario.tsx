import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { UsuarioProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboUsuario () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<UsuarioProps>({USU_CODIGO: 0, USU_NOME: ""})
    const [lista, setLista] = useState<UsuarioProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.usuario > 0) {
            if (context.usuario !== aux_combo.USU_CODIGO) {
                buscarCodigo(context.usuario)
            }
        }
    }, [context.usuario]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/usuario/${codigo}`);
            await setaux_combo({ ...aux_combo, USU_CODIGO: codigo, USU_NOME: response.data.USU_NOME })
            if (codigo !== context.usuario) {
                context.alterUsuario(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, USU_CODIGO: 0, USU_NOME: "" })
            const response = await api.post('/cadastros/usuario_listar', { USU_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.USU_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.USU_NOME) {
            let aux = aux_combo.USU_NOME;
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
        setaux_combo({ ...aux_combo, USU_CODIGO: codigo, USU_NOME: nome })
        context.alterUsuario(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Usuario</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="USU_CODIGO" value={aux_combo.USU_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="USU_NOME" value={aux_combo.USU_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Usuario</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Usuario</h4>
                            <Input name="USU_NOME" placeholder="Informe algo para consultar"
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
                                    <tr key={item.USU_CODIGO} onClick={() => Selecionar(item.USU_CODIGO, item.USU_NOME)} >
                                        <td>{item.USU_CODIGO}</td>
                                        <td>{item.USU_NOME}</td>
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

