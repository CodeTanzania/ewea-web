import { httpActions } from '@codetanzania/emis-api-client';
import {
  deleteFocalPerson,
  paginateAlerts,
  refreshAlerts,
} from '@codetanzania/emis-api-states';
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
import FocalPersonsListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 4, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const categorySpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const scopeSpan = { xxl: 4, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const severitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const statusSpan = { xxl: 5, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...categorySpan, header: 'Category' },
  { ...scopeSpan, header: 'Scope' },
  { ...severitySpan, header: 'Severity' },
  { ...statusSpan, header: 'Status' },
];
const { getAlertsExportUrl } = httpActions;

/**
 * @class
 * @name AlertTypesList
 *
 * @description Render AlertTypesList
 * component which have actionBar, focal People
 * header and focal People list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertTypesList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    alertTpyes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
      .isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
  };

  state = {
    selectedAlertTypes: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectFocalPerson
   * @description Handle select a single alertType action
   *
   * @param {object} alertType selected alertType object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectFocalPerson = alertType => {
    const { selectedAlertTypes } = this.state;
    this.setState({
      selectedAlertTypes: concat([], selectedAlertTypes, alertType),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all alertTpyes actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedAlertTypes, selectedPages } = this.state;
    const { alertTpyes, page } = this.props;
    const selectedList = uniqBy([...selectedAlertTypes, ...alertTpyes], '_id');
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedAlertTypes: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all alertTpyes in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { alertTpyes, page } = this.props;
    const { selectedAlertTypes, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedAlertTypes], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    alertTpyes.forEach(alertType => {
      remove(
        selectedList,
        item => item._id === alertType._id // eslint-disable-line
      );
    });

    this.setState({
      selectedAlertTypes: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter alertTpyes by status action
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
   * @name handleOnDeselectFocalPerson
   * @description Handle deselect a single alertType action
   *
   * @param {object} alertType alertType to be removed from selected focalPeople
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectFocalPerson = alertType => {
    const { selectedAlertTypes } = this.state;
    const selectedList = [...selectedAlertTypes];

    remove(
      selectedList,
      item => item._id === alertType._id // eslint-disable-line
    );

    this.setState({ selectedAlertTypes: selectedList });
  };

  render() {
    const { alertTpyes, loading, page, total, onEdit } = this.props;
    const { selectedAlertTypes, selectedPages } = this.state;
    const selectedAlertTypesCount = intersectionBy(
      selectedAlertTypes,
      alertTpyes,
      '_id'
    ).length;

    return (
      <Fragment>
        {/* toolbar */}
        <Toolbar
          itemName="Alert Types"
          page={page}
          total={total}
          selectedItemsCount={selectedAlertTypesCount}
          exportUrl={getAlertsExportUrl({
            filter: { _id: map(selectedAlertTypes, '_id') },
          })}
          onPaginate={nextPage => {
            paginateAlerts(nextPage);
          }}
          onRefresh={() =>
            refreshAlerts(
              () => {
                notifySuccess('Alert Types refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Alert Types please contact system administrator'
                );
              }
            )
          }
        />
        {/* end toolbar */}

        {/* alertType list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end alertType list header */}

        {/* alertTpyes list */}
        <List
          loading={loading}
          dataSource={alertTpyes}
          renderItem={alertType => (
            <FocalPersonsListItem
              key={alertType._id} // eslint-disable-line
              abbreviation={alertType.type.charAt(0)}
              name={alertType.type}
              category={alertType.category ? alertType.category : 'N/A'}
              scope={alertType.scope ? alertType.scope : 'N/A'}
              severity={alertType.severity}
              status={alertType.status}
              isSelected={
                // eslint-disable-next-line
                map(selectedAlertTypes, item => item._id).includes(
                  alertType._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectFocalPerson(alertType);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectFocalPerson(alertType);
              }}
              onEdit={() => onEdit(alertType)}
              onArchive={() =>
                deleteFocalPerson(
                  alertType._id, // eslint-disable-line
                  () => {
                    notifySuccess('Focal Person was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Focal Person please contact system administrator'
                    );
                  }
                )
              }
            />
          )}
        />
        {/* end alertTpyes list */}
      </Fragment>
    );
  }
}

export default AlertTypesList;
