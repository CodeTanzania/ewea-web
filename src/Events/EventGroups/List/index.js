import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventGroup,
  paginateEventGroups,
  refreshEventGroups,
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
import EventGroupsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventGroupsExportUrl } = httpActions;

/**
 * @class
 * @name EventGroupsList
 *
 * @description Render EventGroupsList
 * component which have actionBar, event groups
 * header and event groups list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventGroupsList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventGroups: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectFocalPerson
   * @description Handle select a single eventGroup action
   *
   * @param {object} eventGroup selected eventGroup object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = eventGroup => {
    const { selectedEventGroups } = this.state;
    this.setState({
      selectedEventGroups: concat([], selectedEventGroups, eventGroup),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Groups actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventGroups, selectedPages } = this.state;
    const { eventGroups, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEventGroups, ...eventGroups],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventGroups: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Groups in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventGroups, page } = this.props;
    const { selectedEventGroups, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventGroups], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventGroups.forEach(eventGroup => {
      remove(
        selectedList,
        item => item._id === eventGroup._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventGroups: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEventGroups
   * @description Handle deselect a single eventGroup action
   *
   * @param {object} eventGroup eventGroup to be removed from selected focalPeople
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventGroups = eventGroup => {
    const { selectedEventGroups } = this.state;
    const selectedList = [...selectedEventGroups];

    remove(
      selectedList,
      item => item._id === eventGroup._id // eslint-disable-line
    );

    this.setState({ selectedEventGroups: selectedList });
  };

  render() {
    const { eventGroups, loading, page, total, onEdit } = this.props;
    const { selectedEventGroups, selectedPages } = this.state;
    const selectedEventGroupsCount = intersectionBy(
      selectedEventGroups,
      eventGroups,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Event Groups"
          page={page}
          total={total}
          selectedItemsCount={selectedEventGroupsCount}
          exportUrl={getEventGroupsExportUrl({
            filter: { _id: map(selectedEventGroups, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventGroups(nextPage);
          }}
          onRefresh={() =>
            refreshEventGroups(
              () => {
                notifySuccess('Event Groups refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Groups please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* eventGroup list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end eventGroup list header */}

        {/* eventGroups list */}
        <List
          loading={loading}
          dataSource={eventGroups}
          renderItem={eventGroup => (
            <EventGroupsListItem
              key={eventGroup._id} // eslint-disable-line
              abbreviation={eventGroup.strings.abbreviation.en}
              name={eventGroup.strings.name.en}
              code={eventGroup.strings.code}
              description={
                eventGroup.strings.description
                  ? eventGroup.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventGroups, item => item._id).includes(
                  eventGroup._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(eventGroup);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventGroups(eventGroup);
              }}
              onEdit={() => onEdit(eventGroup)}
              onArchive={() =>
                deleteEventGroup(
                  eventGroup._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event group was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event group please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end eventGroups list */}
      </>
    );
  }
}

EventGroupsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventGroups: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventGroupsList;
