import React, { useState, useContext } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../contexts/context';
import api from '../../services/api';
import { Dias_letivosProps } from '../diversos/interfaces';
import { DialogProps } from 'components/diversos/interfaces';
import {SuccessAlert, ErrorAlert, InfoAlert, ConfirmationAlert} from 'functions/functions';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useEffect } from 'react';

interface AlertProps {
  alert : JSX.Element | null,
}

export default function Dias_letivosList () {
    const context = useContext(GlobalContext);
    const history = useHistory();
    const [lista, setLista] = useState<Dias_letivosProps[]>([]);
    const [filtro, setFiltro] = useState<Dias_letivosProps>({DIA_CODIGO: 0, DIA_REGISTRODIARIO: "", DIA_DATA:0, DIA_PERIODOS:0,DI_TUR_CODIGO:context.v_disciplinas_turma.codigo})
    const [dialog, setDialog] = useState<AlertProps>({alert: null});

  function hideDialog () {
    setDialog({ alert: null });
  };
  function onConfirmation (id?: number){
    //function to be performed after confirmation of the dialog
    handleDelete(id);
    hideDialog();
  }
  function showDialog(props: DialogProps){
    switch(props.type){
        case 'success' :
            return setDialog({alert: SuccessAlert({
                onCancel:hideDialog, 
                onConfirm:hideDialog,
                title: props.title,
                text: props.msg})})
        case 'error' :
            return setDialog({alert: ErrorAlert({
                onCancel:hideDialog, 
                onConfirm:hideDialog,
                title: props.title,
                text: props.msg})})
        case 'confirmation' :
            return setDialog({alert: ConfirmationAlert({
                onCancel:hideDialog, 
                onConfirm:()=>onConfirmation(props.id),
                title: props.title,
                text: props.msg,
                confirmBtnText:props.confirmBtnText,
                cancelBtnText: props.cancelBtnText,
                })})
        default :
            return setDialog({alert: InfoAlert({
                onCancel:hideDialog, 
                onConfirm:hideDialog,
                title: props.title,
                text: props.msg})})
    }
} 

    useEffect(() => {
      getLista();
    }, []);

    async function getLista(){
          try {
              const response = await api.post('/cadastros/dias_letivos_listar', {DI_TUR_CODIGO: context.v_disciplinas_turma.codigo});
              await setLista(response.data);
              // setaux_data(DatetimeToJSDate(response.data[0].DIA_DATA));
          } catch (error) {
            showDialog({type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...'});
          }
  }

    function novoRegistro(){
      
      history.push(`/admin/dias_letivos_new`);
    }
    function handleSelect(id: number, periodos: number){
      context.alterDias_letivos(id);
      context.alterAux(periodos);
      history.push(`/admin/dias_letivos_edit/${id}`);
    }

    async function handleDelete(id?: number){
      try {
          console.log(`delete ${id}`);
          await api.delete(`/cadastros/dias_letivos/${id}`);
          getLista();
          showDialog({type: 'success', title: 'Informacao', msg: 'Registro excluido com sucesso'});
      } catch (erro) {
          showDialog({type: 'error', title: 'Erro', msg: 'Erro ao excluir o registro'});
      }
  }

  return (
    <div className="content">
      {dialog.alert}
      <Row>
        <Col lg="12" md="12" sm="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Dias Letivos</CardTitle>
              <Input className='form-control' name="DIA_REGISTRODIARIO"
                placeholder="Informe algo para consultar"
                onChange={event => setFiltro({ ...filtro, DIA_REGISTRODIARIO: event.target.value })}></Input>
              <Button className="btn btn-success" onClick={getLista}>Filtrar dados</Button>
              {'  '}
              <Button className="btn btn-primary" onClick={novoRegistro}>Novo</Button>
              {/* <Link to={'/admin/dias_letivos_new'} className="btn btn-primary">Novo</Link> */}
            </CardHeader>
            <CardBody>
              {lista.length > 0 ?
                <>
                  <br></br>
                  <Table >
                    <thead className="text-primary">
                      <tr>
                        <th>Data</th>
                        <th>Períodos</th>
                        {/* <th>Registro Diário</th> */}
                        {/* <th>Job Position</th> */}
                        {/* <th className="text-center">Since</th> */}
                        {/* <th className="text-right">Salary</th> */}
                        <th className="text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                    {lista.map(item => (
                      <tr>
                        <td onClick={() => handleSelect(item.DIA_CODIGO, item.DIA_PERIODOS)} >{item.AUX_DATA}</td>
                        <td onClick={() => handleSelect(item.DIA_CODIGO, item.DIA_PERIODOS)} >{item.DIA_PERIODOS}</td>
                        {/* <td>{item.DIA_REGISTRODIARIO}</td> */}
                        <td className="text-right">
                          <Button
                            className="btn-icon"
                            color="danger"
                            size="sm"
                            type="button"
                            onClick={() => showDialog({
                              type:'confirmation',
                              msg:'Deseja excluir o registro do dia: ' + item.AUX_DATA,
                              title: 'Confirmacao',
                              cancelBtnText: 'Cancelar',
                              confirmBtnText: 'Confirmar',
                              id: item.DIA_CODIGO
                            })} 
                          >
                            <i className="fa fa-times" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                </>
                : <h5>Nenhum registro encontrado</h5>
              }
            </CardBody>
            <CardFooter>
              {/* <h4>Rodap�</h4> */}
            </CardFooter>
          </Card>
        </Col>
      </Row>

    </div>
  )
}

