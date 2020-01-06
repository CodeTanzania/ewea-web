import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventSeverity,
  paginateEventSeverities,
  refreshEventSeverities,
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
import ListHeader from '../../../components/ListHeader';
import Toolbar from '../../../components/Toolbar';
import { notifyError, notifySuccess } from '../../../util';
import EventSeveritiesListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventSeveritiesExportUrl } = httpActions;

/**
 * @class
 * @name EventSeveritiesList
 *
 * @description Render EventSeveritiesList
 * component which have actionBar, event severities
 * header and event severities list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventSeveritiesList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventSeverities: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectFocalPerson
   * @description Handle select a single eventSeverity action
   *
   * @param {object} eventSeverity selected eventSeverity object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = eventSeverity => {
    const { selectedEventSeverities } = this.state;
    this.setState({
      selectedEventSeverities: concat(
        [],
        selectedEventSeverities,
        eventSeverity
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Severities actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventSeverities, selectedPages } = this.state;
    const { eventSeverities, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEventSeverities, ...eventSeverities],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventSeverities: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Severities in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventSeverities, page } = this.props;
    const { selectedEventSeverities, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventSeverities], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventSeverities.forEach(eventSeverity => {
      remove(
        selectedList,
        item => item._id === eventSeverity._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventSeverities: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEventSeverities
   * @description Handle deselect a single eventSeverity action
   *
   * @param {object} eventSeverity eventSeverity instance to be removed from selected EventSeverities
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventSeverities = eventSeverity => {
    const { selectedEventSeverities } = this.state;
    const selectedList = [...selectedEventSeverities];

    remove(
      selectedList,
      item => item._id === eventSeverity._id // eslint-disable-line
    );

    this.setState({ selectedEventSeverities: selectedList });
  };

  render() {
    const { eventSeverities, loading, page, total, onEdit } = this.props;
    const { selectedEventSeverities, selectedPages } = this.state;
    const selectedEventSeveritiesCount = intersectionBy(
      selectedEventSeverities,
      eventSeverities,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Event Severities"
          page={page}
          total={total}
          selectedItemsCount={selectedEventSeveritiesCount}
          exportUrl={getEventSeveritiesExportUrl({
            filter: { _id: map(selectedEventSeverities, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventSeverities(nextPage);
          }}
          onRefresh={() =>
            refreshEventSeverities(
              () => {
                notifySuccess('Event Severities refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Severities please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* eventSeverity list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end eventSeverity list header */}

        {/* eventSeverities list */}
        <List
          loading={loading}
          dataSource={eventSeverities}
          renderItem={eventSeverity => (
            <EventSeveritiesListItem
              key={eventSeverity._id} // eslint-disable-line
              abbreviation={eventSeverity.strings.abbreviation.en}
              name={eventSeverity.strings.name.en}
              code={eventSeverity.strings.code}
              description={
                eventSeverity.strings.description
                  ? eventSeverity.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventSeverities, item => item._id).includes(
                  eventSeverity._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(eventSeverity);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventSeverities(eventSeverity);
              }}
              onEdit={() => onEdit(eventSeverity)}
              onArchive={() =>
                deleteEventSeverity(
                  eventSeverity._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event severity was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event severity please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end eventSeverities list */}
      </>
    );
  }
}

EventSeveritiesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventSeverities: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventSeveritiesList;
