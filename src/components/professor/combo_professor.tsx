import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { ProfessorProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboProfessor () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<ProfessorProps>({PRO_CODIGO: 0, PRO_NOME: ""})
    const [lista, setLista] = useState<ProfessorProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.professor > 0) {
            if (context.professor !== aux_combo.PRO_CODIGO) {
                buscarCodigo(context.professor)
            }
        }
    }, [context.professor]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/professor/${codigo}`);
            await setaux_combo({ ...aux_combo, PRO_CODIGO: codigo, PRO_NOME: response.data.PRO_NOME })
            if (codigo !== context.professor) {
                context.alterProfessor(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, PRO_CODIGO: 0, PRO_NOME: "" })
            const response = await api.post('/cadastros/professor_listar', { PRO_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.PRO_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.PRO_NOME) {
            let aux = aux_combo.PRO_NOME;
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
        setaux_combo({ ...aux_combo, PRO_CODIGO: codigo, PRO_NOME: nome })
        context.alterProfessor(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Professor</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="PRO_CODIGO" value={aux_combo.PRO_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="PRO_NOME" value={aux_combo.PRO_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Professor</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Professor</h4>
                            <Input name="PRO_NOME" placeholder="Informe algo para consultar"
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
                                    <tr key={item.PRO_CODIGO} onClick={() => Selecionar(item.PRO_CODIGO, item.PRO_NOME)} >
                                        <td>{item.PRO_CODIGO}</td>
                                        <td>{item.PRO_NOME}</td>
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

