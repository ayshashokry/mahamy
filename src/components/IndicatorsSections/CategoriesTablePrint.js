import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import axios from "axios";
import { Pagination, ConfigProvider } from "antd";
import PreLoading from "../layout/PreLoading";
import { NoPrint } from "react-easy-print";

import { getCategoriesStatistics } from "../../api/statisticsApi";

class CategoriesTablePrint extends Component {
  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, CategoriesNameMap } = this.props;
    return (
      <>
        {(this.props.selectedCategoryId.length === 0 ||
          this.props.selectedCategoryId === "all") &&
        (this.props.selectedEmpId === 0 ||
          this.props.selectedEmpId === "all") ? (
          <>
            {this.props.categoriesStatsPrint.length !== 0 ? (
              <>
                <div className="title mb-3">
                  <h4>
                    المهام الرئيسية
                    <span>{this.props.categoriesItemsNumber}</span>
                  </h4>
                </div>
                <React.Fragment>
                  <Table className="dashBoardTable mb-5">
                    <thead>
                      <tr>
                        <th>اسم المهمة الرئيسية</th>
                        <th className="text-center">عدد المهام الفرعية</th>
                        <th className="text-center">
                          {" "}
                          المهام الفرعية المكتملة
                        </th>
                        <th className="text-center">
                          {" "}
                          المهام الفرعية المتأخرة
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.categoriesStatsPrint.map(
                        (category, index) => (
                          <>
                            {" "}
                            <tr
                              key={index}
                              style={
                                {
                                  // borderBottom: "1px solid #d4d6de",
                                }
                              }
                            >
                              <td>{category.categoryName}</td>
                              <td className="text-center">
                                {category.allTasksCount}
                              </td>
                              <td className="text-center">
                                {category.finishedTasksCount}
                              </td>
                              <td className="text-center">
                                {category.pastDueCount}
                              </td>
                            </tr>{" "}
                          </>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>
                          <div class="footer-space">&nbsp;</div>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>{" "}
                </React.Fragment>
              </>
            ) : null}
          </>
        ) : (this.props.selectedCategoryId.length !== 0 ||
            this.props.selectedCategoryId !== "all") &&
          (this.props.selectedEmpId === 0 ||
            this.props.selectedEmpId === "all") ? (
          <>
            {this.props.TasksInCategoryStatsPrint.length !== 0 ? (
              <>
                <div className="title mb-3">
                  <h4>
                    المهام الفرعية
                    <span>{this.props.TasksAllItemsCount}</span>
                  </h4>
                </div>
                <React.Fragment>
                  <Table className="dashBoardTable">
                    <thead>
                      <tr>
                        <th>اسم المهمة</th>
                        <th>المهمة الرئيسية</th>
                        <th className="text-center">التقييم</th>
                        <th className="text-center">عدد الموظفين</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.TasksInCategoryStatsPrint.map(
                        (task, index) => (
                          <tr
                            key={index}
                            style={
                              {
                                // borderBottom: "1px solid #d4d6de",
                              }
                            }
                          >
                            <td>{task.taskName}</td>
                            <td>{CategoriesNameMap[task.categoryId]}</td>
                            <td className="text-center">
                              {" "}
                              {task.eval == "beforeDue"
                                ? "قبل الموعد"
                                : task.eval == "onDue"
                                ? "في الموعد"
                                : "بعد الموعد"}
                            </td>
                            <td className="text-center">
                              {task.qaEmpCount + task.regularEmpCount}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>{" "}
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
        ) : (this.props.selectedCategoryId.length !== 0 &&
            this.props.selectedCategoryId !== "all" &&
            this.props.selectedEmpId !== 0 &&
            this.props.selectedEmpId !== "all") ||
          (this.props.selectedEmpId !== 0 &&
            this.props.selectedEmpId !== "all") ? (
          <>
            {this.props.EmployeeTasksInCategoryStatsPrint.length !== 0 ? (
              <>
                <div className="title mb-3">
                  <h4>
                    المهام الفرعية
                    <span>{this.props.TasksEmployeeAllItemsCount}</span>
                  </h4>
                </div>
                <React.Fragment>
                  <Table className="dashBoardTable">
                    <thead>
                      <tr>
                        <th>اسم المهمة</th>
                        <th>المهمة الرئيسية</th>

                        <th className="text-center">التقييم</th>
                        <th className="text-center">تاريخ التسليم المتوقع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.EmployeeTasksInCategoryStatsPrint.map(
                        (task, index) => (
                          <tr
                            key={index}
                            style={
                              {
                                // borderBottom: "1px solid #d4d6de",
                              }
                            }
                          >
                            <td>{task.taskName}</td>
                            <td>{CategoriesNameMap[task.categoryId]}</td>
                            <td className="text-center">
                              {" "}
                              {task.eval == "beforeDue"
                                ? "قبل الموعد"
                                : task.eval == "onDue"
                                ? "في الموعد"
                                : "بعد الموعد"}
                            </td>
                            <td className="text-center">{task.dueDate}</td>
                          </tr>
                        )
                      )}
                    </tbody>{" "}
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
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  CategoriesNameMap: state.Categories.CategoriesNameMap,
  // CategoriesCount: state.Indicators.CategoriesCount,
  // TasksCountInCategory: state.Indicators.TasksCountInCategory,
  // TasksInCategory: state.Indicators.TasksInCategory,
});
export default connect(mapStateToProps)(
  withTranslation(["performance", "common"])(CategoriesTablePrint)
);
