import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col, Drawer, Button } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import compact from 'lodash/compact';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import omit from 'lodash/omit';
import Topbar from '../../components/Topbar';
import CaseForm from './Form';
import CaseFollowupForm from './FollowupForm';
import CaseFiltersForm from './Filters';
import NotificationForm from '../../components/NotificationForm';
import {
  notifyError,
  notifySuccess,
  truncateString,
  shareDetailsFor,
} from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import CaseDetailsViewHeader from './DetailsView/Header';
import CaseDetailsViewBody from './DetailsView/Body';

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
const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const mobileSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 4, xs: 4 };
const genderSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const ageSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const nationalitySpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const areaSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const stageSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 0, xs: 0 };
const statusSpan = { xxl: 4, xl: 4, lg: 4, md: 2, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...numberSpan,
    header: 'Number',
    title: 'Unique Case Identification Number',
  },
  {
    ...nameSpan,
    header: 'Name',
    title: 'Victim/Patient Full Name',
  },
  {
    ...mobileSpan,
    header: 'Phone',
    title: 'Victim/Patient Mobile Phone Number',
  },
  {
    ...ageSpan,
    header: 'Age',
    title: 'Victim/Patient Age',
    style: { textAlign: 'center' },
  },
  {
    ...genderSpan,
    header: 'Gender',
    title: 'Victim/Patient Gender',
  },
  {
    ...nationalitySpan,
    header: 'Nationality',
    title: 'Victim/Patient Nationality',
  },
  { ...areaSpan, header: 'Area', title: 'Victim/Patient Residential Area' },
  {
    ...stageSpan,
    header: 'Stage',
    title: 'Case Stage/Classification',
  },
  {
    ...statusSpan,
    header: 'Status',
    title: 'Case Status',
  },
];

/* titles */
const MODAL_SHARE_TITLE = 'Share Cases';
const MODAL_FILTER_TITLE = 'Filter Cases';
const MODAL_FORM_FOLLOWUP_TITLE =
  'Case Followup - Victim/Patient Clinical Information';

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS = 'Cases were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Cases, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS = 'Case was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Case, Please try again!';

/* helpers */
const statusFor = (caze) => {
  const severity = upperFirst(get(caze, 'severity.strings.name.en'));
  const outcome = upperFirst(get(caze, 'followup.outcome'));
  const status = compact([severity, outcome]).join(', ');
  return status;
};

const statusColorFor = (caze) => {
  const follower = get(caze, 'followup.follower');
  const color = follower
    ? '#52c41a' /* verified */
    : '#f5222d'; /* not verified: danger */
  // : '#fa8c16'; /*not verified: warning*/
  return color;
};

