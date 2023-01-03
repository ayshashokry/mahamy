import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Row, Col, Button, notification, Tag, Select } from "antd";
import PreLoading from "../layout/PreLoading";
import { getTaskRegularEmployees, reassignTaskByQA } from "../../api/tasksApi";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TaskReassign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      allRegularEmployees: [],
      reassignedEmployeesIds: [],
      reassignBtnDisable: false,
    };
  }

  async componentDidMount() {
    const { taskId } = this.props;
    this.setState({ loading: true });
    const allRegularEmployees = await getTaskRegularEmployees(taskId);
    const reassignedEmployees = await getTaskRegularEmployees(taskId, true);
    const reassignedEmployeesIds = reassignedEmployees.map((e) => e.id);
    this.setState({
      loading: false,
      allRegularEmployees,
      reassignedEmployeesIds,
    });
  }

  handleSelectionChange = (value) => {
    this.setState({ reassignedEmployeesIds: value });
  };

  reassignEmployees = async () => {
    const { taskId, onHide } = this.props;
    const { reassignedEmployeesIds } = this.state;
    this.setState({ reassignBtnDisable: true });
    const employees = await reassignTaskByQA(taskId, reassignedEmployeesIds);
    onHide();
    notification.open({
      description:
        employees.length > 0
          ? "سوف يتم الرجوع للموظفين المختارين بمجرد الإنهاء"
          : "لم يتم اختيار أي موظف.. اسحب للمكتملة  للإنهاء بنجاح",
      duration: 3,
    });
  };

  render() {
    const {
      loading,
      allRegularEmployees,
      reassignedEmployeesIds,
      reassignBtnDisable,
    } = this.state;
    const { Option } = Select;

    return (
      <Modal
        onHide={this.props.onHide}
        show={this.props.show}
        backdrop="static"
        className="TaskDetailsModal"
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <Row>
              <Col span={18}>
                <h5>
                  <FontAwesomeIcon icon={faPlusCircle} className="circle" />
                  اعتراض على إنهاء مهمة
                </h5>
              </Col>
              <Col span={6}>
                <h4>
                  <i
                    className="fas fa-times closeModal"
                    onClick={this.props.onHide}
                  ></i>
                </h4>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <PreLoading />
          ) : (
            <>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="اختر الموظفين "
                defaultValue={reassignedEmployeesIds}
                onChange={this.handleSelectionChange}
              >
                {allRegularEmployees.map((e, i) => (
                  <Option key={`emp${i}`} value={e.id}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Row className="formButtons pt-4">
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                className="detailsBtn"
                size="large"
                onClick={this.reassignEmployees}
                htmlType="submit"
                disabled={reassignBtnDisable || loading}
                loading={reassignBtnDisable && !loading}
              >
                تم
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TaskReassign;
