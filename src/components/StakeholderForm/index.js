import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Col, Form, Input, Row } from 'antd';
import get from 'lodash/get';

import SearchableSelectInput from '../SearchableSelectInput';

/* http actions */
const {
  getAgencies,
  getAdministrativeAreas,
  getPartyRoles,
  getPartyGroups,
} = httpActions;
/* redux actions */
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

const StakeholderForm = ({
  stakeholder,
  posting,
  onCancel,
  onCreate,
  onUpdate,
  isAgency,
}) => {
  const onFinish = (values) => {
    if (get(stakeholder, '_id')) {
      const updatedStakeholder = { ...stakeholder, ...values };
      onUpdate(updatedStakeholder);
      return;
    }

    onCreate(values);
  };

  return (
    <Form
      {...formItemLayout} // eslint-disable-line
      onFinish={onFinish}
      initialValues={{
        ...stakeholder,
        party: get(stakeholder, 'party._id'),
        group: get(stakeholder, 'group._id'),
        area: get(stakeholder, 'area._id'),
        role: get(stakeholder, 'role._id'),
      }}
    >
      {/* stakeholder name, phone number and email section */}
      <Row type="flex" justify="space-between">
        <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
          {/* stakeholder name */}
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* end stakeholder name */}
        </Col>
        <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
          <Row type="flex" justify="space-between">
            <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
              {/* stakeholder mobile number */}
              <Form.Item
                name="mobile"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Phone number is required' },
                ]}
              >
                <Input />
              </Form.Item>
              {/* end stakeholder mobile number */}
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} span={12}>
              {/* stakeholder email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'E-mail address is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* end stakeholder email */}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* end stakeholder name, phone number and email section */}

      {/* stakeholder organization, group and area section */}
      <Row type="flex" justify="space-between">
        <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
          {isAgency ? (
            <Form.Item
              name="abbreviation"
              label="Abbreviation"
              rules={[
                { required: true, message: 'Agency Abbreviation is Required' },
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item name="party" label="Organization/Agency">
              <SearchableSelectInput
                onSearch={getAgencies}
                optionLabel="name"
                optionValue="_id"
                initialValue={get(stakeholder, 'party')}
              />
            </Form.Item>
          )}
        </Col>

        <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
          <Row type="flex" justify="space-between">
            <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
              {/* stakeholder group */}
              <Form.Item
                name="group"
                label="Group"
                rules={[
                  {
                    required: true,
                    message: 'Group is required',
                  },
                ]}
              >
                <SearchableSelectInput
                  onSearch={getPartyGroups}
                  optionLabel={(group) => group.strings.name.en}
                  optionValue="_id"
                  initialValue={get(stakeholder, 'group')}
                />
              </Form.Item>
              {/* end stakeholder group */}
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              {/* stakeholder location */}
              <Form.Item
                name="area"
                label="Area"
                rules={[
                  {
                    required: true,
                    message: 'Area is required',
                  },
                ]}
              >
                <SearchableSelectInput
                  onSearch={getAdministrativeAreas}
                  optionLabel={(area) =>
                    `${area.strings.name.en} (${get(
                      area,
                      'relations.level.strings.name.en',
                      'N/A'
                    )})`
                  }
                  optionValue="_id"
                  initialValue={get(stakeholder, 'area')}
                />
              </Form.Item>
              {/* end stakeholder location */}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* end stakeholder organization, group and area section */}

      {/* stakeholder role, landline and fax section */}
      <Row type="flex" justify="space-between">
        <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
          {/* stakeholder role or website depending on whether stakeholder is focal person or an agency */}
          {isAgency ? (
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              name="role"
              label="Role"
              rules={[
                { required: true, message: 'Focal Person role is required' },
              ]}
            >
              <SearchableSelectInput
                onSearch={getPartyRoles}
                optionLabel={(role) => role.strings.name.en}
                optionValue="_id"
                initialValue={get(stakeholder, 'role')}
              />
            </Form.Item>
          )}
          {/* end role or website */}
        </Col>
        <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
          <Row type="flex" justify="space-between">
            <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
              {/* stakeholder landline number */}
              <Form.Item name="landline" label="Other Number">
                <Input />
              </Form.Item>
              {/* end stakeholder landline number */}
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              {/* stakeholder fax */}
              <Form.Item name="fax" label="Fax">
                <Input />
              </Form.Item>
              {/* end stakeholder fax */}
            </Col>
          </Row>
        </Col>
      </Row>
      {/* end stakeholder role, landline and fax section */}

      {/* stakeholder Physical Address, Postal Address section */}
      <Row type="flex" justify="space-between">
        <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
          {/* stakeholder physical Address */}
          <Form.Item name="physicalAddress" label="Physical Address">
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
          </Form.Item>
          {/* end stakeholder physical Address */}
        </Col>
        <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
          {/* stakeholder postal address */}
          <Form.Item name="postalAddress" label="Postal Address">
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
          </Form.Item>
          {/* end stakeholder postal address */}
        </Col>
      </Row>
      {/* end stakeholder physical Address, Postal Address section */}

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

StakeholderForm.propTypes = {
  stakeholder: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    abbreviation: PropTypes.string,
    mobile: PropTypes.string,
    email: PropTypes.string,
    party: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
    }),
    group: PropTypes.string,
    area: PropTypes.string,
    role: PropTypes.string,
    landline: PropTypes.string,
    fax: PropTypes.string,
    physicalAddress: PropTypes.string,
    postalAddress: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
  isAgency: PropTypes.bool,
};

StakeholderForm.defaultProps = {
  isAgency: false,
};

export default StakeholderForm;
