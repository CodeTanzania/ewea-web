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

const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const amenitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const addressSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 7, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...amenitySpan, header: 'Amenity' },
  { ...addressSpan, header: 'Address' },
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
   * @description Handle select a single feature action
   *
   * @param {object} feature selected feature object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = feature => {
    const { selectedEventTypes } = this.state;
    this.setState({
      selectedEventTypes: concat([], selectedEventTypes, feature),
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
    const { features, page } = this.props;
    const selectedList = uniqBy([...selectedEventTypes, ...features], '_id');
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
    const { features, page } = this.props;
    const { selectedEventTypes, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEventTypes], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    features.forEach(feature => {
      remove(
        selectedList,
        item => item._id === feature._id // eslint-disable-line
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
   * @description Handle filter features by status action
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
   * @description Handle deselect a single feature action
   *
   * @param {object} feature feature to be removed from selected focalPeople
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEventTypes = feature => {
    const { selectedEventTypes } = this.state;
    const selectedList = [...selectedEventTypes];

    remove(
      selectedList,
      item => item._id === feature._id // eslint-disable-line
    );

    this.setState({ selectedEventTypes: selectedList });
  };

  render() {
    const { features, loading, page, total, onEdit } = this.props;
    const { selectedEventTypes, selectedPages } = this.state;
    const selectedEventTypesCount = intersectionBy(
      selectedEventTypes,
      features,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Features"
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
                notifySuccess('Features refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Features please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* feature list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end feature list header */}

        {/* features list */}
        <List
          loading={loading}
          dataSource={features}
          renderItem={feature => (
            <EventTypesListItem
              key={feature._id} // eslint-disable-line
              abbreviation={feature.strings.abbreviation.en}
              name={feature.strings.name.en}
              code={feature.strings.code ? feature.strings.code : 'N/A'}
              amenity={
                feature.properties.amenity ? feature.properties.amenity : 'N/A'
              }
              address={
                feature.properties.address_city
                  ? feature.properties.address_city
                  : 'N/A'
              }
              description={
                feature.strings.description
                  ? feature.strings.description.en
                  : 'N/A'
              }
              isSelected={
                // eslint-disable-next-line
                map(selectedEventTypes, item => item._id).includes(
                  feature._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(feature);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEventTypes(feature);
              }}
              onEdit={() => onEdit(feature)}
              onArchive={() =>
                deleteEventType(
                  feature._id, // eslint-disable-line
                  () => {
                    notifySuccess('Feature was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Feature please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end features list */}
      </>
    );
  }
}

EventTypesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  features: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default EventTypesList;
