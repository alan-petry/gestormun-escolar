import React, { useState, useContext, useEffect } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../contexts/context';
import api from '../../services/api';
import { V_disciplinas_turmaProps } from '../diversos/interfaces';
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

interface AlertProps {
  alert : JSX.Element | null,
}

export default function V_disciplinas_turmaList () {
    const context = useContext(GlobalContext);
    const history = useHistory();
    const [lista, setLista] = useState<V_disciplinas_turmaProps[]>([]);
    const [filtro, setFiltro] = useState<V_disciplinas_turmaProps>({DI_TUR_CODIGO : 0, DISC_DESC : ""})
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
    async function getLista(){
        try {
            // const response = await api.post('/cadastros/v_disciplinas_turma_listar', {DISC_DESC: filtro.DISC_DESC});
            const response = await api.post('/cadastros/v_disciplinas_turma_listar', {TUR_ANO: 2021, PRO_CODIGO: context.usuarioLogado.codigo_professor});
            await setLista(response.data);
        } catch (error) {
          showDialog({type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...'});
        }
    }
    getLista(); // poderia usar o getLista abaixo também, porém tem que tratar a quantidade de caracteres exigida.
  }, []);

    async function getLista(){
      if (filtro.DISC_DESC) {
        let aux = filtro.DISC_DESC;
        if (aux.length >= 3){
          try {
              // const response = await api.post('/cadastros/v_disciplinas_turma_listar', {DISC_DESC: filtro.DISC_DESC});
              const response = await api.post('/cadastros/v_disciplinas_turma_listar', {TUR_ANO: 2021, PRO_CODIGO: context.usuarioLogado.codigo_professor});
              await setLista(response.data);
          } catch (error) {
            showDialog({type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...'});
          }
      } else {showDialog({type: 'error', title: 'Erro', msg: 'Informe ao menos 3 caracteres para busca'});}
    } else { showDialog({type: 'error', title: 'Erro', msg: 'Informe ao menos 3 caracteres para busca'});}
  }

    function handleSelect(id: number, descricao?: string){
      context.alterV_disciplinas_turma({codigo: id, descricao: descricao});
      history.push(`/admin/menudisciplina`);
    }

    async function handleDelete(id?: number){
      try {
          console.log(`delete ${id}`);
          await api.delete(`/cadastros/v_disciplinas_turma/${id}`);
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
              <CardTitle tag="h5">Disciplinas do professor</CardTitle>
              {/* <Input className='form-control' name="DISC_DESC"
                placeholder="Informe algo para consultar"
                onChange={event => setFiltro({ ...filtro, DISC_DESC: event.target.value })}></Input>
              <Button className="btn btn-success" onClick={getLista}>Filtrar dados</Button>
              {'  '}<Link to={'/admin/v_disciplinas_turma_new'} className="btn btn-primary">Novo</Link> */}
            </CardHeader>
            <CardBody>
              {lista.length > 0 ?
                <>
                  <br></br>
                  <Table >
                    <thead className="text-primary">
                      <tr>
                        <th>Disciplina</th>
                        <th>Turma</th>
                        <th>Série</th>
                        {/* <th>Escola</th> */}
                        {/* <th>Job Position</th> */}
                        {/* <th className="text-center">Since</th> */}
                        {/* <th className="text-right">Salary</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {lista.map(item => (
                      <tr onClick={() => handleSelect(item.DI_TUR_CODIGO, item.DISC_DESC+' - '+item.TUR_DESC)} >
                        <td>{item.DISC_DESC+' - '+item.ESC_NOME}</td>
                        <td>{item.TUR_DESC}</td>
                        <td>{item.SER_DESC}</td>
                        {/* <td>{item.ESC_NOME}</td> */}
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

