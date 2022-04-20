import { Configuration } from './Configuration';
import { Note } from './Note';

export interface Device {
  name: string;
  description: string;
  operatorId: string;
  id: string;
  serialNumber: string;
  configuration?: Configuration;
  notes?: Note[];
}

export interface EditDevice {
  name: string;
  description: string;
  operatorId?: string;
  id?: string;
  serialNumber?: string;
  configuration?: Configuration[];
  notes?: Note[];
}

export interface WifiScanCommand {
  dfs: boolean;
  activeScan: boolean;
  bandwidth: '' | '20' | '40' | '80';
}
