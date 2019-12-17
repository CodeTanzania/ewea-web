// import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeNotificationTemplateForm,
  Connect,
  getNotificationTemplates,
  openNotificationTemplateForm,
  searchNotificationTemplates,
  selectNotificationTemplate,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Topbar from '../../../components/Topbar';
import NotificationTemplateForm from './Form';
import NotificationTemplatesList from './List';
import './styles.css';

/**
 * @class
 * @name NotificationTemplates
 * @description Render notification templates list which have search box, actions and Notification template list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplates extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
  };

  componentDidMount() {
    getNotificationTemplates();
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
  handleOnCachedValues = cached => {
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
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openNotificationTemplateForm
   * @description Open Notification Template form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationTemplateForm = () => {
    openNotificationTemplateForm();
  };

  /**
   * @function
   * @name openNotificationTemplateForm
   * @description close NotificationTemplate form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationTemplateForm = () => {
    closeNotificationTemplateForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchNotificationTemplates
   * @description Search Notification Templates List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchNotificationTemplates = event => {
    searchNotificationTemplates(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} notificationTemplate template to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = notificationTemplate => {
    selectNotificationTemplate(notificationTemplate);
    this.setState({ isEditForm: true });
    openNotificationTemplateForm();
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
      notificationTemplates,
      notificationTemplate,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      showFilters,
      isEditForm,
      // cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Notification Template here ...',
            onChange: this.searchNotificationTemplates,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Template',
              icon: 'plus',
              size: 'large',
              title: 'Add New Notification Template',
              onClick: this.openNotificationTemplateForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="NotificationTemplatesList">
          {/* list starts */}
          <NotificationTemplatesList
            total={total}
            page={page}
            notificationTemplates={notificationTemplates}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
            onNotify={this.openNotificationForm}
            onShare={this.handleShare}
            onBulkShare={this.handleBulkShare}
          />
          {/* end list */}

          {/* filter modal */}
          <Modal
            title="Filter Notification templates"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            {/* <FocalPersonFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            /> */}
          </Modal>
          {/* end filter modal */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm
                ? 'Edit Notification Template'
                : 'Add New Notification Template'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeNotificationTemplateForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <NotificationTemplateForm
              posting={posting}
              isEditForm={isEditForm}
              notificationTemplate={notificationTemplate}
              onCancel={this.closeNotificationTemplateForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

NotificationTemplates.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  notificationTemplates: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  notificationTemplate: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

NotificationTemplates.defaultProps = {
  notificationTemplate: null,
  searchQuery: undefined,
};

export default Connect(NotificationTemplates, {
  notificationTemplates: 'notificationTemplates.list',
  notificationTemplate: 'notificationTemplates.selected',
  loading: 'notificationTemplates.loading',
  posting: 'notificationTemplates.posting',
  page: 'notificationTemplates.page',
  showForm: 'notificationTemplates.showForm',
  total: 'notificationTemplates.total',
  searchQuery: 'notificationTemplates.q',
});
