import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { axiosSec } from 'utils/axiosInstances';
import {
  Alert,
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Spacer,
  IconButton,
  Tooltip,
  Center,
  HStack,
  PinInput,
  PinInputField,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useMutation } from 'react-query';
import { useAuth } from 'contexts/AuthProvider';

const propTypes = {
  setActiveForm: PropTypes.func.isRequired,
  activeForm: PropTypes.shape({
    form: PropTypes.string.isRequired,
    data: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      verifUuid: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      rememberMe: PropTypes.bool,
    }),
  }).isRequired,
};

const MfaForm = ({ activeForm, setActiveForm }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { setToken } = useAuth();
  const titleColor = useColorModeValue('blue.300', 'white');
  const textColor = useColorModeValue('gray.400', 'white');
  const verifyCode = useMutation((verifInfo) => axiosSec.post('oauth2?completeMFAChallenge=true', verifInfo));
  const sendPhoneTest = useMutation(
    () =>
      axiosSec.post(`oauth2?resendMFACode=true`, {
        uuid: activeForm.data.verifUuid,
      }),
    {
      onSuccess: () => {
        toast({
          id: 'verif-phone-success',
          title: t('common.success'),
          description: t('login.resent_code'),
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: (e) => {
        toast({
          id: 'verif-phone-error',
          title: t('common.error'),
          description: t('login.error_sending_code', { e: e?.response?.data?.ErrorDescription }),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    },
  );
  const [code, setCode] = useState('');

  const submitVerif = (answer) => {
    verifyCode.mutateAsync(
      {
        uuid: activeForm.data.verifUuid,
        answer,
      },
      {
        onSuccess: (response) => {
          if (activeForm.data.rememberMe) localStorage.setItem('access_token', response.data.access_token);
          else sessionStorage.setItem('access_token', response.data.access_token);
          setToken(response.data.access_token);
        },
        onError: (e) => {
          if (e?.response?.status === 403 && e.response.data.ErrorCode === 1) {
            setActiveForm({
              form: 'change-password',
              data: { userId: activeForm.data.userId, password: activeForm.data.password },
            });
          }
        },
      },
    );
  };

  const handleResendClick = () => sendPhoneTest.mutateAsync();

  const getExplanation = () => {
    if (activeForm.data.method === 'sms') return t('login.sms_instructions');
    if (activeForm.data.method === 'email') return t('login.email_instructions');
    return t('login.google_instructions');
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Heading color={titleColor} fontSize="32px" mb="10px">
          {t('login.verification')}
        </Heading>
        <Spacer />
        <Tooltip hasArrow label={t('common.go_back')} placement="top">
          <IconButton
            size="lg"
            color="white"
            bg="blue.300"
            _hover={{
              bg: 'blue.500',
            }}
            _active={{
              bg: 'blue.300',
            }}
            icon={<ArrowBackIcon h={12} w={12} />}
            onClick={() => setActiveForm({ form: 'login' })}
          />
        </Tooltip>
      </Box>
      <Text mb="24px" ms="4px" mt={2} color={textColor} fontWeight="bold" fontSize="14px">
        {getExplanation()}
      </Text>
      <Center my={6}>
        <HStack>
          <PinInput
            isInvalid={verifyCode.isError && code.length === 6}
            onChange={(e) => setCode(e)}
            otp
            onComplete={submitVerif}
            autoFocus
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        {activeForm.data.method === 'authenticator' ? null : (
          <Button
            ml={2}
            onClick={handleResendClick}
            isLoading={sendPhoneTest.isLoading}
            loadingText={t('common.sending')}
          >
            {t('login.resend')}
          </Button>
        )}
      </Center>
      {verifyCode.isError ? (
        <Alert mt="16px" status="error">
          {t('login.invalid_mfa')}
        </Alert>
      ) : null}
      <Button
        fontSize="15px"
        type="submit"
        bg="blue.300"
        w="100%"
        h="45"
        mb="20px"
        color="white"
        mt="20px"
        _hover={{
          bg: 'blue.500',
        }}
        _active={{
          bg: 'blue.300',
        }}
        isLoading={verifyCode.isLoading}
        isDisabled={code.length < 6}
      >
        {t('login.sign_in')}
      </Button>
    </>
  );
};

MfaForm.propTypes = propTypes;

export default MfaForm;
