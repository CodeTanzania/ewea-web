import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import get from 'lodash/get';

/* constants */
const LABEL_COL = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const WRAPPER_COL = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/**
 * @function
 * @name ReportFilter
 * @description Report Filter generic form which have date filters and other common filters
 * @param {object} props Component properties object
 * @param {object} props.filters Preselected filters
 * @param {Function} props.onFilter On filter reports callback
 * @param {Function} props.onClear On clear/reset report filters callback
 * @param {Function} props.onCancel On cancel filters callback
 * @returns {object} Report filter form
 * @version 0.1.0
 * @since 0.1.0
 */
const ReportFilters = ({ filters, onFilter, onClear, onCancel }) => {
  const onFinish = (values) => {
    onFilter({
      createdAt: {
        from: new Date(values.from.format('YYYY-MM-DD')),
        to: new Date(values.to.format('YYYY-MM-DD')),
      },
    });
  };

  return (
    <Form
      onFinish={onFinish}
      wrapperCol={WRAPPER_COL}
      labelCol={LABEL_COL}
      initialValues={{
        from: moment(get(filters, 'createdAt.from', new Date())),
        to: moment(get(filters, 'createdAt.to', new Date())),
      }}
    >
      {/* start: data filters */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item label="Start Date" name="from">
            <DatePicker style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item label="End Date" name="to" allowClear={false}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      {/* end: data filters */}

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button style={{ marginLeft: 8 }} onClick={onClear}>
          Clear
        </Button>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

ReportFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  filters: PropTypes.shape({ from: PropTypes.string, to: PropTypes.string }),
};

ReportFilters.defaultProps = {
  filters: null,
};

export default ReportFilters;
