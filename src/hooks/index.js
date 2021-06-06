import { useState, useEffect } from 'react';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import { pluralize, singularize } from 'inflection';
import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';

import {
  generateFeedbackMessagesFor,
  notifyError,
  notifySuccess,
  shareDetailsFor,
} from '../util';

/* ui */
const { confirm } = Modal;

/**
 * @function
 * @name useFilters
 * @description Custom hook for controlling filters. It store filter states
 * and control visibility of filter form for dashboards
 * @param {object} defaultFilters Default filters to be used
 * @returns {object} Returns functions and state variables for filters
 * @version 0.1.0
 * @since 0.1.0
 */
export const useFilters = (defaultFilters) => {
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [showFilters, setShowFilters] = useState(false);

  return {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
  };
};

/**
 * @function
 * @name useList
 * @description Custom hook for list which bundles all common local states
 * needed for a list component to function
 * @param  {string} resourceName name used for creating special resource handler
 * functions
 * @param {object} [options] Additional options
 * @returns {object} map of exported state value and functions
 * @version 0.3.0
 * @since 0.1.0
 */
export const useList = (resourceName, options) => {
  const nameForMessages = get(options, 'wellknown', resourceName);
  const singularName = upperFirst(singularize(resourceName));
  const pluralName = upperFirst(pluralize(resourceName));
  const {
    MESSAGE_LIST_REFRESH_ERROR,
    MESSAGE_LIST_REFRESH_SUCCESS,
    MESSAGE_ITEM_ARCHIVE_ERROR,
    MESSAGE_ITEM_ARCHIVE_SUCCESS,
    MESSAGE_ITEM_CREATE_ERROR,
    MESSAGE_ITEM_CREATE_SUCCESS,
    MESSAGE_ITEM_UPDATE_ERROR,
    MESSAGE_ITEM_UPDATE_SUCCESS,
  } = generateFeedbackMessagesFor(nameForMessages);
  const [showFilters, setShowFilters] = useState(false);
  const [showView, setShowView] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notificationSubject, setNotificationSubject] = useState();
  const [notificationBody, setNotificationBody] = useState();
  const [cachedValues, setCachedValues] = useState(null);

  useEffect(() => {
    reduxActions[`get${pluralName}`]();
  }, [pluralName]);

  /**
   * @function
   * @name handleOnView
   * @description Handle event for showing details view for selected item
   * @param {object} item Item to show details view for
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnView = (item) => {
    reduxActions[`select${singularName}`](item);
    setShowView(true);
  };

  /**
   * @function
   * @name handleOnCloseView
   * @description Handle event to close details view
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCloseView = () => {
    setShowView(false);
  };

  /**
   * @function
   * @name handleOnCacheValues
   * @description Cached selected values for filters
   * @param {object} newValues values to be cached
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCacheValues = (newValues) => {
    const values = { ...cachedValues, newValues };
    setCachedValues(values);
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnClearCachedValues = () => {
    setCachedValues(null);
  };

  /**
   * @function
   * @name handleOnOpenFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnOpenFiltersModal = () => {
    setShowFilters(true);
  };

  /**
   * @function
   * @name handleOnCloseFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCloseFiltersModal = () => {
    setShowFilters(false);
  };

  /**
   * @function
   * @name handleOnOpenForm
   * @description handle on open form event
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnOpenForm = () => {
    reduxActions[`open${singularName}Form`]();
  };

  /**
   * @function
   * @name handleOnCloseForm
   * @description handle onClose form event
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCloseForm = () => {
    reduxActions[`close${singularName}Form`]();
    setIsEditForm(false);
  };

  /**
   * @function
   * @name handleOnSearch
   * @description handle onSearch item on the list based on supplied filter word
   * @param {object} event Input event object
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnSearch = (event) => {
    reduxActions[`search${pluralName}`](event.target.value);
  };

  /**
   * @function
   * @name handleOnEdit
   * @description Handle on Edit action for list item
   * @param {object} item item to be edited
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnEdit = (item) => {
    reduxActions[`select${singularName}`](item);
    setIsEditForm(true);
    handleOnOpenForm();
  };

  /**
   * @function
   * @name handleOnOpenNotificationForm
   * @description Handle open notification form event
   * @param {object[]} items List of item selected to used in notification form
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnOpenNotificationForm = (items) => {
    setSelectedItems(items);
    setShowNotificationForm(true);
  };

  /**
   * @function
   * @name handleOnCloseNotificationForm
   * @description Handle on close notification form event
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCloseNotificationForm = () => {
    setShowNotificationForm(false);
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleAfterCloseForm = () => {
    reduxActions[`select${singularName}`](null);
    setIsEditForm(false);
  };

  /**
   * @function
   * @name handleAfterCloseNotificationForm
   * @description Perform post close notification form cleanups
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleAfterCloseNotificationForm = () => {
    setNotificationSubject(undefined);
    setNotificationBody(undefined);
  };

  /**
   * @function
   * @name handleOnRefreshList
   * @description Handle list refresh action
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnRefreshList = () => {
    reduxActions[`refresh${pluralName}`](
      () => {
        notifySuccess(MESSAGE_LIST_REFRESH_SUCCESS);
      },
      () => {
        notifyError(MESSAGE_LIST_REFRESH_ERROR);
      }
    );
  };

  /**
   * @function
   * @name handleOnArchiveItem
   * @description show confirm modal before archiving a focal person
   * @param {object} item Resource item to be archived
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnArchiveItem = (item) => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return new Promise((resolve) => {
          reduxActions[`delete${singularName}`](
            item._id, // eslint-disable-line
            () => {
              resolve();
              notifySuccess(MESSAGE_ITEM_ARCHIVE_SUCCESS);
            },
            () => {
              resolve();
              notifyError(MESSAGE_ITEM_ARCHIVE_ERROR);
            }
          );
        });
      },
    });
  };

  /**
   * @function
   * @name handleOnCreateItem
   * @description Handle on create item event
   * @param {object} item item to be created
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCreateItem = (item) => {
    reduxActions[`post${singularName}`](
      item,
      () => {
        notifySuccess(MESSAGE_ITEM_CREATE_SUCCESS);
      },
      () => {
        notifyError(MESSAGE_ITEM_CREATE_ERROR);
      }
    );
  };

  /**
   * @function
   * @name handleOnUpdateItem
   * @description Handle on update item event
   * @param {object} item item to be created
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnUpdateItem = (item) => {
    reduxActions[`put${singularName}`](
      item,
      () => {
        notifySuccess(MESSAGE_ITEM_UPDATE_SUCCESS);
      },
      () => {
        notifyError(MESSAGE_ITEM_UPDATE_ERROR);
      }
    );
  };

  /**
   * @function
   * @name handleOnShare
   * @description handle on share item(s) event
   * @param {object[]} items items to be shared
   * @param {string[]} fields fields from items that are to be shared
   * @param {string} [subject] subject for notification form
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnShare = (items, fields, subject = '') => {
    const message = shareDetailsFor(items, fields);

    setNotificationBody(message);
    setNotificationSubject(subject);
    setShowNotificationForm(true);
  };

  /**
   * @function
   * @name handleOnShare
   * @description handle on share item(s) event
   * @param {object[]} items items to be shared
   * @param {string[]} fields fields from items that are to be shared
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleShareOnWhatsApp = (items, fields) => {
    const message = shareDetailsFor(items, fields);
    // eslint-disable-next-line
    window.open(`https://wa.me/?text=${encodeURI(message)}`, '_blank');
  };

  /**
   * @function
   * @name handleOnPaginate
   * @description Handle on paginate events
   * @param {number} nextPage Next page to paginate to
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnPaginate = (nextPage) => {
    reduxActions[`paginate${pluralName}`](nextPage);
  };

  return {
    showView,
    showFilters,
    setShowFilters,
    isEditForm,
    setIsEditForm,
    showNotificationForm,
    setShowNotificationForm,
    selectedItems,
    setSelectedItems,
    notificationSubject,
    setNotificationSubject,
    notificationBody,
    setNotificationBody,
    cachedValues,
    setCachedValues,

    handleAfterCloseForm,
    handleAfterCloseNotificationForm,
    handleOnArchiveItem,
    handleOnCacheValues,
    handleOnClearCachedValues,
    handleOnCloseFiltersModal,
    handleOnCloseForm,
    handleOnCloseNotificationForm,
    handleOnCloseView,
    handleOnCreateItem,
    handleOnEdit,
    handleOnOpenFiltersModal,
    handleOnOpenForm,
    handleOnOpenNotificationForm,
    handleOnPaginate,
    handleOnRefreshList,
    handleOnSearch,
    handleOnShare,
    handleOnUpdateItem,
    handleOnView,
    handleShareOnWhatsApp,
  };
};
