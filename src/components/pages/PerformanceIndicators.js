import React, { Component } from "react";
//Packages Importing
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PrintComponents from "react-print-components";
import { Print } from "react-easy-print";
import { Container, Button } from "react-bootstrap";
import { ConfigProvider, Row, Col, Image } from "antd";
import moment from "moment-hijri";

//Components Importing
import PieIndicator from "../IndicatorsSections/PieIndicator";
import OutputsChart from "../IndicatorsSections/OutputsChart";
import PriorityChart from "../IndicatorsSections/PriorityChart";
import PerformanceFilter from "../IndicatorsSections/PerformanceFilter";
import CategoriesTable from "../IndicatorsSections/CategoriesTable";
import EmployessTable from "../IndicatorsSections/EmployessTable";

import {
  getCategoriesStatistics,
  getEmployeesStatistics,
  getCategoryStatisticsPieChart,
  getTasksInCategoryStatisticsTable,
  getEmployeeTasksInCategoryStatisticsTable,
  getTasksInCategoryStatisticsPieChart,
  getOutputsStatisticsCharts,
  getPrioritiesStatisticsCharts,
  getEmployeeStatisticsPieChart,
  getEmployeeTaskCountStats,
} from "../../api/statisticsApi";
import PreLoading from "../layout/PreLoading";
import EmpTaskStatusCountTable from "../IndicatorsSections/EmpTaskStatusCountTable";
import PerformancePrint from "./PerformancePrint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

class PerformanceIndicators extends Component {
  constructor(props) {
    super(props);
    this.content = React.createRef();
    this.state = {
      selectedCategoryId: [],
      selectedEmpId: 0,
      fromDate: undefined,
      toDate: undefined,
      loading: false,
      paginationCategoris: [],
      allCategories: [],
      allEmployees: [],
      categoriesPagesCount: 0,
      categoriesItemsNumber: 0,
      employeesItemsNumber: 0,
      TasksAllItemsCount: 0,
      TasksInCategoryPieChartData: {},
      categoriesPieChartData: [],
      TasksInCategoryStats: [],
      EmployeeTasksInCategoryStats: [],
      paginationEmployees: [],
      EmployeeTasksPagesCount: 0,
      TasksPagesCount: 0,
      TasksEmployeeAllItemsCount: 0,
      employeesPagesCount: 0,
      outputsStats: [],
      prioritiesStats: [],
      EmployeePieChartData: {},
      EmpTaskCountStats: {},
      dataLoading: false,
      allTasksInCategory: [],
      allEmpTasksInCategory: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let paginationCategoris = await getCategoriesStatistics(1, 10, {});
    let allCategories = await getCategoriesStatistics(
      1,
      paginationCategoris.totalItemsCount,
      {}
    );
    let employeesStats = await getEmployeesStatistics(1, 10, {});
    let allEmployees = await getEmployeesStatistics(
      1,
      employeesStats.totalItemsCount,
      {}
    );
    this.setState({
      paginationCategoris: paginationCategoris.items,
      categoriesPagesCount: paginationCategoris.pagesCount,
      categoriesItemsNumber: paginationCategoris.totalItemsCount,
      allCategories: allCategories.items,
      paginationEmployees: employeesStats.items,
      employeesPagesCount: employeesStats.pagesCount,
      employeesItemsNumber: employeesStats.totalItemsCount,
      allEmployees: allEmployees.items,
      loading: false,
      categoriesPieChartData: await getCategoryStatisticsPieChart(1, 2, {}),
    });
  }

  onChangeCategoryPagination = async (page, pageSize) => {
    const request = {};
    if (this.state.selectedEmpId) request.employeeId = this.state.selectedEmpId;
    if (this.state.fromDate)
      request.from = moment(this.state.fromDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.fromDate).toISOString().indexOf("T"));
    if (this.state.toDate)
      request.to = moment(this.state.toDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.toDate).toISOString().indexOf("T"));
    let paginationCategoris = await getCategoriesStatistics(
      page,
      pageSize,
      request
    );

