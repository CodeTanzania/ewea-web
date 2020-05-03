import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import EventTopicForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import { notifyError, notifySuccess, truncateString } from '../../util';
import './styles.css';

/* constants */
const {
  getEventTopics,
  openEventTopicForm,
  searchEventTopics,
  selectEventTopic,
  closeEventTopicForm,
  refreshEventTopics,
  paginateEventTopics,
  deleteEventTopic,
} = reduxActions;
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 4 };
const descriptionSpan = { xxl: 15, xl: 15, lg: 15, md: 14, sm: 9, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

const {
  getEventTopicsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyTopics,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name EventTopics
 * @description Render Event Topics list which have search box,
 * actions and event topics list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventTopics extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getEventTopics();
  }

  /**
   * @function
   * @name openEventTopicsForm
   * @description Open event topic form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventTopicsForm = () => {
    openEventTopicForm();
  };

  /**
   * @function
   * @name closeEventTopicsForm
   * @description close event topic form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventTopicsForm = () => {
    closeEventTopicForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventTopics
   * @description Search Event Topics List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventTopics = (event) => {
    searchEventTopics(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventType event topic to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventType) => {
    selectEventTopic(eventType);
    this.setState({ isEditForm: true });
    openEventTopicForm();
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
   * @name closeNotificationForm
   * @description Handle on notify event topics
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

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event topics
   *
   * @param {object[]| object} eventTopics event topics list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (eventTopics) => {
    let message = '';
    if (isArray(eventTopics)) {
      const eventTopicsList = eventTopics.map(
        (eventTopic) =>
          `Name: ${eventTopic.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventTopic.strings.description.en
          }\n`
      );

      message = eventTopicsList.join('\n\n\n');
    } else {
      message = `Name: ${eventTopics.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventTopics.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleRefreshEventTopics
   * @description Refresh Event Topics list
   *
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventTopics = () =>
    refreshEventTopics(
      () => notifySuccess('Event topics refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event topics, please contact system administrator'
        )
    );

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event topic
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
        deleteEventTopic(
          item._id, // eslint-disable-line
          () => notifySuccess('Event topic was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event topic, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      eventTopics,
      loading,
      page,
      posting,
      eventType,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, notificationBody, showNotificationForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event topics here ...',
            onChange: this.searchEventTopics,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Topic',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Topic',
              onClick: this.openEventTopicsForm,
            },
          ]}
        />
        {/* end Topbar */}

        <ItemList
          itemName="Event Topics"
          items={eventTopics}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          // onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventTopics}
          generateExportUrl={getEventTopicsExportUrl}
          onPaginate={(nextPage) => paginateEventTopics(nextPage)}
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
              avatarBackgroundColor={item.strings.color}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Topic',
                    title: 'Update Event Topic Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Topic',
                    title: 'Share Event Topic details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Topic',
                    title:
                      'Remove Event Topic from list of active event topics',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                <span title={item.strings.description.en}>
                  {truncateString(item.strings.description.en, 120)}
                </span>
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Topics"
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
            onSearchTopics={getPartyTopics}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Event Topic' : 'Add New Event Topic'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventTopicsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventTopicForm
            posting={posting}
            isEditForm={isEditForm}
            eventType={eventType}
            onCancel={this.closeEventTopicsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventTopics.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventTopics: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventTopics.defaultProps = {
  eventType: null,
  searchQuery: undefined,
};

export default Connect(EventTopics, {
  eventTopics: 'eventTopics.list',
  eventType: 'eventTopics.selected',
  loading: 'eventTopics.loading',
  posting: 'eventTopics.posting',
  page: 'eventTopics.page',
  showForm: 'eventTopics.showForm',
  total: 'eventTopics.total',
  searchQuery: 'eventTopics.q',
});
