import React from 'react';
import PropTypes from 'prop-types';

import {
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ShareAltOutlined,
  SwapOutlined,
  SyncOutlined,
  UserSwitchOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  WechatOutlined,
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
    return <UserSwitchOutlined />;
  }

  if (iconName === 'archive') {
    return <DeleteOutlined />;
  }

  if (iconName === 'view') {
    return <EyeOutlined />;
  }

  if (iconName === 'whatsapp') {
    return <WechatOutlined />;
  }

  return null;
};

/**
 * @function
 * @name ListItemActions
 * @description Render Dropdown component with has actions for list items
 * @param {object} props props object
 * @param {object} props.edit on edit action callback
 * @param {object} props.assignPermissions on assign role permissions
 * @param {object} props.share on share action callback
 * @param {object} props.onMapPreview on map preview action
 * @param {object} props.view on view action
 * @param {object} props.whatsapp on share via whatsapp action
 * @param {object} props.reload on reload action
 * @param {object} props.archive on archive action callback
 * @param {object} props.transfer on transfer action callback
 * @param {object} props.dispatch on Dispatch vehicle action
 * @param {object} props.atPickup when vehicle at pick up point action
 * @param {object} props.fromPickup when vehicle is leaving pickup point action
 * @param {object} props.atDropOff when vehicle is at drop off point action
 * @param {object} props.fromDropOff when vehicle is leaving drop off point action
 * @param {object} props.adjust on adjust action callback
 * @param {object} props.completeDispatch on complete dispatch action
 * @param {object} props.cancelDispatch on cancel dispatch action
 * @returns {object} react element
 * @version 0.1.0
 * @since 0.1.0
 */
const ListItemActions = ({
  onMapPreview,
  view,
  edit,
  share,
  archive,
  transfer,
  adjust,
  whatsapp,
  reload,
  assignPermissions,
  cancelDispatch,
  dispatch,
  atPickup,
  fromPickup,
  atDropOff,
  fromDropOff,
  completeDispatch,
}) => (
  <Dropdown
    overlay={
      <Menu>
        {view && (
          <Menu.Item key="view" onClick={view.onClick} title={view.title}>
            <EyeOutlined /> {view.name}
          </Menu.Item>
        )}

        {onMapPreview && (
          <Menu.Item
            key="onMapPreview"
            onClick={onMapPreview.onClick}
            title={onMapPreview.title}
          >
            <EyeOutlined /> {onMapPreview.name}
          </Menu.Item>
        )}

        {edit && (
          <Menu.Item key="edit" onClick={edit.onClick} title={edit.title}>
            <EditOutlined /> {edit.name}
          </Menu.Item>
        )}

        {assignPermissions && (
          <Menu.Item
            key="share"
            onClick={assignPermissions.onClick}
            title={assignPermissions.title}
          >
            <UserSwitchOutlined /> {assignPermissions.name}
          </Menu.Item>
        )}

        {dispatch && (
          <Menu.Item
            key="dispatch"
            onClick={dispatch.onClick}
            title={dispatch.title}
          >
            <CarOutlined /> {dispatch.name}
          </Menu.Item>
        )}

        {atPickup && (
          <Menu.Item
            key="atPickup"
            onClick={atPickup.onClick}
            title={atPickup.title}
          >
            <CarOutlined /> {atPickup.name}
          </Menu.Item>
        )}

        {fromPickup && (
          <Menu.Item
            key="fromPickup"
            onClick={fromPickup.onClick}
            title={fromPickup.title}
          >
            <CarOutlined /> {fromPickup.name}
          </Menu.Item>
        )}

        {atDropOff && (
          <Menu.Item
            key="atDropOff"
            onClick={atDropOff.onClick}
            title={atDropOff.title}
          >
            <CarOutlined /> {atDropOff.name}
          </Menu.Item>
        )}

        {fromDropOff && (
          <Menu.Item
            key="fromDropOff"
            onClick={fromDropOff.onClick}
            title={fromDropOff.title}
          >
            <CarOutlined /> {fromDropOff.name}
          </Menu.Item>
        )}

        {completeDispatch && (
          <Menu.Item
            key="completeDispatch"
            onClick={completeDispatch.onClick}
            title={completeDispatch.title}
          >
            <CheckCircleOutlined />
            {completeDispatch.name}
          </Menu.Item>
        )}

        {cancelDispatch && (
          <Menu.Item
            key="cancelDispatch"
            onClick={cancelDispatch.onClick}
            title={cancelDispatch.title}
          >
            <CloseCircleOutlined />
            {cancelDispatch.name}
          </Menu.Item>
        )}

        {reload && (
          <Menu.Item key="reload" onClick={reload.onClick} title={reload.title}>
            <SyncOutlined /> {reload.name}
          </Menu.Item>
        )}

        {share && (
          <Menu.Item key="share" onClick={share.onClick} title={share.title}>
            <ShareAltOutlined /> {share.name}
          </Menu.Item>
        )}

        {archive && (
          <Menu.Item
            key="archive"
            onClick={archive.onClick}
            title={archive.title}
          >
            <DeleteOutlined /> {archive.name}
          </Menu.Item>
        )}

        {transfer && (
          <Menu.Item
            key="transfer"
            onClick={transfer.onClick}
            title={transfer.title}
          >
            <SwapOutlined /> {transfer.name}
          </Menu.Item>
        )}

        {adjust && (
          <Menu.Item
            key="transfer"
            onClick={adjust.onClick}
            title={adjust.title}
          >
            <DiffOutlined /> {adjust.name}
          </Menu.Item>
        )}

        {whatsapp && (
          <Menu.Item key="transfer" title={whatsapp.title}>
            <a target="_blank" rel="noopener noreferrer" href={whatsapp.link}>
              <DiffOutlined /> {whatsapp.name}
            </a>
          </Menu.Item>
        )}
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

/* props validation */
const actionShape = {
  name: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};
ListItemActions.propTypes = {
  view: PropTypes.shape(actionShape),
  onMapPreview: PropTypes.shape(actionShape),
  edit: PropTypes.shape(actionShape),
  reload: PropTypes.shape(actionShape),
  share: PropTypes.shape(actionShape),
  archive: PropTypes.shape(actionShape),
  transfer: PropTypes.shape(actionShape),
  adjust: PropTypes.shape(actionShape),
  assignPermissions: PropTypes.shape(actionShape),
  whatsapp: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  completeDispatch: PropTypes.shape(actionShape),
  cancelDispatch: PropTypes.shape(actionShape),
  dispatch: PropTypes.shape(actionShape),
  atPickup: PropTypes.shape(actionShape),
  fromPickup: PropTypes.shape(actionShape),
  atDropOff: PropTypes.shape(actionShape),
  fromDropOff: PropTypes.shape(actionShape),
};

ListItemActions.defaultProps = {
  view: null,
  onMapPreview: null,
  edit: null,
  reload: null,
  share: null,
  archive: null,
  transfer: null,
  adjust: null,
  whatsapp: null,
  assignPermissions: null,
  completeDispatch: null,
  cancelDispatch: null,
  dispatch: null,
  atPickup: null,
  fromPickup: null,
  atDropOff: null,
  fromDropOff: null,
};

// TODO after migrating all components to this format rename it to ListItemActions
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
export const ItemActions = ({ actions }) => {
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

ItemActions.propTypes = {
  actions: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    link: PropTypes.string,
  }),
};

ItemActions.defaultProps = {
  actions: [],
};

export default ListItemActions;
