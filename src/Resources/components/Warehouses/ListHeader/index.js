import { Col, Row } from 'antd';
import React from 'react';
import './styles.css';

const headerLayout = [
  { span: 5, header: 'Name', offset: 1 },
  { span: 6, header: 'Level', offset: 4 },
];

/**
 * @function
 * @name WarehouseListHeader
 * @description display warehouse list metadata
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const WarehouseListHeader = () => (
  <Row className="WarehouseListHeader">
    {headerLayout.map(item => (
      <Col key={item.header} {...item}>
        <h4 className="title">{item.header}</h4>
      </Col>
    ))}
  </Row>
);

export default WarehouseListHeader;
