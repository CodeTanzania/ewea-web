import {
  Connect,
  getEventLevels,
  openEventLevelForm,
  searchEventLevels,
  selectEventLevel,
  closeEventLevelForm,
  deleteEventLevel,
  refreshEventLevels,
  paginateEventLevels,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';

import Topbar from '../../components/Topbar';
import EventLevelForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess, truncateString } from '../../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6, xs: 14 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 14, md: 13, sm: 10, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

/**
 * @class
 * @name EventLevels
 * @description Render Event Level list which have search box,
 * actions and event types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventLevels extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
  };

  componentDidMount() {
    getEventLevels();
  }

  /**
   * @function
   * @name openEventLevelsForm
   * @description Open event level form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventLevelsForm = () => {
    openEventLevelForm();
  };

  /**
   * @function
   * @name closeEventLevelsForm
   * @description close event level form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventLevelsForm = () => {
    closeEventLevelForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventLevels
   * @description Search Event Level List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventLevels = event => {
    searchEventLevels(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventLevel event level to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventLevel => {
    selectEventLevel(eventLevel);
    this.setState({ isEditForm: true });
    openEventLevelForm();
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
   * @name handleShare
   * @description Handle share multiple event levels
   *
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = () => {
    this.setState({ showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on share
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event levels
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
        deleteEventLevel(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Type was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Type, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventLevels = () =>
    refreshEventLevels(
      () => notifySuccess('Event Levels refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Levels, please contact system administrator'
        )
    );

  render() {
    const {
      eventLevels,
      loading,
      page,
      posting,
      eventLevel,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, showNotificationForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event levels here ...',
            onChange: this.searchEventLevels,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Level',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Level',
              onClick: this.openEventLevelsForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event level"
          items={eventLevels}
          page={page}
          itemCount={total}
          loading={loading}
          onShare={this.handleShare}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshEventLevels}
          onPaginate={nextPage => paginateEventLevels(nextPage)}
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
                    name: 'Edit Event Level',
                    title: 'Update Event Level Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  archive={{
                    name: 'Archive Event Level',
                    title: 'Remove Event Level from list of active Event Types',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan} title={item.strings.description.en}>
                {item.strings.description
                  ? truncateString(item.strings.description.en, 100)
                  : 'N/A'}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Levels"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <></>
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Event Level' : 'Add New Event Level'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventLevelsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventLevelForm
            posting={posting}
            isEditForm={isEditForm}
            eventLevel={eventLevel}
            onCancel={this.closeEventLevelsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventLevels.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventLevels: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventLevel: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventLevels.defaultProps = {
  eventLevel: null,
  searchQuery: undefined,
};

export default Connect(EventLevels, {
  eventLevels: 'eventLevels.list',
  eventLevel: 'eventLevels.selected',
  loading: 'eventLevels.loading',
  posting: 'eventLevels.posting',
  page: 'eventLevels.page',
  showForm: 'eventLevels.showForm',
  total: 'eventLevels.total',
  searchQuery: 'eventLevels.q',
});
