import React from 'react';
import PropTypes from 'prop-types';
import { Box, Center, Heading, Spacer, Spinner, useBoolean } from '@chakra-ui/react';
import { useGetVenue } from 'hooks/Network/Venues';
import CardBody from 'components/Card/CardBody';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import RefreshButton from 'components/Buttons/RefreshButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import SaveButton from 'components/Buttons/SaveButton';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetAnalyticsBoard } from 'hooks/Network/Analytics';
import { useAuth } from 'contexts/AuthProvider';
import useFormRef from 'hooks/useFormRef';
import VenueActions from './Actions';
import EditVenueForm from './Form';
import DeleteVenuePopover from './DeleteVenuePopover';
import CreateVenueModal from '../../../components/Tables/VenueTable/CreateVenueModal';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const VenueCard = ({ id }) => {
  const { endpoints } = useAuth();
  const [editing, setEditing] = useBoolean();
  const { data: venue, refetch, isFetching } = useGetVenue({ id });
  const { data: board, isFetching: isFetchingBoard } = useGetAnalyticsBoard({
    id: endpoints?.owanalytics && venue?.boards.length > 0 ? venue.boards[0] : null,
  });
  const { form, formRef } = useFormRef();

  return (
    <Card mb={4}>
      <CardHeader mb="10px" display="flex">
        <Box pt={1}>
          <Heading size="md">{venue?.name}</Heading>
        </Box>
        <Spacer />
        <Box>
          <CreateVenueModal parentId={venue?.id ?? ''} isDisabled={editing} />
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
          <DeleteVenuePopover isDisabled={editing || isFetching} venue={venue} />
          <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
          <VenueActions isDisabled={editing} venueId={id} />
        </Box>
      </CardHeader>
      <CardBody>
        {(!venue && isFetching) || (!board && isFetchingBoard) ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <EditVenueForm
              editing={editing}
              venue={venue}
              stopEditing={setEditing.off}
              formRef={formRef}
              board={board}
            />
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

VenueCard.propTypes = propTypes;

export default React.memo(VenueCard);
