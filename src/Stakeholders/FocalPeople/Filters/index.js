import React from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form } from 'antd';
import get from 'lodash/get';

import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getPartyGroups,
  getAdministrativeAreas,
  getPartyRoles,
  getAgencies,
} = httpActions;
/* redux actions */
const { clearFocalPersonFilters, filterFocalPeople } = reduxActions;

const LABEL_COL = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const WRAPPER_COL = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/**
 * @function
 * @name FocalPeopleFilters
 * @description Filter modal component for filtering contacts
 * @param {object} props Component object properties
 * @param {object} props.filter filter object
 * @param {object} props.cached Cached values for lazy loaded components
 * @param {Function} props.onCache Callback for caching lazy loaded selected values
 * @param {Function} props.onClearCache Callback for clearing cached values
 * @param {Function} props.onCancel Callback for closing Filter modal window
 * @returns {object} Focal people filters
 * @version 0.2.0
 * @since 0.1.0
 */
const FocalPeopleFilters = ({
  filter,
  cached,
  onCache,
  onClearCache,
  onCancel,
}) => {
  /**
   * @function
   * @name onFinish
   * @description Callback invoked when submitting the form after successfully validation
   * @param {object} values Filled form values object
   * @version 0.1.0
   * @since 0.1.0
   */
  const onFinish = (values) => {
    filterFocalPeople(values);
    onCancel();
  };

  /**
   * @function
   * @name handleClearFilters
   * @description Clear cached values and filter values in redux store
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleClearFilters = () => {
    clearFocalPersonFilters();

    onClearCache();
    onCancel();
  };

  return (
    <Form
      labelCol={LABEL_COL}
      wrapperCol={WRAPPER_COL}
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{
        area: get(filter, 'area', []),
        group: get(filter, 'group', []),
        role: get(filter, 'role', []),
        party: get(filter, 'party', []),
      }}
    >
      {/* start contact group filters */}
      <Form.Item label="By Area(s)" name="area">
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
          mode="multiple"
          onCache={(areas) => {
            onCache({ areas });
          }}
          initialValue={get(cached, 'areas', [])}
        />
      </Form.Item>
      {/* end contact group filters */}

      {/* start contact group filters */}
      <Form.Item label="By Group(s)" name="group">
        <SearchableSelectInput
          onSearch={getPartyGroups}
          optionLabel={(group) => get(group, 'group.strings.name.en', 'N/A')}
          optionValue="_id"
          mode="multiple"
          onCache={(groups) => onCache({ groups })}
          initialValue={get(cached, 'groups', [])}
        />
      </Form.Item>
      {/* end contact group filters */}

      {/* start contact group filters */}
      <Form.Item label="By Role(s)" name="role">
        <SearchableSelectInput
          onSearch={getPartyRoles}
          optionLabel={(role) => get(role, 'strings.name.en', 'N/A')}
          optionValue="_id"
          mode="multiple"
          onCache={(roles) => onCache({ roles })}
          initialValue={get(cached, 'roles', [])}
        />
      </Form.Item>
      {/* end contact group filters */}

      {/* start contact group filters */}
      <Form.Item label="By Agencies" name="party">
        <SearchableSelectInput
          onSearch={getAgencies}
          optionLabel="name"
          optionValue="_id"
          mode="multiple"
          onCache={(agencies) => onCache({ agencies })}
          initialValue={get(cached, 'agencies', [])}
        />
      </Form.Item>
      {/* end contact group filters */}

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button style={{ marginLeft: 8 }} onClick={handleClearFilters}>
          Clear
        </Button>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

FocalPeopleFilters.propTypes = {
  filter: PropTypes.objectOf(
    PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onCancel: PropTypes.func.isRequired,
  cached: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    areas: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    roles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    agencies: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
};

FocalPeopleFilters.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(FocalPeopleFilters, {
  filter: 'focalPeople.filter',
});
