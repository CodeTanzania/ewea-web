import { reduxActions } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { postPartyRole, putPartyRole } = reduxActions;
const { TextArea } = Input;

/**
 * @class
 * @name RoleForm
 * @description Render React Form
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class RoleForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle form submit action
   *
   * @param {object} event onSubmit event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      role,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
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
      }
    });
  };

  render() {
    const {
      isEditForm,
      role,
      posting,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;

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

    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        {/* role name and abbreviation */}
        <Row type="flex" justify="space-between">
          <Col xxl={17} xl={17} lg={17} md={17} sm={24} xs={24}>
            {/* role name */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label=" Name">
              {getFieldDecorator('strings.name.en', {
                initialValue: isEditForm ? role.strings.name.en : undefined,
                rules: [{ required: true, message: 'Role  name is required' }],
              })(<Input />)}
            </Form.Item>
            {/* end role name */}
          </Col>

          <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
            {/* role abbreviation */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Abbreviation">
              {getFieldDecorator('strings.abbreviation.en', {
                initialValue: isEditForm
                  ? role.strings.abbreviation.en
                  : undefined,
              })(<Input />)}
            </Form.Item>
            {/* end role abbreviation */}
          </Col>
        </Row>
        {/* end role name and abbreviation */}

        {/* role description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('strings.description.en', {
            initialValue: isEditForm ? role.strings.description.en : undefined,
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
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
  }
}

RoleForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  role: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

RoleForm.defaultProps = {
  role: null,
};

export default Form.create()(RoleForm);
