import {
  Connect,
  searchAdministrativeAreas,
  selectAdministrativeArea,
  getAdministrativeAreas,
  openAdministrativeAreaForm,
  closeAdministrativeAreaForm,
  paginateAdministrativeAreas,
  refreshAdministrativeAreas,
  deleteAdministrativeArea,
} from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Modal, Col } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import NotificationForm from '../../components/NotificationForm';
import AdministrativeAreasFilters from './Filters';
import AdministrativeAreaForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 5, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 14, xl: 7, lg: 8, md: 11, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

const { confirm } = Modal;

/**
 * @class
 * @name AdministrativeAreas
 * @description Render functions list which have search box, actions and list administrative areas
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AdministrativeAreas extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
    cached: null,
  };

  componentDidMount() {
    getAdministrativeAreas();
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
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openAdministrativeAreaForm
   * @description Open administrativeArea form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAdministrativeAreaForm = () => {
    openAdministrativeAreaForm();
  };

  /**
   * @function
   * @name closeAdministrativeAreaForm
   * @description close administrativeArea form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAdministrativeAreaForm = () => {
    closeAdministrativeAreaForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAdministrativeAreas
   * @description Search AdministrativeAreas List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAdministrativeAreas = event => {
    searchAdministrativeAreas(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} administrativeArea administrativeArea to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = administrativeArea => {
    selectAdministrativeArea(administrativeArea);
    this.setState({ isEditForm: true });
    openAdministrativeAreaForm();
  };

  /**
   * @function
   * @name handleRefreshAdmistrativeAreas
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshAdmistrativeAreas = () => {
    refreshAdministrativeAreas(
      () => {
        notifySuccess('Administrative Areas refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Administrative Areas please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple adminstrative Areas
   *
   * @param {object[]| object} administrativeAreas adminstrative Areas list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = administrativeAreas => {
    let message = '';
    if (isArray(administrativeAreas)) {
      const administrativeAreaList = administrativeAreas.map(
        administrativeArea =>
          `Name: ${administrativeArea.strings.name.en}\nDescription: ${
            // eslint-disable-line
            administrativeArea.strings.description.en
          }\n`
      );

      message = administrativeAreaList.join('\n\n\n');
    } else {
      message = `Name: ${administrativeAreas.strings.name.en}\nDescription: ${
        // eslint-disable-line
        administrativeAreas.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeAdministrativeAreasForm
   * @description close administrative areas form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAdministrativeAreasForm = () => {
    closeAdministrativeAreaForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify administrative areas
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
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event question
   *
   * @param item {object} eventQuestion to archive
   * @version 0.1.0
   * @since 0.1.0
   */

  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteAdministrativeArea(
          item._id, // eslint-disable-line
          () => notifySuccess('Administrative Area was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Administrative Area, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      administrativeAreas,
      administrativeArea,
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
      cached,
      notificationBody,
      showNotificationForm,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for administrative areas here ...',
            onChange: this.searchAdministrativeAreas,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Administrative Area',
              icon: 'plus',
              size: 'large',
              title: 'Add New Administrative Area',
              onClick: this.openAdministrativeAreaForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="administrative areas"
          items={administrativeAreas}
          page={page}
          itemCount={total}
          loading={loading}
          onShare={this.handleShare}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshAdmistrativeAreas}
          onPaginate={nextPage => paginateAdministrativeAreas(nextPage)}
          // generateExportUrl={getAdministrativeAreasFromAPI}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              name={item.strings.name.en}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Administrative Area',
                    title: 'Update Administrative Area Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Administrative Area',
                    title: 'Share Administrative Area details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Administrative Area',
                    title:
                      'Remove Administrative Area from list of active Administrative Areas',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                {item.strings.description ? item.strings.description.en : 'N/A'}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Administrative Areas"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* filter modal */}
        <Modal
          title="Filter Administrative Area"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <AdministrativeAreasFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

        {/* create/edit form modal */}
        <Modal
          title={
            isEditForm
              ? 'Edit Administrative Area'
              : 'Add New Administrative Area'
          }
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeAdministrativeAreaForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <AdministrativeAreaForm
            posting={posting}
            isEditForm={isEditForm}
            administrativeArea={administrativeArea}
            onCancel={this.closeAdministrativeAreaForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

AdministrativeAreas.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  administrativeAreas: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  administrativeArea: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

AdministrativeAreas.defaultProps = {
  administrativeArea: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeAreas, {
  administrativeAreas: 'administrativeAreas.list',
  administrativeArea: 'administrativeAreas.selected',
  loading: 'administrativeAreas.loading',
  posting: 'administrativeAreas.posting',
  page: 'administrativeAreas.page',
  showForm: 'administrativeAreas.showForm',
  total: 'administrativeAreas.total',
  searchQuery: 'administrativeAreas.q',
});
