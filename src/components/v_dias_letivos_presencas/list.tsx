import React, { useState, useContext } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../contexts/context';
import api from '../../services/api';
import { V_dias_letivos_presencasProps } from '../diversos/interfaces';
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

export default function V_dias_letivos_presencasList () {
    const context = useContext(GlobalContext);
    const history = useHistory();
    const [lista, setLista] = useState<V_dias_letivos_presencasProps[]>([]);
    const [filtro, setFiltro] = useState<V_dias_letivos_presencasProps>({DIAP_CODIGO : 0, DIA_CODIGO: 0, MAT_CODIGO: 0})
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
    useEffect (() => {
      getLista(context.dias_letivos);
    }, []);

    async function getLista(id: number){
          try {
              console.log('dia: '+context.dias_letivos);
              const response = await api.post(`/cadastros/dias_letivos_presencas_listar/${id}`);
              await setLista(response.data);
          } catch (error) {
            showDialog({type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...'});
          }
  }

    function handleSelect(id: number){
      history.push(`/admin/dias_letivos_presencas_edit/${id}`);
    }

    async function handleDelete(id?: number){
      try {
          console.log(`delete ${id}`);
          await api.delete(`/cadastros/dias_letivos_presencas/${id}`);
          getLista(context.dias_letivos);
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
              <CardTitle tag="h5">Chamada</CardTitle>
              {/* <Input className='form-control' name="ALU_NOME"
                placeholder="Informe algo para consultar"
                onChange={event => setFiltro({ ...filtro, ALU_NOME: event.target.value })}></Input>
              <Button className="btn btn-success" onClick={getLista}>Filtrar dados</Button>
              {'  '}<Link to={'/admin/v_dias_letivos_presencas_new'} className="btn btn-primary">Novo</Link> */}
            </CardHeader>
            <CardBody>
              {lista.length > 0 ?
                <>
                  <br></br>
                  <Table >
                    <thead className="text-primary">
                      <tr>
                        <th>Aluno</th>
                        {/* <th>Presença</th>
                        <th>Observações</th> */}
                        {/* <th>Job Position</th> */}
                        {/* <th className="text-center">Since</th> */}
                        {/* <th className="text-right">Salary</th> */}
                        {/* <th className="text-right">Ações</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {lista.map(item => (
                      <tr onClick={() => handleSelect(item.DIAP_CODIGO)}>
                        <td>{item.ALU_NOME}</td>
                        {/* <td>{item.DIAP_PRESENCA}</td>
                        <td>{item.DIAP_OBSERVACAO}</td> */}
                        {/* <td className="text-right">
                          <Button
                            className="btn-icon"
                            color="success"
                            size="sm"
                            type="button"
                            onClick={() => handleSelect(item.DIAP_CODIGO)} 
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          {" "}
                        </td> */}
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

