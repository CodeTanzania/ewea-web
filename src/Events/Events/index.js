import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Drawer, Row, Col, Tag, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventFilters from './Filters';
import EventForm from './Form';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import EventDetailsViewHeader from './DetailsView/Header';
import EventDetailsViewBody from './DetailsView/Body';
import {
  notifyError,
  notifySuccess,
  truncateString,
  generateEventTemplate,
  timeAgo,
} from '../../util';

/* http actions */
const {
  getFocalPeople,
  getAdministrativeAreas,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventsExportUrl,
} = httpActions;
/* redux actions */
const {
  closeEventForm,
  getEvents,
  openEventForm,
  searchEvents,
  selectEvent,
  refreshEvents,
  paginateEvents,
  deleteEvent,
} = reduxActions;

/* constants */
const { confirm } = Modal;
const eventSpan = { xxl: 6, xl: 7, lg: 7, md: 8, sm: 10, xs: 11 };
const referenceIDSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6, xs: 7 };
const typeSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const stageSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const levelSpan = { xxl: 3, xl: 2, lg: 0, md: 0, sm: 0, xs: 0 };
const groupSpan = { xxl: 2, xl: 2, lg: 4, md: 0, sm: 0, xs: 0 };
const lastUpdatedSpan = { xxl: 2, xl: 2, lg: 3, md: 3, sm: 4, xs: 0 };

const headerLayout = [
  { ...eventSpan, header: 'Event' },
  { ...referenceIDSpan, header: 'Reference ID' },
  { ...levelSpan, header: 'Event Level' },
  { ...stageSpan, header: 'Event Stage' },
  { ...typeSpan, header: 'Event Type' },
  { ...groupSpan, header: 'Event Group' },
  { ...lastUpdatedSpan, header: 'Last Updated' },
  // { ...urgencySpan, header: 'Urgency' },
];

