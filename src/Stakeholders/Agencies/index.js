import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Row, Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';

import Topbar from '../../components/Topbar';
import StakeholderForm from '../../components/StakeholderForm';
import AgencyFilters from './Filters';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess, generateAgencyVCard } from '../../util';

/* http actions */
const {
  getAgencies: getAgenciesFromAPI,
  getAdministrativeAreas,
  getPartyGroups,
  getAgenciesExportUrl,
} = httpActions;
/* redux actions */
const {
  closeAgencyForm,
  getAgencies,
  openAgencyForm,
  searchAgencies,
  selectAgency,
  refreshAgencies,
  paginateAgencies,
  deleteAgency,
  postAgency,
  putAgency,
} = reduxActions;

/* ui */
const { confirm } = Modal;
/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 7, sm: 14, xs: 12 };
const abbreviationSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const areaSpan = { xxl: 4, xl: 4, lg: 4, md: 0, sm: 0, xs: 0 };
const phoneSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 6, xs: 6 };
const emailSpan = { xxl: 5, xl: 5, lg: 5, md: 6, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...abbreviationSpan, header: 'Abbreviation' },
  { ...areaSpan, header: 'Area' },
  { ...phoneSpan, header: 'Phone Number' },
  { ...emailSpan, header: 'Email' },
];

/**
 * @class
 * @name Agencies
 * @description Render agency list which have search box, actions and agency list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Agencies extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedAgencies: [],
    notificationSubject: undefined,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getAgencies();
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
  handleOnCachedValues = (cached) => {
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
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openAgencyForm
   * @description Open agency form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAgencyForm = () => {
    openAgencyForm();
  };

  /**
   * @function
   * @name openAgencyForm
   * @description close agency form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAgencyForm = () => {
    closeAgencyForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAgencies
   * @description Search Agencies List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAgencies = (event) => {
    searchAgencies(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} agency agency to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (agency) => {
    selectAgency(agency);
    this.setState({ isEditForm: true });
    openAgencyForm();
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify agencies
   *
   * @param {object[]} agencies List of agencies selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = (agencies) => {
    this.setState({
      selectedAgencies: agencies,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify agencies
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    selectAgency(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshAgencies
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshAgencies = () => {
    refreshAgencies(
      () => {
        notifySuccess('Agencies refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Agencies please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple agencies
   *
   * @param {object[]| object} agencies agencies list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (agencies) => {
    let message;
    let subject;
    if (isArray(agencies)) {
      const agencyList = agencies.map(
        (agency) => generateAgencyVCard(agency).body
      );

      subject = 'Agencies Contact Details';
      message = agencyList.join('\n\n\n');
    } else {
      const { body, subject: title } = generateAgencyVCard(agencies);
      subject = title;
      message = body;
    }

    this.setState({
      notificationSubject: subject,
      notificationBody: message,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a agency
   *
   * @param item {object} agency to archive
   * @version 0.1.0
   * @since 0.1.0
   */

  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive ${item.name} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteAgency(
          item._id, // eslint-disable-line
          () => notifySuccess('Agency was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Agency, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      agencies,
      agency,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      showFilters,
      isEditForm,
      showNotificationForm,
      selectedAgencies,
      notificationSubject,
      notificationBody,
      cached,
    } = this.state;

    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for agencies here ...',
            onChange: this.searchAgencies,
            value: searchQuery,
          }}
          action={{
            label: 'New Agency',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Agency',
            onClick: this.openAgencyForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Agencies"
          items={agencies}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshAgencies}
          onPaginate={(nextPage) => paginateAgencies(nextPage)}
          headerLayout={headerLayout}
          generateExportUrl={getAgenciesExportUrl}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              item={item}
              name={item.name}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              title={<span className="text-sm">{item.name}</span>}
              secondaryText={
                <Row>
                  <Col span={16}>
                    <span className="text-xs">{item.abbreviation}</span>
                  </Col>

                  <Col span={6}>
                    <span className="text-xs">{item.mobile}</span>
                  </Col>
                </Row>
              }
              actions={[
                {
                  name: 'Edit Agency',
                  title: 'Update Agency Details',
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Agency',
                  title: 'Share Agency details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Share on WhatsApp',
                  title: 'Share Contact on Whatsapp',
                  link: `https://wa.me/?text=${encodeURI(
                    generateAgencyVCard(item).body
                  )}`,
                  icon: 'whatsapp',
                },
                {
                  name: 'Archive Agency',
                  title: 'Remove Agency from list of active agency',
                  onClick: () => this.showArchiveConfirm(item),
                  icon: 'archive',
                },
              ]}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.name}</Col>
              <Col {...abbreviationSpan}>{item.abbreviation}</Col>
              <Col {...areaSpan}>
                {get(item, 'area.strings.name.en', 'N/A')}
              </Col>
              <Col {...phoneSpan}>{item.mobile}</Col>
              <Col {...emailSpan}>{item.email}</Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Agencies"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
        >
          <NotificationForm
            onSearchRecipients={getAgenciesFromAPI}
            onSearchJurisdictions={getAdministrativeAreas}
            onSearchGroups={getPartyGroups}
            onCancel={this.closeNotificationForm}
            selectedAgencies={selectedAgencies}
            subject={notificationSubject}
            body={notificationBody}
          />
        </Modal>
        {/* end Notification modal */}

        {/* filter modal */}
        <Modal
          title="Filter Agency"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
        >
          <AgencyFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Agency' : 'Add New Agency'}
          visible={showForm}
          className="modal-window-80"
          footer={null}
          onCancel={this.closeAgencyForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <StakeholderForm
            isAgency
            stakeholder={agency}
            posting={posting}
            onCancel={this.closeAgencyForm}
            onCreate={(data) =>
              postAgency(
                data,
                () => {
                  notifySuccess('Agency was created successfully');
                },
                () => {
                  notifyError(
                    'Something occurred while saving agency, please try again!'
                  );
                }
              )
            }
            onUpdate={(data) =>
              putAgency(
                data,
                () => {
                  notifySuccess('Agency was updated successfully');
                },
                () => {
                  notifyError(
                    'Something occurred while updating agency, please try again!'
                  );
                }
              )
            }
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

Agencies.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  agencies: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  agency: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Agencies.defaultProps = {
  agency: null,
  searchQuery: undefined,
};

export default Connect(Agencies, {
  agencies: 'agencies.list',
  agency: 'agencies.selected',
  loading: 'agencies.loading',
  posting: 'agencies.posting',
  page: 'agencies.page',
  showForm: 'agencies.showForm',
  total: 'agencies.total',
  searchQuery: 'agencies.q',
});
