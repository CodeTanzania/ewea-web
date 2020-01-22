import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventCertainty,
  paginateEventCertainties,
  refreshEventCertainties,
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
import EventCertaintiesListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventCertaintiesExportUrl } = httpActions;

/**
 * @class
 * @name EventCertaintiesList
 *
 * @description Render EventCertaintiesList
 * component which have actionBar, event certainties
 * header and event certainties list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventCertaintiesList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventCertainties: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectFocalPerson
   * @description Handle select a single eventCertainty action
   *
   * @param {object} eventCertainty selected eventCertainty object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = eventCertainty => {
    const { selectedEventCertainties } = this.state;
    this.setState({
      selectedEventCertainties: concat(
        [],
        selectedEventCertainties,
        eventCertainty
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Certainties actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventCertainties, selectedPages } = this.state;
    const { eventCertainties, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEventCertainties, ...eventCertainties],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventCertainties: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Certainties in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventCertainties, page } = this.props;
    const { selectedEventCertainties, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventCertainties], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventCertainties.forEach(eventCertainty => {
      remove(
        selectedList,
        item => item._id === eventCertainty._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventCertainties: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEventCertainties
   * @description Handle deselect a single eventCertainty action
   *
   * @param {object} eventCertainty eventCertainty instance to be removed from selected EventCertainties
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventCertainties = eventCertainty => {
    const { selectedEventCertainties } = this.state;
    const selectedList = [...selectedEventCertainties];

    remove(
      selectedList,
      item => item._id === eventCertainty._id // eslint-disable-line
    );

    this.setState({ selectedEventCertainties: selectedList });
  };

  render() {
    const { eventCertainties, loading, page, total, onEdit } = this.props;
    const { selectedEventCertainties, selectedPages } = this.state;
    const selectedEventCertaintiesCount = intersectionBy(
      selectedEventCertainties,
      eventCertainties,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Event Certainties"
          page={page}
          total={total}
          selectedItemsCount={selectedEventCertaintiesCount}
          exportUrl={getEventCertaintiesExportUrl({
            filter: { _id: map(selectedEventCertainties, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventCertainties(nextPage);
          }}
          onRefresh={() =>
            refreshEventCertainties(
              () => {
                notifySuccess('Event Certainties refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Certainties please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* eventCertainty list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end eventCertainty list header */}

        {/* eventCertainties list */}
        <List
          loading={loading}
          dataSource={eventCertainties}
          renderItem={eventCertainty => (
            <EventCertaintiesListItem
              key={eventCertainty._id} // eslint-disable-line
              abbreviation={eventCertainty.strings.abbreviation.en}
              name={eventCertainty.strings.name.en}
              code={eventCertainty.strings.code}
              description={
                eventCertainty.strings.description
                  ? eventCertainty.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventCertainties, item => item._id).includes(
                  eventCertainty._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(eventCertainty);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventCertainties(eventCertainty);
              }}
              onEdit={() => onEdit(eventCertainty)}
              onArchive={() =>
                deleteEventCertainty(
                  eventCertainty._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event certainty was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event certainty please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end eventCertainties list */}
      </>
    );
  }
}

EventCertaintiesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventCertainties: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventCertaintiesList;
