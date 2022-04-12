import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { SubscriberDeviceSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import useMutationResult from 'hooks/useMutationResult';
import SpecialConfigurationManager from 'components/CustomFields/SpecialConfigurationManager';
import { useCreateSubscriberDevice } from 'hooks/Network/SubscriberDevices';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  operatorId: PropTypes.string.isRequired,
  deviceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  contacts: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  locations: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  serviceClasses: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  configuration: PropTypes.instanceOf(Object),
  onConfigurationChange: PropTypes.func.isRequired,
};

const defaultProps = {
  configuration: null,
};

const CreateSubscriberDeviceForm = ({
  isOpen,
  onClose,
  refresh,
  formRef,
  operatorId,
  deviceTypes,
  contacts,
  locations,
  serviceClasses,
  configuration,
  onConfigurationChange,
}) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('devices.one'),
    operationType: 'create',
    refresh,
    onClose,
  });

  const create = useCreateSubscriberDevice();

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypes.map((deviceType) => ({
        value: deviceType,
        label: deviceType,
      })),
    [deviceTypes],
  );
  const contactOptions = useMemo(
    () => [
      {
        value: '',
        label: t('common.none'),
      },
      ...contacts.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    ],
    [contacts],
  );
  const locationOptions = useMemo(
    () => [
      {
        value: '',
        label: t('common.none'),
      },
      ...locations.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    ],
    [locations],
  );
  const serviceClassesOptions = useMemo(
    () => [
      {
        value: '',
        label: t('common.none'),
      },
      ...serviceClasses.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    ],
    [locations],
  );
  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{ ...SubscriberDeviceSchema(t).cast(), deviceType: deviceTypes[0] }}
      validationSchema={SubscriberDeviceSchema(t)}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        create.mutateAsync(
          {
            ...data,
            operatorId,
            configuration: configuration ? configuration.configuration : undefined,
            notes: data.note.length > 0 ? [{ note: data.note }] : undefined,
          },
          {
            onSuccess: () => {
              onSuccess(setSubmitting, resetForm);
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Form>
        <Heading size="md" mb={2}>
          {t('common.identification')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <StringField name="name" label={t('common.name')} isRequired />
          <StringField name="description" label={t('common.description')} />
          <StringField name="note" label={t('common.note')} />
        </SimpleGrid>
        <Heading size="md" mb={2}>
          {t('common.device_details')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <StringField name="serialNumber" label={t('inventory.serial_number')} isRequired />
          <StringField name="realMacAddress" label="MAC" isRequired />
          <SelectField name="deviceType" label={t('inventory.device_type')} options={deviceTypeOptions} isRequired />
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
          />
        </SimpleGrid>
        <Heading size="md" mb={2}>
          {t('subscribers.billing_contact_info')}
        </Heading>
        <SimpleGrid minChildWidth="200px" spacing="10px" mb={4}>
          <SelectField name="serviceClass" label={t('service.one')} options={serviceClassesOptions} isRequired />
          <StringField name="billingCode" label={t('service.billing_code')} />
          <SelectField name="contact" label={t('contacts.one')} options={contactOptions} />
          <SelectField name="location" label={t('locations.one')} options={locationOptions} />
        </SimpleGrid>
        <SpecialConfigurationManager editing onChange={onConfigurationChange} isOnlySections isDeletePossible />
      </Form>
    </Formik>
  );
};

CreateSubscriberDeviceForm.propTypes = propTypes;
CreateSubscriberDeviceForm.defaultProps = defaultProps;

export default CreateSubscriberDeviceForm;