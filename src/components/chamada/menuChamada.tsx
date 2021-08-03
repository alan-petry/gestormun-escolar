import React, {useContext, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GlobalContext } from 'contexts/context';
import api from 'services/api';
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


export default function MenuChamada(){
    const context = useContext(GlobalContext);
    const history = useHistory();


    function handleSelect(id: number){
        // history.push(`/admin/v_disciplinas_turma_edit/${id}`);
        alert('Selecionado: '+id.toString);
    }

    return(
        <div className="content">
      <Row>
        <Col lg="12" md="12" sm="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Chamada: {context.v_disciplinas_turma.descricao}</CardTitle>
              
            </CardHeader>
            <CardBody>
                Dia Letivo: DATA
            </CardBody>
            <CardFooter>
              
            </CardFooter>
          </Card>
        </Col>
      </Row>

        </div>
    )
}