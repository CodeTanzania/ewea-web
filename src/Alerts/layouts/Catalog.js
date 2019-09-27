import React from 'react';
import EmptyState from '../../components/EmptyState';

/**
 * @function
 * @name ActionCatalogLayout
 * @description Render alert catalog layout
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const ActionCatalogLayout = () => (
  <div style={{ marginTop: '20%' }}>
    <EmptyState
      icon="exclamation-circle"
      description="No Actions yet,but when they are available will appear here"
      buttonLabel="New Action"
      onClick={() => {}}
    />
  </div>
);

export default ActionCatalogLayout;
