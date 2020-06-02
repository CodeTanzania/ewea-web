import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button, Input, InputNumber, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getAdministrativeAreas,
  getPartyGenders,
  getPartyOccupations,
} = httpActions;

/* state actions */
const { putCase, postCase } = reduxActions;

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
const MESSAGE_POST_SUCCESS = 'Case was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Case, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Case was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Case, Please try again!';

/**
 * @function CaseForm
 * @name CaseForm
 * @description Form for create and edit case
 * @param {object} props Valid form properties
 * @param {object} props.caze Valid case object
 * @param {boolean} props.isEditForm Flag whether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} CaseForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <CaseForm
 *   caze={case}
 *   isEditForm={isEditForm}
 *   posting={posting}
 *   onCancel={this.handleCloseCaseForm}
 * />
 *
 */
const CaseForm = ({ caze, isEditForm, posting, onCancel }) => {
  const [cached, setCache] = useState({}); // for caching lazy component values
  const [moreOptions, setMoreOptions] = useState(false);

  // form finish(submit) handler
  const onFinish = (values) => {
    const formData = { ...values };

    if (isEditForm) {
      const updates = { ...caze, ...formData };
      putCase(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postCase(
        formData,
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
      initialValues={{
        ...caze,
        victim: {
          ...get(caze, 'victim', null),
          area: get(caze, 'victim.area._id'),
          gender: get(caze, 'victim.gender._id'),
          occupation: get(caze, 'victim.occupation._id'),
        },
      }}
      autoComplete="off"
    >
      {/* start: name & mobile */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Name"
            title="Victim/Patient Full Name e.g Jane Mdoe"
            name={['victim', 'name']}
            rules={[
              { required: true, message: 'Victim/Patient name is required' },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Phone"
            title="Valid Victim/Patient Mobile Phone Number"
            name={['victim', 'mobile']}
            rules={[
              { required: true, message: 'Victim/Patient phone is required' },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* end: name & mobile */}

      {/* start: area & gender */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Area"
            title="Victim/Patient Residential Area"
            name={['victim', 'area']}
            rules={[
              {
                required: true,
                message: 'Victim/Patient Residential Area is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={(area) =>
                `${get(area, 'strings.name.en')} (${get(
                  area,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`
              }
              optionValue="_id"
              initialValue={
                get(caze, 'victim.area') || get(cached, 'victim.area')
              }
              onCache={(values) =>
                setCache({ ...cached, 'victim.area': values[0] })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Gender"
            title="Victim/Patient Gender"
            name={['victim', 'gender']}
            rules={[
              {
                required: true,
                message: 'Victim/Patient Gender is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getPartyGenders}
              optionLabel={(gender) => `${get(gender, 'strings.name.en')}`}
              optionValue="_id"
              initialValue={
                get(caze, 'victim.gender') || get(cached, 'victim.gender')
              }
              onCache={(values) =>
                setCache({ ...cached, 'victim.gender': values[0] })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end: area & gender */}

      {/* start: age & occupation */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            name={['victim', 'age']}
            label="Age"
            title="Victim/Patient Age"
            rules={[
              {
                required: true,
                message: 'Victim/Patient Age is required',
              },
            ]}
          >
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Occupation"
            title="Victim/Patient Occupation e.g Health Worker"
            name={['victim', 'occupation']}
          >
            <SearchableSelectInput
              onSearch={getPartyOccupations}
              optionLabel={(occupation) =>
                `${get(occupation, 'strings.name.en')} `
              }
              optionValue="_id"
              initialValue={
                get(caze, 'victim.occupation') ||
                get(cached, 'victim.occupation')
              }
              onCache={(values) =>
                setCache({ ...cached, 'victim.occupation': values[0] })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end: age & occupation */}

      {/* start: next of kin name & mobile */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Next of Kin - Name"
            title="Valid Next of Kin Name e.g Asha Mdoe"
            name={['victim', 'nextOfKin', 'name']}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Next of Kin - Phone"
            title="Valid Next of Kin Mobile Phone Number"
            name={['victim', 'nextOfKin', 'mobile']}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* end: next of kin name & mobile */}

      {/* start: address */}
      <Form.Item
        label="Address"
        title="Victim/Patient Physical Address"
        name={['victim', 'address']}
      >
        <TextArea autoSize={{ minRows: 2, maxRows: 10 }} />
      </Form.Item>
      {/* end:address */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button type="link" onClick={() => setMoreOptions(!moreOptions)}>
          {moreOptions ? 'Less Options' : 'More Options'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
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

CaseForm.defaultProps = {
  caze: {},
};

CaseForm.propTypes = {
  caze: PropTypes.shape({
    _id: PropTypes.string,
    number: PropTypes.string,
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CaseForm;
