import { message } from 'antd';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { isMobile } from 'react-device-detect';

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
 * @param {number} num number of characters to not exceed
 * @returns {string} truncated string
 * @version 0.1.0
 * @since 0.1.0
 */
export const truncateString = (str, num) => {
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
 * @function
 * @name isMobileScreen
 * @description Determine if the screen is small based on breakpoints
 * @param {object} screens Screens breakpoints object from antd Grid
 * @returns {boolean} True if screen is < 768px
 * @version 0.1.0
 * @since 0.1.0
 */
export const isMobileScreen = (screens) => {
  return ((screens.xs || screens.sm) && !screens.md) || isMobile;
};