/**
 * @class
 * @name Events
 * @description Render event list which have search box, actions and event list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Events extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showEventDetails: false,
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    notificationSubject: undefined,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEvents();
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
   * @name openEventForm
   * @description Open event form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventForm = () => {
    selectEvent(null);
    openEventForm();
  };

  /**
   * @function
   * @name openEventForm
   * @description close event form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventForm = () => {
    closeEventForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name closeEventDetails
   * @description close event details drawer
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventDetails = () => {
    this.setState({ showEventDetails: false });
  };

  /**
   * @function
   * @name searchEvents
   * @description Search Events List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEvents = (event) => {
    searchEvents(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} event event to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (event) => {
    selectEvent(event);
    this.setState({ isEditForm: true });
    openEventForm();
  };

  /**
   * @function
   * @name handleView
   * @description Handle on view event details action for list item
   *
   * @param {object} event event to be viewed
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleView = (event) => {
    selectEvent(event);
    this.setState({ showEventDetails: true });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share  event(s) action
   *
   * @param {object| object[]} events event(s) to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (events) => {
    let message = '';
    let subject;
    if (isArray(events)) {
      const eventList = events.map((event) => {
        const { body } = generateEventTemplate(event);

        return body;
      });

      message = eventList.join('\n\n\n');
      subject = 'Status Update';
    } else {
      const { subject: title, body } = generateEventTemplate(events);
      subject = title;
      message = body;
    }

    this.setState({
      notificationSubject: subject,
      notificationBody: message,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify events
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = () => {
    this.setState({
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify events
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({
      showNotificationForm: false,
      notificationSubject: undefined,
      notificationBody: undefined,
    });
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
    const { showEventDetails } = this.state;
    if (!showEventDetails) {
      selectEvent(null);
    }
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
   * @name handleRefreshEvents
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEvents = () => {
    refreshEvents(
      () => {
        notifySuccess('Events were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Events, Please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving an event
   * @param {object} item Item to be archived
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
        deleteEvent(
          item._id, // eslint-disable-line
          () => notifySuccess('Event was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving event, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      events,
      event,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      showEventDetails,
      showFilters,
      isEditForm,
      showNotificationForm,
      notificationSubject,
      notificationBody,
      cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for events here ...',
            onChange: this.searchEvents,
            value: searchQuery,
          }}
          action={{
            label: 'New Event',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Event',
            onClick: this.openEventForm,
          }}
        />
        {/* end Topbar */}
        {/* list starts */}
        <ItemList
          itemName="events"
          items={events}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEvents}
          onPaginate={(nextPage) => paginateEvents(nextPage)}
          generateExportUrl={getEventsExportUrl}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => {
            const eventLevelColor = get(item, 'level.strings.color');
            return (
              <ListItem
                key={item._id} // eslint-disable-line
                name={item.description}
                item={item}
                isSelected={isSelected}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                avatarBackgroundColor={get(
                  item,
                  'type.strings.color',
                  undefined
                )}
                title={
                  <span className="text-sm">
                    {truncateString(item.description, 50)}
                  </span>
                }
                secondaryText={
                  <Row>
                    <Col span={16}>
                      <span className="text-xs">{item.number}</span>
                    </Col>
                    <Col span={6}>
                      <span className="text-xs">{timeAgo(item.updatedAt)}</span>
                    </Col>
                  </Row>
                }
                actions={[
                  {
                    name: 'View Event',
                    title: 'View Event Details',
                    onClick: () => this.handleView(item),
                    icon: 'view',
                  },
                  {
                    name: 'Edit Event',
                    title: 'Update Event Details',
                    onClick: () => this.handleEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Event',
                    title: 'Share Event details with others',
                    onClick: () => this.handleShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive Event',
                    title: 'Remove Event from list of active Events',
                    onClick: () => this.showArchiveConfirm(item),
                    icon: 'archive',
                  },
                  {
                    name: 'Share on WhatsApp',
                    title: 'Share Event on Whatsapp',
                    link: `https://wa.me/?text=${encodeURI(
                      generateEventTemplate(item).body
                    )}`,
                    icon: 'whatsapp',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...eventSpan} title={item.description}>
                  <Button
                    type="link"
                    onClick={() => this.handleView(item)}
                    style={{
                      padding: 0,
                      color: 'rgba(0, 0, 0, 0.65)',
                      whiteSpace: 'normal',
                      textAlign: 'left',
                      wordWrap: 'break-word',
                    }}
                  >
                    {truncateString(item.description, 50)}
                  </Button>
                </Col>
                {/* <Col {...areaSpan}>{location}</Col> */}
                <Col {...referenceIDSpan}>{item.number}</Col>
                <Col
                  {...levelSpan}
                  title={get(item, 'item.level.strings.description', 'N/A')}
                >
                  {item.level ? (
                    <Tag
                      color={
                        eventLevelColor === '#FFFFFF'
                          ? undefined
                          : eventLevelColor
                      }
                    >
                      {get(item, 'level.strings.name.en', 'N/A')}
                    </Tag>
                  ) : (
                    'N/A'
                  )}
                </Col>
                <Col {...stageSpan}>
                  <Tag color="volcano">{item.stage}</Tag>
                </Col>
                <Col {...typeSpan}>
                  {get(item, 'type.strings.name.en', 'N/A')}
                </Col>
                <Col {...groupSpan}>
                  {get(item, 'group.strings.name.en', 'N/A')}
                </Col>
                <Col {...lastUpdatedSpan}>{timeAgo(item.updatedAt)}</Col>
                {/* eslint-enable react/jsx-props-no-spreading */}
              </ListItem>
            );
          }}
        />
        {/* end list */}
        {/* filter modal */}
        <Modal
          title="Filter Events"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
        >
          <EventFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}
        {/* Notification Modal modal */}
        <Modal
          title="Notify Events"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
          zIndex={10000}
        >
          <NotificationForm
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getAdministrativeAreas}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}
        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Event' : 'Add New Event'}
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeEventForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
          zIndex={10000}
        >
          <EventForm
            posting={posting}
            isEditForm={isEditForm}
            event={event}
            onCancel={this.closeEventForm}
          />
        </Modal>
        {/* end create/edit form modal */}

        {/* Event details drawer */}
        <Drawer
          title={
            <EventDetailsViewHeader
              number={get(event, 'number', 'N/A')}
              description={get(event, 'description', 'N/A')}
              type={get(event, 'type.strings.name.en', 'N/A')}
              stage={get(event, 'stage', 'N/A')}
              onBack={this.closeEventDetails}
            />
          }
          placement="right"
          width="100%"
          onClose={this.closeEventDetails}
          visible={showEventDetails}
          drawerStyle={{ overflow: 'hidden' }}
          headerStyle={{ padding: 0 }}
          bodyStyle={{ overflow: 'hidden', height: '100%', padding: '15px' }}
          destroyOnClose
        >
          <EventDetailsViewBody
            event={event}
            onShare={() => {
              this.handleShare(event);
            }}
            onEdit={() => {
              this.handleEdit(event);
            }}
          />
        </Drawer>
        {/* End Event details drawer */}
      </>
    );
  }
}

Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  event: PropTypes.shape({
    description: PropTypes.string,
    number: PropTypes.string,
    type: PropTypes.shape({
      _id: PropTypes.string,
      strings: PropTypes.shape({
        name: PropTypes.shape({ en: PropTypes.string }),
      }),
    }),
    stage: PropTypes.string,
  }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Events.defaultProps = {
  event: null,
  searchQuery: undefined,
};

export default Connect(Events, {
  events: 'events.list',
  event: 'events.selected',
  loading: 'events.loading',
  posting: 'events.posting',
  page: 'events.page',
  showForm: 'events.showForm',
  total: 'events.total',
  searchQuery: 'events.q',
});
