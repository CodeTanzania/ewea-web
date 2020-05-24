import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Row, Col } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../util';

/* state actions */
const { putUnit, postUnit } = reduxActions;

/* ui */
const { TextArea } = Input;
const labelCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/* messages */
const MESSAGE_POST_SUCCESS = 'Unit was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Unit, please try again!';
const MESSAGE_PUT_SUCCESS = 'Unit was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Unit, please try again!';

/**
 * @function UnitForm
 * @name UnitForm
 * @description Form for create and edit unit of measure
 * @param {object} props Valid form properties
 * @param {object} props.unit Valid unit object
 * @param {boolean} props.isEditForm Flag wether form is on edit mode
 * @param {boolean} props.isPosting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} UnitForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <UnitForm
 *   unit={unit}
 *   isEditForm={isEditForm}
 *   isPosting={isPosting}
 *   onCancel={this.handleCloseUnitForm}
 * />
 *
 */
const UnitForm = ({ unit, isEditForm, isPosting, onCancel }) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    if (isEditForm) {
      const updates = { ...unit, ...values };
      putUnit(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postUnit(
        values,
        () => notifySuccess(MESSAGE_POST_SUCCESS),
        () => notifyError(MESSAGE_POST_ERROR)
      );
    }
  };

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{ ...unit }}
      autoComplete="off"
    >
      {/* start:name */}
      <Form.Item
        label="Name"
        title="Unit name e.g Kilogram"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Unit name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end:name */}

      {/* start: abbreviation & symbol */}
      <Row justify="space-between">
        {/* start:abbreviation */}
        <Col span={11}>
          <Form.Item
            label="Abbreviation"
            title="Unit abbreviation e.g kg"
            name={['strings', 'abbreviation', 'en']}
            rules={[
              {
                required: true,
                message: 'Unit abbreviation is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:abbreviation */}
        {/* start:symbol */}
        <Col span={11}>
          <Form.Item
            label="Symbol"
            title="Unit symbol e.g $"
            name={['strings', 'symbol']}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:symbol */}
      </Row>
      {/* end: abbreviation & symbol */}

      {/* start:description */}
      <Form.Item
        label="Description"
        title="Unit usage description"
        name={['strings', 'description', 'en']}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end:description */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={isPosting}
        >
          Save
        </Button>
      </Form.Item>
      {/* end:form actions */}
    </Form>
  );
};

UnitForm.propTypes = {
  unit: PropTypes.shape({
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
  isPosting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default UnitForm;
