import {
  Connect,
  getEventIndicators,
  openEventIndicatorForm,
  searchEventIndicators,
  selectEventIndicator,
  closeEventIndicatorForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../components/Topbar';
import EventIndicatorForm from './Form';
import EventIndicatorList from './List';
import './styles.css';

/**
 * @class
 * @name EventIndicator
 * @description Render Event Indicators list which have search box,
 * actions and event indicators list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventIndicator extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getEventIndicators();
  }

  /**
   * @function
   * @name openEventIndicatorsForm
   * @description Open event indicator form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventIndicatorsForm = () => {
    openEventIndicatorForm();
  };

  /**
   * @function
   * @name closeEventIndicatorsForm
   * @description close event indicator form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventIndicatorsForm = () => {
    closeEventIndicatorForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventIndicators
   * @description Search Event Indicators List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventIndicators = event => {
    searchEventIndicators(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventIndicator event indicator to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventIndicator => {
    selectEventIndicator(eventIndicator);
    this.setState({ isEditForm: true });
    openEventIndicatorForm();
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
      eventIndicators,
      loading,
      page,
      posting,
      eventIndicator,
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
            placeholder: 'Search for Event indicators here ...',
            onChange: this.searchEventIndicators,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Indicator',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Indicator',
              onClick: this.openEventIndicatorsForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventIndicatorList">
          {/* list starts */}
          <EventIndicatorList
            total={total}
            page={page}
            eventIndicators={eventIndicators}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm ? 'Edit Event Indicator' : 'Add New Event Indicator'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventIndicatorForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventIndicatorForm
              posting={posting}
              isEditForm={isEditForm}
              eventIndicator={eventIndicator}
              onCancel={this.closeEventIndicatorForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventIndicator.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventIndicators: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventIndicator: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventIndicator.defaultProps = {
  eventIndicator: null,
  searchQuery: undefined,
};

export default Connect(EventIndicator, {
  eventIndicators: 'eventIndicators.list',
  eventIndicator: 'eventIndicators.selected',
  loading: 'eventIndicators.loading',
  posting: 'eventIndicators.posting',
  page: 'eventIndicators.page',
  showForm: 'eventIndicators.showForm',
  total: 'eventIndicators.total',
  searchQuery: 'eventIndicators.q',
});
