import { httpActions } from '@codetanzania/ewea-api-client';
import { postFocalPerson, putFocalPerson } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const {
  getAgencies,
  getAdministrativeAreas,
  getPartyRoles,
  getPartyGroups,
} = httpActions;
const { TextArea } = Input;

/**
 * @class
 * @name FocalPersonForm
 * @description Render Focal Person form for creating and updating stakeholder
 * focalPerson details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FocalPersonForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle submit form action
   *
   * @param {object} event onSubmit event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = event => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      focalPerson,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedFocalPerson = { ...focalPerson, ...values };
          putFocalPerson(
            updatedFocalPerson,
            () => {
              notifySuccess('Focal Person was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating focal Person, please try again!'
              );
            }
          );
        } else {
          postFocalPerson(
            values,
            () => {
              notifySuccess('Focal Person was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving focal Person, please try again!'
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
      focalPerson,
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
        {/* focalPerson name, phone number and email section */}
        <Row type="flex" justify="space-between">
          <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
            {/* focalPerson name */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Name">
              {getFieldDecorator('name', {
                initialValue: isEditForm ? focalPerson.name : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Focal Person full name is required',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            {/* end focalPerson name */}
          </Col>
          <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
            <Row type="flex" justify="space-between">
              <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
                {/* focalPerson mobile number */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Phone Number">
                  {getFieldDecorator('mobile', {
                    initialValue: isEditForm ? focalPerson.mobile : undefined,
                    rules: [
                      { required: true, message: 'Phone number is required' },
                    ],
                  })(<Input />)}
                </Form.Item>
                {/* end focalPerson mobile number */}
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} span={12}>
                {/* focalPerson email */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Email">
                  {getFieldDecorator('email', {
                    initialValue: isEditForm ? focalPerson.email : undefined,
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'E-mail address is required',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                {/* end focalPerson email */}
              </Col>
            </Row>
          </Col>
        </Row>
        {/* end focalPerson name, phone number and email section */}

        {/* focalPerson organization, group and area section */}
        <Row type="flex" justify="space-between">
          <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
            {/* focalPerson organization */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Organization/Agency">
              {getFieldDecorator('party', {
                initialValue:
                  isEditForm && focalPerson.party
                    ? focalPerson.party._id // eslint-disable-line
                    : undefined,
              })(
                <SearchableSelectInput
                  onSearch={getAgencies}
                  optionLabel="name"
                  optionValue="_id"
                  initialValue={
                    isEditForm && focalPerson.party
                      ? focalPerson.party
                      : undefined
                  }
                />
              )}
            </Form.Item>
            {/* end focalPerson organization */}
          </Col>

          <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
            <Row type="flex" justify="space-between">
              <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
                {/* focalPerson group */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Group">
                  {getFieldDecorator('group', {
                    initialValue:
                      isEditForm && focalPerson.group
                        ? focalPerson.group._id // eslint-disable-line
                        : undefined,
                    rules: [
                      {
                        required: true,
                        message: 'Focal Person group is required',
                      },
                    ],
                  })(
                    <SearchableSelectInput
                      onSearch={getPartyGroups}
                      optionLabel={group => group.strings.name.en}
                      optionValue="_id"
                      initialValue={
                        isEditForm && focalPerson.group
                          ? focalPerson.group
                          : undefined
                      }
                    />
                  )}
                </Form.Item>
                {/* end focalPerson group */}
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                {/* focalPerson location */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Area">
                  {getFieldDecorator('area', {
                    initialValue:
                      isEditForm && focalPerson.area
                        ? focalPerson.area._id // eslint-disable-line
                        : undefined,
                  })(
                    <SearchableSelectInput
                      onSearch={getAdministrativeAreas}
                      optionLabel={area => area.strings.name.en}
                      optionValue="_id"
                      initialValue={
                        isEditForm && focalPerson.area
                          ? focalPerson.area
                          : undefined
                      }
                    />
                  )}
                </Form.Item>
                {/* end focalPerson location */}
              </Col>
            </Row>
          </Col>
        </Row>
        {/* end focalPerson organization, group and area section */}

        {/* focalPerson role, landline and fax section */}
        <Row type="flex" justify="space-between">
          <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
            {/* focalPerson role */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Role">
              {getFieldDecorator('role', {
                initialValue:
                  isEditForm && focalPerson.role
                    ? focalPerson.role._id // eslint-disable-line
                    : undefined,
                rules: [
                  { required: true, message: 'Focal Person role is required' },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getPartyRoles}
                  optionLabel={role => role.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && focalPerson.role
                      ? focalPerson.role
                      : undefined
                  }
                />
              )}
            </Form.Item>
            {/* end focalPerson role */}
          </Col>
          <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
            <Row type="flex" justify="space-between">
              <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
                {/* focalPerson landline number */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Other Number">
                  {getFieldDecorator('landline', {
                    initialValue: isEditForm ? focalPerson.landline : undefined,
                  })(<Input />)}
                </Form.Item>
                {/* end focalPerson landline number */}
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                {/* focalPerson fax */}
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Fax">
                  {getFieldDecorator('fax', {
                    initialValue: isEditForm ? focalPerson.fax : undefined,
                  })(<Input />)}
                </Form.Item>
                {/* end focalPerson fax */}
              </Col>
            </Row>
          </Col>
        </Row>
        {/* end focalPerson role, landline and fax section */}

        {/* focalPerson Physical Address, Postal Address section */}
        <Row type="flex" justify="space-between">
          <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
            {/* focalPerson physical Address */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Physical Address">
              {getFieldDecorator('physicalAddress', {
                initialValue: isEditForm
                  ? focalPerson.physicalAddress
                  : undefined,
              })(<TextArea autoSize={{ minRows: 1, maxRows: 10 }} />)}
            </Form.Item>
            {/* end focalPerson physical Address */}
          </Col>
          <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
            {/* focalPerson postal address */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Postal Address">
              {getFieldDecorator('postalAddress', {
                initialValue: isEditForm
                  ? focalPerson.postalAddress
                  : undefined,
              })(<TextArea autoSize={{ minRows: 1, maxRows: 10 }} />)}
            </Form.Item>
            {/* end focalPerson postal address */}
          </Col>
        </Row>
        {/* end focalPerson physical Address, Postal Address section */}

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

FocalPersonForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  focalPerson: PropTypes.shape({
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
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Form.create()(FocalPersonForm);
