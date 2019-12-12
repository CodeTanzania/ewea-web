import { httpActions } from '@codetanzania/ewea-api-client';
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
import NotificationForm from '../../../components/NotificationForm';
import Topbar from '../../../components/Topbar';
// import FocalPersonFilters from './Filters';
import NotificationTemplateForm from './Form';
import NotificationTemplatesList from './List';
import './styles.css';

/* constants */
const {
  getNotificationTemplates: getFocalPeopleFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name NotificationTemplates
 * @description Render focalPerson list which have search box, actions and focalPerson list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplates extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedNotificationTemplates: [],
    notificationBody: undefined,
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
   * @name searchFocalPeople
   * @description Search FocalPeople List based on supplied filter word
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
   * @name handleShare
   * @description Handle share single focalPerson action
   *
   * @param {object} focalPerson focalPerson to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = focalPerson => {
    const message = `${focalPerson.name}\nMobile: ${
      // eslint-disable-line
      focalPerson.mobile
    }\nEmail: ${focalPerson.email}`;

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleBulkShare
   * @description Handle share multiple focal People
   *
   * @param {object[]} focalPeople focal People list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleBulkShare = focalPeople => {
    const focalPersonList = focalPeople.map(
      focalPerson =>
        `${focalPerson.name}\nMobile: ${focalPerson.mobile}\nEmail: ${
          // eslint-disable-line
          focalPerson.email
        }`
    );

    const message = focalPersonList.join('\n\n\n');

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify focalPeople
   *
   * @param {object[]} notificationTemplate List of focalPeople selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = notificationTemplate => {
    this.setState({
      selectedNotificationTemplates: notificationTemplate,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify focalPeople
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
      showNotificationForm,
      selectedNotificationTemplates,
      notificationBody,
      // cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Notification Template here ...',
            onChange: this.searchFocalPeople,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Template',
              icon: 'plus',
              size: 'large',
              title: 'Add New Notification Template',
              onClick: this.openNotificationForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="FocalPeopleList">
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
            title="Filter Focal People"
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

          {/* Notification Modal modal */}
          <Modal
            title="Notify Focal People"
            visible={showNotificationForm}
            onCancel={this.closeNotificationForm}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
            afterClose={this.handleAfterCloseNotificationForm}
          >
            <NotificationForm
              recipients={selectedNotificationTemplates}
              onSearchRecipients={getFocalPeopleFromAPI}
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
              isEditForm
                ? 'Edit Notification Template'
                : 'Add New Notification Template'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeNotificationForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <NotificationTemplateForm
              posting={posting}
              isEditForm={isEditForm}
              notificationTemplate={notificationTemplate}
              onCancel={this.closeNotificationForm}
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
