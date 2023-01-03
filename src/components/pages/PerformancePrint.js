import React from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Image } from "antd";

//Components Importing
import PiePrint from "../IndicatorsSections/PiePrint";
import CategoriesTablePrint from "../IndicatorsSections/CategoriesTablePrint";
import EmployeesTablePrint from "../IndicatorsSections/EmployeesTablePrint";
import vision from "../../assets/images/vision.png";
import logo from "../../assets/images/logo@3x.png";
import EmpTaskStatusCountTable from "../IndicatorsSections/EmpTaskStatusCountTable";

export default function PerformancePrint(props) {
  return (
    <div>
      <Row className="mb-5" style={{ width: "100%" }}>
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

      <PiePrint
        EmployeePieChartData={props.EmployeePieChartData}
        selectedEmpId={props.selectedEmpId}
        selectedCategoryId={props.selectedCategoryId}
        TasksInCategoryPieChartData={props.TasksInCategoryPieChartData}
        categoriesPieChartData={props.categoriesPieChartData}
      />
      <Col className="subTasksInd printTables" span={24}>
        <div className="breakPage">
          <CategoriesTablePrint
            TasksAllItemsCount={props.TasksAllItemsCount}
            categoriesItemsNumber={props.categoriesItemsNumber}
            categoriesStatsPrint={props.allCategories}
            categoriesPagesCount={props.categoriesPagesCount}
            TasksInCategoryStatsPrint={props.allTasksInCategory}
            TasksPagesCount={props.TasksPagesCount}
            selectedCategoryId={props.selectedCategoryId}
            fromDate={props.fromDate}
            toDate={props.toDate}
            selectedEmpId={props.selectedEmpId}
            TasksEmployeeAllItemsCount={props.TasksEmployeeAllItemsCount}
            EmployeeTasksInCategoryStatsPrint={props.allEmpTasksInCategory}
            EmployeeTasksPagesCount={props.EmployeeTasksPagesCount}
          />
        </div>
        <div class="footer-spacePie">&nbsp;</div>
        {(props.selectedEmpId === 0 || props.selectedEmpId === "all") &&
        (props.selectedCategoryId.length === 0 ||
          props.selectedCategoryId === "all") ? (
          <EmployeesTablePrint
            employessStatsPrint={props.allEmployees}
            EmployeesAllItemsCount={props.employeesItemsNumber}
            fromDate={props.fromDate}
            toDate={props.toDate}
          />
        ) : props.selectedEmpId > 0 ? (
          <EmpTaskStatusCountTable
            EmpTaskCountStats={props.EmpTaskCountStats}
          />
        ) : null}
      </Col>
      <div className="printFooter p-3 text-center">
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
