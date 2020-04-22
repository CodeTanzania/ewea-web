import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeFeatureTypeForm,
  Connect,
  getFeatureTypes,
  openFeatureTypeForm,
  searchFeatureTypes,
  selectFeatureType,
  refreshFeatureTypes,
  paginateFeatureTypes,
  deleteFeatureType,
} from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import FeatureTypeForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getFeatureTypesExportUrl,
} = httpActions;

const nameSpan = { xxl: 4, xl: 5, lg: 6, md: 7, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 18, xl: 17, lg: 16, md: 14, sm: 20, xs: 18 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

/**
 * @class
 * @name FeatureTypes
 * @description Render featureType list which have search box, actions and featureType list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FeatureTypes extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getFeatureTypes();
  }

  /**
   * @function
   * @name handleOnCachedValues
   * @description Cached selected values for filters
   *
   * @param {object} cached values to be cached from filter
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCachedValues = (cached) => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearCachedValues = () => {
    this.setState({ cached: null });
  };

  /**
   * @function
   * @name openFeatureTypeForm
   * @description Open featureType form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFeatureTypeForm = () => {
    openFeatureTypeForm();
  };

  /**
   * @function
   * @name closeFeatureTypeForm
   * @description close featureType form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFeatureTypeForm = () => {
    closeFeatureTypeForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchFeatureTypes
   * @description Search FeatureTypes List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchFeatureTypes = (event) => {
    searchFeatureTypes(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} featureType featureType to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (featureType) => {
    selectFeatureType(featureType);
    this.setState({ isEditForm: true });
    openFeatureTypeForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} featureTypes event Actions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (featureTypes) => {
    let message = '';
    if (isArray(featureTypes)) {
      const featureTypeList = featureTypes.map(
        (featureType) =>
          `Name: ${featureType.strings.name.en}\nDescription: ${
            // eslint-disable-line
            featureType.strings.description.en
          }\n`
      );

      message = featureTypeList.join('\n\n\n');
    } else {
      message = `Name: ${featureTypes.strings.name.en}\nDescription: ${
        // eslint-disable-line
        featureTypes.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify featureType
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
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
    selectFeatureType(null);
    this.setState({ isEditForm: false });
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

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving an feature type
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteFeatureType(
          item._id, // eslint-disable-line
          () => notifySuccess('Feature type was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving feature type, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshFeatureTypes = () =>
    refreshFeatureTypes(
      () => notifySuccess('Feature types refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing feature types, please contact system administrator'
        )
    );

  render() {
    const {
      featureTypes,
      featureType,
      loading,
      posting,
      page,
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
            placeholder: 'Search for feature type here ...',
            onChange: this.searchFeatureTypes,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Feature Type',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Feature Type',
              onClick: this.openFeatureTypeForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="feature types"
          items={featureTypes}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshFeatureTypes}
          onPaginate={(nextPage) => paginateFeatureTypes(nextPage)}
          generateExportUrl={getFeatureTypesExportUrl}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              name={item.strings.name.en}
              avatarBackgroundColor={item.strings.color}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Feature Type',
                    title: 'Update Feature Type Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Feature Type',
                    title: 'Share Feature Type details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Feature Type',
                    title:
                      'Remove Feature Type from list of active feature types',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')} </Col>

              {/* eslint-disable-next-line */}
              <Col {...descriptionSpan}>
                {get(item, 'strings.description.en', 'N/A')}{' '}
              </Col>
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Feature Types"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
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
          title={isEditForm ? 'Edit Feature Type' : 'Add New Feature Type'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeFeatureTypeForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <FeatureTypeForm
            posting={posting}
            isEditForm={isEditForm}
            featureType={featureType}
            onCancel={this.closeFeatureTypeForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

FeatureTypes.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  featureTypes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  featureType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

FeatureTypes.defaultProps = {
  featureType: null,
  searchQuery: undefined,
};

export default Connect(FeatureTypes, {
  featureTypes: 'featureTypes.list',
  featureType: 'featureTypes.selected',
  loading: 'featureTypes.loading',
  posting: 'featureTypes.posting',
  page: 'featureTypes.page',
  showForm: 'featureTypes.showForm',
  total: 'featureTypes.total',
  searchQuery: 'featureTypes.q',
});
