import React, { Component } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Col,
  Checkbox,
  Row,
  Spin,
} from "antd";
import PreLoading from "../layout/PreLoading";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import { CloudUploadOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import {
  addNewTask,
  getTasksList,
  getTeamTasksList,
} from "../../redux/actions/TasksActions";
import { Container, Dropdown } from "react-bootstrap";
import DatePicker from "@deskpro/react-datepicker-hijri";
import moment from "moment-hijri";
import {
  getEmpList,
  clearEmpList,
  clearAllEmp,
} from "../../redux/actions/GroupsActions";
import { baseUrl, fileUrl } from "../../api/baseUrl";
import { getNextWorkingDay } from "../../api/workingDaysApi";
import Search from "antd/lib/input/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
// import { result } from "lodash";
let selectF = [];
let reqAtt = [];
let QAEmpOptions = [];
class AddSubTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: "",
      dueDateLoading: false,
      numWorkingDays: "",
      qaPeriodInDays: 1,
      selectedPriority: "",
      taskName: "",
      taskDetails: "",
      selectedEmployees: [],
      QAEmployees: [],
      selectedGroups: [],
      selectedoutputs: [],
      taskAttachments: [],
      checkQA: false,
      myGroups: [],
      finalEmpValues: [],
      finalQAEmpValues: [],
      CategoryGroups: [],
      EmpsToDelete: [],
      taskNotes: "",
      selectedFile: null,
      requestAttach: [],
      daterequired: true,
      buttonDisable: false,
      uploadStatus: "",
    };
  }

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  onSelectPriority = (value, e) => {
    this.setState({ selectedPriority: e.id });

    if (e.id == 2) {
      this.setState({ dueDate: moment().add(1, "d"), daterequired: false });
    } else {
      this.setState({ dueDate: null, daterequired: true });
    }
  };

  onselectOutput = (value, e) => {
    this.setState({ selectedoutputs: e.map((v) => v.id) });
  };
  onchangeGroup = (value, e) => {
    this.setState({ selectedGroups: e.map((v) => v.value) });
  };
  onSelect = (id, e) => {
    this.props.getEmpList(e.id);
  };
  onDeselect = (id, e) => {
    this.props.clearEmpList(e.id);
  };

  onSelectEmployee = (value, e) => {
    let final = [];
    this.setState({ EmpsToDelete: e });
    this.setState({ selectedEmployees: value });
    this.props.EmpInGroup.map((emIG) =>
      e.map((emp) => {
        if (emp.id == emIG.id) {
          final.push({
            employeeName: emIG.name,
            employeeId: emIG.id,
            status: 1,
          });
          this.setState({
            finalEmpValues: final,
          });
        }
      })
    );
    QAEmpOptions = this.props.EmpInGroup.filter(
      (o1) => !e.some((o2) => o1.id == o2.id)
    );
  };
  onSelectQAEmployee = (value, e) => {
    let final = [];
    this.setState({ EmpsToDelete: e });
    this.setState({ QAEmployees: value });
    this.props.EmpInGroup.map((emIG) =>
      e.map((emp) => {
        if (emp.id == emIG.id) {
          final.push({
            employeeName: emIG.name,
            employeeId: emIG.id,
            status: 1,
          });
          this.setState({
            finalQAEmpValues: final,
          });
        }
      })
    );
  };

  addTask = (e) => {
    let request = {};
    request.categoryId = this.props.selectedCategoryId;
    if (this.state.taskName) request.name = this.state.taskName;
    if (this.state.dueDate !== null)
      request.dueDate = moment(this.state.dueDate).format("iDD/iMM/iYYYY");
    if (this.state.selectedPriority)
      request.priorityId = this.state.selectedPriority;
    if (this.state.selectedoutputs.length !== 0)
      request.outputs = this.state.selectedoutputs;
    if (this.state.finalEmpValues.length !== 0)
      request.employees = this.state.finalEmpValues;

    if (this.state.taskDetails) request.description = this.state.taskDetails;
    if (this.state.checkQA) request.hasQA = this.state.checkQA;
    if (this.state.requestAttach)
      request.attachments = this.state.requestAttach;
    else {
      request.attachments = [];
    }
    if (this.state.finalQAEmpValues)
      request.QAEmployees = this.state.finalQAEmpValues;
    else {
      request.QAEmployees = [];
    }
    if (this.state.checkQA && this.state.qaPeriodInDays)
      request.qaPeriodInDays = this.state.qaPeriodInDays;
    else {
      request.qaPeriodInDays = "";
    }
    if (!this.state.checkQA) {
      if (
        this.state.taskName !== "" &&
        this.state.selectedPriority !== "" &&
        this.state.selectedEmployees.length !== 0 &&
        this.state.selectedoutputs.length !== 0 &&
        this.state.taskDetails !== "" &&
        this.state.dueDate !== null
      ) {
        this.props.addNewTask(request);
        this.props.onHide();
        this.props.clearAllEmp();
        this.props.confirmationAddTask();
        this.props.getTeamTasksList();
        this.setState({
          buttonDisable: false,
          uploadStatus: "",
          selectedFile: null,
          requestAttach: [],
        });
        selectF = [];
        reqAtt = [];
      }
    }

    if (this.state.checkQA) {
      if (
        this.state.taskName !== "" &&
        this.state.QAEmployees.length !== 0 &&
        this.state.qaPeriodInDays !== "" &&
        this.state.selectedPriority !== "" &&
        this.state.selectedEmployees.length !== 0 &&
        this.state.selectedoutputs.length !== 0 &&
        this.state.taskDetails !== "" &&
        this.state.dueDate !== null
      ) {
        this.props.addNewTask(request);
        this.props.onHide();
        this.props.clearAllEmp();
        this.props.confirmationAddTask();
        this.props.getTeamTasksList();
        this.setState({
          buttonDisable: false,
          uploadStatus: "",
          selectedFile: null,
          requestAttach: [],
        });
        selectF = [];
        reqAtt = [];
      }
    }
  };

  apiCallTimeOut = undefined;

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value }, () => {
      if (name === "numWorkingDays") {
        this.setDueDate(Number(value));
      } else if (name === "dueDate") {
        this.setState({ numWorkingDays: "" });
      }
    });
  };

  setDueDate = (numWorkingDays) => {
    clearTimeout(this.apiCallTimeOut);
    if (numWorkingDays > 0 && numWorkingDays <= 1000) {
      this.setState({ dueDate: "", dueDateLoading: true });
      this.apiCallTimeOut = setTimeout(async () => {
        let dueDate = await getNextWorkingDay(numWorkingDays);
        dueDate = moment(dueDate);
        this.setState({ dueDate, dueDateLoading: false });
      }, 500);
    } else {
      this.setState({ dueDateLoading: false });
    }
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
  componentDidMount() {
    this.props.clearAllEmp();
    let selectedCategory = this.props.Categories.filter(
      (c) => c.id == this.props.selectedCategoryId
    );
    this.setState({
      CategoryGroups: selectedCategory.map((s) =>
        s.groups !== null ? s.groups : this.state.CategoryGroups
      ),
    });
  }

  onHideForm = () => {
    this.props.onHide();
    this.props.clearAllEmp();
    this.setState({
      buttonDisable: false,
      uploadStatus: "",
      selectedFile: null,
      requestAttach: [],
    });
    selectF = [];
    reqAtt = [];
  };

  onCheckQA = (e) => {
    this.setState({ checkQA: e.target.checked });
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
      <Container className="addManiTaskForm">
        <h6>
          {
            this.props.Categories.find(
              (x) => x.id === this.props.selectedCategoryId
            ).name
          }
        </h6>
        <Form
          className="mt-4"
          initialValues={{ qaPeriodInDays: 1 }}
          layout="vertical"
          name="validate_other"
          //   onFinish={onFinish}
        >
          <Row>
            <Col md={{ span: 11 }} xs={{ span: 24 }}>
              <div className="input-div">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل اسم المهمة أو رقم المعاملة",
                      required: true,
                    },
                  ]}
                  label="اسم المهمة/ رقم المعاملة"
                  hasFeedback
                  name="taskName"
                  // validateStatus="error"
                  // help="Should be combination of numbers & alphabets"
                >
                  <Input
                    name="taskName"
                    onChange={this.onChange}
                    value={this.state.taskName}
                    placeholder="إدخل اسم المهمة"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={2}></Col>
            <Col md={{ span: 11 }} xs={{ span: 24 }} className="filterSearch">
              <Form.Item
                name="selectedPriority"
                label="درجة الأولوية"
                rules={[
                  {
                    required: true,
                    message: "من فضلك إدخل أولوية المهمة",
                  },
                ]}
                hasFeedback
              >
                <Select
                  virtual={false}
                  showSearch
                  allowClear
                  className="dont-show"
                  onChange={this.onSelectPriority}
                  value={this.state.selectedPriority}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {this.props.Priorities && this.props.Priorities.length !== 0
                    ? this.props.Priorities.map((priority, index) => (
                        <Select.Option
                          key={index}
                          value={priority.name}
                          id={priority.id}
                        >
                          {priority.name}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>{" "}
          <Row>
            <Col xs={{ span: 24 }}>
              {" "}
              <Form.Item
                name="taskDetails"
                label="تفاصيل المهمة"
                rules={[
                  { required: true, message: "من فضلك إدخل تفاصيل المهمة" },
                ]}
              >
                <Input.TextArea
                  showCount
                  maxLength={300}
                  name="taskDetails"
                  onChange={this.onChange}
                  value={this.state.taskDetails}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={{ span: 11 }} xs={{ span: 24 }} className="filterSearch">
              <Form.Item
                style={{ width: "100%" }}
                name="numWorkingDaysLabel"
                label="يُسَلَم خلال (أيام عمل)"
              >
                <Input
                  name="numWorkingDays"
                  onChange={this.onChange}
                  value={this.state.numWorkingDays}
                  placeholder="ادخل عدد أيام العمل"
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 2 }}></Col>{" "}
            <Col md={{ span: 11 }} xs={{ span: 24 }}>
              {this.state.dueDateLoading ? (
                <div className="dateLoading">
                  {" "}
                  <PreLoading />
                </div>
              ) : (
                <Form.Item
                  style={{ width: "100%" }}
                  name="dueDate"
                  label="تاريخ التسليم"
                  rules={[
                    {
                      required: this.state.daterequired,
                      message: "من فضلك قم بإدخال التاريخ",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholderText="&#xF073;     أختر تاريخ المهمة  "
                    onChangeRaw={this.handleDateChangeRaw}
                    selected={this.state.dueDate}
                    value={this.state.dueDate}
                    minDate={moment().toDate()}
                    onChange={(value) =>
                      this.onChange({
                        target: {
                          name: "dueDate",
                          value,
                        },
                      })
                    }
                    calendar="hijri"
                  />
                  {/* <i  name="dueDate" className="fas fa-calendar dateIcon"></i> */}
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col span={24}>
              <Form.Item
                label="المخرجات"
                name="selectedoutputs"
                rules={[
                  {
                    required: true,
                    message: "من فضلك قم بإختيار مخرج واحد علي الأقل",
                  },
                ]}
                hasFeedback
              >
                <Select
                  virtual={false}
                  showSearch
                  style={{ width: "100%" }}
                  allowClear
                  className="dont-show"
                  onChange={this.onselectOutput}
                  mode="multiple"
                  value={this.state.selectedoutputs}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {this.props.Outputs.map((output, index) => (
                    <Select.Option
                      key={index}
                      value={output.name}
                      id={output.id}
                    >
                      {output.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={{ span: 24 }}>
              <Form.Item
                label="إسناد إلى فريق"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  virtual={false}
                  showSearch
                  mode="multiple"
                  onDeselect={this.onDeselect}
                  onChange={this.onchangeGroup}
                  onSelect={this.onSelect}
                  value={this.state.selectedGroups}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {this.state.CategoryGroups !== null &&
                  this.state.CategoryGroups.length !== 0 &&
                  this.props.Groups &&
                  this.props.Groups.length !== 0
                    ? this.state.CategoryGroups.map((cg) =>
                        cg.map((g) =>
                          this.props.Groups.map((group, index) =>
                            g === group.id ? (
                              <Select.Option
                                key={index}
                                value={group.name}
                                id={group.id}
                              >
                                {group.name}
                              </Select.Option>
                            ) : null
                          )
                        )
                      )
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={{ span: 24 }}>
              <Form.Item
                name="selectedEmployees"
                label="إسناد إلى موظف"
                rules={[
                  {
                    required: true,
                    message: "من فضلك قم بإسناد المهمة لموظف علي الأقل",
                  },
                ]}
                hasFeedback
              >
                <Select
                  virtual={false}
                  showSearch
                  mode="multiple"
                  onChange={this.onSelectEmployee}
                  value={this.state.selectedEmployees}
                  // defaultValue={this.state.selectedEmployees}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {this.props.EmpInGroup && this.props.EmpInGroup.length !== 0
                    ? this.props.EmpInGroup.map((emp, index) => (
                        <Select.Option
                          key={index}
                          // groupId={emp.groupId}
                          id={emp.id}
                          value={emp.name}
                        >
                          {emp.name}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col span={24} style={{ margin: "4px 0" }}>
              <div
                style={{
                  display: "flex",
                  alignContent: "flex-start",
                }}
              >
                <Checkbox onChange={this.onCheckQA}>توكيد الجودة</Checkbox>
              </div>
            </Col>
          </Row>
          {this.state.checkQA ? (
            <Row className="mb-3 mt-5">
              <Col span={12}>
                <Form.Item
                  name="QAEmployees"
                  label=" إسناد إلى موظف توكيد الجودة"
                  rules={[
                    {
                      required: true,
                      message: "من فضلك قم بإضافة موظف جودة واحد علي الأقل",
                    },
                  ]}
                  hasFeedback
                >
                  <Select
                    virtual={false}
                    showSearch
                    mode="multiple"
                    onChange={this.onSelectQAEmployee}
                    value={this.state.QAEmployees}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {this.props.EmpInGroup && this.props.EmpInGroup.length !== 0
                      ? QAEmpOptions.map((emp, index) => (
                          <Select.Option
                            key={index}
                            id={emp.id}
                            value={emp.name}
                          >
                            {emp.name}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10}>
                <Form.Item
                  style={{ width: "100%" }}
                  name="qaPeriodInDays"
                  label="فترة توكيد الجودة"
                  rules={[
                    {
                      required: true,
                      message: "من فضلك قم بإدخال فترة توكيد الجودة",
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    name="qaPeriodInDays"
                    onChange={this.onChange}
                    value={this.state.qaPeriodInDays}
                    // defaultValue={this.state.qaPeriodInDays}
                    placeholder="ادخل فترة توكيد الجودة"
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <></>
          )}
          <br />
          <Row>
            <Col style={{ float: "right" }}>
              {this.state.requestAttach.length !== 0 &&
                this.state.requestAttach.map((f, index) => (
                  <div className="my-2" key={index}>
                    <span></span>
                    <span style={{ float: "right" }}>
                      <Dropdown style={{ wordBreak: "break-word" }}>
                        <Dropdown.Toggle variant="success">
                          <FontAwesomeIcon
                            icon={faEllipsisH}
                            style={{
                              color: "#0b2548",
                            }}
                            className="ml-2"
                          />
                        </Dropdown.Toggle>{" "}
                        {f.fileName}
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
              {/* <Form.Item
                name="upload"
                label="المرفقات"
                rules={[{ required: false }]}
              >
                <Upload
                  fileList={this.state.selectedFile}
                  onChange={this.setFile}
                  type="file"
                  multiple={true}
                  action={baseUrl + "/uploadMultifiles"}
                >
                  <Button block>
                    تحميل <CloudUploadOutlined />
                  </Button>
                </Upload>
              </Form.Item> */}
            </Col>
          </Row>
          <Row className="formButtons pt-4">
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                className="addbtn"
                size="large"
                onClick={this.addTask}
                htmlType="submit"
                disabled={this.state.buttonDisable}
              >
                إضافة
              </Button>
            </Col>
            <Col span={12}>
              <Button
                className="cancelbtn"
                size="large"
                onClick={this.onHideForm}
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
  Categories: state.Categories.FlatCategories,
  Outputs: state.Tasks.OutPuts,
  Groups: state.Groups.Groups,
  EmpInGroup: state.Groups.Employess,
});
const mapDispatchToProps = {
  addNewTask,
  getTasksList,
  getEmpList,
  clearEmpList,
  clearAllEmp,
  getTeamTasksList,
};
export default connect(mapStateToProps, mapDispatchToProps)(AddSubTaskForm);
