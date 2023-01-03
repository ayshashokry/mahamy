import React, { Component } from "react";

//Packages Importing
import { Container } from "react-bootstrap";

import "slick-carousel/slick/slick-theme.css";
//Components Importing
import FilterSearchTasks from "../tasksSections/FilterSearchTasks";

import { connect } from "react-redux";
import EmployeeListsHolder from "../employeeSchedulePage/EmployeeListsHolder";
import { getTeamsCards } from "../../redux/actions/StatusActions";
import PreLoading from "../layout/PreLoading";
class EmployeeTasksSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: undefined,
      selectedPriority: undefined,
      selectedStatus: undefined,
      searchString: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props
      .getTeamsCards
      // (this.props.TeamsTasks,
      // this.props.ScheculeStatuses)
      ();
  }

  render() {
    return (
      <Container fluid>
        <FilterSearchTasks
          selectedCategory={this.state.selectedCategory}
          selectedPriority={this.state.selectedPriority}
          handleSelectCategory={this.handleSelectCategory}
          handleSelectPriority={this.handleSelectPriority}
          pageType="teamsSchedule"
        />

        <Container fluid className="TaskSchedulePage">
          {this.props.ScheculeStatuses.length == 0 ? <PreLoading /> : ""}
          <EmployeeListsHolder
            searchvalue={this.state.searchString}
            selectedCategory={this.state.selectedCategory}
            selectedPriority={this.state.selectedPriority}
          />
        </Container>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  TeamsTasks: state.Tasks.TeamsTasks,
  ScheculeStatuses: state.ScheculeStatuses,
});
const mapDispatchToProps = {
  getTeamsCards,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeTasksSchedule);
