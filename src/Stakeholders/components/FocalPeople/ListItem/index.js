import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { useState } from 'react';
import ListItemActions from '../../../../components/ListItemActions';
import './styles.css';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const nameSpan = { xxl: 3, xl: 3, lg: 4, md: 5, sm: 10, xs: 10 };
const phoneSpan = { xxl: 2, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const emailSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const roleSpan = { xxl: 8, xl: 7, lg: 6, md: 0, sm: 0, xs: 0 };
const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @function
 * @name FocalPeopleListItem
 * @description Single focal person list item component.
 * Render single focal person details
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const FocalPeopleListItem = ({
  item,
  isSelected,
  onSelectItem,
  onDeselectItem,
  onArchive,
  onEdit,
  onShare,
}) => {
  const [isHovered, setHovered] = useState(false);
  const avatarBackground = randomColor();

  /**
   * @function
   * @name handleMouseEnter
   * @description Handle on MouseEnter ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleMouseEnter = () => {
    setHovered(true);
  };

  /**
   * @function
   * @name handleMouseEnter
   * @description Handle on MouseLeave ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleMouseLeave = () => {
    setHovered(false);
  };

  /**
   * @function
   * @name handleToggleSelect
   * @description Handle Toggling List Item checkbox
   *
   * @param {object} event - Event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleToggleSelect = event => {
    if (event.target.checked) {
      onSelectItem();
    } else {
      onDeselectItem();
    }
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a focal person
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const showArchiveConfirm = () => {
    confirm({
      title: `Are you sure you want to archive ${item.name} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onArchive();
      },
    });
  };

  const renderSideComponent = () => {
    if (isSelected) {
      return (
        <Checkbox
          className="Checkbox"
          onChange={handleToggleSelect}
          checked={isSelected}
        />
      );
    }

    return isHovered ? (
      <Checkbox
        className="Checkbox"
        onChange={handleToggleSelect}
        checked={isSelected}
      />
    ) : (
      <Avatar style={{ backgroundColor: avatarBackground }}>
        {item.name.toUpperCase().charAt(0)}
      </Avatar>
    );
  };

  return (
    <div
      className="FocalPeopleListItem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Col {...sideSpan}>{renderSideComponent()}</Col>
        <Col {...nameSpan}>{item.name}</Col>
        <Col
          {...roleSpan}
          title={item.role ? item.role.strings.name.en : 'N/A'}
        >
          {item.role
            ? `${item.role.strings.name.en}, ${
                item.party ? item.party.abbreviation : 'N/A'
              }`
            : 'N/A'}
        </Col>
        <Col {...phoneSpan}>{item.mobile}</Col>
        <Col {...emailSpan}>{item.email}</Col>
        <Col {...areaSpan}>{item.area ? item.area.strings.name.en : 'N/A'}</Col>
        <Col {...isHoveredSpan}>
          {/* eslint-enable react/jsx-props-no-spreading */}
          {isHovered && (
            <ListItemActions
              edit={{
                name: 'Edit Focal Person',
                title: 'Update Focal Person Details',
                onClick: onEdit,
              }}
              share={{
                name: 'Share Focal Person',
                title: 'Share Focal Person details with others',
                onClick: onShare,
              }}
              archive={{
                name: 'Archive Focal Person',
                title: 'Remove Focal Person from list of active focal People',
                onClick: showArchiveConfirm,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

FocalPeopleListItem.propTypes = {
  item: PropTypes.shape({
    location: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.shape({ strings: PropTypes.object }),
    area: PropTypes.shape({ strings: PropTypes.object }),
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    party: PropTypes.shape({
      name: PropTypes.string,
      abbreviation: PropTypes.string,
    }),
  }).isRequired,
  abbreviation: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
  agencyAbbreviation: PropTypes.string.isRequired,

  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default FocalPeopleListItem;
