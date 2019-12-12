import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteAlert,
  paginateAlerts,
  refreshAlerts,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
import compact from 'lodash/compact';
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
import AlertsListItem from '../ListItem';

/* constants */
const urgencySpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 0, xs: 0 };
const statusSpan = { xxl: 2, xl: 3, lg: 3, md: 4, sm: 0, xs: 0 };
const severitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const eventSpan = { xxl: 8, xl: 7, lg: 7, md: 0, sm: 19, xs: 19 };
const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };

const headerLayout = [
  { ...eventSpan, header: 'Event' },
  { ...areaSpan, header: 'Area' },
  { ...statusSpan, header: 'Status' },
  { ...severitySpan, header: 'Severity' },
  { ...urgencySpan, header: 'Urgency' },
];
const { getAlertsExportUrl } = httpActions;

/**
 * @class
 * @name AlertsList
 * @description Render AlertsList component which have actionBar, alerts
 * header and alerts list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertsList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedAlerts: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectAlert
   * @description Handle select a single alert action
   *
   * @param {object} alert selected alert object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectAlert = alert => {
    const { selectedAlerts } = this.state;
    this.setState({
      selectedAlerts: concat([], selectedAlerts, alert),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all alerts actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedAlerts, selectedPages } = this.state;
    const { alerts, page } = this.props;
    const selectedList = uniqBy([...selectedAlerts, ...alerts], '_id');
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedAlerts: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all alerts in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { alerts, page } = this.props;
    const { selectedAlerts, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedAlerts], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    alerts.forEach(alert => {
      remove(
        selectedList,
        item => item._id === alert._id // eslint-disable-line
      );
    });

    this.setState({
      selectedAlerts: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter alerts by status action
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
   * @name handleOnDeselectAlert
   * @description Handle deselect a single alert action
   *
   * @param {object} alert alert to be removed from selected alerts
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectAlert = alert => {
    const { selectedAlerts } = this.state;
    const selectedList = [...selectedAlerts];

    remove(
      selectedList,
      item => item._id === alert._id // eslint-disable-line
    );

    this.setState({ selectedAlerts: selectedList });
  };

  render() {
    const {
      alerts,
      loading,
      page,
      total,
      onEdit,
      onFilter,
      onShare,
      onBulkShare,
    } = this.props;
    const { selectedAlerts, selectedPages } = this.state;
    const selectedAlertsCount = intersectionBy(selectedAlerts, alerts, '_id')
      .length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="alert"
          page={page}
          total={total}
          selectedItemsCount={selectedAlertsCount}
          exportUrl={getAlertsExportUrl({
            filter: { _id: map(selectedAlerts, '_id') },
          })}
          onFilter={onFilter}
          onPaginate={nextPage => {
            paginateAlerts(nextPage);
          }}
          onRefresh={() =>
            refreshAlerts(
              () => {
                notifySuccess('Alerts refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Alerts please contact system administrator'
                );
              }
            )
          }
          onShare={() => onBulkShare(selectedAlerts)}
        />
        {/* end toolbar */}

        {/* alert list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end alert list header */}

        {/* alerts list */}
        <List
          loading={loading}
          dataSource={alerts}
          renderItem={alert => (
            <AlertsListItem
              key={alert._id} // eslint-disable-line
              abbreviation={alert.event.toUpperCase().charAt(0)}
              location={compact(['Tandale', 'Hananasif', 'Kigogo']).join(', ')}
              event={alert.event}
              color={alert.color}
              description={alert.description ? alert.description : 'N/A'}
              urgency={alert.urgency}
              severity={alert.severity}
              status={alert.status}
              isSelected={
                // eslint-disable-next-line
                map(selectedAlerts, item => item._id).includes(
                  alert._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectAlert(alert);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectAlert(alert);
              }}
              onEdit={() => onEdit(alert)}
              onArchive={() =>
                deleteAlert(
                  alert._id, // eslint-disable-line
                  () => {
                    notifySuccess('Alert was archived successfully');
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Alert please contact system administrator'
                    );
                  }
                )
              }
              onShare={() => {
                onShare(alert);
              }}
            />
          )}
        />
        {/* end alerts list */}
      </>
    );
  }
}

AlertsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onBulkShare: PropTypes.func.isRequired,
};

export default AlertsList;
