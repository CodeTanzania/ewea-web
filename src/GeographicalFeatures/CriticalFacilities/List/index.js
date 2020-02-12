import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteFeature,
  paginateFeatures,
  refreshFeatures,
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
import FeaturesListItem from '../ListItem';

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
const { getFeaturesExportUrl } = httpActions;

/**
 * @class
 * @name FeaturesList
 *
 * @description Render Critical Facilities List
 * component which have actionBar, Critical Facilities
 * header and Critical Facilities list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FeaturesList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedFeatures: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectCriticalFacility
   * @description Handle select a single Critical Facility action
   *
   * @param {object} feature selected Critical Facility object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectCriticalFacility = feature => {
    const { selectedFeatures } = this.state;
    this.setState({
      selectedFeatures: concat([], selectedFeatures, feature),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all Critical Facilities actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedFeatures, selectedPages } = this.state;
    const { features, page } = this.props;
    const selectedList = uniqBy([...selectedFeatures, ...features], '_id');
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedFeatures: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all Critical Facilities in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { features, page } = this.props;
    const { selectedFeatures, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedFeatures], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    features.forEach(feature => {
      remove(
        selectedList,
        item => item._id === feature._id // eslint-disable-line
      );
    });

    this.setState({
      selectedFeatures: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter critical facilities by status action
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
   * @name handleOnDeselectCriticalFacilities
   * @description Handle deselect a single critical facility action
   *
   * @param {object} feature critical facility to be removed from selected critical facility
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectCriticalFacilities = feature => {
    const { selectedFeatures } = this.state;
    const selectedList = [...selectedFeatures];

    remove(
      selectedList,
      item => item._id === feature._id // eslint-disable-line
    );

    this.setState({ selectedFeatures: selectedList });
  };

  render() {
    const { features, loading, page, total, onEdit } = this.props;
    const { selectedFeatures, selectedPages } = this.state;
    const selectedFeaturesCount = intersectionBy(
      selectedFeatures,
      features,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="critical facility"
          page={page}
          total={total}
          selectedItemsCount={selectedFeaturesCount}
          exportUrl={getFeaturesExportUrl({
            filter: { _id: map(selectedFeatures, '_id') },
          })}
          onPaginate={nextPage => {
            paginateFeatures(nextPage);
          }}
          onRefresh={() =>
            refreshFeatures(
              () => {
                notifySuccess('Critical Facilities refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Critical Facilities please contact system administrator'
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
            <FeaturesListItem
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
                map(selectedFeatures, item => item._id).includes(
                  feature._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectCriticalFacility(feature);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectCriticalFacilities(feature);
              }}
              onEdit={() => onEdit(feature)}
              onArchive={() =>
                deleteFeature(
                  feature._id, // eslint-disable-line
                  () => {
                    notifySuccess(
                      'Critical Facility was archived successfully'
                    );
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Critical Facility please contact system administrator'
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

FeaturesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  features: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default FeaturesList;
