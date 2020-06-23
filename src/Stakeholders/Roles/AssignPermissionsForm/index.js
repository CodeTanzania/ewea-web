import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Form, Button, Checkbox, Row, Col, Typography, Spin } from 'antd';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { notifySuccess, notifyError } from '../../../util';

const { getPermissions, putPartyRole } = reduxActions;
const { Text } = Typography;
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
 * @name AssignPermissionsForm
 * @description Form for assigning role permission
 *
 * @param {object} props Component Props
 * @param {object[]} props.permissions All permissions from the api
 * @param {boolean} props.loading Flag to show spinner on loading permissions
 * @param {boolean} props.posting Flag to show spinner on updating role
 * @param {object} props.role Role to be updated
 * @param {Function} props.onCancel Callback for closing form
 *
 * @returns {object} AssignPermissionsForm
 * @version 0.1.0
 * @since 0.1.0
 */
const AssignPermissionsForm = ({
  role,
  permissions,
  loading,
  posting,
  onCancel,
}) => {
  useEffect(() => {
    if (isEmpty(permissions)) {
      getPermissions();
    }
  });

  const groupedPermissions = groupBy(permissions, 'resource');
  const assignedPermissions = map(
    get(role, 'relations.permissions', []),
    '_id'
  );

  console.log(role, assignedPermissions);

  const onFinish = (values) => {
    const updatedRole = {
      ...role,
      relations: {
        ...get(role, 'relations', null),
        permissions: values.permissions,
      },
    };

    putPartyRole(
      updatedRole,
      () => {
        onCancel();
        notifySuccess('Permission(s) were assigned successfully');
      },
      () => {
        notifyError(
          'An error occurred while assigning permission(s), please contact your system administrator'
        );
      }
    );
  };

  return (
    <Spin spinning={loading}>
      <Form
        {...formItemLayout} // eslint-disable-line
        initialValues={{ permissions: [...assignedPermissions] }}
        onFinish={onFinish}
      >
        <Form.Item label="Permissions" name="permissions">
          <Checkbox.Group>
            <Row>
              {map(groupedPermissions, (actions, resource) => (
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={6}
                  xl={4}
                  style={{ marginTop: '20px' }}
                >
                  <Text strong>{resource}</Text>

                  {map(actions, (permission) => (
                    <div>
                      {/*  eslint-disable-next-line */}
                      <Checkbox value={permission._id}>
                        {permission.action}
                      </Checkbox>
                    </div>
                  ))}
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

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
    </Spin>
  );
};

AssignPermissionsForm.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      resource: PropTypes.string,
      action: PropTypes.string,
      _id: PropTypes.string,
    })
  ).isRequired,
  role: PropTypes.shape({
    _id: PropTypes.string,
    relations: PropTypes.shape({ permissions: PropTypes.array }),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Connect(AssignPermissionsForm, {
  permissions: 'permissions.list',
  loading: 'permissions.loading',
  role: 'partyRoles.selected',
  posting: 'partyRoles.posting',
});
