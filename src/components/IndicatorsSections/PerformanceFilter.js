import React, { Component } from "react";
import { Select, Col, Row } from "antd";
import { connect } from "react-redux";
import DatePicker from "@deskpro/react-datepicker-hijri";
import "@deskpro/react-datepicker-hijri/dist/react-datepicker.css";
import { getEmpList, clearAllEmp } from "../../redux/actions/GroupsActions";
import { getCategoriesList } from "../../redux/actions/CategoriesActions";
import { getManagedGroupsWithUsers } from "../../api/groupsApi";
import { TreeSelect } from "antd";
const { SHOW_ALL } = TreeSelect;
class PerformanceFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEmployees: [],
      selectedCategoryNames: [],
      days: [
        { name: "متأخر", id: 1 },
        { name: "اليوم", id: 2 },
        { name: "غدا", id: 3 },
      ],
      formValues: {
        categoryId: [],
        employeeId: 0,
        fromDate: undefined,
        toDate: undefined,
      },
      startDate: "",
      endDate: "",
    };
  }
  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCategoriesList();

    let data = (await getManagedGroupsWithUsers())
      .map((x) => x.employees)
      .flat();

    let employeesTasks = [];
    this.props.TeamsTasks.forEach((t) => {
      const employees = t.employees;
      employees.forEach((e) => employeesTasks.push({ ...t, ...e }));
    });

    this.setState({
      allEmployees: data.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.id === o.id &&
              obj.name === o.name &&
              obj.username === o.username
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []),
      employeesTasks,
    });
  }
  func = (tree) =>
    tree.map(({ id: key, name: title, children }) => ({
      title,
      key,
      ...(children && { children: this.func(children) }),
    }));

  handleChange = (value, e) => {
    this.setState(
      { formValues: { ...this.state.formValues, [e.name]: e.id } },
      () => {
        this.props.onSelectFilters(
          this.state.formValues.categoryId,
          this.state.formValues.employeeId,
          this.state.formValues.fromDate,
          this.state.formValues.toDate
        );
      }
    );
  };
  handleChangeDate = (value, name) => {
    this.setState(
      { formValues: { ...this.state.formValues, [name]: value } },
      () => {
        this.props.onSelectFilters(
          this.state.formValues.categoryId,
          this.state.formValues.employeeId,
          this.state.formValues.fromDate,
          this.state.formValues.toDate
        );
      }
    );
  };
  onChangeCategryTree = (categoryValue, categoryNames) => {
    if (categoryValue.length == 0) {
      this.setState({
        formValues: { ...this.state.formValues, categoryId: "all" },
      });
    }
    this.setState({ selectedCategoryNames: categoryNames });
    this.setState(
      {
        formValues: { ...this.state.formValues, categoryId: categoryValue },
      },
      () => {
        this.props.onSelectFilters(
          this.state.formValues.categoryId,
          this.state.formValues.employeeId,
          this.state.formValues.fromDate,
          this.state.formValues.toDate
        );
      }
    );
  };

  render() {
    const tProps = {
      treeData: this.func(this.props.Categories),
      value: this.state.value,
      onChange: this.onChangeCategryTree,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      placeholder: "المهام الرئيسية",
      style: {
        width: "100%",
      },
    };
    const { Option } = Select;
    return (
      <div>
        <div className="PerIndheader mt-4">
          <Row className="filterSearch">
            <Col
              className="pl-2 mt-2"
              lg={{ span: 6 }}
              md={{ span: 8 }}
              xs={{ span: 12 }}
            >
              <TreeSelect
                className="treeSelectt"
                {...tProps}
                filterTreeNode={(input, option) =>
                  option.title.indexOf(input) >= 0
                }
                getPopupContainer={(trigger) => trigger.parentNode}
                virtual={false}
                showSearch
                optionFilterProp="title"
              />
            </Col>
            {/* <Col
              className="pl-2 mt-2"
              lg={{ span: 4 }}
              md={{ span: 8 }}
              xs={{ span: 8 }}
            >
              <Select
                showSearch
                getPopupContainer={(trigger) => trigger.parentNode}
                style={{ width: "100%" }}
                placeholder="المجموعات"
                onChange={(value) => this.handleChange(value, "groupId")}
              >
                {tasksStatusCount_Grp.map((group, index) => (
                  <Option value={group.id} key={index} id={group.id}>
                    {group.name}
                  </Option>
                ))}
              </Select>
            </Col>{" "} */}
            <Col
              className="pl-2 mt-2"
              md={{ span: 8 }}
              lg={{ span: 6 }}
              xs={{ span: 12 }}
            >
              <Select
                virtual={false}
                showSearch
                getPopupContainer={(trigger) => trigger.parentNode}
                style={{ width: "100%" }}
                placeholder="الموظفين"
                onChange={this.handleChange}
              >
                <Option name="employeeId" v="" value="all" id="all">
                  الكل
                </Option>
                {this.state.allEmployees &&
                  this.state.allEmployees !== undefined &&
                  this.state.allEmployees.length !== 0 &&
                  this.state.allEmployees.map((employee, index) => (
                    <Option
                      name="employeeId"
                      value={employee.name}
                      key={index}
                      id={employee.id}
                    >
                      {employee.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col md={{ span: 5 }}></Col>
            <Col
              md={{ span: 6 }}
              lg={{ span: 3 }}
              xs={{ span: 12 }}
              className="mt-2 DateContainer datefromMobile pl-2"
            >
              {/* <p className="pt-2 pl-2">من</p> */}
              <DatePicker
                onChangeRaw={this.handleDateChangeRaw}
                placeholderText="&#xF073;   من    --/--/---- "
                selected={this.state.formValues.fromDate}
                onChange={(value) => this.handleChangeDate(value, "fromDate")}
                calendar="hijri"
              />{" "}
            </Col>
            <Col md={{ span: 1 }}></Col>
            <Col
              md={{ span: 6 }}
              lg={{ span: 3 }}
              xs={{ span: 12 }}
              className="DateContainer mt-2 pl-2"
            >
              {/* <p className="pt-2 pl-2">إلي</p> */}
              <DatePicker
                onChangeRaw={this.handleDateChangeRaw}
                placeholderText="&#xF073;   إلي    --/--/---- "
                selected={this.state.formValues.toDate}
                onChange={(value) => this.handleChangeDate(value, "toDate")}
                calendar="hijri"
              />{" "}
              {/* <i className="fas fa-calendar dateToIcon"></i> */}
            </Col>
            {/* <Col md={{ span: 1 }} xs={{ span: 0 }}></Col>
            <Col className="pl-2" md={{ span: 3 }} xs={{ span: 24 }}></Col>
            <Col
              className=" pl-2 deadlineInput"
              md={{ span: 3 }}
              xs={{ span: 24 }}
            ></Col>
            <Col className="pr-2" md={{ span: 2 }} xs={{ span: 24 }}>
              <Select
                style={{ width: "100%" }}
                placeholder="اليوم"
                onChange={this.handleChange}
              >
                {this.state.days.map((task, index) => (
                  <Option value={task.name} key={index} id={task.id}>
                    {task.name}
                  </Option>
                ))}
              </Select>
            </Col> */}
          </Row>
          {this.state.selectedCategoryNames.length > 0 ? (
            <div className="selectedCategories">
              <span>المهام المختارة</span>{" "}
              <p className="pr-3">
                {this.state.selectedCategoryNames.map((c) => c + " , ")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  Status: state.Tasks.Status,
  Priorities: state.Tasks.Priorities,
  FlatCategories: state.Categories.FlatCategories,
  Tasks: state.Tasks.Tasks,
  TeamsTasks: state.Tasks.TeamsTasks,
  Categories: state.Categories.Categories,
  Employees: state.Groups.Employess,
});

const mapDispatchToProps = {
  getEmpList,
  clearAllEmp,
  getCategoriesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceFilter);
