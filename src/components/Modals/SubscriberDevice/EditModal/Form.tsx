import React, { Ref, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Heading } from '@chakra-ui/react';
import { Formik, Form, FormikProps } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { SubscriberDeviceSchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import useMutationResult from 'hooks/useMutationResult';
import useSelectList from 'hooks/useSelectList';
import { useUpdateSubscriberDevice } from 'hooks/Network/SubscriberDevices';
import SubscriberDeviceConfigurationManager from 'components/CustomFields/SubscriberDeviceConfigurationManager';
import { ModalProps } from 'models/Modal';
import { Device } from 'models/Device';
import { Contact } from 'models/Contact';
import { Location } from 'models/Location';
import { ServiceClass } from 'models/ServiceClass';
import { Subscriber } from 'models/Subscriber';
import { Configuration } from 'models/Configuration';

interface Props {
  editing: boolean;
  modalProps: ModalProps;
  refresh: () => void;
  subscriberDevice: Device;
  formRef: Ref<FormikProps<Device>> | undefined;
  externalData: {
    deviceTypes: string[];
    contacts: Contact[];
    locations: Location[];
    serviceClasses: ServiceClass[];
    subscribers: Subscriber[];
  };
  configuration?: Configuration[];
  defaultConfiguration?: Configuration[];
  onConfigurationChange: (conf: Configuration) => void;
}
const defaultProps = {
  configuration: undefined,
  defaultConfiguration: undefined,
};

const EditSubscriberDeviceForm: React.FC<Props> = ({
  editing,
  modalProps: { isOpen, onClose },
  refresh,
  subscriberDevice,
  externalData,
  formRef,
  configuration,
  onConfigurationChange,
  defaultConfiguration,
}) => {
  const { t } = useTranslation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'update',
    refresh,
    onClose,
  });
  const [formKey, setFormKey] = useState(uuid());
  const updateSubscriberDevice = useUpdateSubscriberDevice({ id: subscriberDevice.id });

  const deviceTypeOptions = useSelectList({ values: externalData.deviceTypes, hasEmpty: true });
  const contactOptions = useSelectList({
    values: externalData.contacts,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const locationOptions = useSelectList({
    values: externalData.locations,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const serviceClassesOptions = useSelectList({
    values: externalData.serviceClasses,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });
  const subscriberOptions = useSelectList({
    values: externalData.subscribers,
    hasEmpty: true,
    valueKey: 'id',
    labelKey: 'name',
  });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={subscriberDevice}
      validationSchema={SubscriberDeviceSchema(t)}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        updateSubscriberDevice.mutateAsync(
          {
            ...data,
            configuration: configuration ?? undefined,
            // @ts-ignore
            notes: data.notes.filter((note) => note.isNew),
          },
          {
            onSuccess: () => {
              onSuccess({ setSubmitting, resetForm });
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{t('common.main')}</Tab>
          <Tab>{t('common.notes')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Form>
              <Heading size="md" mb={2}>
                {t('common.identification')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={!editing} />
                <SelectField
                  name="subscriberId"
                  label={t('subscribers.one')}
                  options={subscriberOptions}
                  isRequired
                  isDisabled={!editing}
                />
                <StringField name="description" label={t('common.description')} isDisabled={!editing} />
              </SimpleGrid>
              <Heading size="md" mb={2}>
                {t('common.device_details')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <StringField
                  name="serialNumber"
                  label={t('inventory.serial_number')}
                  isRequired
                  isDisabled={!editing}
                />
                <SelectField
                  name="deviceType"
                  label={t('inventory.device_type')}
                  options={deviceTypeOptions}
                  isRequired
                  isDisabled={!editing}
                />
                <SelectField
                  name="rrm"
                  label="RRM"
                  options={[
                    { value: 'inherit', label: 'inherit' },
                    { value: 'on', label: 'on' },
                    { value: 'off', label: 'off' },
                  ]}
                  isRequired
                  w={28}
                  isDisabled={!editing}
                />
              </SimpleGrid>
              <Heading size="md" mb={2}>
                {t('subscribers.billing_contact_info')}
              </Heading>
              <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
                <SelectField
                  name="serviceClass"
                  label={t('service.one')}
                  options={serviceClassesOptions}
                  isDisabled={!editing}
                />
                <StringField name="billingCode" label={t('service.billing_code')} isDisabled={!editing} />
                <SelectField name="contact" label={t('contacts.one')} options={contactOptions} isDisabled={!editing} />
                <SelectField
                  name="location"
                  label={t('locations.one')}
                  options={locationOptions}
                  isDisabled={!editing}
                />
              </SimpleGrid>
              <SubscriberDeviceConfigurationManager
                editing={editing}
                onChange={onConfigurationChange}
                configuration={defaultConfiguration}
              />
            </Form>
          </TabPanel>
          <TabPanel>
            <NotesTable name="notes" isDisabled={!editing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Formik>
  );
};

EditSubscriberDeviceForm.defaultProps = defaultProps;

export default EditSubscriberDeviceForm;