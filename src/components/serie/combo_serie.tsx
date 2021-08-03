import api from '../../services/api';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/context';
import { SerieProps } from '../diversos/interfaces';
import {
    Button,
    Input,
    Table,
    Row,
    Col,
    Modal,
} from "reactstrap";

export default function ComboSerie () {
    const context = useContext(GlobalContext);
    const [aux_combo, setaux_combo] = useState<SerieProps>({SER_CODIGO: 0, SER_DESC: ""})
    const [lista, setLista] = useState<SerieProps[]>([]);
    const [timer, setTimer] = useState(0);
    const [modalDialog, setModalDialog] = useState({ alert: false });

    useEffect(() => {
        if (context.serie > 0) {
            if (context.serie !== aux_combo.SER_CODIGO) {
                buscarCodigo(context.serie)
            }
        }
    }, [context.serie]);

    async function buscarCodigo(codigo: number) {
        if (codigo > 0) {
            const response = await api.get(`/cadastros/serie/${codigo}`);
            await setaux_combo({ ...aux_combo, SER_CODIGO: codigo, SER_DESC: response.data.SER_DESC })
            if (codigo !== context.serie) {
                context.alterSerie(codigo);
            }
        }
    }

    async function buscarNome(nome: string) {
        if (nome.length < 3) { 
            alert("Informe ao menos 3 caracteres para consultar") 
        } else {
            setaux_combo({ ...aux_combo, SER_CODIGO: 0, SER_DESC: "" })
            const response = await api.post('/cadastros/serie_listar', { SER_DESC: nome });
            setLista(response.data);
        }
    }

    function keyUpCodigo() {
        clearTimeout(timer);
        setTimer(setTimeout(function () {
            buscarCodigo(aux_combo.SER_CODIGO)
        }, 1000) as unknown as number);
    }

    function keyUpNome() {
        if (aux_combo.SER_DESC) {
            let aux = aux_combo.SER_DESC;
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
        setaux_combo({ ...aux_combo, SER_CODIGO: codigo, SER_DESC: nome })
        context.alterSerie(codigo);
        toggleModalDialog();
    }

    function toggleModalDialog() {
        setModalDialog({ alert: !modalDialog.alert });
    };

    return (
        <div>
            <Row>
                <Col lg="12" md="12" sm="12">
                    <label>Serie</label>
                    <Input type="number" style={{ width: '100px' }}
                        name="SER_CODIGO" value={aux_combo.SER_CODIGO}
                        onChange={event => (setaux_combo({ ...aux_combo, [event.target.name]: event.target.value }))}
                        placeholder="Codigo:" onKeyUp={keyUpCodigo} />
                    <Input name="SER_DESC" value={aux_combo.SER_DESC} label="Descricao" placeholder="Nenhum registro selecionado" disabled />
                    <Button type="button" className="btn btn-primary" onClick={toggleModalDialog} >Buscar Serie</Button>
                </Col>
            </Row>

            <Modal
                isOpen={modalDialog.alert}
                toggle={toggleModalDialog}
            >
                <div className="modal-header justify-content-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>Buscar Serie</h4>
                            <Input name="SER_DESC" placeholder="Informe algo para consultar"
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
                                    <tr key={item.SER_CODIGO} onClick={() => Selecionar(item.SER_CODIGO, item.SER_DESC)} >
                                        <td>{item.SER_CODIGO}</td>
                                        <td>{item.SER_DESC}</td>
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

