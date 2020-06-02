import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import CaseForm from './Form';
import CaseFiltersForm from './Filters';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import './styles.css';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getCasesExportUrl,
} = httpActions;

/* state actions */
const {
  getCases,
  openCaseForm,
  searchCases,
  selectCase,
  closeCaseForm,
  paginateCases,
  refreshCases,
  deleteCase,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const numberSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 16, xs: 14 };
const mobileSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 4 };
const genderSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const ageSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const areaSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const severitySpan = { xxl: 6, xl: 6, lg: 6, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...numberSpan,
    header: 'Number',
    title: 'Unique Case Identification Number',
  },
  {
    ...mobileSpan,
    header: 'Phone',
    title: 'Victim/Patient Mobile Phone Number',
  },
  {
    ...genderSpan,
    header: 'Gender',
    title: 'Victim/Patient Gender',
  },
  {
    ...ageSpan,
    header: 'Age',
    title: 'Victim/Patient Age',
  },
  { ...areaSpan, header: 'Area', title: 'Victim/Patient Residential Area' },
  {
    ...severitySpan,
    header: 'Severity',
    title: 'Case Severity',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS = 'Cases were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Cases, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS = 'Case was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Case, Please try again!';

/**
 * @function CaseList
 * @name CaseList
 * @description List cases
 * @param {object} props Valid list properties
 * @param {object} props.cases Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show case form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.case Current selected list item
 * @returns {object} CaseList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <CaseList />
 *
 */
class CaseList extends Component {
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
      showFilters: false,
      isEditForm: false,
      showNotificationForm: false,
      notificationSubject: undefined,
      notificationBody: undefined,
      cached: null,
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
    getCases();
  }

  /**
   * @function handleOnCache
   * @name handleOnCache
   * @description Handle updating cache
   * @param {object} cached values cached
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCache = (cached) => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function handleOnClearCache
   * @name handleOnClearCache
   * @description Handle clearing cache
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnClearCache = () => {
    // TODO: support keys to clear specific cached value
    this.setState({ cached: null });
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
    searchCases(event.target.value);
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
    refreshCases(
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
    paginateCases(nextPage);
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

    const notificationSubject = 'List of Cases';
    const notificationBody = itemList
      .map((item) => {
        const itemNumber = get(item, 'number', 'N/A');
        const itemGender = get(item, 'victim.gender.strings.name.en', 'N/A');
        const itemArea = get(item, 'victim.area.strings.name.en', 'N/A');
        const itemDescription = get(item, 'description', 'N/A');
        const body = `Number: ${itemNumber}\nGender: ${itemGender}\nArea: ${itemArea}\nDescription: ${itemDescription}\n`;
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
    openCaseForm();
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
    closeCaseForm();
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
    selectCase(null);
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
    selectCase(item);
    this.setState({ isEditForm: true });
    openCaseForm();
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
    const itemName = get(item, 'number', 'N/A');
    const itemId = get(item, '_id');

    confirm({
      title: `Are you sure you want to archive ${itemName} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCase(
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
    const itemNumber = get(item, 'number', 'N/A');
    const itemGender = get(item, 'victim.gender.strings.name.en', 'N/A');
    const itemArea = get(item, 'victim.area.strings.name.en', 'N/A');
    const itemDescription = get(item, 'description', 'N/A');
    const notificationSubject = 'List of Cases';
    const notificationBody = `Number: ${itemNumber}\nGender: ${itemGender}\nArea: ${itemArea}\nDescription: ${itemDescription}\n`;
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
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle filters form opening
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormOpen = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle filters form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormClose = () => {
    this.setState({ showFilters: false });
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
      cases,
      loading,
      page,
      posting,
      caze,
      showForm,
      searchQuery,
      total,
    } = this.props;

    // states
    const {
      showFilters,
      cached,
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
            placeholder: 'Search cases ...',
            title: 'Search cases ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Case',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Case',
              onClick: this.handleFormOpen,
            },
          ]}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="Case"
          items={cases}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
          generateExportUrl={getCasesExportUrl}
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
                name={get(item, 'victim.name')}
                isSelected={isSelected}
                avatarBackgroundColor={get(item, 'victim.gender.strings.color')}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                renderActions={() => (
                  <ListItemActions
                    edit={{
                      name: 'Edit Case',
                      title: 'Update case details',
                      onClick: () => this.handleItemEdit(item),
                    }}
                    share={{
                      name: 'Share Case',
                      title: 'Share case details with others',
                      onClick: () => this.handleItemShare(item),
                    }}
                    archive={{
                      name: 'Archive Case',
                      title: 'Remove case from list of active cases',
                      onClick: () => this.handleItemArchive(item),
                    }}
                  />
                )}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...numberSpan}>{get(item, 'number', 'N/A')}</Col>
                <Col {...mobileSpan}>{get(item, 'victim.mobile', 'N/A')}</Col>
                <Col {...genderSpan}>
                  {get(item, 'victim.gender.strings.name.en', 'N/A')}
                </Col>
                <Col {...ageSpan}>{get(item, 'victim.age', 'N/A')}</Col>
                <Col {...areaSpan}>
                  {get(item, 'victim.area.strings.name.en', 'N/A')}
                </Col>
                <Col {...severitySpan}>
                  {get(item, 'status.strings.name.en', 'N/A')}
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
          title="Share Cases"
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
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.handleNotificationFormClose}
          />
        </Modal>
        {/* end: notification modal */}

        {/* start: filter modal */}
        <Modal
          title="Filter Cases"
          visible={showFilters}
          className="FormModal"
          footer={null}
          onCancel={this.handleListFiltersFormClose}
          destroyOnClose
          maskClosable={false}
        >
          <CaseFiltersForm
            cached={cached}
            onCache={this.handleOnCache}
            onCancel={this.handleListFiltersFormClose}
            onClearCache={this.handleOnClearCache}
          />
        </Modal>
        {/* end: filter modal */}

        {/* start: form modal */}
        <Modal
          title={isEditForm ? 'Edit Case' : 'Add New Case'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <CaseForm
            caze={caze}
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

CaseList.propTypes = {
  cases: PropTypes.arrayOf(
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
  caze: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

CaseList.defaultProps = {
  caze: null,
  searchQuery: undefined,
};

export default Connect(CaseList, {
  cases: 'cases.list',
  loading: 'cases.loading',
  posting: 'cases.posting',
  searchQuery: 'cases.q',
  showForm: 'cases.showForm',
  page: 'cases.page',
  total: 'cases.total',
  caze: 'cases.selected',
});
