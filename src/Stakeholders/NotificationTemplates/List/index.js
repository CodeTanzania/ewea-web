import { httpActions } from '@codetanzania/ewea-api-client';
import {
  deleteNotificationTemplate,
  paginateNotificationTemplates,
  refreshNotificationTemplates,
} from '@codetanzania/ewea-api-states';
import { List } from 'antd';
import concat from 'lodash/concat';
import intersectionBy from 'lodash/intersectionBy';
import map from 'lodash/map';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListHeader from '../../../components/ListHeader';
import Toolbar from '../../../components/Toolbar';
import { notifyError, notifySuccess } from '../../../util';
import NotificationTemplatesListItem from '../ListItem';

/* constants */
const nameSpan = { xxl: 7, xl: 8, lg: 6, md: 8, sm: 10, xs: 10 };
const descriptionSpan = { xxl: 10, xl: 10, lg: 6, md: 8, sm: 0, xs: 0 };
const codeSpan = { xxl: 4, xl: 3, lg: 6, md: 0, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
  { ...codeSpan, header: 'Code' },
];
const { getNotificationTemplatesExportUrl } = httpActions;

/**
 * @class
 * @name NotificationTemplatesList
 * @description Render NotificationTemplatesList component which have actionBar, Notification Template
 * header and Notification Template list components
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplatesList extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedNotificationTemplates: [],
    selectedPages: [],
  };

  /**
   * @function
   * @name handleOnSelectNotificationtionTemplate
   * @description Handle select a single Notification Template action
   *
   * @param {object} notificationTemplate selected Notification Template object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnSelectNotificationTemplate = notificationTemplate => {
    const { selectedNotificationTemplates } = this.state;
    this.setState({
      selectedNotificationTemplates: concat(
        [],
        selectedNotificationTemplates,
        notificationTemplate
      ),
    });
  };

  /**
   * @function
   * @name handleSelectAll
   * @description Handle select all Notification templates actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSelectAll = () => {
    const { selectedNotificationTemplates, selectedPages } = this.state;
    const { notificationTemplates, page } = this.props;
    const selectedList = uniqBy(
      [...selectedNotificationTemplates, ...notificationTemplates],
      '_id'
    );
    const pages = uniq([...selectedPages, page]);
    this.setState({
      selectedNotificationTemplates: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleDeselectAll
   * @description Handle deselect all Notification templates in a current page
   *
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleDeselectAll = () => {
    const { notificationTemplates, page } = this.props;
    const { selectedNotificationTemplates, selectedPages } = this.state;
    const selectedList = uniqBy([...selectedNotificationTemplates], '_id');
    const pages = uniq([...selectedPages]);

    remove(pages, item => item === page);

    notificationTemplates.forEach(notificationTemplate => {
      remove(
        selectedList,
        item => item._id === notificationTemplate._id // eslint-disable-line
      );
    });

    this.setState({
      selectedNotificationTemplates: selectedList,
      selectedPages: pages,
    });
  };

  /**
   * @function
   * @name handleFilterByStatus
   * @description Handle filter focalPeople by status action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFilterByStatus = () => {
    // if (status === 'All') {
    //   filter({});
    // } else if (status === 'Active') {
    //   filter({});
    // } else if (status === 'Archived') {
    //   filter({});
    // }
  };

  /**
   * @function
   * @name handleOnDeselectNotificationTemplate
   * @description Handle deselect a single NotificationTemplate action
   *
   * @param {object} notificationTemplates NotificationTemplate to be removed from selected NotificationTemplates
   * @returns {undefined} undefined
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnDeselectNotificationTemplate = notificationTemplates => {
    const { selectedNotificationTemplates } = this.state;
    const selectedList = [...selectedNotificationTemplates];

    remove(
      selectedList,
      item => item._id === notificationTemplates._id // eslint-disable-line
    );

    this.setState({ selectedNotificationTemplates: selectedList });
  };

  render() {
    const {
      notificationTemplates,
      loading,
      page,
      total,
      onEdit,
      onFilter,
      // onNotify,
      onShare,
      // onBulkShare,
    } = this.props;
    const { selectedNotificationTemplates, selectedPages } = this.state;
    const selectedNotificationTemplatesCount = intersectionBy(
      selectedNotificationTemplates,
      notificationTemplates,
      '_id'
    ).length;

    return (
      <>
        {/* toolbar */}
        <Toolbar
          itemName="Notification Template"
          page={page}
          total={total}
          selectedItemsCount={selectedNotificationTemplatesCount}
          exportUrl={getNotificationTemplatesExportUrl({
            filter: { _id: map(selectedNotificationTemplates, '_id') },
          })}
          onFilter={onFilter}
          // onNotify={() => onNotify(selectedNotificationTemplates)}
          onPaginate={nextPage => {
            paginateNotificationTemplates(nextPage);
          }}
          onRefresh={() =>
            refreshNotificationTemplates(
              () => {
                notifySuccess('Notification Template refreshed successfully');
              },
              () => {
                notifyError(
                  'An Error occurred while refreshing Notification Template please contact system administrator'
                );
              }
            )
          }
          // onShare={() => onBulkShare(selectedNotificationTemplates)}
        />
        {/* end toolbar */}

        {/* focalPerson list header */}
        <ListHeader
          headerLayout={headerLayout}
          onSelectAll={this.handleSelectAll}
          onDeselectAll={this.handleDeselectAll}
          isBulkSelected={selectedPages.includes(page)}
        />
        {/* end focalPerson list header */}

        {/* focalPeople list */}
        <List
          loading={loading}
          dataSource={notificationTemplates}
          renderItem={notificationTemplate => (
            <NotificationTemplatesListItem
              key={notificationTemplate._id} // eslint-disable-line
              name={notificationTemplate.strings.name.en}
              description={notificationTemplate.strings.description.en}
              code={notificationTemplate.strings.code}
              isSelected={
                // eslint-disable-next-line
                map(selectedNotificationTemplates, item => item._id).includes(
                  notificationTemplate._id // eslint-disable-line
                )
              }
              onSelectItem={() => {
                this.handleOnSelectNotificationTemplate(notificationTemplate);
              }}
              onDeselectItem={() => {
                this.handleOnDeselectNotificationTemplate(notificationTemplate);
              }}
              onEdit={() => onEdit(notificationTemplate)}
              onArchive={() =>
                deleteNotificationTemplate(
                  notificationTemplate._id, // eslint-disable-line
                  () => {
                    notifySuccess(
                      'Notification Template was archived successfully'
                    );
                  },
                  () => {
                    notifyError(
                      'An Error occurred while archiving Notification Template please contact system administrator'
                    );
                  }
                )
              }
              onShare={() => {
                onShare(notificationTemplate);
              }}
            />
          )}
        />
        {/* end focalPeople list */}
      </>
    );
  }
}

NotificationTemplatesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  notificationTemplates: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  // onNotify: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  // onBulkShare: PropTypes.func.isRequired,
};

export default NotificationTemplatesList;
