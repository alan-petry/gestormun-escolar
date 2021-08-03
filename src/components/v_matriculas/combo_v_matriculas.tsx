import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { V_matriculasProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboV_matriculas () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<V_matriculasProps>({MAT_CODIGO: 0, ALU_NOME: ""})
    const [lista, setLista] = useState<V_matriculasProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.v_matriculas > 0) {
            if (context.v_matriculas !== aux_combo.MAT_CODIGO) {
                buscarCodigo(context.v_matriculas)
            }
        }
    }, [context.v_matriculas]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/v_matriculas/${codigo}`);
            await setaux_combo({ ...aux_combo, MAT_CODIGO: codigo, ALU_NOME: response.data.ALU_NOME })
            if (codigo !== context.v_matriculas) {
                context.alterV_matriculas(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, MAT_CODIGO: 0, ALU_NOME: "" })
            const response = await api.post('/cadastros/v_matriculas_listar', { ALU_NOME: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.MAT_CODIGO)
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
        setaux_combo({ ...aux_combo, MAT_CODIGO: codigo, ALU_NOME: nome })
        context.alterV_matriculas(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>V_matriculas</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="MAT_CODIGO" value={aux_combo.MAT_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="ALU_NOME" value={aux_combo.ALU_NOME} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar V_matriculas</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar V_matriculas</h4>
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
                                    <tr key={item.MAT_CODIGO} onClick={() => Selecionar(item.MAT_CODIGO, item.ALU_NOME)} >
                                        <td>{item.MAT_CODIGO}</td>
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

