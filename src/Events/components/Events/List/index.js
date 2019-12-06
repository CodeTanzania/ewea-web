import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEvent,
  paginateEvents,
  refreshEvents,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
import compact from 'lodash/compact';
import concat from 'lodash/concat';
import intersectionBy from 'lodash/intersectionBy';
import map from 'lodash/map';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListHeader from '../../../../components/ListHeader';
import Toolbar from '../../../../components/Toolbar';
import { notifyError, notifySuccess } from '../../../../util';
import EventsListItem from '../ListItem';

/* constants */
// const urgencySpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 0, xs: 0 };
// const statusSpan = { xxl: 2, xl: 3, lg: 3, md: 4, sm: 0, xs: 0 };
// const severitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const eventSpan = { xxl: 8, xl: 18, lg: 17, md: 0, sm: 19, xs: 19 };
const referenceIDSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const typeSpan = { xxl: 3, xl: 3, lg: 4, md: 5, sm: 0, xs: 0 };
const groupSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };

const headerLayout = [
  { ...eventSpan, header: 'Event' },
  { ...referenceIDSpan, header: 'Reference ID' },
  { ...typeSpan, header: 'Event Type' },
  { ...groupSpan, header: 'Event Group' },
  // { ...urgencySpan, header: 'Urgency' },
];
const { getEventsExportUrl } = httpActions;

/**
 * @class
 * @name EventsList
 * @description Render EventsList component which have actionBar, events
 * header and events list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventsList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEvents: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectEvent
   * @description Handle select a single event action
   *
   * @param {object} event selected event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectEvent = event => {
    const { selectedEvents } = this.state;
    this.setState({
      selectedEvents: concat([], selectedEvents, event),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all events actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEvents, selectedPages } = this.state;
    const { events, page } = this.props;
    const selectedList = uniqBy([...selectedEvents, ...events], '_id');
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEvents: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all events in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { events, page } = this.props;
    const { selectedEvents, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEvents], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    events.forEach(event => {
      remove(
        selectedList,
        item => item._id === event._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEvents: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter events by status action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFilterByStatus = () => {
    // if (status === 'All') {
    //   filter({});
    // } else if (status === 'Active') {
    //   filter({});
    // } else if (status === 'Archived') {
    //   filter({});
    // }
  };

  /**
   * @function
   * @name handleOnDeselectEvent
   * @description Handle deselect a single event action
   *
   * @param {object} event event to be removed from selected events
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEvent = event => {
    const { selectedEvents } = this.state;
    const selectedList = [...selectedEvents];

    remove(
      selectedList,
      item => item._id === event._id // eslint-disable-line
    );

    this.setState({ selectedEvents: selectedList });
  };

  render() {
    const {
      events,
      loading,
      page,
      total,
      onEdit,
      onFilter,
      onShare,
      onBulkShare,
    } = this.props;
    const { selectedEvents, selectedPages } = this.state;
    const selectedEventsCount = intersectionBy(selectedEvents, events, '_id')
      .length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="event"
          page={page}
          total={total}
          selectedItemsCount={selectedEventsCount}
          exportUrl={getEventsExportUrl({
            filter: { _id: map(selectedEvents, '_id') },
          })}
          onFilter={onFilter}
          onPaginate={nextPage => {
            paginateEvents(nextPage);
          }}
          onRefresh={() =>
            refreshEvents(
              () => {
                notifySuccess('Events refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Events please contact system administrator'
                );
              }
            )
          }
          onShare={() => onBulkShare(selectedEvents)}
        />
        {/* end toolbar */}

        {/* event list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end event list header */}

        {/* events list */}
        <List
          loading={loading}
          dataSource={events}
          renderItem={event => (
            <EventsListItem
              key={event._id} // eslint-disable-line
              abbreviation={event.description.toUpperCase().charAt(0)}
              location={compact(['Tandale', 'Hananasif', 'Kigogo']).join(', ')}
              number={event.number}
              event={event.event}
              color={event.color}
              description={event.description ? event.description : 'N/A'}
              urgency={event.urgency}
              severity={event.severity}
              status={event.status}
              type={event.type.strings.name.en}
              isSelected={
                // eslint-disable-next-line
                map(selectedEvents, item => item._id).includes(
                  event._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectEvent(event);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEvent(event);
              }}
              onEdit={() => onEdit(event)}
              onArchive={() =>
                deleteEvent(
                  event._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event please contact system administrator'
                    );
                  }
                )
              }
              onShare={() => {
                onShare(event);
              }}
            />
          )}
        />
        {/* end events list */}
      </>
    );
  }
}

EventsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onBulkShare: PropTypes.func.isRequired,
};

export default EventsList;
