import {
  postEventFunction,
  putEventFunction,
  Connect,
} from '@codetanzania/ewea-api-states';
import { Button, Form, Input, Select, Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ColorPicker from 'rc-color-picker';
import { notifyError, notifySuccess } from '../../../../util';
import 'rc-color-picker/assets/index.css';

const { Option } = Select;

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
  handleSubmit = e => {
    e.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      emergencyFunction,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEventFunction = {
            ...emergencyFunction,
            ...values,
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
            values,
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
      emergencyFunction,
      posting,
      onCancel,
      families,
      caps,
      natures,
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
        {/* function  name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name ">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? emergencyFunction.name : undefined,
            rules: [{ required: true, message: 'name is required' }],
          })(<Input placeholder="e.g Flood" />)}
        </Form.Item>
        {/* end function  name */}

        {/* function nature */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Nature">
          {getFieldDecorator('nature', {
            initialValue: isEditForm ? emergencyFunction.nature : undefined,
            rules: [{ required: true, message: 'Function nature is required' }],
          })(
            <Select placeholder="e.g Natural">
              {natures.map(nature => (
                <Option key={nature} value={nature}>
                  {nature}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {/* end nature */}

        {/* function cap */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Cap">
          {getFieldDecorator('cap', {
            initialValue: isEditForm ? emergencyFunction.cap : undefined,
            rules: [{ required: true, message: 'Cap is required' }],
          })(
            <Select placeholder="e.g Geo">
              {caps.map(cap => (
                <Option key={cap} value={cap}>
                  {cap}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {/* end function  cap */}

        {/*  function family */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Family">
          {getFieldDecorator('family', {
            initialValue: isEditForm ? emergencyFunction.family : undefined,
            rules: [{ required: true, message: 'Family is required' }],
          })(
            <Select placeholder="e.g Geographical">
              {families.map(family => (
                <Option key={family} value={family}>
                  {family}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {/* end function */}

        {/* function  */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? emergencyFunction.code : undefined,
            rules: [{ required: true, message: 'Code is required' }],
          })(<Input placeholder="e.g NMS" />)}
        </Form.Item>
        {/* end function */}

        <Row>
          <Col span={19}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Color Code">
              {getFieldDecorator('color', {
                initialValue: isEditForm ? emergencyFunction.color : undefined,
              })(
                <Input
                  placeholder="e.g #36c"
                  title="Click button to select color"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1} className="EventFunctionFormColor">
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

FunctionForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  emergencyFunction: PropTypes.shape({
    name: PropTypes.string,
    nature: PropTypes.string,
    family: PropTypes.string,
    color: PropTypes.string,
    cap: PropTypes.string,
    code: PropTypes.string,
  }),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }).isRequired,
  families: PropTypes.arrayOf(PropTypes.string).isRequired,
  natures: PropTypes.arrayOf(PropTypes.string).isRequired,
  caps: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

FunctionForm.defaultProps = {
  emergencyFunction: null,
};

export default Connect(Form.create()(FunctionForm), {
  natures: 'incidentTypes.schema.properties.nature.enum',
  families: 'incidentTypes.schema.properties.family.enum',
  caps: 'incidentTypes.schema.properties.cap.enum',
});
