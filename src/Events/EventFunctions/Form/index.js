import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';
import 'rc-color-picker/assets/index.css';

const { postEventFunction, putEventFunction } = reduxActions;
const { Option } = Select;
const { TextArea } = Input;

/**
 * @class
 * @name FunctionForm
 * @description Render function form for creating/editing function
 *
 * @version 0.1.0
 * @since 0.1.0
 */

class FunctionForm extends Component {
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
  handleSubmit = (e) => {
    e.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      eventFunction,
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
          const updatedEventFunction = {
            ...eventFunction,
            ...payload,
          };
          putEventFunction(
            updatedEventFunction,
            () => {
              notifySuccess('Function was updated successfully');
            },
            () => {
              notifyError(
                `Something occurred while updating Function,
                 please try again!`
              );
            }
          );
        } else {
          postEventFunction(
            payload,
            () => {
              notifySuccess('Function was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Function, please try again!'
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
      eventFunction,
      types,
      posting,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;

    const {
      strings: { name, description, code },
    } = eventFunction || {
      strings: { name: {}, code: '', description: {} },
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
        {/* function  name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name ">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? name.en : undefined,
            rules: [{ required: true, message: 'Function name is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end function  name */}

        {/* function Type */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Type">
          {getFieldDecorator('type', {
            initialValue: isEditForm ? name.en : undefined,
            rules: [{ required: false, message: 'Function type is required' }],
          })(
            <Select>
              {types.map((nature) => (
                <Option key={nature} value={nature}>
                  {nature}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {/* end nature */}

        {/* function description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm ? description.en : undefined,
            rules: [
              { required: true, message: 'Function description is required' },
            ],
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end description */}

        {/* function code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? code : undefined,
            rules: [{ required: true, message: 'Code is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end function code */}

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

FunctionForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventFunction: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      code: PropTypes.string.isRequired,
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

FunctionForm.defaultProps = {
  eventFunction: null,
};

export default Connect(Form.create()(FunctionForm), {
  types: 'eventTypes.list',
});
