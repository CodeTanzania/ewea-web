import { httpActions } from '@codetanzania/ewea-api-client';
import {
  paginateAdministrativeAreas,
  refreshAdministrativeAreas,
  deleteAdministrativeArea,
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
import { notifyError, notifySuccess } from '../../../util';
import ListHeader from '../../../components/ListHeader';
import Toolbar from '../../../components/Toolbar';
import AdministrativeAreasListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 14, xl: 7, lg: 8, md: 11, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];
const { getAdministrativeAreasExportUrl } = httpActions;

/**
 * @class
 * @name AdministrativeAreasList
 * @description Render AdministrativeAreasList component which have actionBar, administrative areas
 * header and administrative areas list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AdministrativeAreasList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedAdministrativeAreas: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectAdministrativeArea
   * @description Handle select a single administrative area action
   *
   * @param {object} administrativeArea selected administrative area object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectAdministrativeArea = administrativeArea => {
    const { selectedAdministrativeAreas } = this.state;
    this.setState({
      selectedAdministrativeAreas: concat(
        [],
        selectedAdministrativeAreas,
        administrativeArea
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all AdministrativeAreas actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedAdministrativeAreas, selectedPages } = this.state;
    const { administrativeAreas, page } = this.props;
    const selectedList = uniqBy(
      [...selectedAdministrativeAreas, ...administrativeAreas],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedAdministrativeAreas: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all administrative areas in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { administrativeAreas, page } = this.props;
    const { selectedAdministrativeAreas, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedAdministrativeAreas], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    administrativeAreas.forEach(administrativeArea => {
      remove(
        selectedList,
        item => item._id === administrativeArea._id // eslint-disable-line
      );
    });

    this.setState({
      selectedAdministrativeAreas: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectAdministrativeArea
   * @description Handle deselect a single administrative area action
   *
   * @param {object} administrativeArea administrative area to be removed from selected AdministrativeAreas
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectAdministrativeArea = administrativeArea => {
    const { selectedAdministrativeAreas } = this.state;
    const selectedList = [...selectedAdministrativeAreas];

    remove(
      selectedList,
      item => item._id === administrativeArea._id // eslint-disable-line
    );

    this.setState({ selectedAdministrativeAreas: selectedList });
  };

  render() {
    const {
      administrativeAreas,
      loading,
      page,
      total,
      onEdit,
      onMapPreview,
      onFilter,
    } = this.props;
    const { selectedAdministrativeAreas, selectedPages } = this.state;
    const selectedAdministrativeAreaCount = intersectionBy(
      selectedAdministrativeAreas,
      administrativeAreas,
      '_id'
    ).length;
    return (
      <div className="AdministrativeAreasList">
        {/* toolbar */}
        <Toolbar
          itemName="administrative areas"
          page={page}
          total={total}
          selectedItemsCount={selectedAdministrativeAreaCount}
          exportUrl={getAdministrativeAreasExportUrl({
            filter: { _id: map(selectedAdministrativeAreas, '_id') },
          })}
          onFilter={onFilter}
          onPaginate={nextPage => {
            paginateAdministrativeAreas(nextPage);
          }}
          onRefresh={() =>
            refreshAdministrativeAreas(
              () => {
                notifySuccess('administrative areas refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing administrative areas please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* administrative area list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end administrative area list header */}

        {/* administrative areas list */}
        <List
          loading={loading}
          dataSource={administrativeAreas}
          renderItem={administrativeArea => {
            const { strings, _id } = administrativeArea;
            return (
              <AdministrativeAreasListItem
                key={_id} // eslint-disable-line
                abbreviation={strings.abbreviation.en}
                name={strings.name.en}
                type={strings.name.en}
                description={strings.description.en}
                code={strings.code}
                color={strings.color}
                isSelected={
                  // eslint-disable-next-line
                  map(selectedAdministrativeAreas, item => item._id).includes(
                    administrativeArea._id // eslint-disable-line
                  )
                }
                onSelectItem={() => {
                  this.handleOnSelectAdministrativeArea(administrativeArea);
                }}
                onDeselectItem={() => {
                  this.handleOnDeselectAdministrativeArea(administrativeArea);
                }}
                onEdit={() => onEdit(administrativeArea)}
                onMapPreview={() => onMapPreview(administrativeArea)}
                onArchive={() =>
                  deleteAdministrativeArea(
                    administrativeArea._id, // eslint-disable-line
                    () => {
                      notifySuccess(
                        'administrative area was archived successfully'
                      );
                    },
                    () => {
                      notifyError(
                        'An Error occurred while archiving administrative area please contact system administrator'
                      );
                    }
                  )
                }
              />
            );
          }}
        />
        {/* end administrative areas list */}
      </div>
    );
  }
}

AdministrativeAreasList.propTypes = {
  loading: PropTypes.bool.isRequired,
  administrativeAreas: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onMapPreview: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default AdministrativeAreasList;
