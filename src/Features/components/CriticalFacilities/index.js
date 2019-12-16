import {
  Connect,
  getFeatures,
  openFeatureForm,
  searchFeatures,
  // selectFeature,
  // closeFeatureForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { Modal } from 'antd';
import Topbar from '../../../components/Topbar';
import EventTypesList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name Features
 * @description Render Features list which have search box,
 * actions and features list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Features extends Component {
  // eslint-disable-next-line react/state-in-constructor
  // state = {
  //   isEditForm: false,
  // };

  componentDidMount() {
    getFeatures();
  }

  /**
   * @function
   * @name openEventTypesForm
   * @description Open feature form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventTypesForm = () => {
    openFeatureForm();
  };

  // /**
  //  * @function
  //  * @name closeEventTypesForm
  //  * @description close feature form
  //  *
  //  * @version 0.1.0
  //  * @since 0.1.0
  //  */
  // closeEventTypesForm = () => {
  //   closeFeatureForm();
  //   this.setState({ isEditForm: false });
  // };

  /**
   * @function
   * @name searchFeatures
   * @description Search Feature List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchFeatures = event => {
    searchFeatures(event.target.value);
  };

  // /**
  //  * @function
  //  * @name handleEdit
  //  * @description Handle on Edit action for list item
  //  *
  //  * @param {object} feature feature to be edited
  //  *
  //  * @version 0.1.0
  //  * @since 0.1.0
  //  */
  // handleEdit = feature => {
  //   selectFeature(feature);
  //   this.setState({ isEditForm: true });
  //   openFeatureForm();
  // };

  // /**
  //  * @function
  //  * @name handleAfterCloseForm
  //  * @description Perform post close form cleanups
  //  *
  //  * @version 0.1.0
  //  * @since 0.1.0
  //  */
  // handleAfterCloseForm = () => {
  //   this.setState({ isEditForm: false });
  // };

  render() {
    const {
      features,
      loading,
      page,
      // posting,
      // feature,
      // showForm,
      searchQuery,
      total,
    } = this.props;
    // const { isEditForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Features here ...',
            onChange: this.searchFeatures,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Feature',
              icon: 'plus',
              size: 'large',
              title: 'Add New Feature',
              onClick: this.openEventTypesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventTypesList">
          {/* list starts */}
          <EventTypesList
            total={total}
            page={page}
            features={features}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          {/* <Modal
            title={isEditForm ? 'Edit Event Type' : 'Add New Event Type'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventTypesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventTypeForm
              posting={posting}
              isEditForm={isEditForm}
              feature={feature}
              onCancel={this.closeEventTypesForm}
            />
          </Modal> */}
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
  // posting: PropTypes.bool.isRequired,
  // showForm: PropTypes.bool.isRequired,
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
