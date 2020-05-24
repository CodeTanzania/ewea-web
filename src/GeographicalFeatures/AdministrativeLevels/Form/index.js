import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button, Input, InputNumber, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const { getAdministrativeLevels } = httpActions;

/* state actions */
const { putAdministrativeLevel, postAdministrativeLevel } = reduxActions;

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
const MESSAGE_POST_SUCCESS = 'Administrative Level was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Administrative Level, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Administrative Level was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Administrative Level, Please try again!';

/**
 * @function AdministrativeLevelForm
 * @name AdministrativeLevelForm
 * @description Form for create and edit administrative level
 * @param {object} props Valid form properties
 * @param {object} props.administrativeLevel Valid administrative level object
 * @param {boolean} props.isEditForm Flag wether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} AdministrativeLevelForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <AdministrativeLevelForm
 *   administrativeLevel={administrativeLevel}
 *   isEditForm={isEditForm}
 *   posting={posting}
 *   onCancel={this.handleCloseAdministrativeLevelForm}
 * />
 *
 */
const AdministrativeLevelForm = ({
  administrativeLevel,
  isEditForm,
  posting,
  onCancel,
}) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    if (isEditForm) {
      const updates = { ...administrativeLevel, ...values };
      putAdministrativeLevel(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postAdministrativeLevel(
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
      initialValues={{ ...administrativeLevel }}
      autoComplete="off"
    >
      {/* start:name */}
      <Form.Item
        label="Name"
        title="Administrative level name e.g County"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Administrative level name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end:name */}

      {/* start: level & parent */}
      <Row justify="space-between">
        {/* start:level */}
        <Col span={11}>
          <Form.Item
            label="Level"
            title="Administrative level number e.g 3"
            name={['numbers', 'weight']}
            rules={[
              {
                required: true,
                message: 'Administrative level number is required',
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* end:level */}
        {/* start:parent */}
        <Col span={11}>
          <Form.Item
            label="Parent"
            title="Administrative level parent e.g Province"
            name={['relations', 'parent', '_id']}
          >
            <SearchableSelectInput
              onSearch={getAdministrativeLevels}
              optionLabel={(parent) => get(parent, 'strings.name.en')}
              optionValue="_id"
              initialValue={get(
                administrativeLevel,
                'relations.parent',
                undefined
              )}
            />
          </Form.Item>
        </Col>
        {/* end:parent */}
      </Row>
      {/* end: level & parent */}

      {/* start:description */}
      <Form.Item
        label="Description"
        title="Administrative level usage description"
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
          loading={posting}
        >
          Save
        </Button>
      </Form.Item>
      {/* end:form actions */}
    </Form>
  );
};

AdministrativeLevelForm.defaultProps = {
  administrativeLevel: {},
};

AdministrativeLevelForm.propTypes = {
  administrativeLevel: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
    }),
    numbers: PropTypes.shape({
      weight: PropTypes.number.isRequired,
    }),
    relations: PropTypes.shape({
      parent: PropTypes.shape({
        _id: PropTypes.string,
      }),
    }),
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdministrativeLevelForm;
