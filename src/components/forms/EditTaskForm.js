import React, { Component } from "react";
import {
  Form,
  Input,
  Select,
  // ConfigProvider,
  Upload,
  Col,
  Row,
  Button,
  notification,
} from "antd";
import { connect } from "react-redux";
import {
  addNewTask,
  getTaskDetails,
  editTask,
  editArchivedTask,
  getTasksList,
  getTeamTasksList,
} from "../../redux/actions/TasksActions";
import { Container, Dropdown } from "react-bootstrap";
import moment from "moment-hijri";
import DatePicker from "@deskpro/react-datepicker-hijri";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import axios from "axios";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import { CloudUploadOutlined } from "@material-ui/icons";
import { saveTask } from "../../api/tasksApi";
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

let selectF = [];
let reqAtt = [];
class EditTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // taskNotes: this.props.notes,
      taskName: this.props.name,
      dueDate: moment(this.props.dueDate, "iDD/iMM/iYYYY"),
      taskDetails: this.props.description,
      selectedEmployees: this.props.employees,
      selectedGroups: [],
      selectedoutputs: this.props.outputs,
      selectedPriority: this.props.priorityId,
      selectedFile: null,
      taskStatus: this.props.status,
      selectQA: this.props.hasQA,
      showConfirm: false,
      taskDate: this.props.dueDate,
      requestAttach: this.props.attachments,
      buttonDisable: false,
      uploadStatus: "",
    };
  }

  setFile = async (e) => {
    reqAtt = this.state.requestAttach;
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
      if (this.state.requestAttach && this.state.requestAttach.length !== 0) {
        this.setState({
          buttonDisable: false,
          uploadStatus: "تم تحميل الملفات بنجاح",
        });
      }
    }
  };

  EditTask = async (e) => {
    const { t } = this.props;
    e.preventDefault();

    const request = {};
    request.id = this.props.taskId;
    request.employees = this.props.employees.filter((x) => x.isQA == false);
    request.qaEmployees = this.props.employees.filter((x) => x.isQA);
    request.qaPeriodInDays = this.props.qaPeriodInDays;
    request.isInQA = this.props.isInQA;
    if (this.props.isQAPassed) {
      request.isQAPassed = this.props.isQAPassed;
    } else {
      request.isQAPassed = null;
    }
    request.categoryId = this.props.categoryId;
    request.name = this.state.taskName;
    request.dueDate = moment(this.state.dueDate).format("iDD/iMM/iYYYY");
    request.priorityId = this.state.selectedPriority;
    request.description = this.state.taskDetails;
    request.status = this.state.taskStatus;
    request.hasQA = this.state.selectQA;
    request.isPinned = this.props.isPinned;
    request.outputs = this.state.selectedoutputs;

    if (this.state.requestAttach)
      request.attachments = this.state.requestAttach;

    if (
      this.state.taskName !== "" &&
      this.state.selectedPriority !== "" &&
      this.state.taskDetails &&
      this.state.selectedoutputs.length !== 0
    ) {
      try {
        const task = await saveTask(request);
        this.props.editArchivedTask(task, false);
        this.props.editConfirm();
        this.props.onHide();
        this.props.confirmationEditTask();
        this.setState({
          // taskNotes: "",
          taskName: "",
          dueDate: "",
          taskDetails: "",
          selectedEmployees: "",
          selectedGroups: [],
          selectedoutputs: "",
          selectedPriority: "",
          taskAttachments: [],
          taskStatus: "",
          selectQA: "",
          taskDate: "",
        });
      } catch (error) {
        const errorMsg = error.message.replace(/['"]+/g, "");
        this.showErrorNotification(t(errorMsg));
      }
    }
    // this.props.getTeamTasksList();
  };

  showErrorNotification(msg) {
    this.props.onHide();
    notification.error({
      description: msg,
      duration: 5,
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  };
  handleSelectEmployee = (selectedEmployees) => {
    this.setState({ selectedEmployees });
  };
  handleSelectGroup = (selectedGroups) => {
    this.setState({ selectedGroups });
  };
  handleSelectOutput = (selectedoutputs) => {
    this.setState({ selectedoutputs });
  };
  selectPriority = (e) => {
    this.setState({ selectedPriority: e });
  };
  onselectQA = (e) => {
    this.setState({ selectQA: e.target.checked });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  componentDidMount() {
    this.props.getTaskDetails(this.props.taskId);
    // this.setState({ taskName: this.props.TaskDetails.name });
  }
  handleDate = (date) => {
    this.setState({ taskDate: date });
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
    this.setState(
      {
        selectedFile: null,
        requestAttach: this.props.attachments,
        buttonDisable: false,
        uploadStatus: "",
      },
      () => {
        this.props.onHide();
      }
    );
  };
  render() {
    const { Option } = Select;
    const { TextArea } = Input;
    return (
      <Container className="addManiTaskForm">
        <Form name="subTaskForm" layout="vertical">
          <Row>
            <Col md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name="name"
                label="اسم المهمة/ رقم المعاملة"
                rules={[
                  {
                    required: true,
                    message: "من فضلك إدخل اسم المهمة أو رقم المعاملة",
                  },
                ]}
                hasFeedback
              >
                <Input
                  defaultValue={this.props.name}
                  name="taskName"
                  onChange={this.onChange}
                  value={this.state.taskName}
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name="dueDate"
                label="تاريخ التسليم"
                rules={[{ required: true }]}
              >
                <DatePicker
                  selected={this.state.dueDate}
                  onChange={(value) =>
                    this.onChange({
                      target: {
                        name: "dueDate",
                        value,
                      },
                    })
                  }
                  placeholderText={this.state.dueDate}
                  onChangeRaw={this.handleDateChangeRaw}
                  calendar="hijri"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 12 }} xs={{ span: 24 }} className="filterSearch">
              <Form.Item
                name="selectedPriority"
                label="درجة الأولوية"
                rules={[
                  {
                    required: true,
                    message: "من فضلك قم بإختيار أولوية المهمة",
                  },
                ]}
              >
                <Select
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear
                  defaultValue={this.state.selectedPriority}
                  className="dont-show"
                  onChange={this.selectPriority}
                  value={this.state.selectPriority}
                >
                  {this.props.Priorities.map((priority, index) => (
                    <Option value={priority.id}>{priority.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item
                name="outputs"
                label="المخرجات"
                rules={[
                  {
                    required: true,
                    message: "من فضلك ادخل مخرج واحد علي الأقل",
                  },
                ]}
              >
                <Select
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  defaultValue={this.state.selectedoutputs}
                  allowClear
                  className="dont-show"
                  onChange={this.handleSelectOutput}
                  mode="multiple"
                  value={this.state.selectedoutputs}
                >
                  {this.props.Outputs && this.props.Outputs.length !== 0
                    ? this.props.Outputs.map((output, index) => (
                        <Option value={output.id}>{output.name}</Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 24 }}>
              {" "}
              <Form.Item
                name="description"
                label="تفاصيل المهمة"
                rules={[
                  { required: true, message: "من فضلك إدخل تفاصيل المهمة" },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={500}
                  name="taskDetails"
                  onChange={this.onChange}
                  defaultValue={this.state.taskDetails}
                  value={this.state.taskDetails}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col xs={{ span: 24 }}>
              <Form.Item
                name="notes"
                label="الملاحظات"
                rules={[{ required: false }]}
              >
                <TextArea
                  showCount
                  maxLength={300}
                  name="taskNotes"
                  defaultValue={this.state.taskNotes}
                  onChange={this.onChange}
                  value={this.state.taskNotes}
                />
              </Form.Item>
            </Col>
          </Row> */}
          {/* <div style={{ display: "flex", alignContent: "flex-start" }}>
            <Checkbox onChange={this.onselectQA}>توكيد الجودة</Checkbox>
          </div> */}

          <Row>
            {" "}
            <Col style={{ float: "right" }}>
              {this.state.requestAttach.length !== 0 &&
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
                            className="ml-2"
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
            </Col>
            <Col xs={{ span: 24 }}>
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
            </Col>{" "}
          </Row>
          <Row className="formButtons pt-4">
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                className="addbtn"
                htmlType="submit"
                size="large"
                onClick={this.EditTask}
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
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  Priorities: state.Tasks.Priorities,
  Outputs: state.Tasks.OutPuts,
  Groups: state.Groups.Groups,
  TaskDetails: state.Tasks.TaskDetails,
});
const mapDispatchToProps = {
  addNewTask,
  getTaskDetails,
  editTask,
  editArchivedTask,
  getTasksList,
  getTeamTasksList,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(EditTaskForm));
