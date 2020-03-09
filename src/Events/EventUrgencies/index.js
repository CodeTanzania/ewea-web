import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeEventUrgencyForm,
  Connect,
  getEventUrgencies,
  openEventUrgencyForm,
  searchEventUrgencies,
  selectEventUrgency,
  refreshEventUrgencies,
  paginateEventUrgencies,
  deleteEventUrgency,
} from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventUrgencyForm from './Form';
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
  getEventUrgenciesExportUrl,
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
 * @name EventUrgency
 * @description Render eventUrgency list which have search box, actions and eventUrgency list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventUrgency extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventUrgencies();
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
   * @name openEventUrgencyForm
   * @description Open eventUrgency form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventUrgencyForm = () => {
    openEventUrgencyForm();
  };

  /**
   * @function
   * @name openEventUrgencyForm
   * @description close eventUrgency form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventUrgencyForm = () => {
    closeEventUrgencyForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventUrgency
   * @description Search EventUrgency List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventUrgencies = event => {
    searchEventUrgencies(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventUrgency eventUrgency to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventUrgency => {
    selectEventUrgency(eventUrgency);
    this.setState({ isEditForm: true });
    openEventUrgencyForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} eventUrgencies event Urgencies list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventUrgencies => {
    let message = '';
    if (isArray(eventUrgencies)) {
      const eventUrgencyList = eventUrgencies.map(
        eventUrgency =>
          `Name: ${eventUrgency.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventUrgency.strings.description.en
          }\n`
      );

      message = eventUrgencyList.join('\n\n\n');
    } else {
      message = `Name: ${eventUrgencies.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventUrgencies.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventUrgencies
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
   * @description show confirm modal before archiving a event urgency
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
        deleteEventUrgency(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Urgency was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Urgency, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventUrgencies = () =>
    refreshEventUrgencies(
      () => notifySuccess('Event Urgency refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Urgency, please contact system administrator'
        )
    );

  render() {
    const {
      eventUrgencies,
      eventUrgency,
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
            placeholder: 'Search for event urgency here ...',
            onChange: this.searchEventUrgencies,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Urgency',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Urgency',
              onClick: this.openEventUrgencyForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event urgencies"
          items={eventUrgencies}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventUrgencies}
          onPaginate={nextPage => paginateEventUrgencies(nextPage)}
          generateExportUrl={getEventUrgenciesExportUrl}
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
                    name: 'Edit Event Urgency',
                    title: 'Update Event Urgency Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Urgency',
                    title: 'Share Event Urgency details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Urgency',
                    title:
                      'Remove Event Urgency from list of active focal People',
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
          title="Notify Event Urgency"
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
          title={isEditForm ? 'Edit Event Urgency' : 'Add New Event Urgency'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventUrgencyForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventUrgencyForm
            posting={posting}
            isEditForm={isEditForm}
            eventUrgency={eventUrgency}
            onCancel={this.closeEventUrgencyForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventUrgency.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventUrgencies: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventUrgency: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventUrgency.defaultProps = {
  eventUrgency: null,
  searchQuery: undefined,
};

export default Connect(EventUrgency, {
  eventUrgencies: 'eventUrgencies.list',
  eventUrgency: 'eventUrgencies.selected',
  loading: 'eventUrgencies.loading',
  posting: 'eventUrgencies.posting',
  page: 'eventUrgencies.page',
  showForm: 'eventUrgencies.showForm',
  total: 'eventUrgencies.total',
  searchQuery: 'eventUrgencies.q',
});
