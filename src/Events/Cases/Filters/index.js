import React from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form } from 'antd';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getPartyGenders,
  getPartyOccupations,
  getAdministrativeAreas,
} = httpActions;

/* state actions */
const { clearCaseFilters, filterCases } = reduxActions;

/* ui */
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

/**
 * @function
 * @name CaseFiltersForm
 * @description Case filters form
 * @param {object} props Filter props
 * @param {object} props.filter Filter object from the store
 * @param {object} props.cached Cached values for lazy loaded values
 * @param {Function} props.onCache Cache value callback
 * @param {Function} props.onClearCache Clear cached values callback
 * @param {Function} props.onCancel Close filter form callback
 * @returns {object} CaseFiltersForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <CaseFiltersForm
 *   filter={filter}
 *   cached={cached}
 *   onCache={this.handleOnCache}
 *   onClearCache={this.handleOnClearCache}
 *   onCancel={this.handleCloseFilterForm}
 * />
 */
const CaseFiltersForm = ({
  filter,
  cached,
  onCache,
  onClearCache,
  onCancel,
}) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    // TODO: clear false values
    filterCases(values);
    onCancel();
  };

  /**
   * @function
   * @name onClearFilters
   * @description On clear form filters callback
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const onClearFilters = () => {
    clearCaseFilters();
    if (isFunction(onClearCache)) {
      onClearCache();
    }
    onCancel();
  };

  return (
    <Form
      onFinish={onFinish}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      autoComplete="off"
      initialValues={{
        ...filter,
      }}
    >
      {/* start:are filter */}
      <Form.Item
        label="By Area"
        title="Victim/Patient Residential Area e.g Dar es Salaam"
        name={['victim.area']}
      >
        <SearchableSelectInput
          onSearch={(optns = {}) => {
            return getAdministrativeAreas(optns);
          }}
          optionLabel={(area) => {
            return get(area, 'strings.name.en');
          }}
          optionValue="_id"
          mode="multiple"
          onCache={(area) => onCache({ 'victim.area': area })}
          initialValue={get(cached, 'victim.area', [])}
        />
      </Form.Item>
      {/* end:are filter */}

      {/* start:gender filter */}
      <Form.Item
        label="By Gender"
        title="Victim/Patient Gender e.g Female"
        name={['victiom.gender']}
      >
        <SearchableSelectInput
          onSearch={(optns = {}) => {
            return getPartyGenders(optns);
          }}
          optionLabel={(gender) => get(gender, 'strings.name.en')}
          optionValue="_id"
          mode="multiple"
          onCache={(gender) => onCache({ 'victiom.gender': gender })}
          initialValue={get(cached, 'victiom.gender')}
        />
      </Form.Item>
      {/* end:gender filter */}

      {/* start:occupation filter */}
      <Form.Item
        label="By Occupation"
        title="Victim/Patient Occupation e.g Health Worker"
        name={['victiom.occupation']}
      >
        <SearchableSelectInput
          onSearch={(optns = {}) => {
            return getPartyOccupations(optns);
          }}
          optionLabel={(occupation) => get(occupation, 'strings.name.en')}
          optionValue="_id"
          mode="multiple"
          onCache={(occupation) =>
            onCache({ 'victiom.occupation': occupation })
          }
          initialValue={get(cached, 'victiom.occupation')}
        />
      </Form.Item>
      {/* end:occupation filter */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button style={{ marginLeft: 8 }} onClick={onClearFilters}>
          Clear
        </Button>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      {/* end:form actions */}
    </Form>
  );
};

CaseFiltersForm.propTypes = {
  filter: PropTypes.shape({
    'victim.gender': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'victim.area': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'victim.occupation': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
  }),
  cached: PropTypes.shape({
    'victim.gender': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'victim.area': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'victim.occupation': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

CaseFiltersForm.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(CaseFiltersForm, {
  filter: 'features.filter',
});
