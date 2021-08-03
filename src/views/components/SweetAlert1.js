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
import React from "react";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import PropTypes from 'prop-types';
// reactstrap components
import { Button, Card, CardBody, CardText, Row, Col } from "reactstrap";

class SweetAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
    };
  }
  // to stop the warning of calling setState of unmounted component
  componentWillUnmount() {
    var id = window.setTimeout(null, 0);
    while (id--) {
      window.clearTimeout(id);
    }
  }
  basicAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Here's a message!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        />
      ),
    });
  };
  titleAndTextAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Here's a message!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          It's pretty, isn't it?
        </ReactBSAlert>
      ),
    });
  };
  successAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Concluído!"
          onConfirm={() => (this.hideAlert(), this.props.onClick())}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          Concluído!
        </ReactBSAlert>
      ),
    });
  };
  htmlAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="HTML example"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          You can use <b>bold</b> text,{" "}
          <a href="https://www.creative-tim.com/">links</a> and other HTML tags
        </ReactBSAlert>
      ),
    });
  };
  warningWithConfirmMessage = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.successDelete()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
          btnSize=""
        >
          You will not be able to recover this imaginary file!
        </ReactBSAlert>
      ),
    });
  };
  warningWithConfirmAndCancelMessage = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.successDelete()}
          onCancel={() => this.cancelDetele()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
          btnSize=""
        >
          You will not be able to recover this imaginary file!
        </ReactBSAlert>
      ),
    });
  };
  autoCloseAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Auto close alert!"
          onConfirm={() => this.hideAlert()}
          showConfirm={false}
        >
          I will close in 2 seconds.
        </ReactBSAlert>
      ),
    });
    setTimeout(this.hideAlert, 2000);
  };
  inputAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          input
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Input something"
          onConfirm={(e) => this.inputConfirmAlert(e)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          btnSize=""
        />
      ),
    });
  };
  inputConfirmAlert = (e) => {
    this.setState({ alert: e });
    setTimeout(this.inputConfirmAlertNext, 200);
  };
  inputConfirmAlertNext = () => {
    const inputValue = this.state.alert;
    this.setState({
      alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
          title={
            <p>
              You entered: <b>{inputValue}</b>
            </p>
          }
        />
      ),
    });
  };
  successDelete = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          Your imaginary file has been deleted.
        </ReactBSAlert>
      ),
    });
  };
  cancelDetele = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          danger
          style={{ display: "block", marginTop: "-100px" }}
          title="Cancelled"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          Your imaginary file is safe :)
        </ReactBSAlert>
      ),
    });
  };
  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };

  renderSwitch(param) {
    switch (param) {
      case 'success':
        return (
          <Button
            className="btn-round"
            color={this.props.buttonColor}
            onClick={this.successAlert}
          >{this.props.buttonText}</Button>
        )
      default:
        return (
          <Button
            className="btn-round"
            color='default'
            onClick={this.successAlert}
            outline
          >OK</Button>
        );
    }
  }

  render() {
    return (
      <>
        <div className="content">
          {this.state.alert}
          {this.renderSwitch(this.props.type)}
        </div>
      </>
    );
  }
}

SweetAlert.propTypes = {
  type: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.oneOf(['info', 'warning', 'error', ]),

};

export default SweetAlert;
