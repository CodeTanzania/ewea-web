import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Input, Row } from 'antd';
import get from 'lodash/get';

/* constants */
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};

/**
 * @function
 * @name OccupationForm
 * @description Form component for creating and editing stakeholder occupations
 * @param {object} props Form properties object
 * @param {Function} props.onCreate on Create resource function
 * @param {Function} props.onUpdate on Update resource function
 * @param {object|null} props.occupation Occupation object to be edited if null will be created
 * @param {boolean} props.posting Flag for showing spinner when posting data to the api
 * @param {Function} props.onCancel Callback function for closing form
 * @returns {object} Render Occupation Form
 * @version 0.2.0
 * @since 0.1.0
 */
const OccupationForm = ({
  occupation,
  posting,
  onCancel,
  onCreate,
  onUpdate,
}) => {
  const onFinish = (values) => {
    if (get(occupation, '_id')) {
      const updatedOccupation = { ...occupation, ...values };
      onUpdate(updatedOccupation);
      return;
    }

    onCreate(values);
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...occupation }}
      autoComplete="off"
    >
      {/* occupation name and abbreviation */}
      <Row type="flex" justify="space-between">
        <Col xxl={17} xl={17} lg={17} md={17} sm={24} xs={24}>
          {/* occupation name */}
          <Form.Item
            name={['strings', 'name', 'en']}
            label="Name"
            rules={[{ required: true, message: 'Occupation name is required' }]}
          >
            <Input />
          </Form.Item>
          {/* end occupation name */}
        </Col>

        <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
          {/* occupation abbreviation */}
          <Form.Item
            name={['strings', 'abbreviation', 'en']}
            label="Abbreviation"
          >
            <Input />
          </Form.Item>
          {/* end occupation abbreviation */}
        </Col>
      </Row>
      {/* end occupation name and abbreviation */}

      {/* occupation description */}
      <Form.Item name={['strings', 'description', 'en']} label="Description">
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end occupation description */}

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={posting}
        >
          Save
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

OccupationForm.propTypes = {
  occupation: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

OccupationForm.defaultProps = {
  occupation: null,
};

export default OccupationForm;
