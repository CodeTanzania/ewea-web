import {
  Connect,
  searchAdministrativeAreas,
  selectAdministrativeArea,
  getAdministrativeAreas,
  openAdministrativeAreaForm,
  closeAdministrativeAreaForm,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Topbar from '../../../components/Topbar';
import AdministrativeAreasFilters from './Filters';
import AdministrativeAreaForm from './Form';
import AdministrativeAreaList from './List';
import './styles.css';

/**
 * @class
 * @name AdministrativeAreas
 * @description Render functions list which have search box, actions and list administrative areas
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AdministrativeAreas extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
  };

  componentDidMount() {
    getAdministrativeAreas();
  }

  /**
   * @function
   * @name handleOnCachedValues
   * @description Cached selected values for filters
   *
   * @param {object} cached values to be cached from filter
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCachedValues = cached => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearCachedValues = () => {
    this.setState({ cached: null });
  };

  /**
   * @function
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openAdministrativeAreaForm
   * @description Open administrativeArea form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAdministrativeAreaForm = () => {
    openAdministrativeAreaForm();
  };

  /**
   * @function
   * @name closeAdministrativeAreaForm
   * @description close administrativeArea form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAdministrativeAreaForm = () => {
    closeAdministrativeAreaForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAdministrativeAreas
   * @description Search AdministrativeAreas List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAdministrativeAreas = event => {
    searchAdministrativeAreas(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} administrativeArea administrativeArea to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = administrativeArea => {
    selectAdministrativeArea(administrativeArea);
    this.setState({ isEditForm: true });
    openAdministrativeAreaForm();
  };

  render() {
    const {
      administrativeAreas,
      administrativeArea,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { showFilters, isEditForm, cached } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Administrative Areas here ...',
            onChange: this.searchAdministrativeAreas,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Function',
              icon: 'plus',
              size: 'large',
              title: 'Add New Administrative Area',
              onClick: this.openAdministrativeAreaForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="AdministrativeAreaForm">
          {/* list starts */}
          <AdministrativeAreaList
            total={total}
            page={page}
            administrativeAreas={administrativeAreas}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
          />
          {/* end list */}

          {/* filter modal */}
          <Modal
            title="Filter Administrative Area"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <AdministrativeAreasFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal>
          {/* end filter modal */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm
                ? 'Edit Administrative Area'
                : 'Add New Administrative Area'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeAdministrativeAreaForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <AdministrativeAreaForm
              posting={posting}
              isEditForm={isEditForm}
              administrativeArea={administrativeArea}
              onCancel={this.closeAdministrativeAreaForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

AdministrativeAreas.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  administrativeAreas: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  administrativeArea: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

AdministrativeAreas.defaultProps = {
  administrativeArea: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeAreas, {
  administrativeAreas: 'administrativeAreas.list',
  administrativeArea: 'administrativeAreas.selected',
  loading: 'administrativeAreas.loading',
  posting: 'administrativeAreas.posting',
  page: 'administrativeAreas.page',
  showForm: 'administrativeAreas.showForm',
  total: 'administrativeAreas.total',
  searchQuery: 'administrativeAreas.q',
});
