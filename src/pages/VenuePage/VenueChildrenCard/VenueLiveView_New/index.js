import React, { useMemo, useState } from 'react';
import { SigmaContainer } from 'react-sigma-v2';
import { getHoursAgo } from 'utils/dateFormatting';
import 'react-sigma-v2/lib/react-sigma-v2.css';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import CustomGraph from './CustomGraph';

const VenueLiveViewNew = ({ boardId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [startTime] = useState(getHoursAgo(1));
  const [endTime] = useState(new Date());
  const { data: timepoints } = useGetAnalyticsBoardTimepoints({ t, toast, id: boardId, startTime, endTime });

  const parsedStuff = useMemo(() => {
    if (!timepoints) return null;

    const nodes = [
      {
        id: 'venue',
        name: 'venue',
        size: 50,
      },
    ];

    const edges = [];

    for (const { device_info: deviceInfo, ssid_data: ssidData, radio_data: radioData } of timepoints[0]) {
      nodes.push({
        id: deviceInfo.serialNumber,
        name: deviceInfo.serialNumber,
        size: 10,
      });
      edges.push({
        from: 'venue',
        to: deviceInfo.serialNumber,
        weight: 100,
      });

      for (const [, { band }] of radioData.entries()) {
        nodes.push({
          id: `${deviceInfo.serialNumber}/radio/${band}`,
          name: `${deviceInfo.serialNumber}/radio/${band}`,
          size: 10,
        });
        edges.push({
          from: deviceInfo.serialNumber,
          to: `${deviceInfo.serialNumber}/radio/${band}`,
          weight: 100,
        });
      }
      for (const { ssid, associations, band } of ssidData) {
        nodes.push({
          id: `ssid/${ssid}/${band}/${deviceInfo.serialNumber}`,
          name: `ssid/${ssid}/${band}`,
          size: Math.max(10, associations.length * 2),
        });
        edges.push({
          from: `${deviceInfo.serialNumber}/radio/${band}`,
          to: `ssid/${ssid}/${band}/${deviceInfo.serialNumber}`,
          weight: 100,
        });

        for (const { station } of associations) {
          nodes.push({
            id: `assoc/${ssid}/${band}/${deviceInfo.serialNumber}/${station}`,
            name: `assoc/${ssid}/${band}`,
            size: 10,
          });
          edges.push({
            from: `ssid/${ssid}/${band}/${deviceInfo.serialNumber}`,
            to: `assoc/${ssid}/${band}/${deviceInfo.serialNumber}/${station}`,
            weight: 5,
          });
        }
      }
    }
    return {
      nodes,
      edges,
    };
  }, [timepoints]);

  if (!parsedStuff) return null;

  return (
    <SigmaContainer style={{ height: '1000px' }}>
      <CustomGraph data={parsedStuff} />
    </SigmaContainer>
  );
};

export default VenueLiveViewNew;
