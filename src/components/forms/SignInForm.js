import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Form, Col, Row, Button, Input, notification } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Login, adminOrEmployee } from "../../redux/actions/authActions";
import {
  getFlatCategoriesList,
  getCategoriesList,
} from "../../redux/actions/CategoriesActions";
import { getGroupsList } from "../../redux/actions/GroupsActions";
import {
  getOutputsList,
  getPrioritiesList,
  getStatusList,
  getTasksList,
  getTeamTasksList,
  startTasksLoading,
  finishTasksLoading,
} from "../../redux/actions/TasksActions";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../api/baseUrl";
import setStoreAfterLogin from "../../helpers/setStoreAfterLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      usererror: "",
      name: "",
      password: "",
      show: false,
      loading: false,
    };
  }

  handleShow = () => {
    this.setState({ show: true });
  };
  handleUserInput = (e) => {
    this.setState({ usererror: "" });
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  confirmationLogin = () => {
    const args = {
      description: "تم تسجيل الدخول بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  Signin = async (e) => {
    this.setState({ loading: true });
    let loginRequest = {};
    loginRequest.username = this.state.name;
    loginRequest.password = this.state.password;
    if (this.state.name !== "" && this.state.password !== "") {
      // this.setState({
      //   usererror: "برجاء التأكد من اسم المستخدم أو كلمة المرور",
      // });
      // const userdata =
      let userType = "";
      await new Promise((resolve, reject) => {
        axios
          .post(baseUrl + "/token", loginRequest)
          .then(async (res) => {
            resolve(res.data);
            if (res.data) {
              userType = await this.props.Login(res.data, this.props.history);
            }
          })
          .catch((error) => {
            this.setState({ loading: false });

            if (error.response !== undefined && error.response.status === 403) {
              this.setState({
                usererror: "برجاء التأكد من اسم المستخدم أو كلمة المرور",
              });
            }
          });
      });

      this.confirmationLogin();
      await setStoreAfterLogin(this.props, userType);
    }
  };

  // enter = (e) => {
  //   if (e) {
  //     e.preventDefault();
  //   }
  //   // document.addEventListener("keydown", (e) => {
  //   // if (e.keyCode === 13) {
  //   //   e.preventDefault();

  //   //   this.Signin();
  //   // }
  //   if (e) {
  //   }
  //   // });
  // };

  // componentDidMount() {
  //   this.enter();
  // }

  render() {
    return (
      <Container className="addManiTaskForm mt-5 signinComponent">
        <Form
          layout="vertical"
          name="validate_other"
          //   onFinish={onFinish}
        >
          <Row>
            <Col md={{ span: 3 }} sm={{ span: 0 }}></Col>
            <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
              <div className="input-div">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل اسم المستخدم",
                      required: true,
                    },
                  ]}
                  name="name"
                  hasFeedback
                  label="اسم المستخدم"
                >
                  <Input
                    name="name"
                    onChange={this.handleUserInput}
                    value={this.state.name}
                    placeholder="اسم المستخدم"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 3 }} sm={{ span: 0 }}></Col>
            <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
              <div className="input-div">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل كلمة المرور",
                      required: true,
                    },
                  ]}
                  name="password"
                  hasFeedback
                  label="كلمة المرور"
                >
                  <Input.Password
                    name="password"
                    onChange={this.handleUserInput}
                    value={this.state.password}
                    placeholder="كلمة المرور"
                  />
                </Form.Item>{" "}
              </div>{" "}
              {this.state.usererror ? (
                <Row>
                  <Col span={24}>
                    <p
                      className=" pb-3"
                      style={{ color: "red", textAlign: "right" }}
                    >
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="ml-3"
                      />
                      {this.state.usererror}
                    </p>
                  </Col>
                </Row>
              ) : null}
            </Col>
          </Row>

          <Row className="formButtons ">
            {" "}
            <Col md={{ span: 3 }} sm={{ span: 0 }}></Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                htmlType="submit"
                className=" addbtn"
                onClick={this.Signin}
              >
                تسجيل الدخول
              </Button>
            </Col>{" "}
          </Row>
        </Form>
      </Container>
    );
  }
}

SignInForm.propTypes = {
  Login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStatetoProps = (state) => ({
  isAuth: state.auth.isAuth,
  auth: state.auth,
  user: state.auth.user,
});
const mapDispatchToProps = {
  Login,
  adminOrEmployee,
  getFlatCategoriesList,
  getCategoriesList,
  getOutputsList,
  getPrioritiesList,
  getStatusList,
  getGroupsList,
  getTasksList,
  getTeamTasksList,
  startTasksLoading,
  finishTasksLoading,
};
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(withRouter(SignInForm));
