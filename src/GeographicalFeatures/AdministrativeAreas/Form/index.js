import { httpActions } from '@codetanzania/ewea-api-client';
import {
  postAdministrativeArea,
  putAdministrativeArea,
  Connect,
} from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import 'rc-color-picker/assets/index.css';

const { getAdministrativeLevels, getAdministrativeAreas } = httpActions;
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
  handleSubmit = (e) => {
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
          },
          relations: {
            level: values.level,
            parent: values.parent,
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
      strings: { name, description },
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
        {/* adminstrativeArea Level */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Administrative Level">
          {getFieldDecorator('level', {
            initialValue:
              isEditForm && administrativeArea
                ? administrativeArea.relations.level._id // eslint-disable-line
                : undefined,
            rules: [
              {
                required: true,
                message: 'Administrative Level is required',
              },
            ],
          })(
            <SearchableSelectInput
              onSearch={getAdministrativeLevels}
              optionLabel={(level) => level.strings.name.en}
              optionValue="_id"
              initialValue={
                isEditForm && administrativeArea
                  ? administrativeArea.relations.level.strings.name.en
                  : undefined
              }
            />
          )}
        </Form.Item>
        {/* end adminstrativeArea Level */}

        {/* administrativeArea Parent */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Administrative Area Parent">
          {getFieldDecorator('parent', {
            initialValue:
              isEditForm && administrativeArea
                ? administrativeArea.relations.parent._id // eslint-disable-line
                : undefined,
          })(
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={(area) =>
                `${area.strings.name.en} (${area.relations.level.strings.name.en})`
              }
              optionValue="_id"
              initialValue={
                isEditForm && administrativeArea
                  ? administrativeArea.relations.parent.strings.name.en
                  : undefined
              }
            />
          )}
        </Form.Item>
        {/* end administrativeArea Parent */}

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
                required: false,
                message: 'AdministrativeArea description is required',
              },
            ],
          })(<Input placeholder="e.g Tandale " />)}
        </Form.Item>
        {/* end description */}

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
    relations: PropTypes.shape({
      level: PropTypes.shape({
        strings: PropTypes.shape({
          name: PropTypes.shape({
            en: PropTypes.string.isRequired,
          }),
        }),
      }),
      parent: PropTypes.shape({
        strings: PropTypes.shape({
          name: PropTypes.shape({
            en: PropTypes.string.isRequired,
          }),
        }),
      }),
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
