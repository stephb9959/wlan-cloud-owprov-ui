import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRow, CCol } from '@coreui/react';
import { useEntity, EntityInformation } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';
import InventoryTable from 'components/InventoryTable';
import AddInventoryTagModal from 'components/AddInventoryTagModal';
import VenueBrowser from 'components/VenueBrowser';

const EntityPage = () => {
  const { t } = useTranslation();
  const { entity, setProviderEntity } = useEntity();
  const { entityId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

  const toggleShowAdd = () => {
    setShowAddModal(!showAddModal);
  };

  useEffect(() => {
    if (entityId !== null) {
      setProviderEntity(entityId);
    }
  }, [entityId]);

  return (
    <>
      <CRow>
        <CCol>
          <EntityInformation t={t} entity={entity} />
          {entity !== null && entity?.uuid !== '0000-0000-0000' ? (
            <div>
              <VenueBrowser entity={entity} />
            </div>
          ) : (
            <div />
          )}
        </CCol>
        <CCol>
          {entity !== null && entity?.uuid !== '0000-0000-0000' ? (
            <div>
              <InventoryTable
                entity={entity}
                toggleAdd={toggleShowAdd}
                refreshId={refreshId}
                refreshPageTables={refreshTable}
                onlyEntity
                urlId="only"
                title={t('entity.assigned_inventory')}
              />
              <AddInventoryTagModal
                show={showAddModal}
                toggle={toggleShowAdd}
                refreshId={refreshId}
                entity={entity}
                refreshTable={refreshTable}
              />
            </div>
          ) : (
            <div />
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default EntityPage;