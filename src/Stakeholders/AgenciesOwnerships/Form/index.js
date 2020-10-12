import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
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
 * @name PartyOwnershipForm
 * @description Render form for creating and editing party ownerships
 * @param {object} props props object
 * @param {object} props.partyOwnership valid party ownership
 * @param {boolean} props.posting posting flag
 * @param {Function} props.onCreate onCreate data callback
 * @param {Function} props.onUpdate onUpdate data callback
 * @param {Function} props.onCancel cancel callback
 * @returns {object} PartyOwnershipForm component
 * @version 0.1.0
 * @since 0.1.0
 */
const PartyOwnershipForm = ({
  partyOwnership,
  posting,
  onCancel,
  onCreate,
  onUpdate,
}) => {
  const onFinish = (values) => {
    if (get(partyOwnership, '_id')) {
      const updatedData = { ...partyOwnership, ...values };
      onUpdate(updatedData);
      return;
    }

    onCreate(values);
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...partyOwnership }}
      autoComplete="off"
    >
      {/* Agency Ownership name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Agency Ownership name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end Agency Ownership name */}

      {/* Agency Ownership Description */}
      <Form.Item
        label="Description"
        name={['strings', 'description', 'en']}
        rules={[
          {
            required: true,
            message: 'Agency Ownership Description is required',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end Agency Ownership */}

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

PartyOwnershipForm.propTypes = {
  partyOwnership: PropTypes.shape({
    strings: PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
    }),
  }).isRequired,
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
};

export default PartyOwnershipForm;
