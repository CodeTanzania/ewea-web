import {
  //   closeFocalPersonForm,
  Connect,
  getAlerts,
  openAlertForm,
  searchAlerts,
  selectAlert,
} from '@codetanzania/emis-api-states';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Topbar from '../../../components/Topbar';
// import FocalPersonFilters from './Filters';
// import FocalPersonForm from './Form';
import AlertTypesList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name AlertTypes
 * @description Render AlertTypes list which have search box, actions and alert types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertTypes extends Component {
  state = {
    // isEditForm: false,
    cached: null,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    alertTpyes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
      .isRequired,
    alertType: PropTypes.shape({ name: PropTypes.string }),
    page: PropTypes.number.isRequired,
    searchQuery: PropTypes.string,
    total: PropTypes.number.isRequired,
  };

  static defaultProps = {
    alertType: null,
    searchQuery: undefined,
  };

  componentDidMount() {
    getAlerts();
  }

  /**
   * @function
   * @name handleOnCachedValues
   * @description Cached selected values for filters
   *
   * @param {object} cached values to be cached from filter
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCachedValues = cached => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearCachedValues = () => {
    this.setState({ cached: null });
  };

  /**
   * @function
   * @name searchAlerts
   * @description Search Alert Types List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAlerts = event => {
    searchAlerts(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} alertType alertType to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = alertType => {
    selectAlert(alertType);
    // this.setState({ isEditForm: true });
    openAlertForm();
  };

  render() {
    const {
      alertTpyes,
      loading,
      page,
      //   posting,
      //   alertType,
      //   showForm,
      searchQuery,
      total,
    } = this.props;
    // const {
    //   //   showFilters,
    //   //   isEditForm,
    //   //   cached,
    // } = this.state;
    return (
      <Fragment>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Alert types here ...',
            onChange: this.searchAlerts,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Alert Type',
              icon: 'plus',
              size: 'large',
              title: 'Add New Alert Type',
              onClick: this.openAlertForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="AlertTypesList">
          {/* list starts */}
          <AlertTypesList
            total={total}
            page={page}
            alertTpyes={alertTpyes}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
          />
          {/* end list */}

          {/* filter modal */}
          {/* <Modal
            title="Filter Focal People"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <FocalPersonFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal> */}
          {/* end filter modal */}

          {/* create/edit form modal */}
          {/* <Modal
            title={isEditForm ? 'Edit Focal Person' : 'Add New Focal Person'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeFocalPersonForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <FocalPersonForm
              posting={posting}
              isEditForm={isEditForm}
              alertType={alertType}
              onCancel={this.closeFocalPersonForm}
            />
          </Modal> */}
          {/* end create/edit form modal */}
        </div>
      </Fragment>
    );
  }
}

export default Connect(AlertTypes, {
  alertTpyes: 'alerts.list',
  alertType: 'alerts.selected',
  loading: 'alerts.loading',
  posting: 'alerts.posting',
  page: 'alerts.page',
  showForm: 'alerts.showForm',
  total: 'alerts.total',
  searchQuery: 'alerts.q',
});
