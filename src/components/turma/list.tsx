import React, { useState, useContext } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../contexts/context';
import api from '../../services/api';
import { TurmaProps } from '../diversos/interfaces';
import { DialogProps } from 'components/diversos/interfaces';
import {SuccessAlert, ErrorAlert, InfoAlert, ConfirmationAlert} from 'functions/functions';
import Select from "react-select";
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

export default function TurmaList () {
    const context = useContext(GlobalContext);
    const history = useHistory();
    const [lista, setLista] = useState<TurmaProps[]>([]);
    const [filtro, setFiltro] = useState<TurmaProps>({TUR_CODIGO : 0, TUR_DESC : "", TUR_ANO: '2021'})
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

    async function getLista(){
      if (filtro.TUR_ANO) {
          try {
              const response = await api.post('/cadastros/turma_listar', {TUR_ANO: filtro.TUR_ANO});
              await setLista(response.data);
          } catch (error) {
            showDialog({type: 'error', title: 'Erro', msg: 'Erro na busca de dados do servidor...'});
          }
    } else { showDialog({type: 'error', title: 'Erro', msg: 'Informe o ano para busca'});}
  }

    function handleSelect(id: number){
      history.push(`/admin/turma_edit/${id}`);
    }

    async function handleDelete(id?: number){
      try {
          console.log(`delete ${id}`);
          await api.delete(`/cadastros/turma/${id}`);
          getLista();
          showDialog({type: 'success', title: 'Informacao', msg: 'Registro excluido com sucesso'});
      } catch (erro) {
          showDialog({type: 'error', title: 'Erro', msg: 'Erro ao excluir o registro'});
      }
  }
  const anos = [
    {value: "2021", label: '2021'},
    {value: "2020", label: '2020'},
    {value: "2019", label: '2019'},
    {value: "2018", label: '2018'},
    {value: "2017", label: '2017'},
    {value: "2016", label: '2016'},
    {value: "2015", label: '2015'},
    {value: "2014", label: '2014'},
    {value: "2013", label: '2013'},
    {value: "2012", label: '2012'},
    {value: "2011", label: '2011'},
  ];

  return (
    <div className="content">
      {dialog.alert}
      <Row>
        <Col lg="12" md="12" sm="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Consulta de Turma</CardTitle>
              <Input className='form-control' name="TUR_ANO" defaultValue='2021'
                placeholder="Informe um ano"
                onChange={event => setFiltro({ ...filtro, TUR_ANO: event.target.value })}></Input>
              {/* <Input className='form-control' name="TUR_DESC"
                placeholder="Informe algo para consultar"
                onChange={event => setFiltro({ ...filtro, TUR_DESC: event.target.value })}></Input> */}
              <Button className="btn btn-success" onClick={getLista}>Filtrar dados</Button>
              {'  '}<Link to={'/admin/turma_new'} className="btn btn-primary">Novo</Link>
            </CardHeader>
            <CardBody>
              {lista.length > 0 ?
                <>
                  <br></br>
                  <Table >
                    <thead className="text-primary">
                      <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Escola</th>
                        <th className="text-right">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                    {lista.map(item => (
                      <tr>
                        <td>{item.TUR_CODIGO}</td>
                        <td>{item.TUR_DESC+' - '+item.TUR_ANO}</td>
                        <td>{item.ESC_NOME}</td>
                        <td className="text-right">
                          <Button
                            className="btn-icon"
                            color="success"
                            size="sm"
                            type="button"
                            onClick={() => handleSelect(item.TUR_CODIGO)} 
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          {" "}
                          <Button
                            className="btn-icon"
                            color="danger"
                            size="sm"
                            type="button"
                            onClick={() => showDialog({
                              type:'confirmation',
                              msg:'Deseja excluir o registro: ' + item.TUR_DESC,
                              title: 'Confirmacao',
                              cancelBtnText: 'Cancelar',
                              confirmBtnText: 'Confirmar',
                              id: item.TUR_CODIGO
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

