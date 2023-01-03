import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { withTranslation } from "react-i18next";

class EmpTaskCountStatsTable extends Component {
  render() {
    const { t, EmpTaskCountStats } = this.props;

    return (
      <>
        {EmpTaskCountStats !== undefined && EmpTaskCountStats.length !== 0 ? (
          <>
            <div className="title mb-3">
              <h4>
                حالة المهام{" "}
                <span>
                  {Object.values(EmpTaskCountStats).reduce((a, b) => a + b, 0)}
                </span>
              </h4>
            </div>
            <React.Fragment>
              <Table className="dashBoardTable">
                <thead>
                  <tr>
                    <th>الحالة</th>
                    <th className="text-center">العدد</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(EmpTaskCountStats).map((key, index) => (
                    <tr
                      key={index}
                      style={
                        {
                          // borderBottom: "1px solid #d4d6de",
                        }
                      }
                    >
                      <td>{t(key)}</td>
                      <td className="text-center">{EmpTaskCountStats[key]}</td>
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

export default withTranslation("performance")(EmpTaskCountStatsTable);
