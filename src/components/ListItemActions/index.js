import React from 'react';
import PropTypes from 'prop-types';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ShareAltOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';

import { Dropdown, Button, Menu } from 'antd';
import isString from 'lodash/isString';
import map from 'lodash/map';

/**
 * @function
 * @name getCommonIcon
 * @description Return common icons based on provided icon name
 * @param {string} iconName Common icon name
 * @returns {object|null} Icon instance or null if name doesn't match
 * @version 0.1.0
 * @since 0.1.0
 */
export const getCommonIcon = (iconName) => {
  if (iconName === 'edit') {
    return <EditOutlined />;
  }

  if (iconName === 'share') {
    return <ShareAltOutlined />;
  }

  if (iconName === 'archive') {
    return <DeleteOutlined />;
  }

  if (iconName === 'view') {
    return <EyeOutlined />;
  }

  if (iconName === 'whatsapp') {
    return <WhatsAppOutlined />;
  }

  if (iconName === 'vehicle') {
    return <CarOutlined />;
  }

  if (iconName === 'complete') {
    return <CheckCircleOutlined />;
  }

  if (iconName === 'cancel') {
    return <CloseCircleOutlined />;
  }

  return null;
};

/**
 * @function
 * @name ItemActions
 * @description Single list item actions
 * @param {object} props Component properties object
 * @param {object[]} props.actions List of actions for list item
 * @returns {object} List Item Actions
 * @version 0.1.0
 * @since 0.1.0
 */
export const ListItemActions = ({ actions }) => {
  return (
    <Dropdown
      overlay={
        <Menu>
          {map(actions, (action) => {
            const icon = isString(action.icon)
              ? getCommonIcon(action.icon)
              : action.icon;

            return action.onClick ? (
              <Menu.Item
                key={action.name}
                title={action.title}
                onClick={action.onClick}
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
      }
      trigger={['click']}
    >
      <Button
        shape="circle"
        size="large"
        icon={<MoreOutlined />}
        className="actionButton"
        title="More actions"
      />
    </Dropdown>
  );
};

ListItemActions.propTypes = {
  actions: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    link: PropTypes.string,
  }),
};

ListItemActions.defaultProps = {
  actions: [],
};
