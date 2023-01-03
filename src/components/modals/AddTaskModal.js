import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
//Packages Importing
import { Modal } from "react-bootstrap";

//Components Importing
export default class AddTaskModal extends Component {
  render() {
    return (
      <Modal
        keyboard={false}
        backdrop="static"
        className="addTaskModal"
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <h5>
              {this.props.title}
              <FontAwesomeIcon icon={faPlusCircle} className="circle" />
            </h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>{this.props.children}</Modal.Body>
      </Modal>
    );
  }
}
