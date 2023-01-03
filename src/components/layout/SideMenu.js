import React, { Component } from "react";

//Packages Importing
import { Col, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { connect } from "react-redux";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultDisplay: "block",
      changeDisplay: "none",

      homeicon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.279"
          height="16.2"
          viewBox="0 0 16.279 16.2"
        >
          <path
            d="M15.97 3.478a1.4 1.4 0 0 0-.609-.465L8.653.436a1.416 1.416 0 0 0-1.028 0L.919 3.015a1.4 1.4 0 0 0-.609.465 1.408 1.408 0 0 0-.31.871v8.177a1.438 1.438 0 0 0 .917 1.336l6.71 2.58a1.42 1.42 0 0 0 1.023 0l6.71-2.58a1.438 1.438 0 0 0 .917-1.336V4.351a1.408 1.408 0 0 0-.309-.873zm-3.7.219a.291.291 0 0 1 0 .542L8.557 5.668a1.163 1.163 0 0 1-.835 0L4.007 4.239a.291.291 0 0 1 0-.542l3.721-1.429a1.163 1.163 0 0 1 .835 0z"
            transform="translate(0 -.34)"
          />
        </svg>
      ),
      taskManagementicon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.67"
          height="15.67"
          viewBox="0 0 15.67 15.67"
        >
          <defs>
            <style></style>
          </defs>
          <g
            id="streamline-icon-programming-module-three_140x140"
            transform="translate(.001)"
          >
            <path
              id="Path_1434"
              d="M1.069 80h4.579a1.068 1.068 0 0 1 1.068 1.068v4.579a1.069 1.069 0 0 1-1.069 1.069H1.068A1.068 1.068 0 0 1 0 85.648v-4.579A1.069 1.069 0 0 1 1.069 80z"
              className="cls-1"
              transform="translate(-.001 -71.046)"
            />
            <path
              id="Path_1435"
              d="M81.069 80h4.579a1.068 1.068 0 0 1 1.068 1.068v4.58a1.068 1.068 0 0 1-1.068 1.068h-4.579A1.069 1.069 0 0 1 80 85.647v-4.578A1.069 1.069 0 0 1 81.069 80z"
              className="cls-1"
              transform="translate(-71.047 -71.046)"
            />
            <path
              id="Path_1436"
              d="M41.069 0h4.579a1.068 1.068 0 0 1 1.068 1.068v4.579a1.069 1.069 0 0 1-1.069 1.069h-4.579A1.068 1.068 0 0 1 40 5.648V1.069A1.069 1.069 0 0 1 41.069 0z"
              className="cls-1"
              transform="translate(-35.524)"
            />
          </g>
        </svg>
      ),

      scheduleicon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.279"
          height="15.116"
          viewBox="0 0 16.279 15.116"
        >
          <path
            d="M14.824 15.634v-1.913a2.037 2.037 0 0 0-2.035-2.035H9.3a.291.291 0 0 1-.291-.291V9.481a2.326 2.326 0 1 0-1.744 0v1.914a.291.291 0 0 1-.291.291H3.487a2.037 2.037 0 0 0-2.035 2.035v1.914a2.326 2.326 0 1 0 1.744 0v-1.914a.291.291 0 0 1 .291-.291h3.488a.291.291 0 0 1 .291.291v1.914a2.326 2.326 0 1 0 1.744 0v-1.914a.291.291 0 0 1 .29-.291h3.488a.291.291 0 0 1 .291.291v1.914a2.326 2.326 0 1 0 1.744 0z"
            transform="translate(.002 -5)"
          />
        </svg>
      ),
      performanceicon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.279"
          height="11.784"
          viewBox="0 0 16.279 11.784"
        >
          <path
            d="M9.963 31.11h-.079a1.744 1.744 0 0 1-1.592-1.241l-1.957-6.525A.291.291 0 0 0 5.8 23.3l-1.11 2.212a1.734 1.734 0 0 1-1.56.964H1.163a1.163 1.163 0 0 1 0-2.326H2.59a.292.292 0 0 0 .26-.16l1.85-3.7a1.744 1.744 0 0 1 3.23.277l1.87 6.241a.292.292 0 0 0 .549.024l.634-1.585a1.733 1.733 0 0 1 1.619-1.1h2.514a1.163 1.163 0 0 1 0 2.326h-1.923a.291.291 0 0 0-.27.182l-1.342 3.355a1.744 1.744 0 0 1-1.618 1.1zm3.181-5z"
            transform="translate(0 -19.326)"
          />
        </svg>
      ),
      archiveicon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16.003"
          viewBox="0 0 16 16.003"
        >
          <path d="M15.782 13.835l-3.115-3.115a.749.749 0 0 0-.531-.219h-.509a6.5 6.5 0 1 0-1.127 1.125v.509a.749.749 0 0 0 .219.531l3.116 3.116a.747.747 0 0 0 1.059 0l.884-.884a.754.754 0 0 0 0-1.063zM6.5 10.5a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
        </svg>
      ),
    };
  }

  changeTogg = (e) => {
    // let el = document.getElementsByClassName("navbar-toggler");
    // for (var i = 0; i < el.length; i++) {
    //   el[i].classList.remove("tog");
    //   el[i].classList.add("change");

    // }
    if (
      this.state.changeDisplay === "block" &&
      this.state.defaultDisplay === "none"
    ) {
      this.setState({ changeDisplay: "none", defaultDisplay: "block" });
    } else {
      this.setState({ changeDisplay: "block", defaultDisplay: "none" });
    }
  };
  onClickLink = () => {
    this.setState({ changeDisplay: "none", defaultDisplay: "block" });
  };
  render() {
    return (
      <div className="sidemenu">
        <link id="slink" href={require("../../App.css")} rel="stylesheet" />
        <Navbar collapseOnSelect expand="xl">
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={this.changeTogg}
          >
            <div
              className="togDefault"
              style={{ display: this.state.defaultDisplay }}
            >
              <FontAwesomeIcon icon={faBars} className="fa-x" />
            </div>
            <div
              className="togChange"
              style={{ display: this.state.changeDisplay }}
            >
              <FontAwesomeIcon icon={faTimes} className="fa-x" />
            </div>
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="flex-wrap">
              {/* {this.state.menuLinks
                .filter((_, index) => !(index % 2) || this.props.isManager)
                .map((link, index) => ( */}

              <Col sm="12" className="sidelinkParent">
                {this.props.admin !== "admin" ? (
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/"
                  >
                    <Nav.Link>
                      الرئيسية
                      <span className="ml-3">{this.state.homeicon} </span>
                    </Nav.Link>
                  </LinkContainer>
                ) : null}
              </Col>

              {this.props.admin === "director" ? (
                <Col sm="12" className="sidelinkParent">
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/Tasks-Brief"
                  >
                    <Nav.Link>
                      ملخص المهام{" "}
                      <span className="ml-3">{this.state.scheduleicon} </span>
                    </Nav.Link>
                  </LinkContainer>
                </Col>
              ) : null}

              <Col sm="12" className="sidelinkParent">
                {this.props.admin === "manager" ||
                this.props.admin === "director" ? (
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/Task-Management"
                  >
                    <Nav.Link>
                      إدارة المهام
                      <span className="ml-3">
                        {this.state.taskManagementicon}{" "}
                      </span>
                    </Nav.Link>
                  </LinkContainer>
                ) : this.props.admin === "admin" ? (
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/"
                  >
                    <Nav.Link>
                      إدارة المهام
                      <span className="ml-3">
                        {this.state.taskManagementicon}{" "}
                      </span>
                    </Nav.Link>
                  </LinkContainer>
                ) : null}
              </Col>

              {this.props.admin !== "admin" ||
              this.props.admin === "director" ? (
                <Col sm="12" className="sidelinkParent">
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/Task-Schedule"
                  >
                    <Nav.Link>
                      جدول مهامي
                      <span className="ml-3">{this.state.scheduleicon} </span>
                    </Nav.Link>
                  </LinkContainer>
                </Col>
              ) : null}
              {this.props.admin === "manager" ||
              this.props.admin === "director" ? (
                <Col sm="12" className="sidelinkParent">
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/Teams-TaskSchedule"
                  >
                    <Nav.Link>
                      جدول مهام الإدارات
                      <span className="ml-3">{this.state.scheduleicon} </span>
                    </Nav.Link>
                  </LinkContainer>
                </Col>
              ) : null}
              {this.props.admin === "manager" ||
              this.props.admin === "director" ? (
                <Col sm="12" className="sidelinkParent">
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/PerformanceIndicators"
                  >
                    <Nav.Link>
                      مؤشرات الأداء
                      <span className="ml-3">
                        {this.state.performanceicon}{" "}
                      </span>
                    </Nav.Link>
                  </LinkContainer>
                </Col>
              ) : null}
              {this.props.admin !== "admin" ? (
                <Col sm="12" className="sidelinkParent">
                  <LinkContainer
                    className="menulink"
                    exact
                    // onClick={this.props.handleClick}
                    onClick={this.onClickLink}
                    activeClassName="sidemenu-active"
                    style={{ width: "100%" }}
                    to="/Archive"
                  >
                    <Nav.Link>
                      المهام المنتهية
                      <span className="ml-3">{this.state.archiveicon} </span>
                    </Nav.Link>
                  </LinkContainer>
                </Col>
              ) : null}
              {/* ))} */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    admin: state.auth.admin,
  };
};

export default connect(mapStateToProps)(SideMenu);
