import React, { Component } from "react";
import SearchForm from "../forms/SearchForm";
import { Row, Col } from "antd";

export default class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    return this.props.archive ? (
      <Row>
        <Col md={{ span: 12 }} xs={{ span: 24 }}>
          <SearchForm
            value={this.props.value}
            handleSearch={this.props.handleSearch}
          />
        </Col>
      </Row>
    ) : (
      <Row>
        <Col md={{ span: 18 }} xs={{ span: 24 }}>
          <SearchForm
            value={this.props.value}
            handleSearch={this.props.onChange}
          />
        </Col>
      </Row>
    );
  }
}
