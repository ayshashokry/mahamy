import React, { Component } from "react";
//Packages Importing
import { Row, Col, notification } from "antd";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import TreeItem from "@material-ui/lab/TreeItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Media from "react-media";
import { withStyles } from "@material-ui/core/styles";

//Images Importing
import { Link } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";
//Components Importing
import TreeDetails from "./TreeDetails";
import AddTaskModal from "../modals/AddTaskModal";
import AddMainTaskForm from "../forms/AddMainTaskForm";
import AddSubTaskForm from "../forms/AddSubTaskForm";
import { ClickAwayListener } from "@material-ui/core";

//Redux Importing
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
class TreeTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: [],
      selectedCategoryId: "",
      selectedCategoryName: "",
      renderModal: "main",
      addTaskModalShow: false,
    };
  }
  openAddTaskModal = (e) => {
    if (e.target.id === "main") {
      this.setState({
        renderModal: "main",
        addTaskModalShow: true,
      });
    } else {
      this.setState({
        renderModal: "sub",
        addTaskModalShow: true,
      });
    }
  };

  closeAddTaskModal = () => {
    setTimeout(() => {
      this.setState({
        addTaskModalShow: false,
      });
    }, 100);
  };
  onSelect = (e, id) => {
    this.props.onSelect(id);
    this.setState({
      selectedCategoryId: id,
      selectedCategoryName: e.target.outerText,
    });
  };
  confirmationAddCategory = () => {
    const args = {
      description: "تم إضافة مهمة رئيسية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  confirmationAddTask = () => {
    const args = {
      description: "تم إضافة مهمة فرعية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };

  renderTreeNodes = (data) =>
    data.map((node, index) => {
      return (
        <Media query="(max-width: 768px)">
          {(matches) =>
            matches ? (
              <TreeItem
                expandIcon={
                  <>
                    {node.children ? (
                      <ChevronLeftIcon className="treeExpand" />
                    ) : null}
                  </>
                }
                collapseIcon={
                  <>
                    {node.children ? (
                      <ExpandMoreIcon className="treeExpand" />
                    ) : null}
                  </>
                }
                onLabelClick={(e) => e.preventDefault()}
                classes
                endIcon={<DateRangeIcon />}
                key={index}
                key={node.id}
                nodeId={node.id}
                label={
                  <>
                    <Link to={`/Task-Management/${node.id}`}>{node.name}</Link>

                    <>
                      <Dropdown className="addTreeIcon">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <FontAwesomeIcon
                            icon={faPlusCircle}
                            className="circle"
                          />{" "}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ zIndex: "9999999" }}>
                          <div className="dropdownsignoutlink">
                            <Dropdown.Item
                              onClick={this.openAddTaskModal}
                              id="main"
                            >
                              مهمة رئيسية
                            </Dropdown.Item>

                            <Dropdown.Item
                              onClick={this.openAddTaskModal}
                              id="sub"
                            >
                              مهمة فرعية
                            </Dropdown.Item>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  </>
                }
              >
                <>
                  {node.children ? (
                    <div className="mr-3">
                      {this.renderTreeNodes(node.children)}
                    </div>
                  ) : null}
                </>
              </TreeItem>
            ) : (
              <TreeItem
                classes={{
                  root: this.props.classes.root,
                  // expanded: classes.expanded,
                  selected: this.props.classes.selected,
                  // label: classes.label
                }}
                expandIcon={
                  <>
                    {node.children ? (
                      <ChevronLeftIcon className="treeExpand" />
                    ) : null}
                  </>
                }
                collapseIcon={
                  <>
                    {node.children ? (
                      <ExpandMoreIcon className="treeExpand" />
                    ) : null}
                  </>
                }
                onLabelClick={(e) => e.preventDefault()}
                classes
                endIcon={<DateRangeIcon />}
                key={index}
                nodeId={node.id}
                label={
                  <>
                    {node.name}{" "}
                    <>
                      <Dropdown className="addTreeIcon">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <FontAwesomeIcon
                            icon={faPlusCircle}
                            className="circle"
                          />{" "}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ zIndex: "9999999" }}>
                          <div className="dropdownsignoutlink">
                            <Dropdown.Item
                              onClick={this.openAddTaskModal}
                              id="main"
                            >
                              مهمة رئيسية
                            </Dropdown.Item>

                            <Dropdown.Item
                              onClick={this.openAddTaskModal}
                              id="sub"
                            >
                              مهمة فرعية
                            </Dropdown.Item>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  </>
                }
              >
                <>
                  {node.children ? (
                    <div className="mr-3">
                      {this.renderTreeNodes(node.children)}
                    </div>
                  ) : null}
                </>
              </TreeItem>
            )
          }
        </Media>
      );
    });

  render() {
    return (
      <div className="tasksTree">
        {" "}
        <AddTaskModal
          show={this.state.addTaskModalShow}
          onHide={this.closeAddTaskModal}
          title={
            this.state.renderModal === "main"
              ? "إضافة مهمة رئيسية جديدة"
              : "إضافة مهمة فرعية جديدة"
          }
        >
          {this.state.renderModal === "main" ? (
            <AddMainTaskForm
              confirmationAddCategory={this.confirmationAddCategory}
              selectedCategoryId={this.state.selectedCategoryId}
              onHide={this.closeAddTaskModal}
            />
          ) : (
            <AddSubTaskForm
              confirmationAddTask={this.confirmationAddTask}
              selectedCategoryId={this.state.selectedCategoryId}
              onHide={this.closeAddTaskModal}
            />
          )}
        </AddTaskModal>
        <Row>
          <Col
            lg={{ span: 6 }}
            md={{ span: 8 }}
            sm={{ span: 22 }}
            xs={{ span: 22 }}
            className="mr-4"
            style={{
              height: "100vh",
              borderLeft: "1px solid #e7e9f1",
            }}
          >
            {this.props.Categories.length !== 0 ? (
              <TreeView
                defaultExpanded={["1"]}
                onNodeSelect={this.onSelect}
                selected={this.state.selectedCategoryId}
              >
                {this.props.searchString === ""
                  ? this.renderTreeNodes(this.props.Categories)
                  : this.props.displayedCategories.length !== 0
                  ? this.renderTreeNodes(this.props.displayedCategories)
                  : this.renderTreeNodes(this.props.Categories)}
              </TreeView>
            ) : null}
          </Col>
          <Col
            className="treeDetailsShow"
            lg={{ span: 16 }}
            md={{ span: 14 }}
            sm={{ span: 0 }}
          >
            <TreeDetails
              searchString={this.props.searchString}
              displayedTasks={this.props.displayedTasks}
              selectedCategoryName={this.state.selectedCategoryName}
              selectedCategoryId={this.state.selectedCategoryId}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
const styles = (theme) => {
  console.log(theme);
  return {
    root: {
      backgroundColor: "red",
    },
  };
};
const mapStateToProps = (state) => ({
  Categories: state.Categories.Categories,
  FlatCategories: state.Categories.FlatCategories,
});

export default connect(mapStateToProps)(withStyles(styles)(TreeTest));
