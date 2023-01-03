import React, { Component } from "react";
import { Table, Dropdown } from "react-bootstrap";

export default class SubTasksTable extends Component {
  render() {
    return (
      <>
        <div className="title mb-3">
          <h4>
            المهام الفرعية <span>50</span>
          </h4>
        </div>
        <React.Fragment>
          <Table className="dashBoardTable">
            <thead>
              <tr>
                <th> اسم المهمة/ رقم المعاملة</th>
                <th>التقييم</th>
                <th style={{ textAlign: "left" }}>عدد الموظفين</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>اسم مهمة فرعية اولي</td> <td>قبل الموعد</td>
                <td className="employeesNum" style={{ textAlign: "left" }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <span>05</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="employeDrop">
                      <Dropdown.Item>
                        <h6>
                          <span>05</span> الموظفين
                        </h6>
                        <p>احمد محمد</p>
                        <p> سعيد جمال</p>
                        <p>عمرو جمال</p>
                        <p>محمد خليل </p>
                        <p>كمال أحمد</p>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      </>
    );
  }
}
