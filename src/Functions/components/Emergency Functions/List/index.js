import { httpActions } from '@codetanzania/ewea-api-client';
import {
  paginateIncidentTypes,
  refreshIncidentTypes,
  deleteIncidentType,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
import concat from 'lodash/concat';
import intersectionBy from 'lodash/intersectionBy';
import map from 'lodash/map';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ListHeader from '../../../../components/ListHeader';
import Toolbar from '../../../../components/Toolbar';
import { notifyError, notifySuccess } from '../../../../util';
import EmergencyFunctionsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const natureSpan = { xxl: 4, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const familySpan = { xxl: 5, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };
const codeSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const capSpan = { xxl: 4, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...natureSpan, header: 'Nature' },
  { ...familySpan, header: 'Family' },
  { ...codeSpan, header: 'Code' },
  { ...capSpan, header: 'Cap' },
];
const { getIncidentTypesExportUrl } = httpActions;

/**
 * @class
 * @name FunctionsList
 * @description Render FunctionsList component which have actionBar, emergency functions
 * header and emergency functions list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FunctionsList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    emergencyFunctions: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string })
    ).isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
  };

  state = {
    selectedEmergencyFunctions: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectEmergencyFunction
   * @description Handle select a single emergency function action
   *
   * @param {object} emergencyFunction selected emergency function object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectEmergencyFunction = emergencyFunction => {
    const { selectedEmergencyFunctions } = this.state;
    this.setState({
      selectedEmergencyFunctions: concat(
        [],
        selectedEmergencyFunctions,
        emergencyFunction
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all Emergency Functions actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const { emergencyFunctions, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEmergencyFunctions, ...emergencyFunctions],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedEmergencyFunctions: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all emergency functions in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { emergencyFunctions, page } = this.props;
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEmergencyFunctions], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    emergencyFunctions.forEach(emergencyFunction => {
      remove(
        selectedList,
        item => item._id === emergencyFunction._id // eslint-disable-line
      );
    });

    this.setState({
      selectedEmergencyFunctions: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleOnDeselectEmergencyFunction
   * @description Handle deselect a single emergency function action
   *
   * @param {object} emergencyFunction emergency function to be removed from selected Emergency Functions
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEmergencyFunction = emergencyFunction => {
    const { selectedEmergencyFunctions } = this.state;
    const selectedList = [...selectedEmergencyFunctions];

    remove(
      selectedList,
      item => item._id === emergencyFunction._id // eslint-disable-line
    );

    this.setState({ selectedEmergencyFunctions: selectedList });
  };

  render() {
    const {
      emergencyFunctions,
      loading,
      page,
      total,
      onEdit,
      onFilter,
    } = this.props;
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const selectedEmergencyFunctionCount = intersectionBy(
      selectedEmergencyFunctions,
      emergencyFunctions,
      '_id'
    ).length;

    return (
      <Fragment>
        {/* toolbar */}
        <Toolbar
          itemName="Emergency Functions"
          page={page}
          total={total}
          selectedItemsCount={selectedEmergencyFunctionCount}
          exportUrl={getIncidentTypesExportUrl({
            filter: { _id: map(selectedEmergencyFunctions, '_id') },
          })}
          onFilter={onFilter}
          onPaginate={nextPage => {
            paginateIncidentTypes(nextPage);
          }}
          onRefresh={() =>
            refreshIncidentTypes(
              () => {
                notifySuccess('Emergency Functions refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Emergency Functions please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* emergency function list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end emergency function list header */}

        {/* emergency functions list */}
        <List
          loading={loading}
          dataSource={emergencyFunctions}
          renderItem={emergencyFunction => (
            <EmergencyFunctionsListItem
              key={emergencyFunction._id} // eslint-disable-line
              abbreviation={emergencyFunction.name.charAt(0)}
              name={emergencyFunction.name}
              nature={
                emergencyFunction.nature ? emergencyFunction.nature : 'N/A'
              }
              family={
                emergencyFunction.family ? emergencyFunction.family : 'N/A'
              }
              code={emergencyFunction.code}
              cap={emergencyFunction.cap}
              color={emergencyFunction.color}
              isSelected={
                // eslint-disable-next-line
                map(selectedEmergencyFunctions, item => item._id).includes(
                  emergencyFunction._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectEmergencyFunction(emergencyFunction);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectEmergencyFunction(emergencyFunction);
              }}
              onEdit={() => onEdit(emergencyFunction)}
              onArchive={() =>
                deleteIncidentType(
                  emergencyFunction._id, // eslint-disable-line
                  () => {
                    notifySuccess(
                      'Emergency Function was archived successfully'
                    );
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Emergency Function please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end emergency functions list */}
      </Fragment>
    );
  }
}

export default FunctionsList;
