import React from 'react';
import PropTypes from 'prop-types';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { Button, Col, Form, Input, Row } from 'antd';
import get from 'lodash/get';

import { notifyError, notifySuccess } from '../../../util';

/* redux actions */
const { postPartyRole, putPartyRole } = reduxActions;
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
 * @name RoleForm
 * @description Form component for creating and editing stakeholder roles
 * @param {object} props Form properties object
 * @param {object|null} props.role Role object to be edited if null will be created
 * @param {boolean} props.posting Flag for showing spinner when posting data to the api
 * @param {Function} props.onCancel Callback function for closing form
 * @returns {object} Render Role Form
 * @version 0.2.0
 * @since 0.1.0
 */
const RoleForm = ({ role, posting, onCancel }) => {
  const onFinish = (values) => {
    if (get(role, '_id')) {
      const updatedRole = { ...role, ...values };
      putPartyRole(
        updatedRole,
        () => {
          notifySuccess('Role was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating role, please try again!'
          );
        }
      );
    } else {
      postPartyRole(
        values,
        () => {
          notifySuccess('Role was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving role, please try again!'
          );
        }
      );
    }
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...role }}
      autoComplete="off"
    >
      {/* role name and abbreviation */}
      <Row type="flex" justify="space-between">
        <Col xxl={17} xl={17} lg={17} md={17} sm={24} xs={24}>
          {/* role name */}
          <Form.Item
            name={['strings', 'name', 'en']}
            label="Name"
            rules={[{ required: true, message: 'Role name is required' }]}
          >
            <Input />
          </Form.Item>
          {/* end role name */}
        </Col>

        <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
          {/* role abbreviation */}
          <Form.Item
            name={['strings', 'abbreviation', 'en']}
            label="Abbreviation"
          >
            <Input />
          </Form.Item>
          {/* end role abbreviation */}
        </Col>
      </Row>
      {/* end role name and abbreviation */}

      {/* role description */}
      <Form.Item name={['strings', 'description', 'en']} label="Description">
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end role description */}

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

RoleForm.propTypes = {
  role: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

RoleForm.defaultProps = {
  role: null,
};

export default RoleForm;
