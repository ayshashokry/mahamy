import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Row, Col, notification } from "antd";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Media from "react-media";
import { Button, Modal } from "react-bootstrap";

//Images Importing
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
//Components Importing
import TreeDetails from "./TreeDetails";
import AddTaskModal from "../modals/AddTaskModal";
import AddMainTaskForm from "../forms/AddMainTaskForm";
import AddSubTaskForm from "../forms/AddSubTaskForm";
import { deleteCategory } from "../../api/categoriesApi";
import {
  getCategoriesList,
  deleteTheCategory,
  getFlatCategoriesList,
} from "../../redux/actions/CategoriesActions";
import EditCategoryModal from "../modals/EditCategoryMadal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const TreeItem = withStyles({
  // root: {
  //   "&.Mui-selected > .MuiTreeItem-label": {
  //     backgroundColor: "red",
  //   },
  // },
})(MuiTreeItem);

function TaskTree(props) {
  const classes = useStyles();
  const [selectedCategoryId, setCategoryId] = useState("");
  const [selectedCategoryName, setCategoryName] = useState("");
  const [renderModal, setRenderModal] = useState("main");
  const [addTaskModalShow, setAddModalShow] = useState(false);
  const [deleteCategoryModalShow, setDeleteCategoryShow] = useState(null);
  const [editCategoryModalShow, setEditCategoryShow] = useState(null);
  const [deleteCategoryAlert, setDeleteCategoryAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const openAddTaskModal = (e) => {
    if (e.target.id === "main") {
      setRenderModal("main");
      setAddModalShow(true);
    } else {
      setRenderModal("sub");
      setAddModalShow(true);
    }
  };
  const closeAddTaskModal = () => {
    setTimeout(() => {
      setAddModalShow(false);
    }, 100);
  };

  const openDeleteCategoryModal = (id) => {
    setDeleteCategoryShow(id);
  };
  const closeDeleteCategoryModal = () => {
    setTimeout(() => {
      setDeleteCategoryShow(null);
    }, 100);
  };
  const closeDeleteCategoryAlert = () => {
    setTimeout(() => {
      setDeleteCategoryAlert(false);
    }, 100);
  };

  const onDelete = async (e) => {
    try {
      await deleteCategory(e.target.id);
      props.deleteTheCategory(e.target.id);
      props.getCategoriesList();
      props.getFlatCategoriesList();
      setDeleteCategoryShow(null);
      confirmationDeleteCategory();
    } catch (e) {
      setDeleteCategoryShow(null);
      setDeleteCategoryAlert(true);
    }
  };
  const confirmationDeleteCategory = () => {
    const args = {
      description: "تم حذف المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };

  const confirmationEditCategory = () => {
    const args = {
      description: "تم تعديل المهمة بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  const openEditCategoryModal = (id) => {
    setEditCategoryShow(id);
  };
  const closeEditCategoryModal = () => {
    setTimeout(() => {
      setEditCategoryShow(null);
    }, 100);
  };
  const onSelect = (e, id) => {
    setLoading(true);

    props.onSelect(id);
    setCategoryId(id);
    setCategoryName(e.target.outerText);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const confirmationAddCategory = () => {
    const args = {
      description: "تم إضافة مهمة رئيسية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };
  const confirmationAddTask = () => {
    const args = {
      description: "تم إضافة مهمة فرعية بنجاح",
      duration: 3,
    };
    notification.open(args);
  };

  const renderTreeNodes = (data) =>
    data.map((node, index) => {
      return (
        <Media query="(max-width: 768px)" key={index}>
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
                endIcon={<DateRangeIcon />}
                nodeId={node.id}
                label={
                  <>
                    {node.canManage ? (
                      <Link
                        className="MuiLabelLink"
                        to={`/Task-Management/${node.id}`}
                      >
                        {node.name}
                      </Link>
                    ) : (
                      node.name
                    )}
                    {node.canManage === true ? (
                      <>
                        <Dropdown className="addTreeIcon">
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            style={{ zIndex: "9999999", textAlign: "right" }}
                          >
                            <div
                              className="dropdownsignoutlink"
                              style={{ textAlign: "right" }}
                            >
                              <Dropdown.Item
                                onClick={openAddTaskModal}
                                id="main"
                              >
                                مهمة رئيسية
                              </Dropdown.Item>{" "}
                              {props.admin !== "admin" ? (
                                <Dropdown.Item
                                  onClick={openAddTaskModal}
                                  id="sub"
                                >
                                  مهمة فرعية
                                </Dropdown.Item>
                              ) : null}
                              <Dropdown.Item
                                onClick={() => openEditCategoryModal(node.id)}
                              >
                                تعديل
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => openDeleteCategoryModal(node.id)}
                              >
                                حذف
                              </Dropdown.Item>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Modal
                          style={{ textAlign: "right" }}
                          show={deleteCategoryModalShow === node.id}
                          onHide={closeDeleteCategoryModal}
                          backdrop="static"
                          className="deleteTaskModal"
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Body>
                            <h4 className="deleteCon">
                              هل أنت متأكد من حذف هذه المهمة؟
                            </h4>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={closeDeleteCategoryModal}>
                              إلغاء
                            </Button>
                            <Button id={node.id} onClick={onDelete}>
                              حذف
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        <Modal
                          style={{ textAlign: "right" }}
                          show={deleteCategoryAlert}
                          onHide={closeDeleteCategoryAlert}
                          backdrop="static"
                          className="deleteTaskModal"
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Body>
                            <h4 className="deleteCon">
                              لا يمكن حذف مهام رئيسية تحتوي علي مهام فرعية او
                              رئيسية. برجاء حذف المهام المرتبطة بها أولا
                            </h4>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              id={node.id}
                              onClick={closeDeleteCategoryAlert}
                            >
                              حسنا
                            </Button>
                          </Modal.Footer>
                        </Modal>{" "}
                      </>
                    ) : null}
                  </>
                }
              >
                <>
                  {node.children ? (
                    <div className="mr-3">{renderTreeNodes(node.children)}</div>
                  ) : null}
                </>
              </TreeItem>
            ) : (
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
                endIcon={<DateRangeIcon />}
                key={index}
                nodeId={node.id}
                label={
                  <>
                    {node.name}
                    {node.canManage === true ? (
                      <>
                        <Dropdown className="addTreeIcon">
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            style={{ zIndex: "9999999", textAlign: "right" }}
                          >
                            <div
                              className="dropdownsignoutlink"
                              style={{ textAlign: "right" }}
                            >
                              {" "}
                              <Dropdown.Item
                                onClick={openAddTaskModal}
                                id="main"
                              >
                                مهمة رئيسية
                              </Dropdown.Item>
                              {props.admin !== "admin" ? (
                                <>
                                  <Dropdown.Item
                                    onClick={openAddTaskModal}
                                    id="sub"
                                  >
                                    مهمة فرعية
                                  </Dropdown.Item>
                                </>
                              ) : null}{" "}
                              <Dropdown.Item
                                onClick={() => openEditCategoryModal(node.id)}
                              >
                                تعديل
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => openDeleteCategoryModal(node.id)}
                              >
                                حذف
                              </Dropdown.Item>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Modal
                          style={{ textAlign: "right" }}
                          show={deleteCategoryModalShow === node.id}
                          onHide={closeDeleteCategoryModal}
                          backdrop="static"
                          className="deleteTaskModal"
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Body>
                            <h4 className="deleteCon">
                              هل أنت متأكد من حذف هذه المهمة؟
                            </h4>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={closeDeleteCategoryModal}>
                              إلغاء
                            </Button>
                            <Button id={node.id} onClick={onDelete}>
                              حذف
                            </Button>
                          </Modal.Footer>
                        </Modal>{" "}
                        <Modal
                          style={{ textAlign: "right" }}
                          show={deleteCategoryAlert}
                          onHide={closeDeleteCategoryAlert}
                          backdrop="static"
                          className="deleteTaskModal"
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                        >
                          <Modal.Body>
                            <h4 className="deleteCon">
                              لا يمكن حذف مهام رئيسية تحتوي علي مهام فرعية او
                              رئيسية. برجاء حذف المهام المرتبطة بها أولا
                            </h4>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              id={node.id}
                              onClick={closeDeleteCategoryAlert}
                            >
                              حسنا
                            </Button>
                          </Modal.Footer>
                        </Modal>{" "}
                      </>
                    ) : null}
                  </>
                }
              >
                <>
                  {node.children ? (
                    <div className="mr-3">{renderTreeNodes(node.children)}</div>
                  ) : null}
                </>
              </TreeItem>
            )
          }
        </Media>
      );
    });
  // const removeSelect = (e) => {
  //   setCategoryId("");
  //   props.onSelect("");
  //   let el = document.getElementsByClassName("MuiTreeItem-root ");

  //   for (var i = 0; i < el.length; i++) {
  //     el[i].classList.remove("Mui-selected");
  //   }
  // };
  return (
    <div className="tasksTree">
      <EditCategoryModal
        show={editCategoryModalShow === selectedCategoryId}
        onHide={closeEditCategoryModal}
        confirmationEditCategory={confirmationEditCategory}
        id={selectedCategoryId}
      />
      <AddTaskModal
        show={addTaskModalShow}
        onHide={closeAddTaskModal}
        title={
          renderModal === "main"
            ? "إضافة مهمة رئيسية جديدة"
            : "إضافة مهمة فرعية جديدة"
        }
      >
        {renderModal === "main" ? (
          <AddMainTaskForm
            confirmationAddCategory={confirmationAddCategory}
            selectedCategoryId={selectedCategoryId}
            onHide={closeAddTaskModal}
          />
        ) : (
          <AddSubTaskForm
            confirmationAddTask={confirmationAddTask}
            selectedCategoryId={selectedCategoryId}
            onHide={closeAddTaskModal}
          />
        )}
      </AddTaskModal>{" "}
      <Row>
        <Col
          lg={{ span: 6 }}
          md={{ span: 8 }}
          sm={{ span: 22 }}
          xs={{ span: 22 }}
          className="mr-4 TreeBorder"
          style={{
            height: "100vh",
          }}
        >
          {props.Categories.length !== 0 ? (
            <TreeView
              className={classes.root}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              onNodeSelect={onSelect}
              // selected={this.state.selectedCategory}
            >
              {renderTreeNodes(props.Categories)}
            </TreeView>
          ) : null}
        </Col>
        <Col
          // onClick={removeSelect}
          className="treeDetailsShow"
          lg={{ span: 16 }}
          md={{ span: 14 }}
          sm={{ span: 0 }}
        >
          <TreeDetails
            loading={loading}
            searchString={props.searchString}
            displayedTasks={props.displayedTasks}
            selectedCategoryName={selectedCategoryName}
            selectedCategoryId={selectedCategoryId}
          />
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    Categories: state.Categories.Categories,
    FlatCategories: state.Categories.FlatCategories,
    admin: state.auth.admin,
  };
}
const mapDispatchToProps = {
  getCategoriesList,
  deleteTheCategory,
  getFlatCategoriesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskTree);
