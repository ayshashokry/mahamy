import React, { Component } from "react";

//Packages Importing
import { Container } from "react-bootstrap";

import "slick-carousel/slick/slick-theme.css";
//Components Importing
import FilterSearchTasks from "../tasksSections/FilterSearchTasks";
import { connect } from "react-redux";
import ListHolder from "../SchedulePage/ListsHolder";
import { getScheduleCards } from "../../redux/actions/StatusActions";
import PreLoading from "../layout/PreLoading";
class TasksSchedule extends Component {
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
    this.props.getScheduleCards();
  }

  render() {
    return (
      <Container fluid>
        <FilterSearchTasks
          Categories={this.props.Categories}
          selectedCategory={this.state.selectedCategory}
          selectedPriority={this.state.selectedPriority}
          handleSelectCategory={this.handleSelectCategory}
          handleSelectPriority={this.handleSelectPriority}
          pageType="managerSchedule"
        />

        <Container fluid className="TaskSchedulePage">
          {this.props.ScheculeStatuses.length == 0 ? <PreLoading /> : ""}
          <ListHolder
            searchvalue={this.state.searchString}
            selectedCategory={this.state.selectedCategory}
            selectedPriority={this.state.selectedPriority}
          />
          {/* {this.props.ScheculeStatuses.map((s) => s.cards.length == 0)[0] &&
          this.props.ScheculeStatuses.map((s) => s.cards.length == 0)[1] &&
          this.props.ScheculeStatuses.map((s) => s.cards.length == 0)[2] ? (
            <p className="noDataSchedule">لا توجد بيانات</p>
          ) : (
            ""
          )} */}
        </Container>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  Tasks: state.Tasks.Tasks,
  Categories: state.Categories.FlatCategories,
  ScheculeStatuses: state.ScheculeStatuses,
});
const mapDispatchToProps = {
  getScheduleCards,
};
export default connect(mapStateToProps, mapDispatchToProps)(TasksSchedule);
