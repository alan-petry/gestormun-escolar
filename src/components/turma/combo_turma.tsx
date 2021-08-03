import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { TurmaProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboTurma () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<TurmaProps>({TUR_CODIGO: 0, TUR_ANO: ""})
    const [lista, setLista] = useState<TurmaProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.turma > 0) {
            if (context.turma !== aux_combo.TUR_CODIGO) {
                buscarCodigo(context.turma)
            }
        }
    }, [context.turma]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/turma/${codigo}`);
            await setaux_combo({ ...aux_combo, TUR_CODIGO: codigo, TUR_ANO: response.data.TUR_ANO, TUR_DESC: response.data.TUR_DESC+'-'+response.data.TUR_ANO })
            if (codigo !== context.turma) {
                context.alterTurma(codigo);
            }
        }
    }

    async function buscarAno(ano: string) {
        if (ano.length < 4) { 
            alert("Informe o ano corretamente") 
        } else {
            setaux_combo({ ...aux_combo, TUR_CODIGO: 0, TUR_ANO: ano, TUR_DESC: '' })
            const response = await api.post('/cadastros/turma_listar', { TUR_ANO: ano });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.TUR_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpAno() {
        if (aux_combo.TUR_ANO) {
            let aux = aux_combo.TUR_ANO;
            if (aux.length > 2)
            {
            clearTimeout(timer);
            setTimer(setTimeout(function () {
                buscarAno(aux)
            }, 1000) as unknown as number);
            }
        }
    }

    function Selecionar(codigo: number, nome?: string, ano?: string) {
        setaux_combo({ ...aux_combo, TUR_CODIGO: codigo, TUR_ANO: ano, TUR_DESC: (nome+'-'+ano)})
        context.alterTurma(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Turma</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="TUR_CODIGO" value={aux_combo.TUR_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="TUR_DESC" value={aux_combo.TUR_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Turma</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Turma</h4>
                            <Input name="TUR_ANO" placeholder="Informe o ano para consultar"
                                onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                                className="form-control" onKeyUp={keyUpAno} />
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
                                    <th>Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(item => (
                                    <tr key={item.TUR_CODIGO} onClick={() => Selecionar(item.TUR_CODIGO, item.TUR_DESC, item.TUR_ANO)} >
                                        <td>{item.TUR_CODIGO}</td>
                                        <td>{item.TUR_DESC}</td>
                                        <td>{item.TUR_ANO}</td>
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

