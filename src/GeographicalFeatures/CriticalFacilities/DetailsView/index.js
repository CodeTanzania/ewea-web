import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import get from 'lodash/get';
import CriticalFacilityDetailsViewBody from './Body';
import CriticalFacilityDetailsViewHeader from './Header';

/**
 * @function
 * @name CriticalFacilityDetailsView
 * @param {object} props React props
 * @param {object} props.criticalFacility criticalFacility
 * @param {boolean} props.showDetails
 * @param {Function} props.handleCloseDetails close details modal
 * @param {Function} props.handleItemEdit close details modal
 * @description details of a critical facility
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityDetailsView = ({
  criticalFacility,
  handleCloseDetails,
  handleItemEdit,
  showDetails,
}) => {
  return (
    <div className="CriticalFacilityDetailsView">
      <Modal
        title={
          <CriticalFacilityDetailsViewHeader
            name={get(criticalFacility, 'strings.name.en', 'N/A')}
            description={get(criticalFacility, 'strings.description.en', 'N/A')}
            onBack={handleCloseDetails}
          />
        }
        width="100%"
        closable={false}
        visible={showDetails}
        getContainer={false}
        mask={false}
        footer={null}
        destroyOnClose
      >
        <CriticalFacilityDetailsViewBody
          criticalFacility={criticalFacility}
          onEdit={() => {
            handleItemEdit(criticalFacility);
          }}
        />
      </Modal>
    </div>
  );
};

export default CriticalFacilityDetailsView;

CriticalFacilityDetailsView.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string,
      }),
      description: PropTypes.shape({
        en: PropTypes.string,
      }),
    }),
  }).isRequired,
  handleItemEdit: PropTypes.func.isRequired,
  showDetails: PropTypes.bool.isRequired,
  handleCloseDetails: PropTypes.func.isRequired,
};
