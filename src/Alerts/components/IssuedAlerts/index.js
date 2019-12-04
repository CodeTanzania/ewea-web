import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeAlertForm,
  Connect,
  getAlerts,
  openAlertForm,
  searchAlerts,
  selectAlert,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../../components/NotificationForm';
import Topbar from '../../../components/Topbar';
import AlertFilters from './Filters';
import AlertForm from './Form';
import AlertsList from './List';
import './styles.css';

/* constants */
const {
  getAlerts: getAlertsFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name Alerts
 * @description Render alert list which have search box, actions and alert list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Alerts extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedAlerts: [],
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getAlerts();
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
   * @name openAlertForm
   * @description Open alert form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAlertForm = () => {
    openAlertForm();
  };

  /**
   * @function
   * @name openAlertForm
   * @description close alert form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAlertForm = () => {
    closeAlertForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAlerts
   * @description Search Alerts List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAlerts = event => {
    searchAlerts(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} alert alert to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = alert => {
    selectAlert(alert);
    this.setState({ isEditForm: true });
    openAlertForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share single alert action
   *
   * @param {object} alert alert to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = alert => {
    const message = `${alert.name}\nMobile: ${
      // eslint-disable-line
      alert.mobile
    }\nEmail: ${alert.email}`;

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleBulkShare
   * @description Handle share multiple focal People
   *
   * @param {object[]} alerts focal People list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleBulkShare = alerts => {
    const alertList = alerts.map(
      alert =>
        `${alert.name}\nMobile: ${alert.mobile}\nEmail: ${
          // eslint-disable-line
          alert.email
        }`
    );

    const message = alertList.join('\n\n\n');

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify alerts
   *
   * @param {object[]} alerts List of alerts selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = alerts => {
    this.setState({
      selectedAlerts: alerts,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify alerts
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
      alerts,
      alert,
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
      selectedAlerts,
      notificationBody,
      cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for alerts here ...',
            onChange: this.searchAlerts,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Alert',
              icon: 'plus',
              size: 'large',
              title: 'Add New Alert',
              onClick: this.openAlertForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="AlertsList">
          {/* list starts */}
          <AlertsList
            total={total}
            page={page}
            alerts={alerts}
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
            title="Filter Alerts"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <AlertFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal>
          {/* end filter modal */}

          {/* Notification Modal modal */}
          <Modal
            title="Notify Alerts"
            visible={showNotificationForm}
            onCancel={this.closeNotificationForm}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
            afterClose={this.handleAfterCloseNotificationForm}
          >
            <NotificationForm
              recipients={selectedAlerts}
              onSearchRecipients={getAlertsFromAPI}
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
            title={isEditForm ? 'Edit Alert' : 'Add New Alert'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeAlertForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <AlertForm
              posting={posting}
              isEditForm={isEditForm}
              alert={alert}
              onCancel={this.closeAlertForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

Alerts.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  alert: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Alerts.defaultProps = {
  alert: null,
  searchQuery: undefined,
};

export default Connect(Alerts, {
  alerts: 'alerts.list',
  alert: 'alerts.selected',
  loading: 'alerts.loading',
  posting: 'alerts.posting',
  page: 'alerts.page',
  showForm: 'alerts.showForm',
  total: 'alerts.total',
  searchQuery: 'alerts.q',
});
