import React from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form } from 'antd';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const { getAgencies, getFeatureTypes, getAdministrativeAreas } = httpActions;

/* state actions */
const { clearFeatureFilters, filterFeatures } = reduxActions;

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
 * @name FeatureFiltersForm
 * @description Feature filters form
 * @param {object} props Filter props
 * @param {object} props.filter Filter object from the store
 * @param {object} props.cached Cached values for lazy loaded values
 * @param {Function} props.onCache Cache value callback
 * @param {Function} props.onClearCache Clear cached values callback
 * @param {Function} props.onCancel Close filter form callback
 * @returns {object} FeatureFiltersForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <FeatureFiltersForm
 *   filter={filter}
 *   cached={cached}
 *   onCache={this.handleOnCache}
 *   onClearCache={this.handleOnClearCache}
 *   onCancel={this.handleCloseFilterForm}
 * />
 */
const FeatureFiltersForm = ({
  filter,
  cached,
  onCache,
  onClearCache,
  onCancel,
}) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    // TODO: clear false values
    filterFeatures(values);
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
    clearFeatureFilters();
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
      {/* start:feature type filter */}
      <Form.Item
        label="By Type"
        title="Critical infrastructure type e.g Hospital"
        name={['relations.type']}
      >
        <SearchableSelectInput
          onSearch={(optns = {}) => {
            return getFeatureTypes(optns);
          }}
          optionLabel={(type) => get(type, 'strings.name.en')}
          optionValue="_id"
          mode="multiple"
          onCache={(type) => onCache({ 'relations.type': type })}
          initialValue={get(cached, 'relations.type')}
        />
      </Form.Item>
      {/* end:feature type filter */}

      {/* start:feature area filter */}
      <Form.Item
        label="By Area"
        title="Critical infrastructure area e.g Dar es Salaam"
        name={['relations.area']}
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
          onCache={(area) => onCache({ 'relations.area': area })}
          initialValue={get(cached, 'relations.area', [])}
        />
      </Form.Item>
      {/* end:feature area filter */}

      {/* start:feature custodians filter */}
      <Form.Item
        label="By Custodian"
        title="Responsible Agencies e.g Police Force"
        name={['relations.custodians']}
      >
        <SearchableSelectInput
          onSearch={(optns = {}) => {
            return getAgencies(optns);
          }}
          optionLabel={(custodian) => get(custodian, 'name')}
          optionValue="_id"
          mode="multiple"
          onCache={(custodians) =>
            onCache({ 'relations.custodians': custodians })
          }
          initialValue={get(cached, 'relations.custodians', [])}
        />
      </Form.Item>
      {/* end:feature custodians filter */}

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

FeatureFiltersForm.propTypes = {
  filter: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
      area: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
      custodians: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
    })
  ),
  cached: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

FeatureFiltersForm.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(FeatureFiltersForm, {
  filter: 'features.filter',
});
