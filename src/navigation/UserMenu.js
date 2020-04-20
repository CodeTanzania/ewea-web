import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { signout } from '@codetanzania/ewea-api-states';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import ChangePasswordForm from '../Auth/components/ChangePassword';
import './styles.css';

class UserMenu extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    visible: false,
    confirmLoading: false,
  };

  /* eslint-disable react/sort-comp */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * @function
   * @name signOut
   * @description signOut user from EWEA system
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  signOut = () => {
    const { history } = this.props;
    signout();
    history.push('/signin');
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    const menu = (
      <Menu className="UserProfileMenu">
        <Menu.Item key="1" onClick={this.showModal}>
          <LockOutlined />
          Change Password
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.signOut()}>
          <LogoutOutlined />
          Sign Out
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Modal
          title="Change Password"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          destroyOnClose
        >
          <ChangePasswordForm onCancel={this.handleCancel} />
        </Modal>
        <Dropdown overlay={menu}>
          <Button className="UserButton" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    );
  }
}

UserMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(UserMenu);
