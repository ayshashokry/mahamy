import React, { PureComponent } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Row, Col } from "antd";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";

class PirPrint extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/3Leoa7f4/";

  render() {
    const CategoriespieInfo = [
      {
        type: "جديدة",
        color: "#55d8fe",
        number: this.props.categoriesPieChartData.notYetStarted,
      },
      {
        type: "متأخرة",
        color: "#ff8373",
        number: this.props.categoriesPieChartData.pastDue,
      },
      {
        type: "قيد التنفيذ",
        color: "#ffda83",
        number: this.props.categoriesPieChartData.current,
      },
      {
        type: "مكتملة",
        color: "#a3a0fb",
        number: this.props.categoriesPieChartData.finished,
      },
      {
        type: "مؤرشفة",
        color: "#a0fba0",
        number: this.props.categoriesPieChartData.archived,
      },
    ];
    const TaskspieInfo = [
      {
        type: "جديدة",
        color: "#55d8fe",
        number: this.props.TasksInCategoryPieChartData.notYetStarted,
      },
      {
        type: "متأخرة",
        color: "#ff8373",
        number: this.props.TasksInCategoryPieChartData.pastDue,
      },
      {
        type: "قيد التنفيذ",
        color: "#ffda83",
        number: this.props.TasksInCategoryPieChartData.current,
      },
      {
        type: "مكتملة",
        color: "#a3a0fb",
        number: this.props.TasksInCategoryPieChartData.finished,
      },
      {
        type: "مؤرشفة",
        color: "#a0fba0",
        number: this.props.TasksInCategoryPieChartData.archived,
      },
    ];
    const EmployeepieInfo = [
      {
        type: "قبل الموعد",
        color: "#55d8fe",
        number: this.props.EmployeePieChartData.beforeDue,
      },
      {
        type: "في الموعد",
        color: "#a0fba0",
        number: this.props.EmployeePieChartData.onDue,
      },
      {
        type: "بعد الموعد",
        color: "#ffda83",
        number: this.props.EmployeePieChartData.afterDue,
      },
    ];
    const Categoriesdata = [
      { name: "حديدة", value: this.props.categoriesPieChartData.notYetStarted },
      { name: " متأخرة", value: this.props.categoriesPieChartData.pastDue },
      {
        name: " قيد التنفيذ",
        value: this.props.categoriesPieChartData.current,
      },
      { name: "مكتملة ", value: this.props.categoriesPieChartData.finished },
      { name: "مؤرشفة ", value: this.props.categoriesPieChartData.archived },
    ];
    const Taskssdata = [
      {
        name: "حديدة",
        value: this.props.TasksInCategoryPieChartData.notYetStarted,
      },
      {
        name: " متأخرة",
        value: this.props.TasksInCategoryPieChartData.pastDue,
      },
      {
        name: " قيد التنفيذ",
        value: this.props.TasksInCategoryPieChartData.current,
      },
      {
        name: "مكتملة ",
        value: this.props.TasksInCategoryPieChartData.finished,
      },
      {
        name: "مؤرشفة ",
        value: this.props.TasksInCategoryPieChartData.archived,
      },
    ];
    const employeesdata = [
      {
        name: "قبل الموعد",
        value: this.props.EmployeePieChartData.beforeDue,
      },
      {
        name: " في الموعد",
        value: this.props.EmployeePieChartData.onDue,
      },
      {
        name: " بعد الموعد",
        value: this.props.EmployeePieChartData.afterDue,
      },
    ];
    const COLORS = ["#55d8fe", "#ff8373", "#ffda83", "#a3a0fb", "#a0fba0"];
    const empCOLORS = ["#55d8fe", "#a0fba0", "#ffda83"];

    return (
      <div>
        {(this.props.selectedCategoryId.length == 0 ||
          this.props.selectedCategoryId == "all") &&
        (this.props.selectedEmpId == 0 || this.props.selectedEmpId == "all") ? (
          <>
            <Row>
              <Col span={14}>
                <PieChart
                  width={300}
                  height={210}
                  onMouseEnter={this.onPieEnter}
                >
                  <Pie
                    data={Categoriesdata}
                    // cx={120}
                    // cy={200}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {Categoriesdata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </Col>
              <Col span={10}>
                <div className="pieInfo">
                  {CategoriespieInfo.map((info, index) => (
                    <Container>
                      <Row className="CardBtns pt-3">
                        <Col span={5} style={{ textAlign: "right" }}>
                          <p>
                            <span
                              className="pieInfoCircle"
                              style={{ borderColor: info.color }}
                            ></span>
                            <span className="pieType">{info.type}</span>
                          </p>
                        </Col>
                        <Col
                          span={18}
                          style={{ textAlign: "right" }}
                          className="pieNumber"
                        >
                          {info.number}
                        </Col>
                      </Row>
                    </Container>
                  ))}
                </div>
              </Col>
            </Row>
          </>
        ) : this.props.selectedCategoryId.length !== 0 &&
          this.props.selectedCategoryId !== "all" &&
          (this.props.selectedEmpId == 0 ||
            this.props.selectedEmpId == "all") ? (
          <>
            <Row>
              <Col span={14}>
                <PieChart
                  width={300}
                  height={210}
                  onMouseEnter={this.onPieEnter}
                >
                  <Pie
                    data={Taskssdata}
                    // cx={120}
                    // cy={200}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {Taskssdata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>{" "}
              </Col>
              <Col span={10}>
                <div className="pieInfo">
                  {TaskspieInfo.map((info, index) => (
                    <Container>
                      <Row className="CardBtns pt-3">
                        <Col span={5} style={{ textAlign: "right" }}>
                          <p>
                            <span
                              className="pieInfoCircle"
                              style={{ borderColor: info.color }}
                            ></span>
                            <span className="pieType">{info.type}</span>
                          </p>
                        </Col>
                        <Col
                          span={18}
                          style={{ textAlign: "right" }}
                          className="pieNumber"
                        >
                          {info.number}
                        </Col>
                      </Row>
                    </Container>
                  ))}
                </div>{" "}
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col span={14}>
              <PieChart width={300} height={210} onMouseEnter={this.onPieEnter}>
                <Pie
                  data={employeesdata}
                  // cx={120}
                  // cy={200}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {employeesdata.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={empCOLORS[index % empCOLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Col>
            <Col span={10}>
              <div className="pieInfo">
                {EmployeepieInfo.map((info, index) => (
                  <Container>
                    <Row className="CardBtns pt-3">
                      <Col span={5} style={{ textAlign: "right" }}>
                        <p>
                          <span
                            className="pieInfoCircle"
                            style={{ borderColor: info.color }}
                          ></span>
                          <span className="pieType">{info.type}</span>
                        </p>
                      </Col>
                      <Col
                        span={18}
                        style={{ textAlign: "right" }}
                        className="pieNumber"
                      >
                        {info.number}
                      </Col>
                    </Row>
                  </Container>
                ))}
              </div>{" "}
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(PirPrint);
