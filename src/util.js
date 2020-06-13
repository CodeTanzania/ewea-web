import { message } from 'antd';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';
import merge from 'lodash/merge';
import startCase from 'lodash/startCase';

/**
 * @function
 * @name joinArrayOfObjectToString
 * @description joins are of objects into comma separated string
 * @param {Array} array array of objects
 * @param {string} property property to join
 * @returns {string} comma separated string
 * @version 0.1.0
 * @since 0.1.0
 */
export const joinArrayOfObjectToString = (array, property = 'name') =>
  array.map((obj) => obj.strings[property].en).join(',');

/**
 * @function
 * @name notifyError
 * @description Show error message box
 *
 * @param {object} error  error object
 * @returns {undefined} undefined
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const notifyError = (error) => {
  // eslint-disable-next-line
  if (!navigator.onLine) {
    return message.error(
      'You are currently offline, Please ensure Network connection is available'
    );
  }

  return message.error(error);
};

/**
 * @function
 * @name notifySuccess
 * @description Show a success message box
 *
 * @param {string} details information to be displayed on message box
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const notifySuccess = (details) => {
  message.success(details);
};

/**
 * @function
 * @name notifyInfo
 * @description Show a info message box
 *
 * @param {string} info information to be displayed on message box
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const notifyInfo = (info) => {
  message.info(info);
};

/**
 * @function
 * @name formatDate
 * @description formats date to ddd, MMM DD YYYY hA format
 *
 * @param {object} date date object
 * @param {string} format format that date object will be formatted to
 * @returns {string} formatted date
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const formatDate = (date, format = 'ddd, MMM DD YYYY hA') =>
  moment(date).format(format);

/**
 * @function
 * @name timeAgo
 * @description creates relative date
 *
 * @param {object} date date object
 * @returns {string} relative time
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const timeAgo = (date) => moment(date).fromNow();

/**
 * @function
 * @name formatNumber
 * @description Format number to en-Us format i.e 2000 to 2,000
 *
 * @param {number|string} number Number to be formatted
 *
 * @returns {string} formatted number
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const formatNumber = (number) =>
  new Intl.NumberFormat('en-US').format(number);

/**
 * @function
 * @name getRGBAColor
 * @description Return RGBA color from base color and alpha value
 *
 * @param {string} baseColor  Base color i.e #ffddee
 * @param {number} alpha Alpha value should be between 0 and 1
 *
 * @returns {string} rbga(r,b,g,a)
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export const getRGBAColor = (baseColor, alpha) => {
  const values = baseColor.split('');

  if (values.length < 7 || alpha > 1 || alpha < 0) {
    return undefined;
  }

  const r = parseInt(`0x${values[1]}${values[2]}`, 16);
  const g = parseInt(`0x${values[3]}${values[4]}`, 16);
  const b = parseInt(`0x${values[5]}${values[6]}`, 16);

  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * @function
 * @name truncateString
 * @description truncates string
 * @param {string} str  string to truncate
 * @param {number} [num=60] number of characters to not exceed
 * @returns {string} truncated string
 * @version 0.1.0
 * @since 0.1.0
 */
export const truncateString = (str, num = 60) => {
  if (isEmpty(str)) {
    return '';
  }

  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return `${str.slice(0, num)}...`;
};

/**
 * @function
 * @name generateEventTemplate
 * @description Create event message for sharing
 *
 * @param {object} event Event object
 *
 * @returns {object} Event description for sharing
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateEventTemplate = (event) => {
  const subject = `${get(
    event,
    'level.strings.name.en',
    'N/A'
  )} Advisory: ${get(event, 'type.strings.name.en')} ${event.stage} - No. ${
    event.number
  }`;

  const body = `${subject} \n\nDescription: ${
    // eslint-disable-line
    event.description
  } \nInstructions: ${event.instructions}${
    !isEmpty(event.areas)
      ? `\nAreas: ${
          event.areas
            ? event.areas.map((area) => area.strings.name.en).join(', ')
            : 'N/A'
        }`
      : ''
  }${event.places ? `\nPlaces: ${event.places}` : ''}`;

  return { subject, body };
};

/**
 * @function
 * @name generateFocalPersonVCard
 * @param {object} focalPerson Focal Person object for V-Card generation
 * @returns {object} Formatted Focal person details to be shared
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateFocalPersonVCard = (focalPerson) => {
  const subject = `Contact Details for ${focalPerson.name}`;

  const body = `Name: ${focalPerson.name}\n${
    focalPerson.role
      ? `Title: ${focalPerson.role.strings.name.en} ${
          focalPerson.party ? `(${focalPerson.party.abbreviation})` : ''
        }`
      : ''
  }\nMobile: ${focalPerson.mobile}\n${
    focalPerson.email ? `Email: ${focalPerson.email}` : ''
  }`;

  return { subject, body };
};

/**
 * @function
 * @name generateAgencyVCard
 * @param {object} agency Focal Person object for V-Card generation
 * @returns {object} Formatted Focal person details to be shared
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateAgencyVCard = (agency) => {
  const subject = `Contact Details for ${agency.name}`;

  const body = `Name: ${agency.name} (${agency.abbreviation})\nMobile: ${
    agency.mobile
  }\n${agency.email ? `Email: ${agency.email}` : ''}`;

  return { subject, body };
};

/**
 * @function
 * @name generateEventActionCatalogueVCard
 * @param {object} eventActionCatalogue Event Action Catalogue object for V-Card generation
 * @returns {object} Formatted Focal person details to be shared
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateEventActionCatalogueVCard = (eventActionCatalogue) => {
  const subject = `Action Catalogue details for ${eventActionCatalogue.strings.name.en}`;
  const body = `Name: ${eventActionCatalogue.strings.name.en}\nEvent: ${get(
    eventActionCatalogue,
    'relations.type.strings.name.en',
    'All'
  )}\nFunction: ${get(
    eventActionCatalogue,
    'relations.function.strings.name.en',
    'N/A'
  )}\nAction: ${get(
    eventActionCatalogue,
    'relations.action.strings.name.en',
    'All'
  )}\nRoles: ${joinArrayOfObjectToString(
    eventActionCatalogue.relations.roles
  )}\nGroups: ${joinArrayOfObjectToString(
    eventActionCatalogue.relations.groups
  )}\nArea: ${get(
    eventActionCatalogue,
    'relations.area.strings.name.en',
    'N/A'
  )}
  `;

  return { subject, body };
};

/**
 * @function
 * @name generateVehicleDispatchShareableDetails
 * @param {object} vehicleDispatch Vehicle dispatch object for V-Card generation
 * @returns {object} Formatted Focal person details to be shared
 * @version 0.1.0
 * @since 0.1.0
 */
