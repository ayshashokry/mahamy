import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";

class EmployeesTablePrint extends Component {
  render() {
    return (
      <>
        {this.props.employessStatsPrint !== undefined &&
        this.props.employessStatsPrint.length !== 0 ? (
          <>
            <div className="title mb-3">
              <h4>
                الموظفين <span>{this.props.EmployeesAllItemsCount}</span>
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
                  {this.props.employessStatsPrint.map((emp, index) => (
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
            </React.Fragment>
          </>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // EmployeesCount: state.Indicators.EmployeesCount,
});
export default connect(mapStateToProps)(EmployeesTablePrint);
