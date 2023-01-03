import React from "react";
import { Input, Row } from "antd";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function SearchForm(props) {
  return (
    <Row className="searchForm">
      <Input
        type="text"
        value={props.value}
        onChange={props.handleSearch}
        placeholder="البحث بواسطة اسم المهمة"
      />
      <Button className="searchIconBtn">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Row>
  );
}
