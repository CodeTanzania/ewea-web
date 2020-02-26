import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon, Menu } from 'antd';
import './styles.css';

/**
 * @function
 * @name ListItemActions
 * @description Render Dropdown component with has actions for list items
 *
 * @param {object} props props object
 * @param {object} props.edit on edit action callback
 * @param {object} props.share on share action callback
 * @param {object} props.archive on archive action callback
 * @param {object} props.transfer on transfer action callback
 * @param {object} props.adjust on adjust action callback
 * @returns {object} react element
 *
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
}) => (
  <Dropdown
    overlay={
      <Menu>
        {view && (
          <Menu.Item key="view" onClick={view.onClick} title={view.title}>
            <Icon type="eye" /> {view.name}
          </Menu.Item>
        )}

        {onMapPreview && (
          <Menu.Item
            key="onMapPreview"
            onClick={onMapPreview.onClick}
            title={onMapPreview.title}
          >
            <Icon type="eye" /> {onMapPreview.name}
          </Menu.Item>
        )}

        {edit && (
          <Menu.Item key="edit" onClick={edit.onClick} title={edit.title}>
            <Icon type="edit" /> {edit.name}
          </Menu.Item>
        )}

        {reload && (
          <Menu.Item key="reload" onClick={reload.onClick} title={reload.title}>
            <Icon type="sync" /> {reload.name}
          </Menu.Item>
        )}

        {share && (
          <Menu.Item key="share" onClick={share.onClick} title={share.title}>
            <Icon type="share-alt" /> {share.name}
          </Menu.Item>
        )}

        {archive && (
          <Menu.Item
            key="archive"
            onClick={archive.onClick}
            title={archive.title}
          >
            <Icon type="delete" /> {archive.name}
          </Menu.Item>
        )}

        {transfer && (
          <Menu.Item
            key="transfer"
            onClick={transfer.onClick}
            title={transfer.title}
          >
            <Icon type="swap" /> {transfer.name}
          </Menu.Item>
        )}

        {adjust && (
          <Menu.Item
            key="transfer"
            onClick={adjust.onClick}
            title={adjust.title}
          >
            <Icon type="diff" /> {adjust.name}
          </Menu.Item>
        )}

        {whatsapp && (
          <Menu.Item key="transfer" title={whatsapp.title}>
            <a target="_blank" rel="noopener noreferrer" href={whatsapp.link}>
              <Icon type="diff" /> {whatsapp.name}
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
      icon="more"
      className="ListItemActionsButton"
      title="More actions"
    />
  </Dropdown>
);

/* props validation */
ListItemActions.propTypes = {
  view: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  onMapPreview: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  edit: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  reload: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  share: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  archive: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  transfer: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  adjust: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  }),
  whatsapp: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
  }),
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
};

export default ListItemActions;
