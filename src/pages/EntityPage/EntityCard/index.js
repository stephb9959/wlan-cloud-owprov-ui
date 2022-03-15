import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, Spacer, Spinner, useBoolean, useToast } from '@chakra-ui/react';
import { useGetEntity } from 'hooks/Network/Entity';
import CardBody from 'components/Card/CardBody';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import RefreshButton from 'components/Buttons/RefreshButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import SaveButton from 'components/Buttons/SaveButton';
import LoadingOverlay from 'components/LoadingOverlay';
import EditEntityForm from './Form';
import DeleteEntityPopover from './DeleteEntityPopover';
import CreateEntityModal from '../CreateEntityModal';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const EntityCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [editing, setEditing] = useBoolean();
  const { data: entity, refetch, isFetching } = useGetEntity({ t, toast, id });
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{entity?.name}</Heading>
        </Box>
        <Spacer />
        <Box>
          <CreateEntityModal parentId={entity?.id ?? ''} isDisabled={editing} />
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isCompact={false}
            isDisabled={!editing || !form.isValid || !form.dirty}
            ml={2}
          />
          <ToggleEditButton
            toggleEdit={setEditing.toggle}
            isEditing={editing}
            isDisabled={isFetching}
            isDirty={formRef.dirty}
            ml={2}
          />
          <DeleteEntityPopover isDisabled={editing || isFetching} entity={entity} />
          <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
        </Box>
      </CardHeader>
      <CardBody>
        {!entity && isFetching ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <EditEntityForm
              editing={editing}
              entity={entity}
              stopEditing={setEditing.off}
              formRef={formRef}
            />
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

EntityCard.propTypes = propTypes;

export default React.memo(EntityCard);