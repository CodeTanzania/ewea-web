import { httpActions } from '@codetanzania/ewea-api-client';
import {
  paginateEventFunctions,
  refreshEventFunctions,
  deleteEventFunction,
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
import { notifyError, notifySuccess } from '../../../../util';
import ListHeader from '../../../../components/ListHeader';
import Toolbar from '../../../../components/Toolbar';
import EmergencyFunctionsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 5, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const typeSpan = { xxl: 4, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const codeSpan = { xxl: 3, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 10, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...typeSpan, header: 'Type' },
  { ...descriptionSpan, header: 'Description' },
];
const { getEventFunctionsExportUrl } = httpActions;

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
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedEmergencyFunctions: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectEmergencyFunction
   * @description Handle select a single emergency function action
   *
   * @param {object} eventFunction selected emergency function object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectEmergencyFunction = eventFunction => {
    const { selectedEmergencyFunctions } = this.state;
    this.setState({
      selectedEmergencyFunctions: concat(
        [],
        selectedEmergencyFunctions,
        eventFunction
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all EmergencyFunctions actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const { eventFunctions, page } = this.props;
    const selectedList = uniqBy(
      [...selectedEmergencyFunctions, ...eventFunctions],
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
    const { eventFunctions, page } = this.props;
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedEmergencyFunctions], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    eventFunctions.forEach(eventFunction => {
      remove(
        selectedList,
        item => item._id === eventFunction._id // eslint-disable-line
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
   * @param {object} eventFunction emergency function to be removed from selected EmergencyFunctions
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectEmergencyFunction = eventFunction => {
    const { selectedEmergencyFunctions } = this.state;
    const selectedList = [...selectedEmergencyFunctions];

    remove(
      selectedList,
      item => item._id === eventFunction._id // eslint-disable-line
    );

    this.setState({ selectedEmergencyFunctions: selectedList });
  };

  render() {
    const {
      eventFunctions,
      loading,
      page,
      total,
      onEdit,
      onFilter,
    } = this.props;
    const { selectedEmergencyFunctions, selectedPages } = this.state;
    const selectedEmergencyFunctionCount = intersectionBy(
      selectedEmergencyFunctions,
      eventFunctions,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Emergency Functions"
          page={page}
          total={total}
          selectedItemsCount={selectedEmergencyFunctionCount}
          exportUrl={getEventFunctionsExportUrl({
            filter: { _id: map(selectedEmergencyFunctions, '_id') },
          })}
          onFilter={onFilter}
          onPaginate={nextPage => {
            paginateEventFunctions(nextPage);
          }}
          onRefresh={() =>
            refreshEventFunctions(
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
          dataSource={eventFunctions}
          renderItem={eventFunction => {
            const { strings, _id } = eventFunction;
            return (
              <EmergencyFunctionsListItem
                key={_id} // eslint-disable-line
                abbreviation={strings.abbreviation.en}
                name={strings.name.en}
                type={strings.name.en}
                description={strings.description.en}
                code={strings.code}
                color={strings.color}
                isSelected={
                  // eslint-disable-next-line
                  map(selectedEmergencyFunctions, item => item._id).includes(
                    eventFunction._id // eslint-disable-line
                  )
                }
                onSelectItem={() => {
                  this.handleOnSelectEmergencyFunction(eventFunction);
                }}
                onDeselectItem={() => {
                  this.handleOnDeselectEmergencyFunction(eventFunction);
                }}
                onEdit={() => onEdit(eventFunction)}
                onArchive={() =>
                  deleteEventFunction(
                    eventFunction._id, // eslint-disable-line
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
            );
          }}
        />
        {/* end emergency functions list */}
      </>
    );
  }
}

FunctionsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventFunctions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default FunctionsList;
