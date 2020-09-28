import React from 'react';
import { Form, Input, InputNumber, Button, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import map from 'lodash/map';

/**
 * @function
 * @name renderInput
 * @description Render form input value based on input component meta data
 * @param {object} value Input value meta information
 * @param {string} key string value that will be used as input name
 * @returns {object} Form.Item component
 * @version 0.1.0
 * @since 0.1.0
 */
const renderInput = (value, key) => {
  if (value.type === 'number') {
    return (
      <Form.Item
        name={key}
        label={value.description}
        rules={[{ type: value.type }]}
      >
        <InputNumber />
      </Form.Item>
    );
  }

  if (value.type === 'text') {
    return (
      <Form.Item
        name={key}
        label={value.description}
        rules={[{ type: value.type }]}
      >
        <Input />
      </Form.Item>
    );
  }

  if (value.type === 'boolean') {
    return (
      <Form.Item
        name={key}
        label={value.description}
        rules={[{ type: value.type }]}
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox />
      </Form.Item>
    );
  }

  return (
    <Form.Item
      name={key}
      label={value.description}
      rules={[{ type: value.type }]}
    >
      <Input />
    </Form.Item>
  );
};

/**
 * @function
 * @name ParadeForm
 * @description Render parade form based on question template provided
 * @param {object} props Object properties object
 * @param {object} props.form form object to be rendered
 * @param {Function} props.onCancel a callback function for closing form
 * @returns {object} ParadeForm
 * @version 0.1.0
 * @since 0.1.0
 */
const ParadeForm = ({ form, onCancel }) => {
  const handleFinish = () => {
    onCancel();
  };

  return (
    <Form
      onFinish={handleFinish}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      {map(form, renderInput)}

      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

ParadeForm.propTypes = {
  form: PropTypes.shape(PropTypes.any).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ParadeForm;
