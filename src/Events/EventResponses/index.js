import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeEventResponseForm,
  Connect,
  getEventResponses,
  openEventResponseForm,
  searchEventResponses,
  selectEventResponse,
  refreshEventResponses,
  paginateEventResponses,
  deleteEventResponse,
} from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventResponseForm from './Form';
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
  getEventResponsesExportUrl,
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
 * @name EventResponses
 * @description Render eventResponse list which have search box, actions and eventResponse list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventResponses extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventResponses();
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
   * @name openEventResponseForm
   * @description Open eventResponse form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventResponseForm = () => {
    openEventResponseForm();
  };

  /**
   * @function
   * @name openEventResponseForm
   * @description close eventResponse form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventResponseForm = () => {
    closeEventResponseForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventResponses
   * @description Search EventResponses List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventResponses = event => {
    searchEventResponses(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventResponse eventResponse to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventResponse => {
    selectEventResponse(eventResponse);
    this.setState({ isEditForm: true });
    openEventResponseForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} eventResponses event Actions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventResponses => {
    let message = '';
    if (isArray(eventResponses)) {
      const eventResponseList = eventResponses.map(
        eventResponse =>
          `Name: ${eventResponse.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventResponse.strings.description.en
          }\n`
      );

      message = eventResponseList.join('\n\n\n');
    } else {
      message = `Name: ${eventResponses.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventResponses.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventResponses
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
    selectEventResponse(null);
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
        deleteEventResponse(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Response was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Response, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventResponses = () =>
    refreshEventResponses(
      () => notifySuccess('Event Responses refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Responses, please contact system administrator'
        )
    );

  render() {
    const {
      eventResponses,
      eventResponse,
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
            placeholder: 'Search for event responses here ...',
            onChange: this.searchEventResponses,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Response',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Response',
              onClick: this.openEventResponseForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event responses"
          items={eventResponses}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventResponses}
          onPaginate={nextPage => paginateEventResponses(nextPage)}
          generateExportUrl={getEventResponsesExportUrl}
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
                    name: 'Edit Event Response',
                    title: 'Update Event Response Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Response',
                    title: 'Share Event Response details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Response',
                    title:
                      'Remove Event Response from list of active focal People',
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
          title="Notify Event Responses"
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
          title={isEditForm ? 'Edit Event Response' : 'Add New Event Response'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventResponseForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventResponseForm
            posting={posting}
            isEditForm={isEditForm}
            eventResponse={eventResponse}
            onCancel={this.closeEventResponseForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventResponses.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventResponses: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventResponse: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventResponses.defaultProps = {
  eventResponse: null,
  searchQuery: undefined,
};

export default Connect(EventResponses, {
  eventResponses: 'eventResponses.list',
  eventResponse: 'eventResponses.selected',
  loading: 'eventResponses.loading',
  posting: 'eventResponses.posting',
  page: 'eventResponses.page',
  showForm: 'eventResponses.showForm',
  total: 'eventResponses.total',
  searchQuery: 'eventResponses.q',
});
