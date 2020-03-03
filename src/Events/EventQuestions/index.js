import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getEventQuestions,
  openEventQuestionForm,
  searchEventQuestions,
  selectEventQuestion,
  closeEventQuestionForm,
  paginateEventQuestions,
  refreshEventQuestions,
  deleteEventQuestion,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import EventQuestionForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

const { confirm } = Modal;

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 8, xs: 8 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 4, xs: 3 };
const indicatorSpan = { xxl: 6, xl: 6, lg: 6, md: 6, sm: 8, xs: 7 };
const descriptionSpan = { xxl: 9, xl: 9, lg: 9, md: 8, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...indicatorSpan, header: 'Indicator' },
  { ...descriptionSpan, header: 'Description' },
];

const {
  // getEventQuestions: getEventQuestionFromAPI,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
} = httpActions;

/**
 * @class
 * @name EventQuestions
 * @description Render Event Questions list which have search box,
 * actions and event questions list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventQuestions extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getEventQuestions();
  }

  /**
   * @function
   * @name openEventQuestionsForm
   * @description Open event question form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventQuestionsForm = () => {
    openEventQuestionForm();
  };

  /**
   * @function
   * @name closeEventQuestionsForm
   * @description close event question form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventQuestionsForm = () => {
    closeEventQuestionForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventQuestions
   * @description Search Event Questions List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventQuestions = event => {
    searchEventQuestions(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventQuestion event question to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventQuestion => {
    selectEventQuestion(eventQuestion);
    this.setState({ isEditForm: true });
    openEventQuestionForm();
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
   * @name handleRefreshEventQuestions
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventQuestions = () => {
    refreshEventQuestions(
      () => {
        notifySuccess('Event Questions refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Event Questions please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify notificationTemplate
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
   * @name handleShare
   * @description Handle share multiple event Questions
   *
   * @param {object[]| object} eventQuestions event Questions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventQuestions => {
    let message = '';
    if (isArray(eventQuestions)) {
      const eventQuestionList = eventQuestions.map(
        eventQuestion =>
          `Name: ${eventQuestion.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventQuestion.strings.description.en
          }\n`
      );

      message = eventQuestionList.join('\n\n\n');
    } else {
      message = `Name: ${eventQuestions.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventQuestions.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event question
   *
   * @param item {object} eventQuestion to archive
   * @version 0.1.0
   * @since 0.1.0
   */

  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEventQuestion(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Question was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Question, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      eventQuestions,
      loading,
      page,
      posting,
      eventQuestion,
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
            placeholder: 'Search for event questions here ...',
            onChange: this.searchEventQuestions,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Question',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Question',
              onClick: this.openEventQuestionsForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Event Question"
          items={eventQuestions}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventQuestions}
          onPaginate={nextPage => paginateEventQuestions(nextPage)}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              item={item}
              name={item.strings.name.en}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Question',
                    title: 'Update Event Question Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Question',
                    title: 'Share Event Question details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Question',
                    title:
                      'Remove Event Question from list of active event question',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...indicatorSpan}>
                {get(item, 'item.relations.indicator.strings.name.en', 'N/A')}
              </Col>
              <Col {...descriptionSpan}>{item.strings.description.en}</Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Event Question modal */}
        <Modal
          title="Notify Event Question"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Event Question modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Event Question' : 'Add New Event Question'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventQuestionsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventQuestionForm
            posting={posting}
            isEditForm={isEditForm}
            eventQuestion={eventQuestion}
            onCancel={this.closeEventQuestionsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventQuestions.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventQuestions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventQuestion: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventQuestions.defaultProps = {
  eventQuestion: null,
  searchQuery: undefined,
};

export default Connect(EventQuestions, {
  eventQuestions: 'eventQuestions.list',
  eventQuestion: 'eventQuestions.selected',
  loading: 'eventQuestions.loading',
  posting: 'eventQuestions.posting',
  page: 'eventQuestions.page',
  showForm: 'eventQuestions.showForm',
  total: 'eventQuestions.total',
  searchQuery: 'eventQuestions.q',
});
