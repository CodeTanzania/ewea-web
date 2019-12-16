import {
  postAdministrativeArea,
  putAdministrativeArea,
  Connect,
} from '@codetanzania/ewea-api-states';
import { Button, Form, Input, Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ColorPicker from 'rc-color-picker';
import { notifyError, notifySuccess } from '../../../../util';
import 'rc-color-picker/assets/index.css';

/**
 * @class
 * @name AdministrativeAreaForm
 * @description Render administrative area form for creating/editing function
 *
 * @version 0.1.0
 * @since 0.1.0
 */

class AdministrativeAreaForm extends Component {
  /**
   * @function
   * @name onChangeColor
   * @description Handle changing of color
   *
   * @param {string} color event object
   * @version 0.1.0
   * @since 0.1.0
   */
  onChangeColor = ({ color }) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ color });
  };

  /**
   * @function
   * @name handleSubmit
   * @description Handle create/edit action
   *
   * @param {object} e event object
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = e => {
    e.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      administrativeArea,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            name: { en: values.name },
            description: { en: values.description },
            code: values.code,
            color: values.color,
          },
        };
        if (isEditForm) {
          const updatedAdministrativeArea = {
            ...administrativeArea,
            ...payload,
          };
          putAdministrativeArea(
            updatedAdministrativeArea,
            () => {
              notifySuccess('AdministrativeArea was updated successfully');
            },
            () => {
              notifyError(
                `Something occurred while updating AdministrativeArea,
                 please try again!`
              );
            }
          );
        } else {
          postAdministrativeArea(
            payload,
            () => {
              notifySuccess('AdministrativeArea was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving AdministrativeArea, please try again!'
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
      administrativeArea,
      posting,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;

    const {
      strings: { name, description, code, color },
    } = administrativeArea || {
      strings: { name: {}, code: '', description: {}, color: '' },
    };

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
        {/* administrativeArea name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name ">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? name.en : undefined,
            rules: [
              {
                required: true,
                message: 'AdministrativeArea name is required',
              },
            ],
          })(<Input placeholder="e.g Tandale " />)}
        </Form.Item>
        {/* end administrativeArea name */}

        {/* administrative area description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm ? description.en : undefined,
            rules: [
              {
                required: true,
                message: 'AdministrativeArea description is required',
              },
            ],
          })(<Input placeholder="e.g Tandale " />)}
        </Form.Item>
        {/* end description */}

        {/* administrative area code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? code : undefined,
            rules: [{ required: true, message: 'Code is required' }],
          })(<Input placeholder="e.g T" />)}
        </Form.Item>
        {/* end administrative area code */}

        <Row>
          <Col span={19}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Color Code">
              {getFieldDecorator('color', {
                initialValue: isEditForm ? color : undefined,
              })(
                <Input
                  placeholder="e.g #36c"
                  title="Click button to select color"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1} className="AdministrativeAreaFormColor">
            <ColorPicker animation="slide-up" onChange={this.onChangeColor} />
          </Col>
        </Row>
        {/* end function color code */}

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

AdministrativeAreaForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  administrativeArea: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      code: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  }),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }).isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

AdministrativeAreaForm.defaultProps = {
  administrativeArea: null,
};

export default Connect(Form.create()(AdministrativeAreaForm), {
  types: 'eventTypes.list',
});
