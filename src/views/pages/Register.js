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
import React, { useState } from "react";
import api from 'services/api';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

export function Register (props) {
  const [myUser, setUser] = useState({});

  const ReturnLogin = () => {
      props.history.push('/admin/login');
  }
  
  const handleSubmit = ev => {
      ev.preventDefault();
      console.log(myUser);
      // api.put('cadastros/USUARIO', myUser)
      api.put('GetToken', myUser)
          .then(resp => {
              const { data } = resp;
              if (data) {
                  props.history.push('/admin/login');
              }
          })
          .catch(error => {
              alert('Erro no cadastro');
          })
  }

  const handleChange = ev => {
      let id = [ev.target.id];
      let value = ev.target.value;
      setUser({ ...myUser, [id]: value });
  }

// class Register extends React.Component {
//   componentDidMount() {
//     document.body.classList.toggle("register-page");
//   }
//   componentWillUnmount() {
//     document.body.classList.toggle("register-page");
//   }
  
    return (
      <div className="register-page">
        <Container>
          <Row>
            {/* <Col className="ml-auto" lg="5" md="5">
              <div className="info-area info-horizontal mt-5">
                <div className="icon icon-primary">
                  <i className="nc-icon nc-tv-2" />
                </div>
                <div className="description">
                  <h5 className="info-title">Marketing</h5>
                  <p className="description">
                    We've created the marketing campaign of the website. It was
                    a very interesting collaboration.
                  </p>
                </div>
              </div>
              <div className="info-area info-horizontal">
                <div className="icon icon-primary">
                  <i className="nc-icon nc-html5" />
                </div>
                <div className="description">
                  <h5 className="info-title">Fully Coded in HTML5</h5>
                  <p className="description">
                    We've developed the website with HTML5 and CSS3. The client
                    has access to the code using GitHub.
                  </p>
                </div>
              </div>
              <div className="info-area info-horizontal">
                <div className="icon icon-info">
                  <i className="nc-icon nc-atom" />
                </div>
                <div className="description">
                  <h5 className="info-title">Built Audience</h5>
                  <p className="description">
                    There is also a Fully Customizable CMS Admin Dashboard for
                    this product.
                  </p>
                </div>
              </div>
            </Col> */}
            <Col className="mr-auto" lg="6" md="6">
              <Card className="card-signup text-center">
                <CardHeader>
                  <CardTitle tag="h4">Cadastrar usuário</CardTitle>
                  {/* <div className="social">
                    <Button className="btn-icon btn-round" color="twitter">
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button className="btn-icon btn-round" color="dribbble">
                      <i className="fa fa-dribbble" />
                    </Button>
                    <Button className="btn-icon btn-round" color="facebook">
                      <i className="fa fa-facebook-f" />
                    </Button>
                    <p className="card-description">or be classical</p>
                  </div> */}
                </CardHeader>
                <CardBody>
                  <Form action="" className="form" method="" onSubmit={handleSubmit}>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Nome" type="text" 
                        id='USU_NOME'
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-circle-10" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Login" type="text" 
                        id='USERNAME'
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Email..." type="email" 
                        id='USU_EMAIL'
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
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-key-25" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Senha usuário master"
                        type="password"
                        autoComplete="off"
                        id='PASSMASTER'
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <FormGroup check className="text-left">
                      <Label check>
                        <Input defaultChecked type="checkbox" />
                        <span className="form-check-sign" />Aceito todos os {" "}
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          termos e condições de uso.
                        </a>
                        .
                      </Label>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button
                    className="btn-round"
                    color="info"
                    onClick={handleSubmit}
                    type='submit'
                  >
                    Cadastrar
                  </Button>
                </CardFooter>
              </Card>
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

export default Register;
