import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext, getIn } from 'formik';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { INTERFACE_SSID_ENCRYPTION_SCHEMA } from './schemas';

const namePrefix = `encryption`;

const keyProtos = ['psk', 'psk2', 'psk-mixed', 'sae-mixed'];

const EncryptionResourceForm = ({ isDisabled }: { isDisabled: boolean }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  const onEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFieldValue(`${namePrefix}`, INTERFACE_SSID_ENCRYPTION_SCHEMA(t, true).cast());
    } else {
      setFieldValue(`${namePrefix}`, undefined);
    }
  };

  const onProtoChange = useCallback(
    (e) => {
      const value = getIn(values, `${namePrefix}`);
      if (e.target.value === 'none') {
        setFieldValue(`${namePrefix}`, { proto: 'none' });
      } else if (value && value.proto === 'none') {
        setFieldValue(`${namePrefix}`, { proto: e.target.value, ieee80211w: 'disabled', key: 'YOUR_SECRET' });
      } else {
        setFieldValue(`${namePrefix}.proto`, e.target.value);
      }
    },
    [getIn(values, `${namePrefix}`)],
  );

  const isEnabled = useMemo(() => getIn(values, `${namePrefix}`) !== undefined, [getIn(values, `${namePrefix}`)]);

  const canChangeIeee = useMemo(() => {
    const configValue = getIn(values, `${namePrefix}`);

    return configValue && configValue.proto && configValue.proto !== 'none';
  }, [getIn(values, `${namePrefix}`)]);

  const isKeyNeeded = useMemo(
    () => getIn(values, `${namePrefix}`) !== undefined && keyProtos.includes(getIn(values, `${namePrefix}`).proto),
    [getIn(values, `${namePrefix}`)],
  );

  return (
    <>
      <Heading size="md" display="flex" mt={6}>
        <Text mr={2}>Encryption</Text>
        <Switch
          onChange={onEnabledChange}
          isChecked={isEnabled}
          borderRadius="15px"
          size="lg"
          _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
          isDisabled={isDisabled}
        />
      </Heading>
      {isEnabled && (
        <SimpleGrid minChildWidth="300px" spacing="20px">
          <SelectField
            name={`${namePrefix}.proto`}
            label="protocol"
            definitionKey="interface.ssid.encryption.proto"
            options={[
              { value: 'none', label: t('common.none') },
              { value: 'psk', label: 'WPA-PSK' },
              { value: 'psk2', label: 'WPA2-PSK' },
              { value: 'psk-mixed', label: 'WPA-PSK/WPA2-PSK Personal Mixed' },
              { value: 'wpa2', label: 'WPA2-Enterprise EAP-TLS' },
              { value: 'sae-mixed', label: 'WPA2/WPA3 Transitional' },
              { value: 'wpa3', label: 'WPA3-Enterprise EAP-TLS' },
              { value: 'wpa3-192', label: 'WPA3-192-Enterprise EAP-TLS' },
            ]}
            onChange={onProtoChange}
            isRequired
            isDisabled={isDisabled}
          />
          {canChangeIeee && (
            <SelectField
              name={`${namePrefix}.ieee80211w`}
              label="ieee80211w"
              definitionKey="interface.ssid.encryption.ieee80211w"
              options={[
                { value: 'disabled', label: 'disabled' },
                { value: 'optional', label: 'optional' },
                { value: 'required', label: 'required' },
              ]}
              isRequired
              isDisabled={isDisabled}
            />
          )}
          {isKeyNeeded && (
            <StringField
              name={`${namePrefix}.key`}
              label="key"
              definitionKey="interface.ssid.encryption.key"
              isRequired
              hideButton
              isDisabled={isDisabled}
            />
          )}
        </SimpleGrid>
      )}
    </>
  );
};

export default React.memo(EncryptionResourceForm);
