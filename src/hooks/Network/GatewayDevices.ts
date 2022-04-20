import { WifiScanCommand } from 'models/Device';
import { useMutation } from 'react-query';
import { axiosGw } from 'utils/axiosInstances';

export const useRebootDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(() => axiosGw.post(`device/${serialNumber}/reboot`, { serialNumber, when: 0 }));

export const useBlinkDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(() =>
    axiosGw.post(`device/${serialNumber}/leds`, { serialNumber, when: 0, pattern: 'blink', duration: 30 }),
  );

export const useWifiScanDevice = ({ serialNumber }: { serialNumber: string }) =>
  useMutation(({ dfs, bandwidth, activeScan }: WifiScanCommand) =>
    axiosGw.post(`device/24f5a207a130/wifiscan`, {
      test: serialNumber,
      serialNumber: '24f5a207a130',
      override_dfs: dfs,
      bandwidth: bandwidth !== '' ? bandwidth : undefined,
      activeScan,
    }),
  );
