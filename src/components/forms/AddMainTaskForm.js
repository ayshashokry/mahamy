import React, { useState } from "react";
import { Form, Select, Checkbox, Input, Button } from "antd";
import { Container, Table } from "react-bootstrap";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import {
  addCategory,
  getCategoriesList,
  getFlatCategoriesList,
} from "../../redux/actions/CategoriesActions";
function AddMainTaskForm(props) {
  const [selectedGroups, handleChangeGroup] = useState([]);
  const [taskName, onChangeName] = useState("");
  const [checkedGroups, setCheckedGroups] = useState([]);
  const [requestGroupsIds, setGroupsIds] = useState([]);
  const [checkedError, setCheckedError] = useState("");
  const [uniqueNameError, setuniqueNameError] = useState("");

  const onChange = (e) => {
    onChangeName(e.target.value);
    setuniqueNameError("");
  };
  const handleChange = (selectGroups, e) => {
    let finalGroupsId = [];
    let finalSelectedGroups = [];
    e.map((gId) => finalGroupsId.push(Number(gId.id)));
    e.map((g) => finalSelectedGroups.push({ name: g.value, id: Number(g.id) }));

    setGroupsIds(finalGroupsId);
    handleChangeGroup(finalSelectedGroups);
    if (checkedGroups.length !== 0) {
      let newArray = [...checkedGroups];

      checkedGroups.forEach((group) => {
        if (!selectGroups.includes(group) && newArray.indexOf(group) !== -1) {
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
    if (e.target.checked) {
      setCheckedGroups(checkedGroups.concat([value]));
      setCheckedError("");
    } else {
      setCheckedGroups(
        checkedGroups.filter(function (val) {
          return val !== value;
        })
      );

      // if (this.state.checkedGroups.length === 0) {
      // }
    }
  };
  // deleteGroup = (e) => {
  //   // let divs = document.getElementsByClassName("ant-select-selection-item");
  //   // let parent = document.getElementsByClassName("ant-select-selector");
  //   // for (let i = 0; i < divs.length; i++) {
  //   //   parent.parentNode.removeChild(divs[i]);
  //   // }
  //   const newList = this.state.selectedGroups.filter(
  //     (item) => item !== e.target.id
  //   );
  //   this.setState({ selectedGroups: newList });
  // };
  const addNewCategory = (e) => {
    if (
      props.selectedCategoryId &&
      props.Categories.filter(
        (c) =>
          c.name == taskName && c.parentCategoryId == props.selectedCategoryId
      ).length !== 0
    ) {
      setuniqueNameError(
        "???? ???????? ?????????? ?????? ???????? ?????????? ???? ?????? - ???? ???????? ???????? ?????? ???????? ?????? ????????"
      );
    } else {
      if (checkedGroups.length == 0) {
        setCheckedError("???? ???????? ???? ???????????? ?????????????????? ?????????????? ?????? ??????????");
      } else {
        setCheckedError("");
      }

      let managersIds = [];
      checkedGroups.map((c) => managersIds.push(Number(c.id)));
      let request = {};
      if (taskName) request.name = taskName;
      request.departmentId = 1928;
      if (selectedGroups) {
        request.groups = requestGroupsIds;
      }
      if (checkedGroups.length !== 0) request.managers = managersIds;

      if (props.selectedCategoryId)
        request.parentCategoryId = props.selectedCategoryId;
      else {
        request.parentCategoryId = null;
      }

      if (
        taskName !== "" &&
        selectedGroups.length !== 0 &&
        checkedGroups.length !== 0
      ) {
        props.addCategory(request);
        props.onHide();
        props.confirmationAddCategory();
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
              ?????????????? ???????????? ???????? ???????????????? ??????????????????
            </p>
          </Col>
          <Col span={24}>
            <div className="input-div">
              <Form.Item
                rules={[
                  {
                    message: "???? ???????? ???????? ?????? ????????????",
                    required: true,
                  },
                ]}
                name="taskName"
                hasFeedback
                label="?????? ???????????? ????????????????"
                // help="Should be combination of numbers & alphabets"
              >
                <Input
                  name="taskName"
                  onChange={onChange}
                  value={taskName}
                  placeholder="???????? ?????? ???????????? ????????????????"
                />
              </Form.Item>
              <p
                style={{
                  color: "red",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {uniqueNameError}
              </p>
            </div>
          </Col>
          <Col span={24}>
            <div className="input-div">
              <Form.Item
                hasFeedback
                label="?????????? ?????? ????????????"
                name="select-multiple"
                rules={[
                  {
                    message: "???????? ???????????? ?????? ??????????",
                    type: "array",
                    required: true,
                  },
                ]}
              >
                <Select
                  virtual={false}
                  showSearch
                  id="selectt"
                  allowClear
                  className="dont-show"
                  onChange={handleChange}
                  mode="multiple"
                  value={selectedGroups}
                  placeholder="???????? ????????????"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {props.Groups && props.Groups.length !== 0
                    ? props.Groups.map((group, index) => (
                        <Select.Option
                          className="selectgroup"
                          value={group.name}
                          key={group.id}
                          id={group.id}
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
                      <th>??</th> <th></th>
                      <th></th> <th>?????? ????????????????</th>
                      {/* <th>????????????????</th> */}
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
                          <Checkbox.Group>
                            <Form.Item>
                              <Checkbox
                                onChange={(e) => onCheck(e, group)}
                                value={group.name}
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
                        <td>{group.name}</td>
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
                    ?????? ???????????? ?????? ?????????????????? ???????? ???????????? ???? ?????????? ???????? ????????????
                    ???????????? ???????????????? ?????? ?????????????? ????????
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
              onClick={addNewCategory}
              htmlType="submit"
            >
              ??????????
            </Button>
          </Col>
          <Col span={12}>
            <Button className="cancelbtn" size="large" onClick={props.onHide}>
              ??????????
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
const mapDispatchToProps = {
  addCategory,
  getFlatCategoriesList,
  getCategoriesList,
};
export default connect(mapStateToProps, mapDispatchToProps)(AddMainTaskForm);
