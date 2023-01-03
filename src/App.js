import React, { Component } from "react";

//Components Importing
import NavBar from "./components/layout/NavBar";
import SideMenu from "./components/layout/SideMenu";
import TaskManagement from "./components/pages/TaskManagement";
import TasksSchedule from "./components/pages/TasksSchedule";
import EmployeeTasksSchedule from "./components/pages/EmployeeTasksSchedule";
import PrivateRoute from "./components/PrivateRoute";
import TaskManagmentDetails from "./components/tasksSections/TaskManagmentDetails";
import SignInForm from "./components/forms/SignInForm";
//Packages Importing
import { BrowserRouter as Router, Route } from "react-router-dom"; // add Switch
import Media from "react-media";
//Style Importing
import "./App.css";
import Archive from "./components/pages/Archive";
import PerformanceIndicators from "./components/pages/PerformanceIndicators";

import {
  getStatusList,
  getTasksList,
  getOutputsList,
  getPrioritiesList,
  getTeamTasksList,
  startTasksLoading,
  finishTasksLoading,
} from "./redux/actions/TasksActions";
import { changeUser } from "./redux/actions/UserAction";
import {
  getCategoriesList,
  getFlatCategoriesList,
} from "./redux/actions/CategoriesActions";
import jwt_decode from "jwt-decode";
import PreLoading from "./components/layout/PreLoading";
import { getGroupsList } from "./redux/actions/GroupsActions";
import { connect } from "react-redux";
import HomePage from "./components/pages/HomePage";
import {
  setCurrentUser,
  adminOrEmployee,
  LogOut,
} from "./redux/actions/authActions";
import setAuthToken from "./helpers/setAuthToken";
import store from "./redux/store";
import TasksBrief from "./components/pages/TasksBrief";
import setStoreAfterLogin from "./helpers/setStoreAfterLogin";
if (localStorage.userToken) {
  setAuthToken(localStorage.userToken);
  const decoded = jwt_decode(localStorage.userToken);
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      linktext: "",
      isManager: false,
    };
  }

  handleClick = () => {
    setTimeout(() => {
      this.setState({ show: false });
      this.setState({ show: true });
    }, 0.5);
  };

  async componentDidMount() {
    if (localStorage.userToken) {
      await setStoreAfterLogin(this.props);
      const decoded = jwt_decode(localStorage.userToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.props.LogOut();
      }
    }
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <NavBar
            className="appnav"
            isManager={this.state.isManager}
            activeLink={this.state.linktext}
            show={this.state.show}
          />

          <div className="apppage" style={{ backgroundColor: "#fbfcfe" }}>
            <div className="pagescroll">
              {this.props.isAuth ? null : (
                <Route exact path="/login" component={SignInForm} />
              )}
              {this.props.isLoading ? (
                <div className="spinner-bk">
                  <PreLoading />
                </div>
              ) : (
                <>
                  <PrivateRoute
                    authed={this.props.isAuth}
                    path="/Archive"
                    component={Archive}
                  />
                  <PrivateRoute
                    authed={this.props.isAuth}
                    path="/PerformanceIndicators"
                    component={PerformanceIndicators}
                  />
                  {this.props.admin !== "admin" ? (
                    <PrivateRoute
                      authed={this.props.isAuth}
                      exact
                      path="/Task-Management"
                      component={TaskManagement}
                    />
                  ) : null}
                  <PrivateRoute
                    authed={this.props.isAuth}
                    exact
                    path="/Task-Schedule"
                    component={TasksSchedule}
                  />
                  <PrivateRoute
                    authed={this.props.isAuth}
                    exact
                    path="/Tasks-Brief"
                    component={TasksBrief}
                  />
                  <PrivateRoute
                    authed={this.props.isAuth}
                    exact
                    path="/Teams-TaskSchedule"
                    component={EmployeeTasksSchedule}
                  />
                  {this.props.admin !== "admin" ? (
                    <PrivateRoute
                      exact
                      authed={this.props.isAuth}
                      path="/"
                      component={HomePage}
                    />
                  ) : (
                    <PrivateRoute
                      exact
                      authed={this.props.isAuth}
                      path="/"
                      component={TaskManagement}
                    />
                  )}
                  <Media query="(max-width: 768px)">
                    <PrivateRoute
                      authed={this.props.isAuth}
                      exact
                      path="/Task-Management/:id"
                      component={TaskManagmentDetails}
                    />
                  </Media>
                </>
              )}
            </div>
            <div className="appSidemenu">
              {this.props.isAuth ? (
                <SideMenu
                  handleClick={this.handleClick}
                  isManager={this.state.isManager}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.User,
  isAuth: state.auth.isAuth,
  Tasks: state.Tasks.Tasks,
  isLoading: state.Tasks.isLoading,
  admin: state.auth.admin,
  expDate: state.auth.user.exp,
});
const mapDispatchToProps = {
  getStatusList,
  getTasksList,
  getPrioritiesList,
  getCategoriesList,
  getGroupsList,
  getOutputsList,
  getFlatCategoriesList,
  changeUser,
  getTeamTasksList,
  adminOrEmployee,
  setCurrentUser,
  LogOut,
  startTasksLoading,
  finishTasksLoading,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
