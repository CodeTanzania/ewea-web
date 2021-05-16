import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { signOut as logout } from '@codetanzania/ewea-api-states';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ChangePasswordForm from '../Auth/components/ChangePassword';
import './styles.css';

/**
 * @function
 * @param {object} props User menu props
 * @param {object} props.history history object
 * @param {Function} props.history.push push handler
 * @name UserMenu
 * @description Menu for shown when user click user icon at the top bar
 * @returns {object} User Menu component
 * @version 0.1.0
 * @since 0.1.0
 */
const UserMenu = ({ history: { push } }) => {
  const [showChangePasswordForm, setShowChangePassword] = useState(false);
  /**
   * @function
   * @name signOut
   * @description signOut user from EWEA system
   * @version 0.1.0
   * @since 0.1.0
   */
  const signOut = () => {
    logout();
    push('/signin');
  };

  const onClickMenu = ({ key }) => {
    if (key === 'changePassword') {
      setShowChangePassword(true);
    } else {
      signOut();
    }
  };

  const menu = (
    <Menu className="UserProfileMenu" onClick={onClickMenu}>
      <Menu.Item key="changePassword">
        <LockOutlined />
        Change Password
      </Menu.Item>
      <Menu.Item key="signOut">
        <LogoutOutlined />
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <Button className="UserButton" icon={<UserOutlined />} />
      </Dropdown>

      <Modal
        title="Change Password"
        visible={showChangePasswordForm}
        onCancel={() => setShowChangePassword(false)}
        footer={null}
        maskClosable={false}
        destroyOnClose
      >
        <ChangePasswordForm onCancel={() => setShowChangePassword(false)} />
      </Modal>
    </div>
  );
};

UserMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(UserMenu);
