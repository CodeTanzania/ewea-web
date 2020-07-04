import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../components/Topbar';
import UnitForm from './Form';
import NotificationForm from '../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../util';
import ItemList from '../components/List';
import ListItem from '../components/ListItem';

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
const nameSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 16, xs: 14 };
const abbreviationSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 4, xs: 4 };
const symbolSpan = { xxl: 4, xl: 3, lg: 4, md: 4, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 10, xl: 10, lg: 10, md: 8, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name', title: 'Unit Name' },
  { ...abbreviationSpan, header: 'Abbreviation', title: 'Unit Abbreviation' },
  { ...symbolSpan, header: 'Symbol', title: 'Unit Symbol' },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Unit Usage Description',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS = 'Units were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Units, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS = 'Unit was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Unit, Please try again!';

/**
 * @function UnitList
 * @name UnitList
 * @description List units of measure
 * @param {object} props Valid list properties
 * @param {object} props.units Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show unit form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.unit Current selected list item
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
      notificationSubject: undefined,
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
   * @function handleListPaginate
   * @name handleListPaginate
   * @description Handle list paginate
   * @param {number} nextPage List next page number
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListPaginate = (nextPage) => {
    paginateUnits(nextPage);
  };

  /**
   * @function handleListShare
   * @name handleListShare
   * @description Handle list sharing
   * @param {object[]} items List of items
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListShare = (items) => {
    const itemList = [].concat(items);

    const notificationSubject = 'List of Units';
    const notificationBody = itemList
      .map((item) => {
        const itemName = get(item, 'strings.name.en', 'N/A');
        const itemAbbreviation = get(item, 'strings.abbreviation.en', 'N/A');
        const itemSymbol = get(item, 'strings.symbol', 'N/A');
        const itemDescription = get(item, 'strings.description.en', 'N/A');
        const body = `Name: ${itemName}\nAbbreviation: ${itemAbbreviation}\nSymbol: ${itemSymbol}\nDescription: ${itemDescription}\n`;
        return body;
      })
      .join('\n');
    const showNotificationForm = true;

    this.setState({
      notificationSubject,
      notificationBody,
      showNotificationForm,
    });
  };

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
   * @function handleItemArchive
   * @name handleItemArchive
   * @description Handle list item archiving with confirmation
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemArchive = (item) => {
    const itemId = get(item, '_id');
    const itemName = get(item, 'strings.name.en', 'N/A');
    confirm({
      title: `Are you sure you want to archive ${itemName} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUnit(
          itemId,
          () => notifySuccess(MESSAGE_ITEM_ARCHIVE_SUCCESS),
          () => notifyError(MESSAGE_ITEM_ARCHIVE_ERROR)
        );
      },
    });
  };

  /**
   * @function handleItemShare
   * @name handleItemShare
   * @description Handle list item sharing
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemShare = (item) => {
    const itemName = get(item, 'strings.name.en', 'N/A');
    const itemAbbreviation = get(item, 'strings.abbreviation.en', 'N/A');
    const itemSymbol = get(item, 'strings.symbol', 'N/A');
    const itemDescription = get(item, 'strings.description.en', 'N/A');

    const notificationSubject = 'List of Units';
    const notificationBody = `Name: ${itemName}\nAbbreviation: ${itemAbbreviation}\nSymbol: ${itemSymbol}\nDescription: ${itemDescription}\n`;
    const showNotificationForm = true;

    this.setState({
      notificationSubject,
      notificationBody,
      showNotificationForm,
    });
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
    // props
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

    // states
    const {
      isEditForm,
      showNotificationForm,
      notificationSubject,
      notificationBody,
    } = this.state;

    return (
      <>
        {/* start: list topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search units ...',
            title: 'Search units ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          action={{
            label: 'New Unit',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Unit',
            onClick: this.handleFormOpen,
          }}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="Unit"
          items={units}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
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
                name={get(item, 'strings.name.en')}
                isSelected={isSelected}
                avatarBackgroundColor={get(item, 'strings.color')}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                title={
                  <Row>
                    <Col span={16}>
                      <span className="text-sm">
                        {get(item, 'strings.name.en', 'N/A')}
                      </span>
                    </Col>
                    <Col span={6}>
                      <span className="text-xs">
                        {get(item, 'strings.symbol', 'N/A')}
                      </span>
                    </Col>
                  </Row>
                }
                secondaryText={
                  <span className="text-xs">
                    {get(item, 'strings.description.en', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'Edit Unit',
                    title: 'Update unit details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Unit',
                    title: 'Share unit details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive Unit',
                    title: 'Remove unit from list of active units',
                    onClick: () => this.handleItemArchive(item),
                    icon: 'archive',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')}</Col>
                <Col {...abbreviationSpan}>
                  {get(item, 'strings.abbreviation.en', 'N/A')}
                </Col>
                <Col {...symbolSpan}>{get(item, 'strings.symbol', 'N/A')}</Col>
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
          title="Share Units"
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.handleNotificationFormClose}
          />
        </Modal>
        {/* end: notification modal */}

        {/* start: form modal */}
        <Modal
          title={isEditForm ? 'Edit Unit' : 'Add New Unit'}
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <UnitForm
            unit={unit}
            posting={posting}
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
  units: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  showForm: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

UnitList.defaultProps = {
  unit: null,
  searchQuery: undefined,
};

export default Connect(UnitList, {
  units: 'units.list',
  loading: 'units.loading',
  posting: 'units.posting',
  searchQuery: 'units.q',
  showForm: 'units.showForm',
  page: 'units.page',
  total: 'units.total',
  unit: 'units.selected',
});