    this.setState({
      paginationCategoris: paginationCategoris.items,
      categoriesPagesCount: paginationCategoris.pagesCount,
      dataLoading: false,
    });
  };
  onChangeTasksPagination = async (page, pageSize) => {
    const request = {};
    if (this.state.selectedEmpId) request.employeeId = this.state.selectedEmpId;
    if (this.state.fromDate)
      request.from = moment(this.state.fromDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.fromDate).toISOString().indexOf("T"));
    if (this.state.toDate)
      request.to = moment(this.state.toDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.toDate).toISOString().indexOf("T"));
    let tasksStats = await getTasksInCategoryStatisticsTable(
      page,
      pageSize,
      this.state.selectedCategoryId,
      request
    );

    this.setState({
      TasksInCategoryStats: tasksStats.items,
      TasksPagesCount: tasksStats.pagesCount,
      dataLoading: false,
    });
  };
  onChangeEmployeesPagination = async (page, pageSize) => {
    const request = {};
    if (this.state.fromDate)
      request.from = moment(this.state.fromDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.fromDate).toISOString().indexOf("T"));
    if (this.state.toDate)
      request.to = moment(this.state.toDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.toDate).toISOString().indexOf("T"));
    let employeesStats = await getEmployeesStatistics(page, pageSize, request);

    this.setState({
      paginationEmployees: employeesStats.items,
      employeesPagesCount: employeesStats.pagesCount,
      dataLoading: false,
    });
  };

  onChangeEmployeeTasksPagination = async (page, pageSize) => {
    const request = {};
    if (this.state.selectedEmpId) request.employeeId = this.state.selectedEmpId;
    if (this.state.fromDate)
      request.from = moment(this.state.fromDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.fromDate).toISOString().indexOf("T"));
    if (this.state.toDate)
      request.to = moment(this.state.toDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(this.state.toDate).toISOString().indexOf("T"));
    if (this.state.selectedCategoryId)
      request.categoryId = this.state.selectedCategoryId;
    let employeesTasksStats = await getEmployeeTasksInCategoryStatisticsTable(
      page,
      pageSize,
      request
    );
    let allEmpTasksInCategory = await getEmployeeTasksInCategoryStatisticsTable(
      1,
      employeesTasksStats.totalItemsCount,
      request
    );

    this.setState({
      allEmpTasksInCategory: allEmpTasksInCategory.items,
      EmployeeTasksInCategoryStats: employeesTasksStats.items,
      EmployeeTasksPagesCount: employeesTasksStats.pagesCount,
      dataLoading: false,
    });
  };
  onSelectFilters = async (categoryId, EmpId, fromDate, toDate) => {
    let outputsData = [];
    let prioritiesData = [];
    this.setState({ dataLoading: true });

    let request = {};
    if (EmpId !== "all") request.employeeId = EmpId;
    if (fromDate !== undefined)
      request.from = moment(fromDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(fromDate).toISOString().indexOf("T"));
    if (toDate !== undefined)
      request.to = moment(toDate)
        .add(1, "day")
        .toISOString()
        .slice(0, moment(toDate).toISOString().indexOf("T"));
    if (categoryId !== "all") request.categoryId = categoryId;
    let employeeStats = await getEmployeesStatistics(1, 10, request);
    let allEmployees = await getEmployeesStatistics(
      1,
      employeeStats.totalItemsCount,
      request
    );

    let categoriesPieChart = await getCategoryStatisticsPieChart(
      1,
      10,
      request
    );
    let paginationCategoris = await getCategoriesStatistics(1, 10, request);
    let allCategories = await getCategoriesStatistics(
      1,
      paginationCategoris.totalItemsCount,
      request
    );
    let tasksStats = await getTasksInCategoryStatisticsTable(
      1,
      10,
      categoryId,
      request
    );

    let allTasksInCategory = await getTasksInCategoryStatisticsTable(
      1,
      tasksStats.totalItemsCount,
      categoryId,
      request
    );
    let tasksPieChart = await getTasksInCategoryStatisticsPieChart(
      1,
      10,
      categoryId,
      request
    );

    let employeeInTaskStats = await getEmployeeTasksInCategoryStatisticsTable(
      1,
      10,
      request
    );
    let allEmpTasksInCategory = await getEmployeeTasksInCategoryStatisticsTable(
      1,
      employeeInTaskStats.totalItemsCount,
      request
    );
    let employeePieChart = await getEmployeeStatisticsPieChart(request);
    let EmpTaskCountStats = await getEmployeeTaskCountStats(request);

    if (
      (categoryId.length !== 0 && categoryId !== "all") ||
      (EmpId !== 0 && EmpId !== "all")
    ) {
      (await getOutputsStatisticsCharts(request)).map((o) => {
        outputsData.push({
          name: o.outputName,
          allCount: o.allCount,
          finishedCount: o.finishedCount,
        });
      });
      this.setState({ outputsStats: outputsData });

      (await getPrioritiesStatisticsCharts(request)).map((o) => {
        prioritiesData.push({
          name: o.priorityId == 1 ? "عادي" : o.priorityId == 2 ? "عاجل" : "سري",
          allCount: o.allCount,
          finishedCount: o.finishedCount,
        });
      });
      this.setState({ prioritiesStats: prioritiesData });
    }

    // if (fromDate !== undefined || toDate !== undefined) {
    //   this.setState({
    //     categoriesPieChartData: categoriesPieChart,
    //     paginationCategoris: paginationCategoris.items,
    //     allCategories: allCategories.items,
    //     categoriesPagesCount: paginationCategoris.pagesCount,
    //     categoriesItemsNumber: paginationCategoris.totalItemsCount,
    //     paginationEmployees: employeeStats.items,
    //     allEmployees: allEmployees.items,
    //     employeesItemsNumber: employeeStats.totalItemsCount,
    //     employeesPagesCount: employeeStats.pagesCount,
    //     dataLoading: false,
    //     EmployeePieChartData: {},
    //     EmpTaskCountStats: {},
    //     TasksInCategoryPieChartData: {},
    //     TasksInCategoryStats: [],
    //     EmployeeTasksInCategoryStats: [],
    //   });
    // }
    if (
      categoryId == "all" ||
      EmpId == "all" ||
      ((categoryId == "all" || categoryId.length == 0) &&
        (fromDate !== undefined ||
          toDate !== undefined ||
          fromDate == undefined ||
          toDate == undefined))
    ) {
      console.log(paginationCategoris);
      this.setState({
        categoriesPieChartData: categoriesPieChart,
        paginationCategoris: paginationCategoris.items,
        allCategories: allCategories.items,
        categoriesPagesCount: paginationCategoris.pagesCount,
        categoriesItemsNumber: paginationCategoris.totalItemsCount,
        dataLoading: false,

        EmployeePieChartData: {},
        EmpTaskCountStats: {},
        TasksInCategoryPieChartData: {},
        TasksInCategoryStats: [],
        EmployeeTasksInCategoryStats: [],
      });
    }
    if (
      (EmpId == 0 || EmpId == "all") &&
      categoryId.length > 0 &&
      categoryId !== "all" &&
      (fromDate !== undefined ||
        toDate !== undefined ||
        fromDate == undefined ||
        toDate == undefined)
    ) {
      this.setState({ dataLoading: true });

      this.setState({
        allTasksInCategory: allTasksInCategory.items,
        TasksInCategoryStats: tasksStats.items,
        TasksPagesCount: tasksStats.pagesCount,
        TasksAllItemsCount: tasksStats.totalItemsCount,
        TasksInCategoryPieChartData: tasksPieChart,
        dataLoading: false,
        EmployeePieChartData: {},
        EmpTaskCountStats: {},
        paginationCategoris: [],
        EmployeeTasksInCategoryStats: [],
      });
    }
    if (
      (categoryId.length !== 0 &&
        categoryId !== "all" &&
        EmpId !== 0 &&
        EmpId !== "all") ||
      (EmpId !== 0 &&
        EmpId !== "all" &&
        (fromDate !== undefined ||
          toDate !== undefined ||
          fromDate == undefined ||
          toDate == undefined))
    ) {
      this.setState({ dataLoading: true });

      this.setState({
        EmployeeTasksInCategoryStats: employeeInTaskStats.items,
        allEmpTasksInCategory: allEmpTasksInCategory.items,
        EmployeeTasksPagesCount: employeeInTaskStats.pagesCount,
        TasksEmployeeAllItemsCount: employeeInTaskStats.totalItemsCount,
        EmployeePieChartData: employeePieChart,
        EmpTaskCountStats: EmpTaskCountStats,
        dataLoading: false,
        TasksInCategoryPieChartData: {},
        paginationCategoris: [],
        TasksInCategoryStats: [],
      });
    }

    this.setState({
      selectedCategoryId: categoryId,
      selectedEmpId: EmpId,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  render() {
    const { t } = this.props;
    return (
      <>
        {this.state.loading ? (
          <PreLoading />
        ) : (
          <>
            {!Object.values(this.state.categoriesPieChartData).every(
              (o) => o === 0
            ) ||
            (Object.values(this.state.categoriesPieChartData).every(
              (o) => o === 0
            ) &&
              (this.state.fromDate !== undefined ||
                this.state.toDate !== undefined)) ? (
              <Container fluid>
                <PerformanceFilter onSelectFilters={this.onSelectFilters} />
                {this.state.dataLoading ? (
                  <PreLoading />
                ) : (
                  <div className="performanceIndicatorsPage">
                    {/* {this.state.selectedCategoryId.length !== 0 &&
                    this.state.selectedCategoryId !== "all" &&
                    Object.values(this.state.TasksInCategoryPieChartData).every(
                      (o) => o === 0
                    ) &&
                    Object.values(this.state.EmpTaskCountStats).every(
                      (o) => o === 0
                    ) &&
                    this.state.TasksInCategoryStats.length == 0 &&
                    this.state.selectedEmpId !== 0 &&
                    this.state.selectedEmpId !== "all" &&
                    this.state.EmployeePieChartData.onDue == 0 &&
                    this.state.EmployeePieChartData.beforeDue == 0 &&
                    this.state.EmployeePieChartData.afterDue == 0 &&
                    this.state.EmployeeTasksInCategoryStats.length ===
                      0 ? null : ( */}
                    <Row>
                      <Col
                        className="subTasksInd "
                        lg={{ span: 15 }}
                        xs={{ span: 24 }}
                      >
                        {/* TasksInCategoryPieChartData */}
                        {this.state.paginationCategoris.length == 0 &&
                        this.state.TasksInCategoryStats.length == 0 &&
                        this.state.allEmpTasksInCategory.length == 0 &&
                        this.state.EmployeeTasksInCategoryStats.length == 0 ? (
                          <h3 className="NoDataH3 p-4">لا توجد نتائج</h3>
                        ) : (
                          <CategoriesTable
                            allTasksInCategory={this.state.allTasksInCategory}
                            tasksLoading={this.state.tasksLoading}
                            TasksAllItemsCount={this.state.TasksAllItemsCount}
                            categoriesItemsNumber={
                              this.state.categoriesItemsNumber
                            }
                            paginationCategoris={this.state.paginationCategoris}
                            onChangeCategoryPagination={
                              this.onChangeCategoryPagination
                            }
                            categoriesPagesCount={
                              this.state.categoriesPagesCount
                            }
                            TasksInCategoryStats={
                              this.state.TasksInCategoryStats
                            }
                            TasksPagesCount={this.state.TasksPagesCount}
                            onChangeTasksPagination={
                              this.onChangeTasksPagination
                            }
                            selectedCategoryId={this.state.selectedCategoryId}
                            fromDate={this.state.fromDate}
                            toDate={this.state.toDate}
                            selectedEmpId={this.state.selectedEmpId}
                            TasksEmployeeAllItemsCount={
                              this.state.TasksEmployeeAllItemsCount
                            }
                            EmployeeTasksInCategoryStats={
                              this.state.EmployeeTasksInCategoryStats
                            }
                            onChangeEmployeeTasksPagination={
                              this.onChangeEmployeeTasksPagination
                            }
                            EmployeeTasksPagesCount={
                              this.state.EmployeeTasksPagesCount
                            }
                          />
                        )}
                        {(this.state.selectedEmpId === 0 ||
                          this.state.selectedEmpId === "all") &&
                        (this.state.selectedCategoryId.length == 0 ||
                          this.state.selectedCategoryId === "all") ? (
                          <EmployessTable
                            loading={this.state.dataLoading}
                            paginationEmployees={this.state.paginationEmployees}
                            employeesItemsNumber={
                              this.state.employeesItemsNumber
                            }
                            onChangeEmployeesPagination={
                              this.onChangeEmployeesPagination
                            }
                            fromDate={this.state.fromDate}
                            toDate={this.state.toDate}
                          />
                        ) : this.state.selectedEmpId > 0 ? (
                          <EmpTaskStatusCountTable
                            EmpTaskCountStats={this.state.EmpTaskCountStats}
                          />
                        ) : null}
                      </Col>
                      <Col lg={{ span: 1 }} xs={{ span: 0 }}></Col>
                      <Col
                        className="subTasksCircle "
                        lg={{ span: 8 }}
                        xs={{ span: 24 }}
                      >
                        <Row className="CardBtns pt-4">
                          <Col span={12} style={{ textAlign: "right" }}>
                            {(this.state.selectedCategoryId.length == 0 ||
                              this.state.selectedCategoryId == "all") &&
                            (this.state.selectedEmpId == 0 ||
                              this.state.selectedEmpId == "all") ? (
                              <h4 className="p-3">المهام</h4>
                            ) : this.state.selectedCategoryId.length !== 0 &&
                              this.state.selectedCategoryId !== "all" &&
                              (this.state.selectedEmpId == 0 ||
                                this.state.selectedEmpId == "all") ? (
                              <h4 className="p-3">المهام الفرعية</h4>
                            ) : (
                              <h4 className="p-3">مهام الموظف</h4>
                            )}
                          </Col>
                          <Col
                            span={12}
                            //  style={{ textAlign: "left" }}
                          >
                            <PrintComponents
                              trigger={
                                <Button className="printBtn priBtnDesk">
                                  <FontAwesomeIcon icon={faPrint} />
                                  {t("print")}
                                </Button>
                              }
                            >
                              <ConfigProvider direction="rtl">
                                <Print single>
                                  <PerformancePrint
                                    allEmpTasksInCategory={
                                      this.state.allEmpTasksInCategory
                                    }
                                    allTasksInCategory={
                                      this.state.allTasksInCategory
                                    }
                                    employeesStats={this.state.employeesStats}
                                    allEmployees={this.state.allEmployees}
                                    EmployeePieChartData={
                                      this.state.EmployeePieChartData
                                    }
                                    selectedEmpId={this.state.selectedEmpId}
                                    selectedCategoryId={
                                      this.state.selectedCategoryId
                                    }
                                    TasksInCategoryPieChartData={
                                      this.state.TasksInCategoryPieChartData
                                    }
                                    categoriesPieChartData={
                                      this.state.categoriesPieChartData
                                    }
                                    EmpTaskCountStats={
                                      this.state.EmpTaskCountStats
                                    }
                                    tasksLoading={this.state.tasksLoading}
                                    TasksAllItemsCount={
                                      this.state.TasksAllItemsCount
                                    }
                                    categoriesItemsNumber={
                                      this.state.categoriesItemsNumber
                                    }
                                    paginationCategoris={
                                      this.state.paginationCategoris
                                    }
                                    allCategories={this.state.allCategories}
                                    onChangeCategoryPagination={
                                      this.onChangeCategoryPagination
                                    }
                                    categoriesPagesCount={
                                      this.state.categoriesPagesCount
                                    }
                                    TasksInCategoryStats={
                                      this.state.TasksInCategoryStats
                                    }
                                    TasksPagesCount={this.state.TasksPagesCount}
                                    onChangeTasksPagination={
                                      this.onChangeTasksPagination
                                    }
                                    selectedCategoryId={
                                      this.state.selectedCategoryId
                                    }
                                    fromDate={this.state.fromDate}
                                    toDate={this.state.toDate}
                                    selectedEmpId={this.state.selectedEmpId}
                                    TasksEmployeeAllItemsCount={
                                      this.state.TasksEmployeeAllItemsCount
                                    }
                                    EmployeeTasksInCategoryStats={
                                      this.state.EmployeeTasksInCategoryStats
                                    }
                                    onChangeEmployeeTasksPagination={
                                      this.onChangeEmployeeTasksPagination
                                    }
                                    EmployeeTasksPagesCount={
                                      this.state.EmployeeTasksPagesCount
                                    }
                                    loading={this.state.dataLoading}
                                    paginationEmployees={
                                      this.state.paginationEmployees
                                    }
                                    employeesItemsNumber={
                                      this.state.employeesItemsNumber
                                    }
                                    onChangeEmployeesPagination={
                                      this.onChangeEmployeesPagination
                                    }
                                    fromDate={this.state.fromDate}
                                    toDate={this.state.toDate}
                                  />
                                </Print>
                              </ConfigProvider>
                            </PrintComponents>
                          </Col>
                        </Row>

                        <PieIndicator
                          EmployeePieChartData={this.state.EmployeePieChartData}
                          selectedEmpId={this.state.selectedEmpId}
                          selectedCategoryId={this.state.selectedCategoryId}
                          TasksInCategoryPieChartData={
                            this.state.TasksInCategoryPieChartData
                          }
                          categoriesPieChartData={
                            this.state.categoriesPieChartData
                          }
                        />
                      </Col>
                    </Row>
                    )}
                    {this.state.outputsStats.length !== 0 ||
                    this.state.prioritiesStats.length !== 0 ? (
                      <Row>
                        <Col
                          className="outPutDashboard mt-3"
                          md={{ span: 15 }}
                          xs={{ span: 24 }}
                        >
                          <OutputsChart outputsData={this.state.outputsStats} />
                        </Col>
                        <Col md={{ span: 1 }} xs={{ span: 0 }}></Col>
                        <Col
                          className="priorityDashboard mt-3"
                          md={{ span: 8 }}
                          xs={{ span: 24 }}
                        >
                          {" "}
                          <PriorityChart
                            prioritiesData={this.state.prioritiesStats}
                          />
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                )}
              </Container>
            ) : (
              <Container
                style={{ position: "relative" }}
                className="NoDataPage"
                fluid
              >
                <h3
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "40%",
                  }}
                  className="NoDataH3"
                >
                  البيانات غير كافية للإحصائيات
                </h3>
              </Container>
            )}
          </>
        )}
      </>
    );
  }
}

export default connect(null)(
  withTranslation(["performance", "common"])(PerformanceIndicators)
);
