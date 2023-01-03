import React, { Component } from "react";
import { Form, Select, Col, Row, Button } from "antd";
import { connect } from "react-redux";
import {
  addNewTask,
  getTaskDetails,
  editTask,
} from "../../redux/actions/TasksActions";
import { Container } from "react-bootstrap";
import DatePicker from "@deskpro/react-datepicker-hijri";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import {
  getEmpList,
  clearEmpList,
  clearAllEmp,
} from "../../redux/actions/GroupsActions";
import { saveTask } from "../../api/tasksApi";
import { notification } from "antd";
import { withTranslation } from "react-i18next";

let QAEmpOptions = [];

class ReAssignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployeesNames: this.props.employees.map((e) => e.employeeName),
      allCategoryGroups: [],
      selectedEmployees: [],
      QAEmployees: [],
      finalQAEmpValues: [],
      // selectedGroups: this.props.employees.map((e) => e.groupId),
      selectedGroups: [],
      toCheckEmp: [],
    };
  }

  EditTask = async (e) => {
    const { t } = this.props;
    e.preventDefault();

    const request = { ...this.props.task };
    request.employees = this.state.finalEmpValues;
    if (this.state.finalQAEmpValues)
      request.qaEmployees = this.state.finalQAEmpValues;
    else {
      request.qaEmployees = [];
    }
    request.qaPeriodInDays = this.props.qaPeriodInDays;

    if (this.state.selectedEmployees.length !== 0) {
      try {
        const task = await saveTask(request);
        this.props.editTask(task, false);
        this.props.reAssignConfirm();
        this.props.onHide();
        this.props.clearAllEmp();
        this.props.confirmationReassignTask();
      } catch (error) {
        const errorMsg = error.message.replace(/['"]+/g, "");
        this.showErrorNotification(t(errorMsg));
      }
    }
  };

  showErrorNotification(msg) {
    this.props.onHide();
    notification.error({
      description: msg,
      duration: 5,
    });
  }

  onChange = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value }, () => {});
  };

  handleSelectEmployee = (value, e) => {
    let final = [];
    this.setState({ EmpsToDelete: e });
    this.setState({ selectedEmployees: value });
    this.props.EmpInGroup.map((emIG) =>
      value.map((emp) => {
        if (emp === emIG.id) {
          final.push({
            employeeName: emIG.name,
            employeeId: emIG.id,
            groupId: emIG.groupId,
            status: 1,
          });
          this.setState({
            finalEmpValues: final,
          });
        }
      })
    );
    QAEmpOptions = this.props.EmpInGroup.filter(
      (o1) => !e.some((o2) => o1.id == o2.value)
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

  handleSelectGroup = (selectedGroups) => {
    this.setState({ selectedGroups });
  };
  onHideForm = (e) => {
    this.props.onHide();
    this.props.clearAllEmp();
  };
  onSelect = (id) => {
    this.props.getEmpList(id);
    let idFilters = this.props.employees.map((e) => e.employeeId);

    let final = this.props.EmpInGroup.filter(
      (emp) => !idFilters.includes(emp.id)
    );
  };
  onDeselect = (id) => {
    this.props.clearEmpList(id);
  };

  componentDidMount() {
    let Category = this.props.FlatCategories.filter(
      (c) => c.id == this.props.categoryId
    );
    this.setState({
      allCategoryGroups: Category.map((c) => c.groups),
    });
  }

  render() {
    console.log(QAEmpOptions);
    return (
      <Container className="addManiTaskForm">
        <Form name="subTaskForm" layout="vertical">
          <Row>
            <Col xs={{ span: 24 }}>
              <Form.Item
                name="team"
                label="إسناد إلى فريق"
                rules={[{ required: false }]}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear
                  className="dont-show"
                  onChange={this.handleSelectGroup}
                  mode="multiple"
                  onDeselect={this.onDeselect}
                  onSelect={this.onSelect}
                  value={this.state.selectedGroups}
                  defaultValue={[...new Set(this.state.selectedGroups)]}
                >
                  {this.state.allCategoryGroups.map((cg) =>
                    cg.map((g) =>
                      this.props.Groups.map((group, index) =>
                        g == String(group.id) ? (
                          <Select.Option value={group.id}>
                            {group.name}
                          </Select.Option>
                        ) : null
                      )
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }}>
              <Form.Item
                name="selectedEmployees"
                label="إسناد إلى موظف"
                rules={[
                  {
                    required: true,
                    message: "من فضلك قم بإختيار موظف واحد علي الأقل",
                  },
                ]}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear
                  className="dont-show"
                  onChange={this.handleSelectEmployee}
                  mode="multiple"
                  value={this.state.selectedEmployees}
                  // defaultValue={this.state.selectedEmployees}
                >
                  {this.props.EmpInGroup && this.props.EmpInGroup.length !== 0
                    ? this.props.EmpInGroup.map((emp) => (
                        <Select.Option groupId={emp.groupId} value={emp.id}>
                          {emp.name}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {this.props.hasQA ? (
            <Row className="mb-3 mt-5">
              <Col span={24}>
                <Form.Item
                  name="QAEmployees"
                  label=" إسناد إلى موظف توكيد الجودة"
                  rules={[
                    {
                      required: false,
                      // message: "من فضلك قم بإسناد المهمة لموظف علي الأقل",
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
            </Row>
          ) : (
            <></>
          )}

          <Row className="formButtons pt-4">
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                className="addbtn"
                htmlType="submit"
                size="large"
                onClick={this.EditTask}
              >
                تعديل
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
  Outputs: state.Tasks.OutPuts,
  Groups: state.Groups.Groups,
  TaskDetails: state.Tasks.TaskDetails,
  FlatCategories: state.Categories.FlatCategories,
  EmpInGroup: state.Groups.Employess,
});
const mapDispatchToProps = {
  addNewTask,
  getTaskDetails,
  editTask,
  getEmpList,
  clearAllEmp,
  clearEmpList,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(ReAssignForm));