export const generateVehicleDispatchShareableDetails = (vehicleDispatch) => {
  const subject = `Vehicle dispatch details for ${vehicleDispatch.number}`;
  const body = `Number: ${vehicleDispatch.number}\nDispatcher: ${get(
    vehicleDispatch,
    'dispatcher.party.name',
    'N/A'
  )}\nRequested Date: ${moment(vehicleDispatch.createdAt).format(
    'YYYY-MM-DD HH:mm:ss'
  )}`;
  return { subject, body };
};

/**
 * @function shareDetailsFor
 * @name shareDetailsFor
 * @description Derive share details for an item
 * @param {string[]} items list of items
 * @param {object} fields item shared field details
 * @returns {string} share details
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * cost case = { ... };
 * const fields =
 *  { number: { header: 'Number', dataIndex: 'number', defaultValue: 'N/A' } };
 * shareDetailsFor(case, fields);
 * //=> Number: 1235
 */
export const shareDetailsFor = (items, fields) => {
  // ensure items & fields
  const itemz = [].concat(items);
  const fieldz = merge({}, fields);

  // prepare share details
  const details = map(itemz, (item) => {
    let itemDetails = '';
    forEach(fieldz, ({ header, dataIndex, defaultValue = 'N/A' }, key) => {
      const label = header || startCase(key);
      const value = isFunction(dataIndex)
        ? dataIndex(item) || defaultValue
        : get(item, dataIndex, defaultValue);
      itemDetails += `${label}: ${value}\n`;
    });
    return itemDetails;
  }).join('\n');

  // return
  return details;
};

/**
 * @function
 * @name normalizeItemsSpan
 * @description Map items with their span number on grid layout
 * @param {object[]} items items to be mapped
 * @param {number} span Number the item should span on grid
 * @returns {object[]} Mapped items with span number
 * @version 0.1.0
 * @since 0.1.0
 */
const normalizeItemsSpan = (items, span) =>
  map(items, (item) => ({
    value: item,
    span,
  }));

/**
 * @function
 * @name generateItemsGridSpan
 * @description Generate grid span for items to be rendered
 * @param {object[]} items Items to be rendered in a grid
 * @param {number} maxColPerRow Max number of items(cols) in a row
 * @returns {object[]} Items with span property
 * @version 0.1.0
 * @since 0.1.0
 */
export const assignItemsGridSpan = (items = [], maxColPerRow) => {
  const GRID_MAX_SPAN = 24;
  const itemsCount = items.length;
  const normalSpanCols = Math.floor(itemsCount / maxColPerRow) * maxColPerRow;
  const remainder = itemsCount % maxColPerRow;
  const gridRemainder = GRID_MAX_SPAN % itemsCount;

  if (itemsCount > maxColPerRow) {
    return [
      ...normalizeItemsSpan(
        take(items, normalSpanCols),
        GRID_MAX_SPAN / maxColPerRow
      ),
      ...normalizeItemsSpan(
        takeRight(items, remainder),
        GRID_MAX_SPAN / remainder
      ),
    ];
  }
  if (itemsCount < maxColPerRow && gridRemainder === 0) {
    return [...normalizeItemsSpan(items, GRID_MAX_SPAN / itemsCount)];
  }
  if (itemsCount < maxColPerRow && gridRemainder !== 0) {
    return [
      ...normalizeItemsSpan(take(items, itemsCount - 1), gridRemainder),
      ...normalizeItemsSpan(takeRight(items), gridRemainder * 2),
    ];
  }
  return [...normalizeItemsSpan(items, 24 / maxColPerRow)];
};
