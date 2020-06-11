import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Topbar from '../../components/Topbar';
import EventFunctionForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getEventFunctionsExportUrl,
} = httpActions;

/* state actions */
const {
  getEventFunctions,
  openEventFunctionForm,
  searchEventFunctions,
  selectEventFunction,
  closeEventFunctionForm,
  paginateEventFunctions,
  refreshEventFunctions,
  deleteEventFunction,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const numberSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 };
const nameSpan = { xxl: 6, xl: 6, lg: 6, md: 6, sm: 16, xs: 14 };
const groupsSpan = { xxl: 12, xl: 12, lg: 12, md: 10, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...numberSpan,
    header: 'Number',
    title: 'Emergency Function Number',
  },
  {
    ...codeSpan,
    header: 'Code',
    title: 'Emergency Function Code',
  },
  { ...nameSpan, header: 'Name', title: 'Emergency Function Name' },
  {
    ...groupsSpan,
    header: 'Group/Agencies',
    title: 'Emergency Function Lead and Supporting Agencies',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS =
  'Emergency Functions were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Emergency Functions, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS =
  'Emergency Function was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Emergency Function, Please try again!';

/* helpers */
const getGroupsFor = (item) => {
  const groups = [].concat(get(item, 'relations.groups', []));
  if (isEmpty(groups)) {
    return 'N/A';
  }
  const joinedGroups = map(groups, (group) => {
    return get(group, 'strings.name.en', '');
  }).join(', ');
  return joinedGroups;
};

/**
 * @function EventFunctionList
 * @name EventFunctionList
 * @description List emergency functions
 * @param {object} props Valid list properties
 * @param {object} props.eventFunctions Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show emergency function form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.eventFunction Current selected list item
 * @returns {object} EventFunctionList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <EventFunctionList />
 *
 */
class EventFunctionList extends Component {
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
    getEventFunctions();
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
    searchEventFunctions(event.target.value);
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
    refreshEventFunctions(
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
    paginateEventFunctions(nextPage);
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
    const itemList = sortBy([].concat(items), 'numbers.weight');

    const notificationSubject = 'List of Emergency Functions';
    const notificationBody = itemList
      .map((item) => {
        const itemNumber = get(item, 'numbers.weight', 'N/A');
        const itemCode = get(item, 'strings.code', 'N/A');
        const itemName = get(item, 'strings.name.en', 'N/A');
        const itemGroups = getGroupsFor(item);
        const itemDescription = get(item, 'strings.description.en', 'N/A');
        const body = `Number: ${itemNumber}\nCode: ${itemCode}\nName: ${itemName}\nLead and Supporting Agencies: ${itemGroups}\nDescription: ${itemDescription}\n`;
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
    openEventFunctionForm();
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
    closeEventFunctionForm();
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
    selectEventFunction(null);
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
    selectEventFunction(item);
    this.setState({ isEditForm: true });
    openEventFunctionForm();
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
        deleteEventFunction(
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
    const itemNumber = get(item, 'numbers.weight', 'N/A');
    const itemCode = get(item, 'strings.code', 'N/A');
    const itemName = get(item, 'strings.name.en', 'N/A');
    const itemGroups = getGroupsFor(item);
    const itemDescription = get(item, 'strings.description.en', 'N/A');
    const notificationBody = `Number: ${itemNumber}\nCode: ${itemCode}\nName: ${itemName}\nLead and Supporting Agencies: ${itemGroups}\nDescription: ${itemDescription}\n`;

    const notificationSubject = 'List of Emergency Functions';
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
      eventFunctions,
      loading,
      page,
      posting,
      eventFunction,
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
            placeholder: 'Search emergency functions ...',
            title: 'Search emergency functions ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          action={{
            label: 'New Function',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Emergency Function',
            onClick: this.handleFormOpen,
          }}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="EmergencyFunction"
          items={eventFunctions}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
          generateExportUrl={getEventFunctionsExportUrl}
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
                    <Col span={20}>
                      <span className="text-sm">
                        {get(item, 'strings.name.en', 'N/A')}
                      </span>
                    </Col>
                    <Col span={2}>
                      <span className="text-xs">
                        {get(item, 'numbers.weight', 'N/A')}
                      </span>
                    </Col>
                  </Row>
                }
                secondaryText={
                  <span className="text-xs">
                    {get(item, 'strings.code', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'Edit Emergency Function',
                    title: 'Update emergency function details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Emergency Function',
                    title: 'Share emergency function details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive Emergency Function',
                    title:
                      'Remove emergency function from list of active emergency functions',
                    onClick: () => this.handleItemArchive(item),
                    icon: 'archive',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...numberSpan}>{get(item, 'numbers.weight', 'N/A')}</Col>
                <Col {...codeSpan}>{get(item, 'strings.code', 'N/A')}</Col>
                <Col {...nameSpan}>
                  <span
                    title={get(
                      item,
                      'strings.description.en',
                      get(item, 'strings.name.en', 'N/A')
                    )}
                  >
                    {get(item, 'strings.name.en', 'N/A')}
                  </span>
                </Col>
                <Col {...groupsSpan}>
                  <span title={getGroupsFor(item)}>
                    {truncateString(getGroupsFor(item), 100)}
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
          title="Share Emergency Functions"
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
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
          title={
            isEditForm
              ? 'Edit Emergency Function'
              : 'Add New Emergency Function'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <EventFunctionForm
            eventFunction={eventFunction}
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

EventFunctionList.propTypes = {
  eventFunctions: PropTypes.arrayOf(
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
  eventFunction: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

EventFunctionList.defaultProps = {
  eventFunction: null,
  searchQuery: undefined,
};

export default Connect(EventFunctionList, {
  eventFunctions: 'eventFunctions.list',
  loading: 'eventFunctions.loading',
  posting: 'eventFunctions.posting',
  searchQuery: 'eventFunctions.q',
  showForm: 'eventFunctions.showForm',
  page: 'eventFunctions.page',
  total: 'eventFunctions.total',
  eventFunction: 'eventFunctions.selected',
});
