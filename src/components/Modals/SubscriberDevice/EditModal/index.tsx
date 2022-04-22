import React, { Ref, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Spinner, Center, useBoolean } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import EditButton from 'components/Buttons/EditButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import useFormRef from 'hooks/useFormRef';
import useFormModal from 'hooks/useFormModal';
import { useGetSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import useOperatorChildren from 'hooks/useOperatorChildren';
import useNestedConfigurationForm from 'hooks/useNestedConfigurationForm';
import { FormikProps } from 'formik';
import { Device } from 'models/Device';
import EditSubscriberDeviceForm from './Form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subscriberDevice?: Device;
  refresh: () => void;
  operatorId: string;
}

const defaultProps = {
  subscriberDevice: undefined,
};

const EditSubscriberDeviceModal: React.FC<Props> = ({ isOpen, onClose, subscriberDevice, refresh, operatorId }) => {
  const { t } = useTranslation();
  const { form, formRef } = useFormRef();
  const [editing, setEditing] = useBoolean();
  const { isConfirmOpen, closeConfirm, closeModal, closeCancelAndForm } = useFormModal({
    isDirty: form?.dirty,
    onModalClose: onClose,
  });
  const { isLoaded, deviceTypes, contacts, locations, serviceClasses, subscribers } = useOperatorChildren({
    operatorId,
  });
  const {
    data: subscriberDeviceData,
    isLoading,
    refetch,
  } = useGetSubscriberDevice({
    id: subscriberDevice?.id ?? '',
    enabled: subscriberDevice?.id !== '' && isOpen,
  });
  const {
    data: { configuration, isDirty: isConfigurationDirty, isValid: isConfigurationValid },
    onChange: onConfigurationChange,
    reset,
  } = useNestedConfigurationForm({ defaultConfiguration: subscriberDeviceData?.configuration ?? undefined });

  const refreshAfterUpdate = () => {
    reset();
    refresh();
    refetch();
  };

  useEffect(() => {
    if (isOpen) {
      onConfigurationChange(null);
      setEditing.off();
    }
  }, [isOpen]);

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
        <ModalHeader
          title={t('crud.edit_obj', { obj: t('certificates.device') })}
          right={
            <>
              <SaveButton
                onClick={form.submitForm}
                isLoading={form.isSubmitting}
                isDisabled={
                  !editing || !form.isValid || !isConfigurationValid || (!form.dirty && !isConfigurationDirty)
                }
              />
              <EditButton ml={2} isDisabled={editing} onClick={setEditing.toggle} isCompact />
              <CloseButton ml={2} onClick={closeModal} />
            </>
          }
        />
        <ModalBody>
          {isOpen && isLoaded && !isLoading && subscriberDeviceData !== undefined ? (
            <EditSubscriberDeviceForm
              editing={editing}
              subscriberDevice={subscriberDeviceData}
              externalData={{
                deviceTypes,
                contacts,
                locations,
                serviceClasses,
                subscribers: subscribers ?? [],
              }}
              modalProps={{
                isOpen,
                onOpen: () => {},
                onClose: closeCancelAndForm,
              }}
              refresh={refreshAfterUpdate}
              formRef={formRef as Ref<FormikProps<Device>> | undefined}
              configuration={configuration || undefined}
              defaultConfiguration={subscriberDeviceData.configuration}
              onConfigurationChange={onConfigurationChange}
            />
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </ModalBody>
      </ModalContent>
      <ConfirmCloseAlert isOpen={isConfirmOpen} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </Modal>
  );
};

EditSubscriberDeviceModal.defaultProps = defaultProps;

export default EditSubscriberDeviceModal;