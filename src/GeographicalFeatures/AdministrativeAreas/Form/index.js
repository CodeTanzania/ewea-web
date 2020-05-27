import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button, Input, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const { getAdministrativeLevels, getAdministrativeAreas } = httpActions;

/* state actions */
const { putAdministrativeArea, postAdministrativeArea } = reduxActions;

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
const MESSAGE_POST_SUCCESS = 'Administrative Area was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Administrative Area, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Administrative Area was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Administrative Area, Please try again!';

/**
 * @function AdministrativeAreaForm
 * @name AdministrativeAreaForm
 * @description Form for create and edit administrative area
 * @param {object} props Valid form properties
 * @param {object} props.administrativeArea Valid administrative area object
 * @param {boolean} props.isEditForm Flag whether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} AdministrativeAreaForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <AdministrativeAreaForm
 *   administrativeArea={administrativeArea}
 *   isEditForm={isEditForm}
 *   posting={posting}
 *   onCancel={this.handleCloseAdministrativeAreaForm}
 * />
 *
 */
const AdministrativeAreaForm = ({
  administrativeArea,
  isEditForm,
  posting,
  onCancel,
}) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    // TODO: fix SearchableSelectInput
    const formData = { ...values };
    if (!get(formData, 'relations.parent._id')) {
      formData.relations.parent = null;
    }
    if (!get(formData, 'relations.level._id')) {
      formData.relations.level = null;
    }

    if (isEditForm) {
      const updates = { ...administrativeArea, ...formData };
      putAdministrativeArea(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postAdministrativeArea(
        formData,
        () => notifySuccess(MESSAGE_POST_SUCCESS),
        () => notifyError(MESSAGE_POST_ERROR)
      );
    }
  };

  // search administrative area exclude self
  const searchAdministrativeAreas = (optns, me) => {
    const filter = {};
    const myId = get(me, '_id');
    const myLevel = get(me, 'relations.level');

    // ignore self from selection
    if (myId) {
      // eslint-disable-next-line no-underscore-dangle
      filter._id = { $nin: [myId] };
    }
    // ensure higher levels
    if (myLevel) {
      // TODO: find with above level
      // filter['relations.level'] = { $ne: get(myLevel, '_id', myLevel) };
    }

    return getAdministrativeAreas({ ...optns, filter });
  };

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{ ...administrativeArea }}
      autoComplete="off"
    >
      {/* start: name & code */}
      <Row justify="space-between">
        {/* start:name */}
        <Col span={11}>
          <Form.Item
            label="Name"
            title="Administrative area name e.g Dar es Salaam"
            name={['strings', 'name', 'en']}
            rules={[
              {
                required: true,
                message: 'Administrative area name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:name */}
        {/* start:code */}
        <Col span={11}>
          <Form.Item
            label="Code"
            title="Administrative area code e.g DSM"
            name={['strings', 'code']}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:code */}
      </Row>
      {/* end: name & code */}

      {/* start: level & parent */}
      <Row justify="space-between">
        {/* start:level */}
        <Col span={11}>
          <Form.Item
            label="Level"
            title="Administrative level e.g Region"
            name={['relations', 'level', '_id']}
            rules={[
              {
                required: true,
                message: 'Administrative level is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getAdministrativeLevels(optns);
              }}
              optionLabel={(level) => get(level, 'strings.name.en')}
              optionValue="_id"
              initialValue={get(
                administrativeArea,
                'relations.level',
                undefined
              )}
            />
          </Form.Item>
        </Col>
        {/* end:level */}
        {/* start:parent */}
        <Col span={11}>
          <Form.Item
            label="Parent"
            title="Administrative area parent e.g Tanzania"
            initialValue={null}
            name={['relations', 'parent', '_id']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return searchAdministrativeAreas(optns, administrativeArea);
              }}
              optionLabel={(parent) => {
                return `${get(parent, 'strings.name.en')} (${get(
                  parent,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`;
              }}
              optionValue="_id"
              initialValue={get(
                administrativeArea,
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
        title="Administrative area description"
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

AdministrativeAreaForm.defaultProps = {
  administrativeArea: {},
};

AdministrativeAreaForm.propTypes = {
  administrativeArea: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      code: PropTypes.string,
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
      level: PropTypes.shape({
        _id: PropTypes.string,
      }),
      parent: PropTypes.shape({
        _id: PropTypes.string,
      }),
    }),
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdministrativeAreaForm;
