import {
  Connect,
  getFeatures,
  openFeatureForm,
  searchFeatures,
  selectFeature,
  closeFeatureForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../../components/Topbar';
import FeaturesList from './List';
import FeaturesForm from './Form';
import './styles.css';

/* constants */

/**
 * @class
 * @name Features
 * @description Render Critical facilities list which have search box,
 * actions and critical facilities list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Features extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getFeatures();
  }

  /**
   * @function
   * @name openFeaturesForm
   * @description Open feature form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFeaturesForm = () => {
    openFeatureForm();
  };

  /**
   * @function
   * @name closeFeaturesForm
   * @description close feature form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFeaturesForm = () => {
    closeFeatureForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchFeatures
   * @description Search critical facility List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchFeatures = event => {
    searchFeatures(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} feature critical facility to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = feature => {
    selectFeature(feature);
    this.setState({ isEditForm: true });
    openFeatureForm();
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    this.setState({ isEditForm: false });
  };

  render() {
    const {
      features,
      loading,
      page,
      posting,
      feature,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Critical facilities here ...',
            onChange: this.searchFeatures,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Feature',
              icon: 'plus',
              size: 'large',
              title: 'Add New Critical facility',
              onClick: this.openFeaturesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="FeaturesList">
          {/* list starts */}
          <FeaturesList
            total={total}
            page={page}
            features={features}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm
                ? 'Edit Critical Facility'
                : 'Add New Critical Facility'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeFeaturesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <FeaturesForm
              posting={posting}
              isEditForm={isEditForm}
              feature={feature}
              onCancel={this.closeFeaturesForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

Features.propTypes = {
  loading: PropTypes.bool.isRequired,
  features: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  feature: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

Features.defaultProps = {
  feature: null,
  searchQuery: undefined,
};

export default Connect(Features, {
  features: 'features.list',
  feature: 'features.selected',
  loading: 'features.loading',
  posting: 'features.posting',
  page: 'features.page',
  showForm: 'features.showForm',
  total: 'features.total',
  searchQuery: 'features.q',
});
