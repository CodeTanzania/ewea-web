import { httpActions } from '@codetanzania/emis-api-client';
import {
  //   closeFocalPersonForm,
  Connect,
  getAlerts,
  //   openFocalPersonForm,
  searchAlerts,
  //   selectFocalPerson,
} from '@codetanzania/emis-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import NotificationForm from '../../../components/NotificationForm';
import Topbar from '../../../components/Topbar';
// import FocalPersonFilters from './Filters';
// import FocalPersonForm from './Form';
import AlertTypesList from './List';
import './styles.css';

/* constants */
const {
  getFocalPeople: getFocalPeopleFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name AlertTypes
 * @description Render AlertTypes list which have search box, actions and alert types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertTypes extends Component {
  state = {
    showNotificationForm: false,
    selectedFocalPeople: [],
    notificationBody: undefined,
    cached: null,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    alertTpyes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
      .isRequired,
    alertType: PropTypes.shape({ name: PropTypes.string }),
    page: PropTypes.number.isRequired,
    searchQuery: PropTypes.string,
    total: PropTypes.number.isRequired,
  };

  static defaultProps = {
    alertType: null,
    searchQuery: undefined,
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
   * @name searchAlerts
   * @description Search Alert Types List based on supplied filter word
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
//    * @function
//    * @name handleEdit
//    * @description Handle on Edit action for list item
//    *
//    * @param {object} alertType alertType to be edited
//    *
//    * @version 0.1.0
//    * @since 0.1.0
//    */
  //   handleEdit = alertType => {
  //     selectFocalPerson(alertType);
  //     this.setState({ isEditForm: true });
  //     openFocalPersonForm();
  //   };

  /**
   * @function
   * @name handleShare
   * @description Handle share single alert type action
   *
   * @param {object} alertType alert type to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = alertType => {
    const message = `${alertType.type}`;

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleBulkShare
   * @description Handle share multiple alert types
   *
   * @param {object[]} alertTpyes alert types list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleBulkShare = alertTpyes => {
    const focalPersonList = alertTpyes.map(alertType => `${alertType.type}`);

    const message = focalPersonList.join('\n\n\n');

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify alertTpyes
   *
   * @param {object[]} alertTpyes List of alert tpyes selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = alertTpyes => {
    this.setState({
      selectedFocalPeople: alertTpyes,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify alertTpyes
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  //   /**
  //    * @function
  //    * @name handleAfterCloseForm
  //    * @description Perform post close form cleanups
  //    *
  //    * @version 0.1.0
  //    * @since 0.1.0
  //    */
  //   handleAfterCloseForm = () => {
  //     this.setState({ isEditForm: false });
  //   };

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
      alertTpyes,
      loading,
      page,
      //   posting,
      //   alertType,
      //   showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      //   showFilters,
      //   isEditForm,
      //   cached,
      showNotificationForm,
      selectedFocalPeople,
      notificationBody,
    } = this.state;
    return (
      <Fragment>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Alert types here ...',
            onChange: this.searchAlerts,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Focal Person',
              icon: 'plus',
              size: 'large',
              title: 'Add New Focal Person',
              onClick: this.openFocalPersonForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="AlertTypesList">
          {/* list starts */}
          <AlertTypesList
            total={total}
            page={page}
            alertTpyes={alertTpyes}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
            onNotify={this.openNotificationForm}
            onShare={this.handleShare}
            onBulkShare={this.handleBulkShare}
          />
          {/* end list */}

          {/* filter modal */}
          {/* <Modal
            title="Filter Focal People"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <FocalPersonFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal> */}
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
              recipients={selectedFocalPeople}
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
          {/* <Modal
            title={isEditForm ? 'Edit Focal Person' : 'Add New Focal Person'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeFocalPersonForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <FocalPersonForm
              posting={posting}
              isEditForm={isEditForm}
              alertType={alertType}
              onCancel={this.closeFocalPersonForm}
            />
          </Modal> */}
          {/* end create/edit form modal */}
        </div>
      </Fragment>
    );
  }
}

export default Connect(AlertTypes, {
  alertTpyes: 'alerts.list',
  alertType: 'alerts.selected',
  loading: 'alerts.loading',
  posting: 'alerts.posting',
  page: 'alerts.page',
  showForm: 'alerts.showForm',
  total: 'alerts.total',
  searchQuery: 'alerts.q',
});
