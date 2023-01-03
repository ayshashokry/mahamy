import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Pagination, ConfigProvider, Image, Row, Col } from "antd";
import { NoPrint } from "react-easy-print";
import { Container, Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import vision from "../../assets/images/vision.png";
import logo from "../../assets/images/logo@3x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

class CategoriesTable extends Component {
  constructor(props) {
    super(props);
    this.printTable = React.createRef();
  }
  async componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    console.log(this.props);
    const { t, CategoriesNameMap } = this.props;
    return (
      <div ref={this.printTable} className="printTables p-4">
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
        {(this.props.selectedCategoryId.length == 0 ||
          this.props.selectedCategoryId == "all") &&
        (this.props.selectedEmpId === 0 ||
          this.props.selectedEmpId === "all") ? (
          <>
            {this.props.paginationCategoris.length !== 0 ? (
              <div>
                <div className="title mb-3">
                  <h4>
                    المهام الرئيسية
                    <span className="px-3">
                      {this.props.categoriesItemsNumber}
                    </span>{" "}
                    <span style={{ float: "left" }}>
                      <ReactToPrint
                        trigger={() => (
                          <Button className="printBtn priBtnDesk">
                            <FontAwesomeIcon icon={faPrint} />
                          </Button>
                        )}
                        content={() => this.printTable.current}
                      />
                    </span>
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
                      {this.props.paginationCategoris.map((category, index) => (
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
                    <ConfigProvider direction="rtl">
                      <Pagination
                        showSizeChanger={false}
                        className="pt-3"
                        pageSize={10}
                        total={this.props.categoriesItemsNumber}
                        defaultCurrent={1}
                        onChange={this.props.onChangeCategoryPagination}
                      />
                    </ConfigProvider>
                  </NoPrint>
                </React.Fragment>
              </div>
            ) : null}
          </>
        ) : (this.props.selectedCategoryId.length !== 0 ||
            this.props.selectedCategoryId !== "all") &&
          (this.props.selectedEmpId === 0 ||
            this.props.selectedEmpId === "all") ? (
          <>
            {this.props.TasksInCategoryStats.length !== 0 ? (
              <>
                <div className="title mb-3">
                  <h4>
                    المهام الفرعية
                    <span className="px-3">
                      {this.props.TasksAllItemsCount}
                    </span>{" "}
                    <span style={{ float: "left" }}>
                      <ReactToPrint
                        trigger={() => (
                          <Button className="printBtn priBtnDesk">
                            <FontAwesomeIcon icon={faPrint} />
                          </Button>
                        )}
                        content={() => this.printTable.current}
                      />
                    </span>
                  </h4>
                </div>
                <React.Fragment>
                  <Table className="dashBoardTable">
                    <thead>
                      <tr>
                        <th>اسم المهمة </th>
                        <th>المهمة الرئيسية</th>
                        <th className="text-center">التقييم</th>
                        <th className="text-center">عدد الموظفين</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.TasksInCategoryStats.map((task, index) => (
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
                      ))}
                    </tbody>{" "}
                    <tfoot>
                      <tr>
                        <td>
                          <div class="footer-space">&nbsp;</div>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                  <NoPrint>
                    <ConfigProvider direction="rtl">
                      <Pagination
                        className="pt-3"
                        pageSize={10}
                        total={this.props.TasksAllItemsCount}
                        defaultCurrent={1}
                        showSizeChanger={false}
                        onChange={this.props.onChangeTasksPagination}
                      />
                    </ConfigProvider>
                  </NoPrint>
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
            {this.props.EmployeeTasksInCategoryStats.length !== 0 ? (
              <>
                <div className="title mb-3">
                  <h4>
                    المهام الفرعية
                    <span className="px-3">
                      {this.props.EmployeeTasksInCategoryStats.length}
                    </span>{" "}
                    <span style={{ float: "left" }}>
                      <ReactToPrint
                        trigger={() => (
                          <Button className="printBtn priBtnDesk">
                            <FontAwesomeIcon icon={faPrint} />
                          </Button>
                        )}
                        content={() => this.printTable.current}
                      />
                    </span>
                  </h4>
                </div>
                <React.Fragment>
                  <Table className="dashBoardTable">
                    <thead>
                      <tr>
                        <th>اسم المهمة </th>
                        <th>المهمة الرئيسية</th>
                        <th className="text-center">التقييم</th>
                        <th className="text-center">تاريخ التسليم المتوقع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.EmployeeTasksInCategoryStats.map(
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
                  <NoPrint>
                    <ConfigProvider direction="rtl">
                      <Pagination
                        className="pt-3"
                        pageSize={10}
                        total={this.props.TasksEmployeeAllItemsCount}
                        onChange={this.props.onChangeEmployeeTasksPagination}
                        showSizeChanger={false}
                      />
                    </ConfigProvider>
                  </NoPrint>
                </React.Fragment>
              </>
            ) : null}
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
  CategoriesNameMap: state.Categories.CategoriesNameMap,
  // CategoriesCount: state.Indicators.CategoriesCount,
  // TasksCountInCategory: state.Indicators.TasksCountInCategory,
  // TasksInCategory: state.Indicators.TasksInCategory,
});
export default connect(mapStateToProps)(
  withTranslation(["performance", "common"])(CategoriesTable)
);