/* fields */
const shareFields = {
  number: { header: 'Number', dataIndex: 'number' },
  name: { header: 'Name', dataIndex: 'victim.name' },
  phoneNumber: { header: 'Phone Number', dataIndex: 'victim.mobile' },
  age: { header: 'Age', dataIndex: 'victim.age' },
  gender: {
    header: 'Gender',
    dataIndex: 'victim.gender.strings.name.en',
  },
  nationality: {
    header: 'Nationality',
    dataIndex: 'victim.nationality.strings.name.en',
  },
  area: { header: 'Area', dataIndex: 'victim.area.strings.name.en' },
  stage: { header: 'Stage', dataIndex: 'stage.strings.name.en' },
  status: { header: 'Status', dataIndex: (item) => statusFor(item) },
};

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
      showDetailsView: false,
      isEditForm: false,
      showNotificationForm: false,
      notificationSubject: undefined,
      notificationBody: undefined,
      showFollowUpForm: false,
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
   * @param {...string} [keys] cache keys to clear
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnClearCache = (...keys) => {
    // clear specific keys
    if (keys) {
      const { cached: previousCached } = this.state;
      const values = omit({ ...previousCached }, ...keys);
      this.setState({ cached: values });
    }
    // clear all
    else {
      this.setState({ cached: null });
    }
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
    const notificationSubject = 'List of Cases';
    const notificationBody = shareDetailsFor(items, shareFields);
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
   * @function handleItemView
   * @name handleItemView
   * @description Handle list item view
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemView = (item) => {
    selectCase(item);
    this.setState({ showDetailsView: true });
  };

  /**
   * @function handleItemViewClose
   * @name handleItemViewClose
   * @description Handle close list item view
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemViewClose = () => {
    this.setState({ showDetailsView: false });
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
    const notificationSubject = 'List of Cases';
    const notificationBody = shareDetailsFor(item, shareFields);
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
   * @function handleAfterNotificationFormClose
   * @name handleAfterNotificationFormClose
   * @description Perform claeanups after close notification form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterNotificationFormClose = () => {
    this.setState({
      notificationSubject: undefined,
      notificationBody: undefined,
    });
  };

  /**
   * @function handleListFiltersFormOpen
   * @name handleListFiltersFormOpen
   * @description Handle filters form opening
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormOpen = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function handleListFiltersFormClose
   * @name handleListFiltersFormClose
   * @description Handle filters form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormClose = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function handleItemFollowup
   * @name handleItemFollowup
   * @description Handle list item followup
   * @param {object} item List item
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemFollowup = (item) => {
    selectCase(item);
    this.setState({ showFollowUpForm: true });
  };

  /**
   * @function handleFormClose
   * @name handleFormClose
   * @description Handle form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFollowupFormClose = () => {
    this.setState({ showFollowUpForm: false });
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
      showDetailsView,
      showNotificationForm,
      notificationSubject,
      notificationBody,
      showFollowUpForm,
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
          action={{
            label: 'New Case',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Case',
            onClick: this.handleFormOpen,
          }}
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
                avatarBackgroundColor={get(item, 'severity.strings.color')}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                title={
                  <Row>
                    <Col span={16}>
                      <span className="text-sm">
                        {get(item, 'number', 'N/A')}
                      </span>
                    </Col>
                    <Col span={6}>
                      <span className="text-xs">
                        {get(item, 'victim.mobile', 'N/A')}
                      </span>
                    </Col>
                  </Row>
                }
                secondaryText={
                  <span className="text-xs">
                    {get(item, 'victim.name', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'View Case',
                    title: 'View Case Details',
                    onClick: () => this.handleItemView(item),
                    icon: 'view',
                  },
                  {
                    name: 'Edit Case',
                    title: 'Update case details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Followup Case',
                    title: 'Followup on case',
                    onClick: () => this.handleItemFollowup(item),
                    icon: <ClockCircleOutlined />,
                  },
                  {
                    name: 'Share Case',
                    title: 'Share case details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...numberSpan}>
                  <Button
                    type="link"
                    onClick={() => this.handleItemView(item)}
                    style={{
                      padding: 0,
                      color: 'rgba(0, 0, 0, 0.65)',
                      whiteSpace: 'normal',
                      textAlign: 'left',
                      wordWrap: 'break-word',
                    }}
                  >
                    {get(item, 'number', 'N/A')}
                  </Button>
                </Col>
                <Col {...nameSpan}>
                  <span title={get(item, 'victim.name', 'N/A')}>
                    {truncateString(get(item, 'victim.name', 'N/A'))}
                  </span>
                </Col>
                <Col {...mobileSpan}>{get(item, 'victim.mobile', 'N/A')}</Col>
                <Col {...ageSpan} style={{ textAlign: 'center' }}>
                  {get(item, 'victim.age', 'N/A')}
                </Col>
                <Col {...genderSpan}>
                  {get(item, 'victim.gender.strings.name.en', 'N/A')}
                </Col>
                <Col {...nationalitySpan}>
                  <span
                    title={get(
                      item,
                      'victim.nationality.strings.name.en',
                      'N/A'
                    )}
                  >
                    {truncateString(
                      get(item, 'victim.nationality.strings.name.en', 'N/A')
                    )}
                  </span>
                </Col>
                <Col {...areaSpan}>
                  <span title={get(item, 'victim.area.strings.name.en', 'N/A')}>
                    {truncateString(
                      get(item, 'victim.area.strings.name.en', 'N/A')
                    )}
                  </span>
                </Col>
                <Col {...stageSpan}>
                  {get(item, 'stage.strings.name.en', 'N/A')}
                </Col>
                <Col {...statusSpan}>
                  <span
                    title={statusFor(item)}
                    style={{ color: statusColorFor(item) }}
                  >
                    {statusFor(item)}
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
          title={MODAL_SHARE_TITLE}
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterNotificationFormClose}
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
          title={MODAL_FILTER_TITLE}
          visible={showFilters}
          className="modal-window-80"
          footer={null}
          onCancel={this.handleListFiltersFormClose}
          destroyOnClose
          maskClosable={false}
        >
          <CaseFiltersForm
            cached={cached}
            onCache={this.handleOnCache}
            onClearCache={this.handleOnClearCache}
            onCancel={this.handleListFiltersFormClose}
          />
        </Modal>
        {/* end: filter modal */}

        {/* start: form modal */}
        <Modal
          visible={showForm}
          className="modal-window-80"
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
            cached={cached}
            onCache={this.handleOnCache}
            onClearCache={this.handleOnClearCache}
            onCancel={this.handleFormClose}
          />
        </Modal>
        {/* end: form modal */}

        {/* start: followup modal */}
        <Modal
          title={MODAL_FORM_FOLLOWUP_TITLE}
          visible={showFollowUpForm}
          className="modal-window-80"
          footer={null}
          onCancel={this.handleFollowupFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <CaseFollowupForm
            caze={caze}
            posting={posting}
            onCancel={this.handleFollowupFormClose}
          />
        </Modal>
        {/* end: followup modal */}

        {/* start: case details view */}
        <Drawer
          title={
            <CaseDetailsViewHeader
              number={get(caze, 'number', 'N/A')}
              phone={get(caze, 'victim.mobile', 'N/A')}
              onBack={this.handleItemViewClose}
            />
          }
          placement="right"
          width="100%"
          drawerStyle={{ overflow: 'hidden' }}
          headerStyle={{ padding: 0 }}
          bodyStyle={{ overflow: 'hidden', height: '100%', padding: '15px' }}
          visible={showDetailsView}
          onClose={this.handleItemViewClose}
          destroyOnClose
        >
          <CaseDetailsViewBody data={caze} />
        </Drawer>
        {/* end: case details view */}
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
