import React, { Component } from "react";
//Packages Importing
import { Modal } from "react-bootstrap";
import EditCategoryForm from "../forms/EditCategoryForm";
import { connect } from "react-redux";
//Components Importing
class EditCategoryModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        keyboard={false}
        backdrop="static"
        className="addTaskModal"
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <EditCategoryForm
            confirmationEditCategory={this.props.confirmationEditCategory}
            onHide={this.props.onHide}
            selectedCategory={
              this.props.Categories.filter((c) => c.id == this.props.id)[0]
            }
          />
        </Modal.Body>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  Categories: state.Categories.FlatCategories,
});

export default connect(mapStateToProps)(EditCategoryModal);
