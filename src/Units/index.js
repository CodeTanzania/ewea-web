import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getUnits,
  openUnitForm,
  searchUnits,
  selectUnit,
  closeUnitForm,
  refreshUnits,
  paginateUnits,
  deleteUnit,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Topbar from '../components/Topbar';
import UnitForm from './Form';
import NotificationForm from '../components/NotificationForm';
import ItemList from '../components/List';
import ListItem from '../components/ListItem';
import ListItemActions from '../components/ListItemActions';
import { notifyError, notifySuccess, truncateString } from '../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 4 };
const descriptionSpan = { xxl: 15, xl: 15, lg: 15, md: 14, sm: 9, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

const {
  getUnitsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name Units
 * @description Render Units list which have search box,
 * actions and units list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Units extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getUnits();
  }

  /**
   * @function
   * @name openUnitsForm
   * @description Open unit form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openUnitsForm = () => {
    openUnitForm();
  };

  /**
   * @function
   * @name closeUnitsForm
   * @description close unit form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeUnitsForm = () => {
    closeUnitForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchUnits
   * @description Search Units List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchUnits = (event) => {
    searchUnits(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventType unit to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventType) => {
    selectUnit(eventType);
    this.setState({ isEditForm: true });
    openUnitForm();
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
   * @name closeNotificationForm
   * @description Handle on notify units
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function
   * @name handleAfterCloseNotificationForm
   * @description Perform post close notification form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseNotificationForm = () => {
    this.setState({ notificationBody: undefined });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple units
   *
   * @param {object[]| object} units units list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (units) => {
    let message = '';
    if (isArray(units)) {
      const unitsList = units.map(
        (unit) =>
          `Name: ${unit.strings.name.en}\nDescription: ${
            // eslint-disable-line
            unit.strings.description.en
          }\n`
      );

      message = unitsList.join('\n\n\n');
    } else {
      message = `Name: ${units.strings.name.en}\nDescription: ${
        // eslint-disable-line
        units.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleRefreshUnits
   * @description Refresh Units list
   *
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshUnits = () =>
    refreshUnits(
      () => notifySuccess('Event groups refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event groups, please contact system administrator'
        )
    );

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a unit
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUnit(
          item._id, // eslint-disable-line
          () => notifySuccess('Event group was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event group, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      units,
      loading,
      page,
      posting,
      eventType,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, notificationBody, showNotificationForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for units here ...',
            onChange: this.searchUnits,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Unit',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Unit',
              onClick: this.openUnitsForm,
            },
          ]}
        />
        {/* end Topbar */}

        <ItemList
          itemName="Units"
          items={units}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          // onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshUnits}
          generateExportUrl={getUnitsExportUrl}
          onPaginate={(nextPage) => paginateUnits(nextPage)}
          headerLayout={headerLayout}
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
              avatarBackgroundColor={item.strings.color}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Unit',
                    title: 'Update Unit Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Unit',
                    title: 'Share Unit details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Unit',
                    title: 'Remove Unit from list of active units',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                <span title={item.strings.description.en}>
                  {truncateString(item.strings.description.en, 120)}
                </span>
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />

        {/* Notification Modal modal */}
        <Modal
          title="Notify Units"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
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

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Unit' : 'Add New Unit'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeUnitsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <UnitForm
            posting={posting}
            isEditForm={isEditForm}
            eventType={eventType}
            onCancel={this.closeUnitsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

Units.propTypes = {
  loading: PropTypes.bool.isRequired,
  units: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

Units.defaultProps = {
  eventType: null,
  searchQuery: undefined,
};

export default Connect(Units, {
  units: 'units.list',
  eventType: 'units.selected',
  loading: 'units.loading',
  posting: 'units.posting',
  page: 'units.page',
  showForm: 'units.showForm',
  total: 'units.total',
  searchQuery: 'units.q',
});
