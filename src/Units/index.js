import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import Topbar from '../components/Topbar';
import UnitForm from './Form';
import NotificationForm from '../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../util';
import ItemList from '../components/List';
import ListItem from '../components/ListItem';
import ListItemActions from '../components/ListItemActions';
import './styles.css';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getUnitsExportUrl,
} = httpActions;

/* state actions */
const {
  getUnits,
  openUnitForm,
  searchUnits,
  selectUnit,
  closeUnitForm,
  paginateUnits,
  refreshUnits,
  deleteUnit,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 16, xs: 14 };
const abbreviationSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 14, md: 13, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name', title: 'Unit Name' },
  { ...abbreviationSpan, header: 'Abbreviation', title: 'Unit Abbreviation' },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Unit Usage Description',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS = 'Units were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Units, please try again!';

/**
 * @function UnitList
 * @name UnitList
 * @description List units of measure
 * @param {object} props Valid list properties
 * @param {object} props.units Valid unit list
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show unit form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.unit Current selected unit object
 * @returns {object} UnitList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <UnitList />
 *
 */
class UnitList extends Component {
  /**
   * @function constructor
   * @name constructor
   * @description Initialize states
   * @param {object} props Valid component properties
   * @version 0.1.0
   * @since 0.1.0
   */
  constructor(props) {
    super(props);
    this.state = {
      isEditForm: false,
      showNotificationForm: false,
      notificationBody: undefined,
    };
  }

  /**
   * @function componentDidMount
   * @name componentDidMount
   * @description Load data
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  componentDidMount() {
    getUnits();
  }

  /**
   * @function handleFormOpen
   * @name handleFormOpen
   * @description Handle form opening
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFormOpen = () => {
    openUnitForm();
  };

  /**
   * @function handleFormClose
   * @name handleFormClose
   * @description Handle form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFormClose = () => {
    closeUnitForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function handleFormClose
   * @name handleFormClose
   * @description Handle post form close and perform cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterFormClose = () => {
    selectUnit(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function handleListSearch
   * @name handleListSearch
   * @description Handle list search
   * @param {object} event List search event
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListSearch = (event) => {
    searchUnits(event.target.value);
  };

  /**
   * @function handleListRefresh
   * @name handleListRefresh
   * @description Handle list refresh
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListRefresh = () => {
    refreshUnits(
      () => notifySuccess(MESSAGE_LIST_REFRESH_SUCCESS),
      () => notifyError(MESSAGE_LIST_REFRESH_ERROR)
    );
  };

  /**
   * @function handleItemEdit
   * @name handleItemEdit
   * @description Handle list item edit
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemEdit = (item) => {
    selectUnit(item);
    this.setState({ isEditForm: true });
    openUnitForm();
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a unit
   *
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */

  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUnit(
          item._id, // eslint-disable-line
          () => notifySuccess('Unit was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Unit, Please contact your system Administrator'
            )
        );
      },
    });
  };

  /**
   * @function
   * @name handleListShare
   * @description Handle share multiple event Indicators
   *
   * @param {object[]| object} units event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListShare = (units) => {
    let message = '';
    if (isArray(units)) {
      const unitList = units.map(
        (unit) =>
          `Name: ${unit.strings.name.en}\nDescription: ${
            // eslint-disable-line
            unit.strings.description.en
          }\n`
      );

      message = unitList.join('\n\n\n');
    } else {
      message = `Name: ${units.strings.name.en}\nDescription: ${
        // eslint-disable-line
        units.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function handleItemShare
   * @name handleItemShare
   * @description Handle list item edit
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemShare = (item) => {
    const message = `Name: ${item.strings.name.en}\nDescription: ${
      // eslint-disable-line
      item.strings.description.en
    }\n`;

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle notification form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleNotificationFormClose = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function render
   * @name render
   * @description Render list
   * @returns {object} List to render
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  render() {
    const {
      units,
      loading,
      page,
      posting,
      unit,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, showNotificationForm, notificationBody } = this.state;

    return (
      <>
        {/* start: list topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for units ...',
            title: 'Search for units ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Unit',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Unit',
              onClick: this.handleFormOpen,
            },
          ]}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="Unit"
          items={units}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.handleListFilter}
          onNotify={this.openNotificationForm}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={(nextPage) => paginateUnits(nextPage)}
          generateExportUrl={getUnitsExportUrl}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <>
              {/* start: list item */}
              <ListItem
                key={get(item, '_id')}
                item={item}
                name={item.strings.name.en}
                isSelected={isSelected}
                avatarBackgroundColor={item.strings.color}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                renderActions={() => (
                  <ListItemActions
                    edit={{
                      name: 'Edit Unit',
                      title: 'Update unit Details',
                      onClick: () => this.handleItemEdit(item),
                    }}
                    share={{
                      name: 'Share Unit',
                      title: 'Share unit details with others',
                      onClick: () => this.handleItemShare(item),
                    }}
                    archive={{
                      name: 'Archive Unit',
                      title: 'Remove unit from list of active units',
                      onClick: () => this.showArchiveConfirm(item),
                    }}
                  />
                )}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')}</Col>
                <Col {...abbreviationSpan}>
                  {get(item, 'strings.abbreviation.en', 'N/A')}
                </Col>
                <Col {...descriptionSpan}>
                  <span title={get(item, 'strings.description.en', 'N/A')}>
                    {truncateString(
                      get(item, 'strings.description.en', 'N/A'),
                      100
                    )}
                  </span>
                </Col>
                {/* eslint-enable react/jsx-props-no-spreading */}
              </ListItem>
              {/* end: list item */}
            </>
          )}
        />
        {/* end: list */}

        {/* start: notification modal */}
        <Modal
          title="Notify Unit"
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
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
            onCancel={this.handleNotificationFormClose}
          />
        </Modal>
        {/* end: notification modal */}

        {/* start: form modal */}
        <Modal
          title={isEditForm ? 'Edit Unit' : 'Add New Unit'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <UnitForm
            unit={unit}
            isPosting={posting}
            isEditForm={isEditForm}
            onCancel={this.handleFormClose}
          />
        </Modal>
        {/* end: form modal */}
      </>
    );
  }
}

UnitList.propTypes = {
  loading: PropTypes.bool.isRequired,
  units: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  unit: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

UnitList.defaultProps = {
  unit: null,
  searchQuery: undefined,
};

export default Connect(UnitList, {
  units: 'units.list',
  unit: 'units.selected',
  loading: 'units.loading',
  posting: 'units.posting',
  page: 'units.page',
  showForm: 'units.showForm',
  total: 'units.total',
  searchQuery: 'units.q',
});
