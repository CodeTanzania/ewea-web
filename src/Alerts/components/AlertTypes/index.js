import {
  Connect,
  getAlerts,
  openAlertForm,
  searchAlerts,
  selectAlert,
  closeAlertForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Modal } from 'antd';
import Topbar from '../../../components/Topbar';
import AlertTypeForm from './Form';
import AlertTypesList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name AlertTypes
 * @description Render Alert Types list which have search box,
 * actions and alert types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertTypes extends Component {
  state = {
    isEditForm: false,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    alertTypes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
      .isRequired,
    alertType: PropTypes.shape({ name: PropTypes.string }),
    page: PropTypes.number.isRequired,
    searchQuery: PropTypes.string,
    total: PropTypes.number.isRequired,
    posting: PropTypes.bool.isRequired,
    showForm: PropTypes.bool.isRequired,
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
   * @name openAlertTypesForm
   * @description Open alert type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAlertTypesForm = () => {
    openAlertForm();
  };

  /**
   * @function
   * @name closeAlertTypesForm
   * @description close alert type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAlertTypesForm = () => {
    closeAlertForm();
    this.setState({ isEditForm: false });
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
    this.setState({ isEditForm: true });
    openAlertForm();
  };

  render() {
    const {
      alertTypes,
      loading,
      page,
      posting,
      alertType,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm } = this.state;
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
              onClick: this.openAlertTypesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="AlertTypesList">
          {/* list starts */}
          <AlertTypesList
            total={total}
            page={page}
            alertTypes={alertTypes}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={isEditForm ? 'Edit Alert Type' : 'Add New Alert Type'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeAlertTypesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <AlertTypeForm
              posting={posting}
              isEditForm={isEditForm}
              alertType={alertType}
              onCancel={this.closeAlertTypesForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </Fragment>
    );
  }
}

export default Connect(AlertTypes, {
  alertTypes: 'alerts.list',
  alertType: 'alerts.selected',
  loading: 'alerts.loading',
  posting: 'alerts.posting',
  page: 'alerts.page',
  showForm: 'alerts.showForm',
  total: 'alerts.total',
  searchQuery: 'alerts.q',
});
