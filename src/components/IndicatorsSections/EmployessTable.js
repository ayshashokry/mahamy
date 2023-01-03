import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { Pagination, ConfigProvider, Image, Row, Col } from "antd";
import { NoPrint } from "react-easy-print";
import { Button, Container } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import vision from "../../assets/images/vision.png";
import logo from "../../assets/images/logo@3x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

class EmployeesTable extends Component {
  constructor(props) {
    super(props);
    this.printTable = React.createRef();
  }

  render() {
    return (
      <div ref={this.printTable} className="printTables p-4">
        {" "}
        <Row className="mb-5 pb-5 onlyPrint" style={{ width: "100%" }}>
          <Col span={4}>
            {" "}
            <Image width={200} src={logo} />
          </Col>
          <Col span={15} className="text-center pt-5 printTitle">
            <h4>مؤشرات الاداء- تطبيق مهامى</h4>
          </Col>
          <Col span={4}>
            <Image width={200} src={vision} className="pt-5" />
          </Col>
        </Row>
        {this.props.paginationEmployees !== undefined &&
        this.props.paginationEmployees.length !== 0 ? (
          <>
            <div className="title mb-3">
              <h4>
                الموظفين{" "}
                <span className="px-3">{this.props.employeesItemsNumber}</span>
                <span style={{ float: "left" }}>
                  <ReactToPrint
                    trigger={() => (
                      <Button className="printBtn priBtnDesk">
                        <FontAwesomeIcon icon={faPrint} />
                      </Button>
                    )}
                    content={() => this.printTable.current}
                  />
                </span>{" "}
              </h4>
            </div>
            <React.Fragment>
              <Table className="dashBoardTable">
                <thead>
                  <tr>
                    <th>اسم الموظف</th>
                    <th className="text-center"> قبل الموعد</th>
                    <th className="text-center"> في الموعد </th>
                    <th className="text-center"> بعد الموعد </th>
                    <th className="text-center"> المهام المتأخرة </th>
                    <th className="text-center"> كل المهام </th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.paginationEmployees.map((emp, index) => (
                    <tr
                      key={index}
                      style={
                        {
                          // borderBottom: "1px solid #d4d6de",
                        }
                      }
                    >
                      <td>{emp.empName}</td>
                      <td className="text-center">{emp.beforeDue}</td>
                      <td className="text-center">{emp.onDue}</td>
                      <td className="text-center">{emp.afterDue}</td>
                      <td className="text-center">{emp.delayed}</td>
                      <td className="text-center">
                        {emp.beforeDue +
                          emp.onDue +
                          emp.afterDue +
                          emp.delayed +
                          emp.current}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <div class="footer-space">&nbsp;</div>
                    </td>
                  </tr>
                </tfoot>
              </Table>
              <NoPrint>
                {" "}
                <ConfigProvider direction="rtl">
                  <Pagination
                    className="pt-3"
                    pageSize={10}
                    total={this.props.employeesItemsNumber}
                    defaultCurrent={1}
                    onChange={this.props.onChangeEmployeesPagination}
                  />
                </ConfigProvider>
              </NoPrint>
            </React.Fragment>
          </>
        ) : null}{" "}
        <div className="printFooter p-3 text-center onlyPrint">
          <Container>
            <Row>
              <Col span={{ span: 24 }}>
                <h4> مؤشرات الأداء-تطبيق مهامى</h4>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // EmployeesCount: state.Indicators.EmployeesCount,
});
export default connect(mapStateToProps)(EmployeesTable);
