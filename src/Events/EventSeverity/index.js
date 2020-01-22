import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeEventSeverityForm,
  Connect,
  getEventSeverities,
  openEventSeverityForm,
  searchEventSeverities,
  selectEventSeverity,
  refreshEventSeverities,
  paginateEventSeverities,
  deleteEventSeverity,
} from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import isArray from 'lodash/isArray';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventSeverityForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const {
  getEventSeverities: getEventSeveritiesFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

/**
 * @class
 * @name EventSeverities
 * @description Render eventSeverity list which have search box, severities and eventSeverity list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventSeverities extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    selectedEventSeverities: [],
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventSeverities();
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
   * @name openEventSeverityForm
   * @description Open eventSeverity form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventSeverityForm = () => {
    openEventSeverityForm();
  };

  /**
   * @function
   * @name openEventSeverityForm
   * @description close eventSeverity form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventSeverityForm = () => {
    closeEventSeverityForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventSeverities
   * @description Search EventSeverities List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventSeverities = event => {
    searchEventSeverities(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit severity for list item
   *
   * @param {object} eventSeverity Event Severity to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventSeverity => {
    selectEventSeverity(eventSeverity);
    this.setState({ isEditForm: true });
    openEventSeverityForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Severities
   *
   * @param {object[]| object} eventSeverities event Severities list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventSeverities => {
    let message = '';
    if (isArray(eventSeverities)) {
      const eventSeverityList = eventSeverities.map(
        eventSeverity =>
          `Name: ${eventSeverity.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventSeverity.strings.description.en
          }\n`
      );

      message = eventSeverityList.join('\n\n\n');
    } else {
      message = `Name: ${eventSeverities.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventSeverities.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventSeverities
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

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a focal person
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEventSeverity(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Severity was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Severity, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventSeverities = () =>
    refreshEventSeverities(
      () => notifySuccess('Event Severities refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Severities, please contact system administrator'
        )
    );

  render() {
    const {
      eventSeverities,
      eventSeverity,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      isEditForm,
      showNotificationForm,
      selectedEventSeverities,
      notificationBody,
    } = this.state;

    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event severities here ...',
            onChange: this.searchEventSeverities,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Severity',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Severity',
              onClick: this.openEventSeverityForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event Severities"
          items={eventSeverities}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventSeverities}
          onPaginate={nextPage => paginateEventSeverities(nextPage)}
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
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Severity',
                    title: 'Update Event Severity Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Severity',
                    title: 'Share Event Severity details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Severity',
                    title:
                      'Remove Event Severity from list of active focal People',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan} title={item.strings.description.en}>
                {item.strings.description.en}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Severities"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={selectedEventSeverities}
            onSearchRecipients={getEventSeveritiesFromAPI}
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
          title={isEditForm ? 'Edit Event Severity' : 'Add New Event Severity'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventSeverityForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventSeverityForm
            posting={posting}
            isEditForm={isEditForm}
            eventSeverity={eventSeverity}
            onCancel={this.closeEventSeverityForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventSeverities.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventSeverities: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventSeverity: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventSeverities.defaultProps = {
  eventSeverity: null,
  searchQuery: undefined,
};

export default Connect(EventSeverities, {
  eventSeverities: 'eventSeverities.list',
  eventSeverity: 'eventSeverities.selected',
  loading: 'eventSeverities.loading',
  posting: 'eventSeverities.posting',
  page: 'eventSeverities.page',
  showForm: 'eventSeverities.showForm',
  total: 'eventSeverities.total',
  searchQuery: 'eventSeverities.q',
});
