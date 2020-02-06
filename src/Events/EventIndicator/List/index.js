import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteEventIndicator,
  paginateEventIndicators,
  refreshEventIndicators,
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
import EventIndicatorsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventIndicatorsExportUrl } = httpActions;

/**
 * @class
 * @name EventIndicatorList
 *
 * @description Render EventIndicatorList
 * component which have actionBar, event indicators
 * header and event indicators list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventIndicatorList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEventIndicators: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectIndicator
   * @description Handle select a single event indicator action
   *
   * @param {object} eventIndicator selected event indicator object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectIndicator = eventIndicator => {
    const { selectedEventIndicators } = this.state;
    this.setState({
      selectedEventIndicators: concat(
        [],
        selectedEventIndicators,
        eventIndicator
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all event Indicators actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEventIndicators, selectedPages } = this.state;
    const { eventIndicators, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEventIndicators, ...eventIndicators],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEventIndicators: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all event Indicators in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { eventIndicators, page } = this.props;
    const { selectedEventIndicators, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventIndicators], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventIndicators.forEach(eventIndicator => {
      remove(
        selectedList,
        item => item._id === eventIndicator._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEventIndicators: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEventIndicators
   * @description Handle deselect a single event indicator action
   *
   * @param {object} eventIndicator eventIndicator instance to be removed from selected EventIndicators
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventIndicators = eventIndicator => {
    const { selectedEventIndicators } = this.state;
    const selectedList = [...selectedEventIndicators];

    remove(
      selectedList,
      item => item._id === eventIndicator._id // eslint-disable-line
    );

    this.setState({ selectedEventIndicators: selectedList });
  };

  render() {
    const { eventIndicators, loading, page, total, onEdit } = this.props;
    const { selectedEventIndicators, selectedPages } = this.state;
    const selectedEventIndicatorsCount = intersectionBy(
      selectedEventIndicators,
      eventIndicators,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="event indicator"
          page={page}
          total={total}
          selectedItemsCount={selectedEventIndicatorsCount}
          exportUrl={getEventIndicatorsExportUrl({
            filter: { _id: map(selectedEventIndicators, '_id') },
          })}
          onPaginate={nextPage => {
            paginateEventIndicators(nextPage);
          }}
          onRefresh={() =>
            refreshEventIndicators(
              () => {
                notifySuccess('Event Indicators refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Event Indicators please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* eventIndicator list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end eventIndicator list header */}

        {/* eventIndicators list */}
        <List
          loading={loading}
          dataSource={eventIndicators}
          renderItem={eventIndicator => (
            <EventIndicatorsListItem
              key={eventIndicator._id} // eslint-disable-line
              abbreviation={eventIndicator.strings.abbreviation.en}
              name={eventIndicator.strings.name.en}
              code={eventIndicator.strings.code}
              description={
                eventIndicator.strings.description
                  ? eventIndicator.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventIndicators, item => item._id).includes(
                  eventIndicator._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectIndicator(eventIndicator);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventIndicators(eventIndicator);
              }}
              onEdit={() => onEdit(eventIndicator)}
              onArchive={() =>
                deleteEventIndicator(
                  eventIndicator._id, // eslint-disable-line
                  () => {
                    notifySuccess('Event indicator was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Event indicator please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end eventIndicators list */}
      </>
    );
  }
}

EventIndicatorList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventIndicators: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventIndicatorList;
