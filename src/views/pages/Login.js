/*!

=========================================================
* Paper Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useContext, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
} from "reactstrap";

import api from '../../services/api';
import { GlobalContext } from '../../contexts/context';



export function Login (props) {
  const context = useContext(GlobalContext);
  const [myUser, setUser] = useState({});

  // useEffect(() => {
  //   document.body.classList.toggle("login-page");
  // }, []);

  const handleSubmit = ev => {
      ev.preventDefault();
      api.post('GetToken', myUser)
          .then(resp => {
              const { data } = resp;
              if (data.token) {
                  localStorage.setItem('app-token', data.token);
                  context.alterLogin(true);
                  api.post('/cadastros/usuario_listar', {'USU_LOGIN': myUser.USERNAME})
                    .then(resp => {
                      const { data } = resp;
                      console.log(data);
                      context.alterUsuarioLogado({codigo: data[0].USU_CODIGO, login: data[0].USU_LOGIN, nome: data[0].USU_NOME, perfil: data[0].USU_PERFIL, codigo_professor: data[0].USU_PROFESSOR});
                      // alert("Bem vindo " + data[0].USU_NOME);
                    })
                  props.history.push('/admin/dashboard');
              } else
              {
                localStorage.removeItem('app-token');
                context.alterLogin(false);
                alert('Usuário ou senha inválidos');
              }
          })
          .catch(error => {
              localStorage.removeItem('app-token');
              context.alterLogin(false);
              alert('Usuário ou senha inválidos');
          })
  }

  const handleChange = (event) => {
      let id = [event.target.id];
      let value = event.target.value;
      setUser({ ...myUser, [id]: value });
  };

  const RegisterUser = () => {
      props.history.push('/auth/register');
  }

    return (
      <div className="login-page">
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form action="" className="form" method="">
                <Card className="card-login">
                  <CardHeader>
                    <CardHeader>
                      <h3 className="header text-center">Login</h3>
                    </CardHeader>
                  </CardHeader>
                  <CardBody>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Usuário" 
                        type="text" 
                        id="USERNAME"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-key-25" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Senha"
                        type="password"
                        autoComplete="off"
                        id='PASSWORD'
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <br />
                    {/* <FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input
                            defaultChecked
                            defaultValue=""
                            type="checkbox"
                          />
                          <span className="form-check-sign" />
                          Subscribe to newsletter
                        </Label>
                      </FormGroup>
                    </FormGroup> */}
                  </CardBody>
                  <CardFooter>
                    <Button
                      block
                      className="btn-round mb-3"
                      color="warning"
                      onClick={handleSubmit}
                    >
                      Logar
                    </Button>
                    <Button
                      block
                      className="btn-round mb-3"
                      color="info"
                      onClick={RegisterUser}
                    >
                      Cadastrar usuário
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
        <div
          className="full-page-background"
          style={{
            backgroundImage: `url(${require("assets/img/bg/cascata-coqueirosdosul.jpg")})`,
          }}
        />
      </div>
    );
}



export default Login;
