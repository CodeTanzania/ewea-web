import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getFeatures,
  openFeatureForm,
  searchFeatures,
  selectFeature,
  closeFeatureForm,
  paginateFeatures,
  refreshFeatures,
  deleteFeature,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import { Modal, Col } from 'antd';
import Topbar from '../../components/Topbar';
import FeaturesForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const amenitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const addressSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 7, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...amenitySpan, header: 'Amenity' },
  { ...addressSpan, header: 'Address' },
  { ...descriptionSpan, header: 'Description' },
];
const {
  getFeaturesExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
} = httpActions;

const { confirm } = Modal;

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
    notificationBody: undefined,
    showNotificationForm: false,
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

  /**
   * @function
   * @name handleRefreshFeatures
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshFeatures = () => {
    refreshFeatures(
      () => {
        notifySuccess('Features refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Features please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple features
   *
   * @param {object[]| object} features features list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = features => {
    let message = '';
    if (isArray(features)) {
      const featureList = features.map(
        feature =>
          `Name: ${feature.strings.name.en}\nDescription: ${
            // eslint-disable-line
            feature.strings.description.en
          }\n`
      );

      message = featureList.join('\n\n\n');
    } else {
      message = `Name: ${features.strings.name.en}\nDescription: ${
        // eslint-disable-line
        features.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event question
   *
   * @param item {object} features to archive
   * @version 0.1.0
   * @since 0.1.0
   */

  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteFeature(
          item._id, // eslint-disable-line
          () => notifySuccess('Feature was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Feature, Please contact your system Administrator'
            )
        );
      },
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify features
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function
   * @name handleAfterCloseNotificationForm
   * @description Perform post close notification form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseNotificationForm = () => {
    this.setState({ notificationBody: undefined });
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
    const { isEditForm, showNotificationForm, notificationBody } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for critical facilities here ...',
            onChange: this.searchFeatures,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Critical Facility',
              icon: 'plus',
              size: 'large',
              title: 'Add New Critical Facility',
              onClick: this.openFeaturesForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="features"
          items={features}
          page={page}
          itemCount={total}
          loading={loading}
          onShare={this.handleShare}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshFeatures}
          onPaginate={nextPage => paginateFeatures(nextPage)}
          generateExportUrl={getFeaturesExportUrl}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              name={item.strings.name.en}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Feature',
                    title: 'Update Feature Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Feature',
                    title: 'Share Feature details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Feature',
                    title: 'Remove Feature from list of active Features',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>
                {item.strings.code ? item.strings.code : 'N/A'}
              </Col>
              <Col {...amenitySpan}>
                {item.properties.amenity ? item.properties.amenity : 'N/A'}
              </Col>
              <Col {...addressSpan}>
                {item.properties.address_city
                  ? item.properties.address_city
                  : 'N/A'}
              </Col>
              <Col {...descriptionSpan}>
                {item.strings.description ? item.strings.description.en : 'N/A'}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Features"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={
            isEditForm ? 'Edit Critical Facility' : 'Add New Critical Facility'
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
