import React, { Component } from "react";
//Packages Importing
import { Nav, Navbar, Container } from "react-bootstrap";
import PersonIcon from "@material-ui/icons/Person";
// import EmailIcon from "@material-ui/icons/Email";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Flip from "react-reveal/Flip";
import { notification, Dropdown, Menu, Button } from "antd";
//Images Importing
import Logo from "../../assets/images/logo.png";
import vision from "../../assets/images/vision.png";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Media from "react-media";
import { LogOut } from "../../redux/actions/authActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
class NavBar extends Component {
  confirmationLogout = () => {
    const args = {
      description: "تم تسجيل الخروج بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  SignOut = (e) => {
    // e.preventDefault();
    this.props.LogOut();
    this.confirmationLogout();
  };
  toggleCurrentLang = () => {
    var link;
    if (this.props.i18n.language === "en") {
      this.props.i18n.changeLanguage("ar");
      link = document.getElementById("slink");
      link.href = "../../App.css";
    } else {
      this.props.i18n.changeLanguage("en");

      link = document.getElementById("slink");
      link.href = process.env.PUBLIC_URL + "/english.css";
    }
  };
  render() {
    return (
      <Navbar className="mahamy-navbar">
        <Container fluid>
          <h4>تطبيق مهامي</h4>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {this.props.isAuth ? (
                <Dropdown
                  getPopupContainer={(trigger) => trigger.parentNode}
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Media query="(max-width: 768px)">
                        {(matches) =>
                          matches ? (
                            <>
                              <Menu.Item>
                                <Link className="navitem ">
                                  <i
                                    style={{ fontSize: "18px" }}
                                    className="pl-2 fa-x fas fa-user"
                                  ></i>
                                  الصفحـة الشـخصـية
                                </Link>
                              </Menu.Item>
                              <hr />
                              <Menu.Item>
                                <Link className="navitem ">
                                  <i
                                    style={{ fontSize: "18px" }}
                                    className="pl-2 fa-x fas fa-bell"
                                  ></i>
                                  الإشعارات
                                </Link>
                              </Menu.Item>

                              <hr />

                              <Menu.Item
                                style={{ cursor: "pointer" }}
                                className="navitem "
                                onClick={this.SignOut}
                              >
                                <i
                                  style={{ fontSize: "18px" }}
                                  className="pl-2 fa-x fas fa-sign-out-alt"
                                ></i>
                                تسجيـل خـروج
                              </Menu.Item>
                            </>
                          ) : (
                            <>
                              <Menu.Item
                                style={{ cursor: "pointer" }}
                                className="navitem "
                                onClick={this.SignOut}
                              >
                                <i
                                  style={{ fontSize: "18px" }}
                                  className="pl-2 fa-x fas fa-sign-out-alt"
                                ></i>
                                تسجيـل خروج
                              </Menu.Item>
                            </>
                          )
                        }
                      </Media>
                    </Menu>
                  }
                  placement="bottomLeft"
                  arrow
                >
                  <Button className="userBtn">
                    <span className="navitem ">
                      {this.props.user.unique_name}
                    </span>
                    <FontAwesomeIcon className="mr-2" icon={faChevronDown} />
                  </Button>
                </Dropdown>
              ) : null}

              {this.props.isAuth ? (
                <Media query="(max-width: 768px)">
                  {(matches) =>
                    matches ? null : (
                      <>
                        {" "}
                        <Nav.Link href="">
                          <PersonIcon></PersonIcon>
                        </Nav.Link>
                        {/* <Nav.Link href="">
                  <EmailIcon></EmailIcon>
                </Nav.Link> */}
                        <Nav.Link href="">
                          <NotificationsIcon></NotificationsIcon>
                        </Nav.Link>
                      </>
                    )
                  }
                </Media>
              ) : null}
              {/* {!this.props.isAuth ? (
                <Button className="loginBtn ">
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
              ) : null} */}
            </Nav>

            <Media query="(max-width: 768px)">
              {(matches) =>
                matches ? (
                  <Navbar.Brand className="text-center m-auto">
                    <Link to="/">
                      <img alt="logo" src={Logo} />
                    </Link>
                    <div>
                      {" "}
                      <h6>أمانة المنطقة الشرقية</h6>
                      <h6>
                        الإدارة العامة لنظم <br />
                        المعلومات الجغرافية
                      </h6>
                    </div>{" "}
                  </Navbar.Brand>
                ) : null
              }
            </Media>
          </Navbar.Collapse>
          <Flip bottom cascade when={this.props.show}>
            <div className="mr-lg-5">
              <h3>{this.props.activeLink}</h3>
            </div>
          </Flip>{" "}
          <Navbar.Brand className="navlogo text-center  ">
            <Link to="/">
              <img alt="logo" src={Logo} />
            </Link>
            <br />
            <h6>أمانة المنطقة الشرقية</h6>
            <h6>الإدارة العامة لنظم المعلومات الجغرافية</h6>
          </Navbar.Brand>{" "}
          <img
            className="visionHeader"
            alt="vision"
            src={vision}
            style={{ width: "100px", marginRight: "20px" }}
          />
        </Container>
      </Navbar>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  // isAuth: true,
  user: state.auth.user,
});
const mapDispatchToProps = {
  LogOut,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("header")(NavBar));
