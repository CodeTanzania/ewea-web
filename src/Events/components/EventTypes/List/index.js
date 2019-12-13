import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventType,
  paginateEventTypes,
  refreshEventTypes,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
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
import EventTypesListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 7, xl: 7, lg: 6, md: 7, sm: 10, xs: 10 };
const groupSpan = { xxl: 7, xl: 7, lg: 7, md: 7, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 8, xl: 8, lg: 9, md: 7, sm: 9, xs: 9 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...groupSpan, header: 'Group' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventTypesExportUrl } = httpActions;

/**
 * @class
 * @name EventTypesList
 *
 * @description Render EventTypesList
 * component which have actionBar, event types
 * header and event types list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventTypesList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventTypes: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectFocalPerson
   * @description Handle select a single eventType action
   *
   * @param {object} eventType selected eventType object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = eventType => {
    const { selectedEventTypes } = this.state;
    this.setState({
      selectedEventTypes: concat([], selectedEventTypes, eventType),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Types actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventTypes, selectedPages } = this.state;
    const { eventTypes, page } = this.props;
    const selectedList = uniqBy([...selectedEventTypes, ...eventTypes], '_id');
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventTypes: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Types in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventTypes, page } = this.props;
    const { selectedEventTypes, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventTypes], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventTypes.forEach(eventType => {
      remove(
        selectedList,
        item => item._id === eventType._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventTypes: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter eventTypes by status action
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
   * @name handleOnDeselectEventTypes
   * @description Handle deselect a single eventType action
   *
   * @param {object} eventType eventType to be removed from selected focalPeople
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventTypes = eventType => {
    const { selectedEventTypes } = this.state;
    const selectedList = [...selectedEventTypes];

    remove(
      selectedList,
      item => item._id === eventType._id // eslint-disable-line
    );

    this.setState({ selectedEventTypes: selectedList });
  };

  render() {
    const { eventTypes, loading, page, total, onEdit } = this.props;
    const { selectedEventTypes, selectedPages } = this.state;
    const selectedEventTypesCount = intersectionBy(
      selectedEventTypes,
      eventTypes,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Event Types"
          page={page}
          total={total}
          selectedItemsCount={selectedEventTypesCount}
          exportUrl={getEventTypesExportUrl({
            filter: { _id: map(selectedEventTypes, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventTypes(nextPage);
          }}
          onRefresh={() =>
            refreshEventTypes(
              () => {
                notifySuccess('Event Types refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Types please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* eventType list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end eventType list header */}

        {/* eventTypes list */}
        <List
          loading={loading}
          dataSource={eventTypes}
          renderItem={eventType => (
            <EventTypesListItem
              key={eventType._id} // eslint-disable-line
              abbreviation={eventType.strings.abbreviation.en}
              name={eventType.strings.name.en}
              group={eventType.strings.group ? eventType.strings.group : 'N/A'}
              description={
                eventType.strings.description
                  ? eventType.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventTypes, item => item._id).includes(
                  eventType._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(eventType);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventTypes(eventType);
              }}
              onEdit={() => onEdit(eventType)}
              onArchive={() =>
                deleteEventType(
                  eventType._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event type was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event type please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end eventTypes list */}
      </>
    );
  }
}

EventTypesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventTypes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventTypesList;
