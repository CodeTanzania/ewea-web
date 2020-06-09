import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Checkbox, Col, Row, Grid, List, Drawer, Menu } from 'antd';
import randomColor from 'randomcolor';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import map from 'lodash/map';

import { ItemActions, getCommonIcon } from '../ListItemActions';
import './styles.css';

/* constants */
const { useBreakpoint } = Grid;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 2, xs: 3 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 3 };

/**
 * @function ListItem
 * @name ListItem
 * @description Generic list item(row) for list component
 * @param {object} props props object
 * @param {object} props.item valid item
 * @param {string} props.name item name
 * @param {string|object} props.title Title section in mobile view can be a string or react node
 * @param {string|object} props.secondaryText secondary text can be a string or react node
 * @param {string} props.avatarBackgroundColor item avatar background color
 * @param {boolean} props.isSelected select flag
 * @param {Function} props.onSelectItem select callback
 * @param {Function} props.onDeselectItem deselect callback
 * @param {Function} props.renderActions item render actions
 * @param {object[]} props.actions actions for list item
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
  title,
  secondaryText,
  actions,
}) => {
  const screens = useBreakpoint();
  const [showActions, setShowActions] = useState(false);
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
    <>
      {(screens.xs || screens.sm) && !screens.md ? (
        <List.Item onClick={() => setShowActions(true)}>
          <List.Item.Meta
            avatar={
              <Avatar
                size="large"
                style={{ backgroundColor: avatarBackground }}
              >
                {(name || item.name).toUpperCase().charAt(0)}
              </Avatar>
            }
            title={title}
            description={secondaryText}
          />
        </List.Item>
      ) : (
        <div
          className="ListItem"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Row align="middle">
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...sideSpan}>{renderSideComponent()}</Col>
            {children}
            <Col {...isHoveredSpan}>
              {/* eslint-enable react/jsx-props-no-spreading */}
              {isEmpty(actions) ? (
                renderActions()
              ) : (
                <ItemActions actions={actions} />
              )}
            </Col>
          </Row>
        </div>
      )}

      <Drawer
        title="Actions"
        placement="bottom"
        visible={showActions}
        onClose={() => setShowActions(false)}
        destroyOnClose
        bodyStyle={{ padding: 0 }}
      >
        <Menu style={{ border: 'none' }}>
          {map(actions, (action) => {
            const icon = isString(action.icon)
              ? getCommonIcon(action.icon)
              : action.icon;

            return action.onClick ? (
              <Menu.Item
                key={action.name}
                title={action.title}
                onClick={() => {
                  action.onClick();
                  setShowActions(false);
                }}
                icon={icon}
              >
                {action.name}
              </Menu.Item>
            ) : (
              <Menu.Item key={action.name} title={action.title} icon={icon}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={action.link}
                  style={{ color: 'inherit' }}
                >
                  {action.name}
                </a>
              </Menu.Item>
            );
          })}
        </Menu>
      </Drawer>
    </>
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
  renderActions: PropTypes.func,
  title: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
  secondaryText: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
  children: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      onClick: PropTypes.func,
      position: PropTypes.number,
      icon: PropTypes.oneOf([PropTypes.node, PropTypes.string]),
    })
  ),
};

ListItem.defaultProps = {
  name: undefined,
  avatarBackgroundColor: undefined,
  title: null,
  secondaryText: null,
  actions: [],
  renderActions: null,
};

export default ListItem;
