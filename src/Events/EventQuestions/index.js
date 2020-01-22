import {
  Connect,
  getEventQuestions,
  openEventQuestionForm,
  searchEventQuestions,
  selectEventQuestion,
  closeEventQuestionForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../components/Topbar';
import EventQuestionForm from './Form';
import EventQuestionsList from './List';
import './styles.css';

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
    const { isEditForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Event questions here ...',
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

        <div className="EventQuestionsList">
          {/* list starts */}
          <EventQuestionsList
            total={total}
            page={page}
            eventQuestions={eventQuestions}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm ? 'Edit Event Question' : 'Add New Event Question'
            }
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
        </div>
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
