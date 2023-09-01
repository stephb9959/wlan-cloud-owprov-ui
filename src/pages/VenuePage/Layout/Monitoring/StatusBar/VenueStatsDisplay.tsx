import * as React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Heading, IconButton, LayoutProps, LightMode, SpaceProps, Spacer, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';

export interface VenueStatsDisplayProps extends LayoutProps, SpaceProps {
  title?: string;
  label?: string;
  explanation?: string;
  color?: string;
  openModal?: () => void;
  element?: React.ReactElement;
}

const _VenueStatsDisplay = ({
  title,
  label,
  explanation,
  color,
  openModal,
  element,
  ...props
}: VenueStatsDisplayProps) => {
  const { t } = useTranslation();

  return (
    <Card
      onClick={openModal}
      cursor={openModal ? 'pointer' : ''}
      className="tile-shadow-animate"
      bg={color}
      p={4}
      {...props}
    >
      {title !== '' && (
        <Heading size="md" display="flex">
          {title}
          <Tooltip hasArrow label={explanation}>
            <InfoIcon ml={2} mt="0.10rem" mb="2px" />
          </Tooltip>
          <Spacer />
          {openModal && (
            <LightMode>
              <Tooltip label={t('common.view_details')}>
                <IconButton
                  variant="ghost"
                  aria-label={t('common.view_details')}
                  size="sm"
                  icon={<MagnifyingGlass height={20} width={20} />}
                  ml={2}
                />
              </Tooltip>
            </LightMode>
          )}
        </Heading>
      )}
      {element ?? (
        <Heading size="sm">
          {label}
          {title === '' && (
            <Tooltip hasArrow label={explanation}>
              <InfoIcon ml={2} mb="2px" />
            </Tooltip>
          )}
        </Heading>
      )}
    </Card>
  );
};

export const VenueStatsDisplay = React.memo(_VenueStatsDisplay);