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
  getEmployeeTaskCountStats
} from "../../api/statisticsApi";
import PreLoading from "../layout/PreLoading";
import EmpTaskStatusCountTable from "../IndicatorsSections/EmpTaskStatusCountTable";
import PerformancePrint from "./PerformancePrint";
import { ConsoleWriter } from "istanbul-lib-report";

class PerfoTest extends Component {
  constructor(props) {
    super(props);
    this.content = React.createRef();
    this.state = {
      allCategories: [],
      paginationCategoris: [],
      categoriesItemsNumber: 0,
      categoriesPagesCount: 0,
      categoriesPieChartData: [],
      allEmployees: [],
      paginationEmployees: [],
      employeesItemsNumber: 0,
      employeesPagesCount: 0,
      selectedCategoryId: 0,
      selectedEmpId: 0,
      fromDate: undefined,
      toDate: undefined,
      loading: false,
      outputsStats: [],
      prioritiesStats: [],
      dataLoading: false
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let categoriesStats = await getCategoriesStatistics(1, 10, {});
    let allCategories = await getCategoriesStatistics(
      1,
      categoriesStats.totalItemsCount,
      {}
    );
    let employeesStats = await getEmployeesStatistics(1, 10, {});
    let allEmployees = await getEmployeesStatistics(
      1,
      categoriesStats.totalItemsCount,
      {}
    );
    this.setState({
      paginationCategoris: categoriesStats.items,
      categoriesPagesCount: categoriesStats.pagesCount,
      categoriesItemsNumber: categoriesStats.totalItemsCount,
      allCategories: allCategories,
      paginationEmployees: employeesStats.items,
      employeesPagesCount: employeesStats.pagesCount,
      employeesItemsNumber: employeesStats.totalItemsCount,
      allEmployees: allEmployees,
      loading: false,
      categoriesPieChartData: await getCategoryStatisticsPieChart(1, 2, {})
    });
  }

  onChangeCategoryPagination = async (page, pageSize) => {
    const request = {};
    if (this.state.selectedEmpId) request.employeeId = this.state.selectedEmpId;
    if (this.state.fromDate)
      request.from = moment(this.state.fromDate)
        .add(1, "day")
        .toISOString()
        .slice(
          0,
          moment(this.state.fromDate)
            .toISOString()
            .indexOf("T")
        );
    if (this.state.toDate)
      request.to = moment(this.state.toDate)
        .add(1, "day")
        .toISOString()
        .slice(
          0,
          moment(this.state.toDate)
            .toISOString()
            .indexOf("T")
        );
    let categoriesStats = await getCategoriesStatistics(
      page,
      pageSize,
      request
    );

    this.setState({
      paginationCategoris: categoriesStats.items,
      categoriesPagesCount: categoriesStats.pagesCount,
      dataLoading: false
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
        .slice(
          0,
          moment(fromDate)
            .toISOString()
            .indexOf("T")
        );
    if (toDate !== undefined)
      request.to = moment(toDate)
        .add(1, "day")
        .toISOString()
        .slice(
          0,
          moment(toDate)
            .toISOString()
            .indexOf("T")
        );
    if (categoryId !== "all") request.categoryId = categoryId;
    let employeeStats = await getEmployeesStatistics(1, 10, request);

    let categoriesPieChart = await getCategoryStatisticsPieChart(
      1,
      10,
      request
    );
    let categoriesStats = await getCategoriesStatistics(1, 10, request);

    let tasksStats = await getTasksInCategoryStatisticsTable(
      1,
      10,
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
    let employeePieChart = await getEmployeeStatisticsPieChart(request);
    let EmpTaskCountStats = await getEmployeeTaskCountStats(request);
    if (
      (categoryId !== 0 && categoryId !== "all") ||
      (EmpId !== 0 && EmpId !== "all")
    ) {
      (await getOutputsStatisticsCharts(request)).map(o => {
        outputsData.push({
          name: o.outputName,
          allCount: o.allCount,
          finishedCount: o.finishedCount
        });
      });
      this.setState({ outputsStats: outputsData });

      (await getPrioritiesStatisticsCharts(request)).map(o => {
        prioritiesData.push({
          name: o.priorityId == 1 ? "عادي" : o.priorityId == 2 ? "عاجل" : "سري",
          allCount: o.allCount,
          finishedCount: o.finishedCount
        });
      });
      this.setState({ prioritiesStats: prioritiesData });
    }

    if (fromDate !== undefined || toDate !== undefined) {
      this.setState({
        CategoriesPieChartData: categoriesPieChart,
        categoriesStats: categoriesStats.items,
        CategoriesPagesCount: categoriesStats.pagesCount,
        categoriesItemsNumber: categoriesStats.totalItemsCount,
        employessStats: employeeStats.items,
        EmployeesAllItemsCount: employeeStats.totalItemsCount,
        EmployeesPageCount: employeeStats.pagesCount,
        dataLoading: false,
        EmployeePieChartData: {},
        EmpTaskCountStats: {},
        TasksInCategoryPieChartData: {},
        TasksInCategoryStats: [],
        EmployeeTasksInCategoryStats: []
      });
    }
    if (
      categoryId == "all" ||
      (EmpId == "all" &&
        (categoryId == "all" || categoryId == 0) &&
        (fromDate !== undefined ||
          toDate !== undefined ||
          fromDate == undefined ||
          toDate == undefined))
    ) {
      this.setState({
        CategoriesPieChartData: categoriesPieChart,
        categoriesStats: categoriesStats.items,
        // categoriesStatsPrint: categoriesStatsPrint.items,
        CategoriesPagesCount: categoriesStats.pagesCount,
        categoriesItemsNumber: categoriesStats.totalItemsCount,
        dataLoading: false,

        EmployeePieChartData: {},
        EmpTaskCountStats: {},
        TasksInCategoryPieChartData: {},
        TasksInCategoryStats: [],
        // TasksInCategoryStatsPrint: [],
        EmployeeTasksInCategoryStats: []
      });
    }
    if (
      (EmpId == 0 || EmpId == "all") &&
      categoryId !== 0 &&
      categoryId !== "all" &&
      (fromDate !== undefined ||
        toDate !== undefined ||
        fromDate == undefined ||
        toDate == undefined)
    ) {
      this.setState({ dataLoading: true });

      this.setState({
        TasksInCategoryStats: tasksStats.items,
        // TasksInCategoryStatsPrint: tasksStatsPrint.items,
        TasksPagesCount: tasksStats.pagesCount,
        TasksAllItemsCount: tasksStats.totalItemsCount,
        TasksInCategoryPieChartData: tasksPieChart,
        dataLoading: false,
        EmployeePieChartData: {},
        EmpTaskCountStats: {},
        categoriesStats: [],
        EmployeeTasksInCategoryStats: []
      });
    }
    if (
      (categoryId !== 0 &&
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
        // EmployeeTasksInCategoryStatsPrint: employeesInTaskPrint.items,
        EmployeeTasksPagesCount: employeeInTaskStats.pagesCount,
        TasksEmployeeAllItemsCount: employeeInTaskStats.totalItemsCount,
        EmployeePieChartData: employeePieChart,
        EmpTaskCountStats: EmpTaskCountStats,
        dataLoading: false,
        TasksInCategoryPieChartData: {},
        categoriesStats: [],
        TasksInCategoryStats: []
        // TasksInCategoryStatsPrint: [],
      });
    }

    this.setState({
      selectedCategoryId: categoryId,
      selectedEmpId: EmpId,
      fromDate: fromDate,
      toDate: toDate
    });
  };

  render() {
   
    const { t } = this.props;

    return <>{this.state.loading ? <PreLoading /> : <></>}</>;
  }
}

export default connect(null)(
  withTranslation(["performance", "common"])(PerfoTest)
);

// <>
//   {!Object.values(this.state.CategoriesPieChartData).every(
//     o => o === 0
//   ) ||
//   (Object.values(this.state.CategoriesPieChartData).every(
//     o => o === 0
//   ) &&
//     (this.state.fromDate !== undefined ||
//       this.state.toDate !== undefined)) ? (
//     <Container fluid>
//       <PerformanceFilter onSelectFilters={this.onSelectFilters} />
//       {this.state.dataLoading ? (
//         <PreLoading />
//       ) : (
//         <div className="performanceIndicatorsPage">
//           {this.state.selectedCategoryId !== 0 &&
//           this.state.selectedCategoryId !== "all" &&
//           Object.values(this.state.TasksInCategoryPieChartData).every(
//             o => o === 0
//           ) &&
//           Object.values(this.state.EmpTaskCountStats).every(
//             o => o === 0
//           ) &&
//           this.state.TasksInCategoryStats.length == 0 &&
//           this.state.selectedEmpId !== 0 &&
//           this.state.selectedEmpId !== "all" &&
//           this.state.EmployeePieChartData.onDue == 0 &&
//           this.state.EmployeePieChartData.beforeDue == 0 &&
//           this.state.EmployeePieChartData.afterDue == 0 &&
//           this.state.EmployeeTasksInCategoryStats.length ===
//             0 ? null : (
//             <Row>
//               <Col
//                 className="subTasksInd "
//                 lg={{ span: 15 }}
//                 xs={{ span: 24 }}
//               >
//                 {this.state.categoriesStats.length == 0 &&
//                 this.state.TasksInCategoryStats.length == 0 &&
//                 Object.keys(this.state.EmpTaskCountStats).length == 0 &&
//                 this.state.EmployeeTasksInCategoryStats.length == 0 ? (
//                   <h3
//                     style={{
//                       position: "absolute",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       left: "40%"
//                     }}
//                     className="NoDataH3"
//                   >
//                     لا توجد نتائج
//                   </h3>
//                 ) : (
//                   <CategoriesTable
//                     tasksLoading={this.state.tasksLoading}
//                     employeesTasksLoading={
//                       this.state.employeesTasksLoading
//                     }
//                     categoriesLoading={this.state.categoriesLoading}
//                     TasksAllItemsCount={this.state.TasksAllItemsCount}
//                     categoriesItemsNumber={
//                       this.state.categoriesItemsNumber
//                     }
//                     categoriesStats={this.state.categoriesStats}
//                     onChangeCategoryPagination={
//                       this.onChangeCategoryPagination
//                     }
//                     CategoriesPagesCount={
//                       this.state.CategoriesPagesCount
//                     }
//                     TasksInCategoryStats={
//                       this.state.TasksInCategoryStats
//                     }
//                     TasksPagesCount={this.state.TasksPagesCount}
//                     onChangeTasksPagination={
//                       this.onChangeTasksPagination
//                     }
//                     selectedCategoryId={this.state.selectedCategoryId}
//                     fromDate={this.state.fromDate}
//                     toDate={this.state.toDate}
//                     selectedEmpId={this.state.selectedEmpId}
//                     TasksEmployeeAllItemsCount={
//                       this.state.TasksEmployeeAllItemsCount
//                     }
//                     EmployeeTasksInCategoryStats={
//                       this.state.EmployeeTasksInCategoryStats
//                     }
//                     onChangeEmployeeTasksPagination={
//                       this.onChangeEmployeeTasksPagination
//                     }
//                     EmployeeTasksPagesCount={
//                       this.state.EmployeeTasksPagesCount
//                     }
//                   />
//                 )}
//                 {(this.state.selectedEmpId === 0 ||
//                   this.state.selectedEmpId === "all") &&
//                 (this.state.selectedCategoryId === 0 ||
//                   this.state.selectedCategoryId === "all") ? (
//                   <EmployessTable
//                     loading={this.state.dataLoading}
//                     employessStats={this.state.employessStats}
//                     employeesLoading={this.state.employeesLoading}
//                     EmployeesAllItemsCount={
//                       this.state.EmployeesAllItemsCount
//                     }
//                     onChangeEmployeesPagination={
//                       this.onChangeEmployeesPagination
//                     }
//                     fromDate={this.state.fromDate}
//                     toDate={this.state.toDate}
//                   />
//                 ) : this.state.selectedEmpId > 0 ? (
//                   <EmpTaskStatusCountTable
//                     EmpTaskCountStats={this.state.EmpTaskCountStats}
//                   />
//                 ) : null}
//               </Col>
//               <Col lg={{ span: 1 }} xs={{ span: 0 }}></Col>
//               <Col
//                 className="subTasksCircle "
//                 lg={{ span: 8 }}
//                 xs={{ span: 24 }}
//               >
//                 <Row className="CardBtns pt-4">
//                   <Col span={12} style={{ textAlign: "right" }}>
//                     {/* <h4>{t("common:subTasks")}</h4> */}
//                     {(this.state.selectedCategoryId == 0 ||
//                       this.state.selectedCategoryId == "all") &&
//                     (this.state.selectedEmpId == 0 ||
//                       this.state.selectedEmpId == "all") ? (
//                       <h4 className="p-3">المهام</h4>
//                     ) : this.state.selectedCategoryId !== 0 &&
//                       this.state.selectedCategoryId !== "all" &&
//                       (this.state.selectedEmpId == 0 ||
//                         this.state.selectedEmpId == "all") ? (
//                       <h4 className="p-3">المهام الفرعية</h4>
//                     ) : (
//                       <h4 className="p-3">مهام الموظف</h4>
//                     )}
//                   </Col>
//                   <Col span={12} style={{ textAlign: "left" }}>
//                     <PrintComponents
//                       trigger={
//                         <Button
//                           className="printBtn priBtnDesk"
//                           style={{ float: "left" }}
//                         >
//                           <i className="fas fa-print"></i> {t("print")}
//                         </Button>
//                       }
//                     >
//                       <ConfigProvider direction="rtl">
//                         <Print single>
//                           <PerformancePrint
//                             EmployeePieChartData={
//                               this.state.EmployeePieChartData
//                             }
//                             selectedEmpId={this.state.selectedEmpId}
//                             selectedCategoryId={
//                               this.state.selectedCategoryId
//                             }
//                             TasksInCategoryPieChartData={
//                               this.state.TasksInCategoryPieChartData
//                             }
//                             CategoriesPieChartData={
//                               this.state.CategoriesPieChartData
//                             }
//                             EmpTaskCountStats={
//                               this.state.EmpTaskCountStats
//                             }
//                             tasksLoading={this.state.tasksLoading}
//                             employeesTasksLoading={
//                               this.state.employeesTasksLoading
//                             }
//                             categoriesLoading={
//                               this.state.categoriesLoading
//                             }
//                             TasksAllItemsCount={
//                               this.state.TasksAllItemsCount
//                             }
//                             categoriesItemsNumber={
//                               this.state.categoriesItemsNumber
//                             }
//                             categoriesStats={this.state.categoriesStats}
//                             onChangeCategoryPagination={
//                               this.onChangeCategoryPagination
//                             }
//                             CategoriesPagesCount={
//                               this.state.CategoriesPagesCount
//                             }
//                             TasksInCategoryStats={
//                               this.state.TasksInCategoryStats
//                             }
//                             TasksPagesCount={this.state.TasksPagesCount}
//                             onChangeTasksPagination={
//                               this.onChangeTasksPagination
//                             }
//                             selectedCategoryId={
//                               this.state.selectedCategoryId
//                             }
//                             fromDate={this.state.fromDate}
//                             toDate={this.state.toDate}
//                             selectedEmpId={this.state.selectedEmpId}
//                             TasksEmployeeAllItemsCount={
//                               this.state.TasksEmployeeAllItemsCount
//                             }
//                             EmployeeTasksInCategoryStats={
//                               this.state.EmployeeTasksInCategoryStats
//                             }
//                             onChangeEmployeeTasksPagination={
//                               this.onChangeEmployeeTasksPagination
//                             }
//                             EmployeeTasksPagesCount={
//                               this.state.EmployeeTasksPagesCount
//                             }
//                             loading={this.state.dataLoading}
//                             employessStats={this.state.employessStats}
//                             employeesLoading={
//                               this.state.employeesLoading
//                             }
//                             EmployeesAllItemsCount={
//                               this.state.EmployeesAllItemsCount
//                             }
//                             onChangeEmployeesPagination={
//                               this.onChangeEmployeesPagination
//                             }
//                             fromDate={this.state.fromDate}
//                             toDate={this.state.toDate}
//                           />
//                         </Print>{" "}
//                       </ConfigProvider>
//                     </PrintComponents>
//                   </Col>
//                 </Row>

//                 <PieIndicator
//                   EmployeePieChartData={this.state.EmployeePieChartData}
//                   selectedEmpId={this.state.selectedEmpId}
//                   selectedCategoryId={this.state.selectedCategoryId}
//                   TasksInCategoryPieChartData={
//                     this.state.TasksInCategoryPieChartData
//                   }
//                   CategoriesPieChartData={
//                     this.state.CategoriesPieChartData
//                   }
//                 />
//               </Col>
//             </Row>
//           )}

//           {this.state.outputsStats.length !== 0 ||
//           this.state.prioritiesStats.length !== 0 ? (
//             <Row>
//               <Col
//                 className="outPutDashboard mt-3"
//                 md={{ span: 15 }}
//                 xs={{ span: 24 }}
//               >
//                 <div className="outputHeader">
//                   <h5 className="p-3">{t("subTasksOutput")}</h5>
//                   <p className="pt-4">
//                     <span className="ml-3">
//                       <span
//                         style={{ backgroundColor: "#011354" }}
//                         className="outPutColor"
//                       ></span>
//                       {t("common:allTasks")}
//                     </span>
//                     <span className="mr-3">
//                       <span
//                         style={{ backgroundColor: "#025358" }}
//                         className="outPutdoneColor"
//                       ></span>
//                       {t("common:finishedTasks")}
//                     </span>
//                   </p>
//                   <span></span>
//                 </div>
//                 <OutputsChart outputsData={this.state.outputsStats} />
//               </Col>
//               <Col md={{ span: 1 }} xs={{ span: 0 }}></Col>
//               <Col
//                 className="priorityDashboard mt-3"
//                 md={{ span: 8 }}
//                 xs={{ span: 24 }}
//               >
//                 {" "}
//                 <div className="outputHeader">
//                   <h5 className="p-3">{t("subTasksPriority")}</h5>
//                   <p className="pt-4">
//                     <span className="ml-3">
//                       <span
//                         style={{ backgroundColor: "#011354" }}
//                         className="outPutColor"
//                       ></span>
//                       {t("common:allTasks")}
//                     </span>
//                     <span className="mr-3">
//                       <span
//                         style={{ backgroundColor: "#025358" }}
//                         className="outPutdoneColor"
//                       ></span>
//                       {t("common:finishedTasks")}
//                     </span>
//                   </p>
//                   <span></span>
//                 </div>
//                 <PriorityChart
//                   prioritiesData={this.state.prioritiesStats}
//                 />
//               </Col>
//             </Row>
//           ) : null}
//         </div>
//       )}
//     </Container>
//   ) : (
//     <Container
//       style={{ position: "relative" }}
//       className="NoDataPage"
//       fluid
//     >
//       <h3
//         style={{
//           position: "absolute",
//           top: "50%",
//           transform: "translateY(-50%)",
//           left: "40%"
//         }}
//         className="NoDataH3"
//       >
//         البيانات غير كافية للإحصائيات
//       </h3>
//     </Container>
//   )}
// </>;
