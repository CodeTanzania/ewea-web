import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { useState } from 'react';
import ListItemActions from '../../../../components/ListItemActions';
import './styles.css';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const nameSpan = { xxl: 22, xl: 22, lg: 22, md: 21, sm: 19, xs: 19 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @function
 * @name EventActionListItem
 * @description Single focal person list item component.
 * Render single focal person details
 *
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventActionListItem = ({
  item,
  isSelected,
  onSelectItem,
  onDeselectItem,
  onArchive,
  onEdit,
  onShare,
}) => {
  const [isHovered, setHovered] = useState(false);
  const avatarBackground = item.strings.color || randomColor();

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
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
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
        {item.strings.name.en.toUpperCase().charAt(0)}
      </Avatar>
    );
  };

  return (
    <div
      className="EventActionListItem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Col {...sideSpan}>{renderSideComponent()}</Col>
        <Col {...nameSpan}>{item.strings.name.en}</Col>
        <Col {...isHoveredSpan}>
          {/* eslint-enable react/jsx-props-no-spreading */}
          {isHovered && (
            <ListItemActions
              edit={{
                name: 'Edit Event Action',
                title: 'Update Event Action Details',
                onClick: onEdit,
              }}
              share={{
                name: 'Share Event Action',
                title: 'Share Event Action details with others',
                onClick: onShare,
              }}
              archive={{
                name: 'Archive Event Action',
                title: 'Remove Event Action from list of active focal People',
                onClick: showArchiveConfirm,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

EventActionListItem.propTypes = {
  item: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }).isRequired,
      color: PropTypes.string,
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

export default EventActionListItem;
