import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Checkbox, Col, Row } from 'antd';
import randomColor from 'randomcolor';
import './styles.css';

/* constants */
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 2, xs: 3 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 3 };

/**
 * @function ListItem
 * @name ListItem
 * @description Generic list item(row) for list component
 * @param {object} props props object
 * @param {object} props.item valid item
 * @param {string} props.name item name
 * @param {string} props.avatarBackgroundColor item avatar background color
 * @param {boolean} props.isSelected select flag
 * @param {Function} props.onSelectItem select callback
 * @param {Function} props.onDeselectItem deselect callback
 * @param {Function} props.renderActions item render actions
 * @param {object[]} props.children item children
 * @returns {object} React Component
 * @version 0.1.0
 * @since 0.1.0
 */
const ListItem = ({
  item,
  name,
  avatarBackgroundColor,
  isSelected,
  onSelectItem,
  onDeselectItem,
  renderActions,
  children,
}) => {
  const [isHovered, setHovered] = useState(false);
  const avatarBackground = avatarBackgroundColor || randomColor();

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
  const handleToggleSelect = (event) => {
    if (event.target.checked) {
      onSelectItem();
    } else {
      onDeselectItem();
    }
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
        {(name || item.name).toUpperCase().charAt(0)}
      </Avatar>
    );
  };

  return (
    <div
      className="ListItem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Col {...sideSpan}>{renderSideComponent()}</Col>
        {children}
        <Col {...isHoveredSpan}>
          {/* eslint-enable react/jsx-props-no-spreading */}
          {renderActions()}
        </Col>
      </Row>
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  name: PropTypes.string,
  avatarBackgroundColor: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
  renderActions: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

ListItem.defaultProps = {
  name: undefined,
  avatarBackgroundColor: undefined,
};

export default ListItem;
