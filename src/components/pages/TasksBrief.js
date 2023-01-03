import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import { Row, Col } from "antd";
import MainCard from "../mainPage/MainCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import PreLoading from "../layout/PreLoading";
import moment from "moment-hijri";
let newT = [],
  delayT = [],
  todayT = [];
class TasksBrief extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTasks: [],
      delayTasks: [],
      todayTasks: [],
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });
    const todaysDate = moment();
    if (this.props.Tasks.length > 0) {
      this.props.Tasks.map((task) => {
        const dueDate = moment(task.dueDate, "iDD/iMM/iYYYY");
        if (dueDate.isBefore(todaysDate, "day") && task.status !== 3) {
          delayT.push(task);
        }
        if (dueDate.isSame(todaysDate, "day") && task.status !== 3) {
          todayT.push(task);
        }
        if (dueDate.isAfter(todaysDate, "day") && task.status !== 3) {
          newT.push(task);
        }
      });
      this.setState({
        delayTasks: delayT,
        newTasks: newT,
        todayTasks: todayT,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
    window.scrollTo(0, 0);
  }
  componentWillUnmount() {
    this.setState({ delayTasks: [], newTasks: [], todayTasks: [] });
    newT = [];
    delayT = [];
    todayT = [];
  }

  render() {
    const settingsDelay = {
      dots: false,
      arrows: true,
      infinite: this.state.delayTasks.length >= 3,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      swipe: false,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            infinite: true,
            swipe: false,
          },
        },
      ],
    };
    const settingsToday = {
      dots: false,
      arrows: true,
      infinite: this.state.todayTasks.length >= 3,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      swipe: false,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            infinite: true,
            swipe: false,
          },
        },
      ],
    };

    const settingsNew = {
      dots: false,
      arrows: true,
      infinite: this.state.newTasks.length >= 3,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      swipe: false,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            infinite: true,
            swipe: false,
          },
        },
      ],
    };
    return (
      <Container fluid className="HomePage">
        {this.state.loading ? <PreLoading /> : ""}

        {this.props.Tasks && !this.state.loading ? (
          <Row>
            <Col span={24}>
              <Row>
                <Col
                  lg={{ span: 7 }}
                  md={{ span: 24 }}
                  className="text-right statusDivMain"
                >
                  <span className="cardsNum">
                    {this.state.delayTasks ? this.state.delayTasks.length : 0}
                  </span>
                  <span className="statusTitle"> مهام متأخرة</span>
                </Col>
              </Row>
              <Slider
                {...settingsDelay}
                className={
                  this.state.delayTasks.length === 1 ||
                  this.state.delayTasks.length === 2
                    ? "floatSlick"
                    : ""
                }
              >
                {this.state.delayTasks.length !== 0
                  ? this.state.delayTasks.map((card, index) => (
                      <div>
                        <MainCard key={index} index={index} {...card} />
                      </div>
                    ))
                  : null}
              </Slider>
            </Col>
            <Col span={24} className="mt-4 mb-4">
              <Row>
                <Col
                  lg={{ span: 7 }}
                  md={{ span: 24 }}
                  className="text-right statusDivMain"
                >
                  <span className="cardsNum">
                    {this.state.todayTasks ? this.state.todayTasks.length : 0}
                  </span>
                  <span className="statusTitle"> مهام يتم تسليمها اليوم</span>
                </Col>
              </Row>
              <Slider
                {...settingsToday}
                className={
                  this.state.todayTasks.length === 1 ||
                  this.state.todayTasks.length === 2
                    ? "floatSlick"
                    : ""
                }
              >
                {this.state.todayTasks.length !== 0
                  ? this.state.todayTasks.map((card, index) => (
                      <div>
                        <MainCard key={index} index={index} {...card} />
                      </div>
                    ))
                  : null}
              </Slider>
            </Col>
            <Col span={24} className="mb-4">
              <Row>
                <Col
                  lg={{ span: 7 }}
                  md={{ span: 24 }}
                  className="text-right statusDivMain"
                >
                  <span className="cardsNum">
                    {this.state.newTasks ? this.state.newTasks.length : 0}
                  </span>
                  <span className="statusTitle"> مهام جديدة</span>
                </Col>
              </Row>
              <Slider
                {...settingsNew}
                className={
                  this.state.newTasks.length === 1 ||
                  this.state.newTasks.length === 2
                    ? "floatSlick"
                    : ""
                }
              >
                {this.state.newTasks.length !== 0
                  ? this.state.newTasks.map((card, index) => (
                      <div>
                        <MainCard key={index} index={index} {...card} />
                      </div>
                    ))
                  : null}
              </Slider>
            </Col>
          </Row>
        ) : null}
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  Tasks: state.Tasks.TeamsTasks,
});

export default connect(mapStateToProps)(TasksBrief);
