import React from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form, InputNumber, Row, Col } from 'antd';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getAdministrativeAreas,
  getPartyGenders,
  getPartyNationalities,
  getPartyOccupations,
  getCaseStages,
  getCaseSeverities,
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
  // filter scoped cache keys
  const cacheKeys = [
    'filters.victim.area',
    'filters.victim.gender',
    'filters.victim.nationality',
    'filters.victim.occupation',
    'filters.stage',
    'filters.severity',
  ];

  // form finish(submit) handler
  const onFinish = (values) => {
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
    // TODO: fix age filter error
    clearCaseFilters();
    if (isFunction(onClearCache)) {
      onClearCache(...cacheKeys);
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
      {/* start:area & gender filter */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Area(s)"
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
              onCache={(area) => onCache({ 'filters.victim.area': area })}
              initialValue={get(cached, 'filters.victim.area')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Gender(s)"
            title="Victim/Patient Gender e.g Female"
            name={['victim.gender']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getPartyGenders(optns);
              }}
              optionLabel={(gender) => get(gender, 'strings.name.en')}
              optionValue="_id"
              mode="multiple"
              onCache={(gender) => onCache({ 'filters.victim.gender': gender })}
              initialValue={get(cached, 'filters.victim.gender')}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end:area & gender filter */}

      {/* start:nationality & occupation filter */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Nationality(s)"
            title="Victim/Patient Nationality e.g Tanzanian"
            name={['victim.nationality']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getPartyNationalities(optns);
              }}
              optionLabel={(nationality) => get(nationality, 'strings.name.en')}
              optionValue="_id"
              mode="multiple"
              onCache={(nationality) =>
                onCache({ 'filters.victim.nationality': nationality })
              }
              initialValue={get(cached, 'filters.victim.nationality')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Occupation(s)"
            title="Victim/Patient Occupation e.g Health Worker"
            name={['victim.occupation']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getPartyOccupations(optns);
              }}
              optionLabel={(occupation) => get(occupation, 'strings.name.en')}
              optionValue="_id"
              mode="multiple"
              onCache={(occupation) =>
                onCache({ 'filters.victim.occupation': occupation })
              }
              initialValue={get(cached, 'filters.victim.occupation')}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end:nationality & occupation filter */}

      {/* start:stage & severity filter */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Stage(s)"
            title="Case Stage e.g Followup"
            name={['stage']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getCaseStages(optns);
              }}
              optionLabel={(stage) => get(stage, 'strings.name.en')}
              optionValue="_id"
              mode="multiple"
              onCache={(stage) => onCache({ 'filters.stage': stage })}
              initialValue={get(cached, 'filters.stage')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="By Severity(s)"
            title="Case Severity e.g Critical"
            name={['severity']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getCaseSeverities(optns);
              }}
              optionLabel={(severity) => get(severity, 'strings.name.en')}
              optionValue="_id"
              mode="multiple"
              onCache={(severity) => onCache({ 'filters.severity': severity })}
              initialValue={get(cached, 'filters.severity')}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* start:end & severity filter */}

      {/* start:age filter */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            name={['victim.age', 'min']}
            label="Minimum Age"
            title="Victim/Patient Minimum Age e.g 26"
          >
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            name={['victim.age', 'max']}
            label="Maximum Age"
            title="Victim/Patient Maximum Age e.g 95"
          >
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      {/* end:age filter */}

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
    'victim.age': PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  }),
  cached: PropTypes.shape({
    'filters.victim.gender': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'filters.victim.area': PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
    'filters.victim.occupation': PropTypes.arrayOf(
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
  filter: 'cases.filter',
});
