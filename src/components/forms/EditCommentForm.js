import React, { Component } from "react";
import { Row, Col, Form, Input } from "antd";
import { Button, Dropdown } from "react-bootstrap";
import { CloudUploadOutlined } from "@material-ui/icons";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import axios from "axios";
import { saveTaskComment } from "../../api/tasksApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { saveTicketComment } from "../../api/ticketsApi";
let selectF = [];
let reqAtt = [];
class EditCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: this.props.comment.comment,
      selectedFile: null,
      requestAttach: this.props.comment.attachments,
      buttonDisable: false,
      uploadStatus: "",
    };
  }
  onChangeComment = (e) => {
    this.setState({ commentText: e.target.value });
  };
  componentDidMount() {
    reqAtt = this.props.comment.attachments;
  }

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
  EditTheComment = async (e) => {
    const request = {};
    request.id = this.props.comment.id;
    if (this.state.commentText) request.comment = this.state.commentText;
    request.createdOn = this.props.comment.createdOn;
    request.taskId = this.props.comment.taskId;
    request.employeeName = this.props.comment.employeeName;
    if (this.state.requestAttach)
      request.attachments = this.state.requestAttach;

    const comment = this.props.isSupportComments
      ? await saveTicketComment(this.props.taskId, request)
      : await saveTaskComment(this.props.taskId, request);
    comment.showOptionsMenu = true;
    this.props.editTaskComment(comment);

    if (this.state.commentText !== "") {
      this.props.closeEdit();
    }
  };
  removeAtt = (e) => {
    let files = this.state.requestAttach.filter((f) => f.path !== e.target.id);
    reqAtt = reqAtt.filter((f) => f.path !== e.target.id);

    this.setState({ requestAttach: files });
    if (files.length == 0) {
      this.setState({ uploadStatus: "", selectedFile: null, reqAtt: [] });
    }
  };
  closeTheEdit = (e) => {
    reqAtt = this.props.attachments;
    this.setState(
      {
        commentText: this.props.comment.comment,
        selectedFile: null,
        requestAttach: this.props.comment.attachments,
        buttonDisable: false,
        uploadStatus: "",
      },
      () => {
        this.props.closeEdit();
      }
    );
  };
  render() {
    return (
      <Form name="subTaskForm" className="editCommentModal" layout="vertical">
        <div id="editCommentsModal">
          <Form.Item
            className="mr-2"
            name="name"
            // label="التعليق"
            rules={[
              {
                required: true,
                message: "من فضلك إدخل التعليق",
              },
            ]}
            hasFeedback
          >
            <Input.TextArea
              defaultValue={this.props.comment.comment}
              name="commentText"
              onChange={this.onChangeComment}
              value={this.state.commentText}
            />
          </Form.Item>{" "}
          <Row className="pt-4 mr-2">
            <Col span={24}>
              <h5>المرفقات</h5>
              {this.state.requestAttach &&
                this.state.requestAttach.length !== 0 &&
                this.state.requestAttach.map((f) => (
                  <div className="my-2">
                    <span></span>
                    <span>
                      <Dropdown>
                        <Dropdown.Toggle variant="success">
                          <FontAwesomeIcon
                            icon={faEllipsisH}
                            style={{
                              color: "#0b2548",
                            }}
                            className=" ml-2"
                          />
                          {f.fileName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <div className="dropdownsignoutlink">
                            <Dropdown.Item onClick={this.removeAtt} id={f.path}>
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
                  onClick={this.clickedFileInput}
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
        </div>
        <Row className="formButtons pt-4">
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              className="addbtn"
              htmlType="submit"
              size="large"
              onClick={this.EditTheComment}
              disabled={this.state.buttonDisable}
            >
              تعديل
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className="cancelbtn"
              size="large"
              onClick={this.closeTheEdit}
            >
              إلغاء
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default EditCommentForm;
