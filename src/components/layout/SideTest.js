import React, { Component } from "react";
//Packages Importing
import { Nav, Navbar, Container, Dropdown, Button } from "react-bootstrap";
import PersonIcon from "@material-ui/icons/Person";
// import EmailIcon from "@material-ui/icons/Email";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Flip from "react-reveal/Flip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
//Images Importing
import Logo from "../../assets/images/logo.png";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Media from "react-media";

class SideTest extends Component {
  SignOut = () => {
    // this.props.toggleAppAuthority();
  };
  toggleCurrentLang = () => {
    if (this.props.i18n.language === "en") {
      this.props.i18n.changeLanguage("ar");
      var link = document.getElementById("slink");
      link.href = "../../App.css";
    } else {
      this.props.i18n.changeLanguage("en");

      var link = document.getElementById("slink");
      link.href = process.env.PUBLIC_URL + "/english.css";
    }
  };
  render() {
    return (
      <Media query="(max-width: 768px)">
        {(matches) =>
          matches ? (
            <Navbar className="mahamy-navbar">
              <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Nav className="mr-auto">
                  <div className="dropdownsignoutlink">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {/* {username.charAt(0).toUpperCase()}{" "} */}
                        <ExpandMoreIcon />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <div className="dropdownsignoutlink">
                        
                          <>
                            <Dropdown.Item onClick={this.SignOut}>
                              <NotificationsIcon />
                              الإشعارات
                            </Dropdown.Item>
                            <Dropdown.Item onClick={this.SignOut}>
                              <PersonIcon /> الصفحة الشخصية
                            </Dropdown.Item>{" "}
                            <Dropdown.Item onClick={this.SignOut}>
                              <ExitToAppIcon />
                              تسجيل خروج
                            </Dropdown.Item>
                          </>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="nav-username">
                    {this.props.isManager ? "*أحمد" : "أحمد"}
                  </div>
                </Nav>
                <Flip bottom cascade when={this.props.show}>
                  <div className="mr-lg-5">
                    <h3>{this.props.activeLink}</h3>
                  </div>
                </Flip>
                <Navbar.Brand className="navlogo mr-lg-5  ml-lg-5">
                  <Link to="/">
                    <img alt="logo" src={Logo} />
                  </Link>
                </Navbar.Brand>
              </Container>
              <Navbar.Brand className=" pl-5 ">
                <Link to="/">
                  <img alt="logo" src={Logo} />
                </Link>
              </Navbar.Brand>
              <Navbar className="mahamy-navbar" expand="xl">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </Navbar>
            </Navbar>
          ) : (
            <Navbar className="mahamy-navbar ">
              <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <div className="dropdownsignoutlink">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {/* {username.charAt(0).toUpperCase()}{" "} */}
                          <ExpandMoreIcon />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <div className="dropdownsignoutlink">
                            <Dropdown.Item onClick={this.SignOut}>
                              <ExitToAppIcon />
                              تسجيل خروج
                            </Dropdown.Item>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="nav-username">
                      {this.props.isManager ? "*أحمد" : "أحمد"}
                    </div>{" "}
                    <>
                      <Nav.Link href="#home">
                        <PersonIcon></PersonIcon>
                      </Nav.Link>
                      {/* <Nav.Link href="#home">
                    <EmailIcon></EmailIcon>
                  </Nav.Link> */}
                      <Nav.Link href="#home">
                        <NotificationsIcon></NotificationsIcon>
                      </Nav.Link>
                    </>
                  </Nav>
                </Navbar.Collapse>
                <Flip bottom cascade when={this.props.show}>
                  <div className="mr-lg-5">
                    <h3>{this.props.activeLink}</h3>
                  </div>
                </Flip>
                <Navbar.Brand className="navlogo mr-lg-5  ml-lg-5">
                  <Link to="/">
                    <img alt="logo" src={Logo} />
                  </Link>
                </Navbar.Brand>
              </Container>
            </Navbar>
          )
        }
      </Media>
    );
  }
}
export default connect(null)(withTranslation("header")(SideTest));
