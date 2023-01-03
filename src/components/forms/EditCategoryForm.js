import React, { useState, useEffect } from "react";
import { Form, Select, Checkbox, Input, Button } from "antd";
import { Container, Table } from "react-bootstrap";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import { editCategory } from "../../redux/actions/CategoriesActions";
function EditCategoryForm(props) {
  const [selectedGroups, handleChangeGroup] = useState(
    props.selectedCategory.groups
  );
  const [taskName, onChangeName] = useState(props.selectedCategory.name);
  const [checkedGroups, setCheckedGroups] = useState(
    props.selectedCategory.managers
  );
  const [requestGroupsIds, setGroupsIds] = useState([]);
  const [checkedError, setCheckedError] = useState("");
  const [uniqueNameError, setuniqueNameError] = useState("");

  const onChange = (e) => {
    onChangeName(e.target.value);
    setuniqueNameError("");
  };
  useEffect(() => {
    let selectedGroupss = [];
    let checkedGroupss = [];
    props.Groups.map((g) =>
      props.selectedCategory.groups.map((group) =>
        g.id == group ? selectedGroupss.push({ name: g.name, id: g.id }) : null
      )
    );
    props.Groups.map((g) =>
      props.selectedCategory.managers.map((manager) =>
        g.id == manager ? checkedGroupss.push({ name: g.name, id: g.id }) : null
      )
    );
    handleChangeGroup(selectedGroupss);
    setCheckedGroups(checkedGroupss);
  }, []);
  const handleChange = (selectGroups, e) => {
    let finalGroupsId = [];
    let finalSelectedGroups = [];
    e.map((gId) => finalGroupsId.push(Number(gId.id)));
    e.map((g) => finalSelectedGroups.push({ name: g.name, id: Number(g.id) }));

    setGroupsIds(finalGroupsId);
    handleChangeGroup(finalSelectedGroups);
    if (checkedGroups.length !== 0) {
      let newArray = checkedGroups;

      checkedGroups.forEach((group) => {
        if (
          !selectGroups.includes(group.id) &&
          newArray.indexOf(group) !== -1
        ) {
          newArray.splice(newArray.indexOf(group), 1);
          setCheckedGroups(newArray);
        }
      });
    }
  };
  const onCheck = (e, value) => {
    if (selectedGroups && !selectedGroups.includes(value)) {
      e.target.checked = false;
    }
    if (e.target.checked == true) {
      setCheckedGroups(checkedGroups.concat([value]));
      setCheckedError("");
    } else {
      let newArray = [...checkedGroups];
      newArray = newArray.filter((v) => v.id !== value.id);
      setCheckedGroups(newArray);
    }
  };
  const editTheCategory = async (e) => {
    e.preventDefault();

    if (
      props.Categories.filter(
        (c) =>
          c.name == taskName &&
          c.parentCategoryId == props.selectedCategory.parentCategoryId &&
          c.id !== props.selectedCategory.id
      ).length !== 0
    ) {
      setuniqueNameError(
        "لا يمكن ادخال اسم مهمه مدخله من قبل - من فضلك ادخل اسم مهمه غير مكرر"
      );
    } else {
      if (checkedGroups.length == 0) {
        setCheckedError("من فضلك قم بإعطاء الصلاحيات لمجموعة علي الأقل");
      } else {
        setCheckedError("");
      }
      let managersIds = [];
      checkedGroups.map((c) => managersIds.push(Number(c.id)));
      let request = {};
      request.id = props.selectedCategory.id;
      request.name = taskName;
      if (requestGroupsIds.length !== 0) {
        request.groups = requestGroupsIds;
      } else {
        request.groups = props.selectedCategory.groups;
      }
      if (checkedGroups.length !== 0) request.managers = managersIds;

      if (
        taskName !== "" &&
        selectedGroups.length !== 0 &&
        checkedGroups.length !== 0
      ) {
        props.editCategory(request, true);
        props.onHide();
        props.confirmationEditCategory();
      }
    }
  };

  return (
    <Container className="addManiTaskForm">
      <Form
        layout="vertical"
        name="validate_other"
        //   onFinish={onFinish}
      >
        <Row>
          <Col span={24}>
            <p
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#5c6581",
              }}
              className="manageName"
            >
              الإدارة العامة لنظم المعومات الجغرافية
            </p>
          </Col>
          <Col span={24}>
            <Form.Item
              name="taskName"
              label="اسم المهمة"
              rules={[{ required: true, message: "من فضلك إدخل اسم المهمة" }]}
              hasFeedback
            >
              <Input
                defaultValue={props.selectedCategory.name}
                name="taskName"
                onChange={onChange}
                value={taskName}
              />
            </Form.Item>{" "}
            <p
              style={{
                color: "red",
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              {uniqueNameError}
            </p>
          </Col>
          <Col span={24}>
            <div className="input-div">
              <Form.Item
                hasFeedback
                label="إسناد إلي مجموعة"
                name="select-multiple"
                rules={[
                  {
                    message: "أختر مجموعة علي الاقل",
                    type: "array",
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  id="selectt"
                  allowClear
                  className="dont-show"
                  onChange={handleChange}
                  mode="multiple"
                  defaultValue={selectedGroups}
                  value={selectedGroups}
                  placeholder="اختر مجموعة"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {props.Groups && props.Groups.length !== 0
                    ? props.Groups.map((group, index) => (
                        <Select.Option
                          className="selectgroup"
                          value={group.id}
                          key={group.id}
                          id={group.id}
                          name={group.name}
                        >
                          {group.name}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col span={24}>
            {selectedGroups.length !== 0 ? (
              <React.Fragment>
                <Table className="selectedGroupsTable">
                  <thead>
                    <tr>
                      <th>م</th> <th></th>
                      <th></th> <th>اسم المجموعة</th>
                      {/* <th>العمليات</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGroups.map((group, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #d4d6de",
                        }}
                      >
                        <td>
                          <Checkbox.Group
                            defaultValue={props.selectedCategory.managers}
                          >
                            <Form.Item>
                              <Checkbox
                                onChange={(e) => onCheck(e, group)}
                                value={group.id}
                                name={group.name}
                                key={index}
                                id={group.id}
                                style={{
                                  lineHeight: "32px",
                                }}
                              />
                            </Form.Item>
                          </Checkbox.Group>
                        </td>
                        <td></td> <td></td>
                        <td>{group.name}</td>{" "}
                      </tr>
                    ))}
                  </tbody>
                </Table>{" "}
                <p
                  style={{
                    color: "red",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {checkedError}
                </p>
                <div style={{ textAlign: "right" }}>
                  <span className="tableSpan">
                    عند اختيار أحد المجموعات فإنه يمكِّن من إنشاء مهام رئيسية
                    وفرعية وإسنادها إلى مجموعات آخرى
                  </span>
                </div>
              </React.Fragment>
            ) : null}
          </Col>
        </Row>

        <Row className="formButtons pt-4">
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              className="addbtn"
              size="large"
              onClick={editTheCategory}
              htmlType="submit"
            >
              تعديل
            </Button>
          </Col>
          <Col span={12}>
            <Button className="cancelbtn" size="large" onClick={props.onHide}>
              إلغاء
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
const mapStateToProps = function (state) {
  return {
    Groups: state.Groups.Groups,
    Categories: state.Categories.FlatCategories,
  };
};
const mapDispatchToProps = { editCategory };
export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryForm);
