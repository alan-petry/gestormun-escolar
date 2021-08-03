import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { MatriculaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboMatricula () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<MatriculaProps>({MAT_CODIGO: 0, ALU_CODIGO: ""})
    const [lista, setLista] = useState<MatriculaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.matricula > 0) {
            if (context.matricula !== aux_combo.MAT_CODIGO) {
                buscarCodigo(context.matricula)
            }
        }
    }, [context.matricula]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/matricula/${codigo}`);
            await setaux_combo({ ...aux_combo, MAT_CODIGO: codigo, ALU_CODIGO: response.data.ALU_CODIGO })
            if (codigo !== context.matricula) {
                context.alterMatricula(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, MAT_CODIGO: 0, ALU_CODIGO: "" })
            const response = await api.post('/cadastros/matricula_listar', { ALU_CODIGO: nome });
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
        if (aux_combo.ALU_CODIGO) {
            let aux = aux_combo.ALU_CODIGO;
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
        setaux_combo({ ...aux_combo, MAT_CODIGO: codigo, ALU_CODIGO: nome })
        context.alterMatricula(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Matricula</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="MAT_CODIGO" value={aux_combo.MAT_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="ALU_CODIGO" value={aux_combo.ALU_CODIGO} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Matricula</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Matricula</h4>
                            <Input name="ALU_CODIGO" placeholder="Informe algo para consultar"
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
                                    <tr key={item.MAT_CODIGO} onClick={() => Selecionar(item.MAT_CODIGO, item.ALU_CODIGO)} >
                                        <td>{item.MAT_CODIGO}</td>
                                        <td>{item.ALU_CODIGO}</td>
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

