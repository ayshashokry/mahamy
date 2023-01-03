import React, { Component } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl, fileUrl } from "../../api/baseUrl";

import {
  Form,
  Input,
  // ConfigProvider,
  Upload,
  Col,
  Row,
} from "antd";
import { CloudUploadOutlined } from "@material-ui/icons";
import moment from "moment-hijri";
import { saveTaskComment } from "../../api/tasksApi";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveTicketComment } from "../../api/ticketsApi";
let selectF = [];
let reqAtt = [];
class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: "",
      selectedFile: null,
      requestAttach: [],
      buttonDisable: false,
      uploadStatus: "",
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setFile = async (e) => {
    if (e.target.files.length !== 0) {
      const formData = new FormData();
      if (e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          selectF.push(e.target.files[i]);
          Object.assign({}, selectF);
          formData.append(`file[${i}]`, e.target.files[i]);
        }
      }
      this.setState({
        selectedFile: Object.assign({}, selectF),
        buttonDisable: true,
        uploadStatus: "يرجي الإنتظار حتي يتم تحميل الملفات",
      });
      await axios
        .post(baseUrl + "/uploadMultifiles", formData)
        .then((res) =>
          res.data.map((att) =>
            reqAtt.push({
              fileName: String(att.PrevFileName).substring(
                String(att.PrevFileName).lastIndexOf("/") + 1
              ),
              path: att.data,
            })
          )
        )
        .then(
          this.setState({
            requestAttach: reqAtt,
          })
        );

      if (this.state.requestAttach.length !== 0) {
        this.setState({
          buttonDisable: false,
          uploadStatus: "تم تحميل الملفات بنجاح",
        });
      }
    }
  };

  addComment = async (e) => {
    const request = {};
    if (this.state.commentText) request.comment = this.state.commentText;
    request.createdOn = moment().format("iDD/iMM/iYYYY HH:mm:ss");
    request.taskId = this.props.taskId;
    if (this.state.requestAttach)
      request.attachments = this.state.requestAttach;
    else {
      request.attachments = [];
    }
    const comment = this.props.isSupportComments
      ? await saveTicketComment(this.props.taskId, request)
      : await saveTaskComment(this.props.taskId, request);
    comment.showOptionsMenu = true;
    this.props.addTaskComment(comment);
    if (this.state.commentText !== "") {
      this.props.onHide();
      this.setState({
        commentText: "",
        requestAttach: [],
        selectedFile: null,
        uploadStatus: "",
        selectedFile: null,
      });
      selectF = [];
      reqAtt = [];
    }
  };
  onHideForm = () => {
    this.props.onHide();
    this.setState({
      buttonDisable: false,
      uploadStatus: "",
      selectedFile: null,
      requestAttach: [],
    });
    selectF = [];
    reqAtt = [];
  };
  removeAtt = (e) => {
    let files = this.state.requestAttach.filter((f) => f.path !== e.target.id);
    reqAtt = reqAtt.filter((f) => f.path !== e.target.id);

    this.setState({ requestAttach: files });
    if (files.length == 0) {
      this.setState({ uploadStatus: "", selectedFile: null, reqAtt: [] });
    }
  };
  render() {
    return (
      <>
        <Modal
          keyboard={false}
          onHide={this.props.onHide}
          show={this.props.show}
          backdrop="static"
          className="AddCommentModal"
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              <Row>
                <Col span={16} style={{ textAlign: "right" }}>
                  <h5>
                    <FontAwesomeIcon icon={faPlusCircle} className="circle" />
                    إضافة تعليق
                  </h5>
                </Col>
                <Col span={8}>
                  <h4 onClick={this.props.onHide}>كل التعليقات</h4>
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id="commentsModal">
            <Form>
              <Row>
                <Col span={24}>
                  <h6>اسم المهمة/ ررقم المعاملة</h6>
                  <p>{this.props.name}</p>
                </Col>
              </Row>
              <Row className="pt-4">
                <Col span={24}>
                  <h6> التعليق</h6>
                  <Form.Item
                    name="commentText"
                    rules={[
                      { required: true, message: "من فضلك إدخل التعليق" },
                    ]}
                  >
                    <Input.TextArea
                      name="commentText"
                      value={this.state.commentText}
                      onChange={this.onChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="pt-4">
                <Col span={24}>
                  <h6>المرفقات</h6>
                  {this.state.requestAttach.length !== 0 &&
                    this.state.requestAttach.map((f) => (
                      <div className="my-2">
                        <span></span>
                        <span>
                          <Dropdown>
                            <Dropdown.Toggle variant="success">
                              <i
                                style={{
                                  color: "#0b2548",
                                }}
                                className="fas fa-ellipsis-h pl-2"
                              ></i>{" "}
                              {f.fileName}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <div className="dropdownsignoutlink">
                                <Dropdown.Item
                                  onClick={this.removeAtt}
                                  id={f.path}
                                >
                                  حذف
                                </Dropdown.Item>
                                <Dropdown.Item
                                  tag="a"
                                  target="_blank"
                                  rel="noreferrer"
                                  href={`${fileUrl}/${f.path}`}
                                >
                                  مشاهدة المرفق
                                </Dropdown.Item>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </span>
                      </div>
                    ))}
                  <Button block className="ant-uploaded">
                    تحميل <CloudUploadOutlined />
                    <input
                      className="custom-file-input"
                      multiple
                      onChange={this.setFile}
                      type="file"
                      // style={{ display: 'none' }}
                    />
                  </Button>
                </Col>
              </Row>
              <p
                style={{
                  paddingTop: "10px",
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#025358",
                }}
              >
                {this.state.uploadStatus}
              </p>
              <Row className="formButtons pt-4 m-4">
                <Col span={12} style={{ textAlign: "right" }}>
                  <Button
                    htmlType="submit"
                    className="addbtn "
                    onClick={this.addComment}
                    disabled={this.state.buttonDisable}
                  >
                    إضافة
                  </Button>
                </Col>
                <Col span={12} style={{ textAlign: "left" }}>
                  <Button className="cancelbtn" onClick={this.onHideForm}>
                    إلغاء
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AddComment;
