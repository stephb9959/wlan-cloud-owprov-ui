export const BASE_FORM = {
  name: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  weight: {
    type: 'int',
    value: 0,
    error: false,
    required: true,
  },
  description: {
    type: 'string',
    value: '',
    error: false,
    required: false,
  },
};

export const GLOBALS_FORM = {
  'ipv4-network': {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  'ipv6-network': {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
};

export const UNIT_FORM = {
  name: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  location: {
    type: 'string',
    value: '',
    error: false,
    required: true,
  },
  timezone: {
    type: 'string',
    value: '',
    error: false,
    required: true,
    options: [
      'Midway Islands Time (UTC-11:00)',
      'Hawaii Standard Time (UTC-10:00)',
      'Pacific Standard Time (UTC-8:00)',
      'Mountain Standard Time (UTC-7:00)',
      'Central Standard Time (UTC-6:00)',
      'Eastern Standard Time (UTC-5:00)',
      'Puerto Rico and US Virgin Islands Time (UTC-4:00)',
      'Canada Newfoundland Time (UTC-3:30)',
      'Brazil Eastern Time (UTC-3:00)',
      'Central African Time (UTC-1:00)',
      'Universal Coordinated Time (UTC)',
      'European Central Time (UTC+1:00)',
      'Eastern European Time (UTC+2:00)',
      '(Arabic) Egypt Standard Time (UTC+2:00)',
      'Eastern African Time (UTC+3:00)',
      'Middle East Time (UTC+3:30)',
      'Near East Time (UTC+4:00)',
      'Pakistan Lahore Time (UTC+5:00)',
      'India Standard Time (UTC+5:30)',
      'Bangladesh Standard Time (UTC+6:00)',
      'Vietnam Standard Time (UTC+7:00)',
      'China Taiwan Time (UTC+8:00)',
      'Japan Standard Time (UTC+9:00)',
      'Australia Central Time (UTC+9:30)',
      'Australia Eastern Time (UTC+10:00)',
      'Solomon Standard Time (UTC+11:00)',
      'New Zealand Standard Time (UTC+12:00)',
    ],
  },
  'leds-active': {
    type: 'bool',
    value: true,
    error: false,
  },
  'random-password': {
    type: 'bool',
    value: false,
    error: false,
  },
};

export const METRICS_FORM = {
  statistics: {
    enabled: false,
    interval: {
      type: 'int',
      value: 0,
      error: false,
      required: true,
    },
    types: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['ssids', 'lldp', 'clients'],
    },
  },
  health: {
    enabled: false,
    interval: {
      value: 60,
      type: 'int',
      error: false,
      required: true,
      minimum: 60,
    },
  },
  'wifi-frames': {
    enabled: false,
    filters: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: [
        'probe',
        'auth',
        'assoc',
        'disassoc',
        'deauth',
        'local-deauth',
        'inactive-deauth',
        'key-mismatch',
        'beacon-report',
        'radar-detected',
      ],
    },
  },
  'dhcp-snooping': {
    enabled: false,
    filters: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['ack', 'discover', 'offer', 'request', 'solicit', 'reply', 'renew'],
    },
  },
};

export const SERVICES_FORM = {
  lldp: {
    enabled: false,
    describe: {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    location: {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
  },
  ssh: {
    enabled: false,
    port: {
      value: 22,
      type: 'int',
      error: false,
      required: true,
      maximum: 65535,
    },
    'authorized-keys': {
      enabled: false,
      filters: {
        value: [],
        type: 'multi-custom',
        error: false,
        required: true,
      },
    },
    'password-authentication': {
      type: 'bool',
      value: false,
      error: false,
    },
  },
  ntp: {
    enabled: false,
    servers: {
      enabled: false,
      filters: {
        value: [],
        type: 'multi-custom',
        error: false,
        required: true,
      },
    },
    'local-server': {
      type: 'bool',
      value: false,
      error: false,
    },
  },
  mdns: {
    enabled: false,
    enable: {
      type: 'bool',
      value: false,
      error: false,
    },
  },
  rrty: {
    enabled: false,
    host: {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    port: {
      value: 5912,
      type: 'int',
      error: false,
      required: true,
      maximum: 65535,
    },
    token: {
      type: 'string',
      value: '',
      error: false,
      required: true,
      maxLength: '32',
      minLength: '32',
    },
  },
  log: {
    enabled: false,
    host: {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    port: {
      value: 5912,
      type: 'int',
      error: false,
      required: true,
      maximum: 65535,
    },
    proto: {
      value: ['udp'],
      type: 'multi',
      error: false,
      required: true,
      options: ['udp', 'tcp'],
    },
    size: {
      value: 1000,
      type: 'int',
      error: false,
      required: true,
      minimum: 32,
    },
  },
  http: {
    enabled: false,
    'http-port': {
      value: 80,
      type: 'int',
      error: false,
      required: true,
      maximum: 65535,
      minimum: 1,
    },
  },
  igmp: {
    enabled: false,
    enable: {
      type: 'bool',
      value: false,
      error: false,
    },
  },
  ieee8021x: {
    enabled: false,
    'ca-certificate': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    'use-local-certificate': {
      type: 'bool',
      value: false,
      error: false,
    },
    'server-certificate': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    'private-key': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    users: {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
  },
  'radius-proxy': {
    realms: {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
  },
  'online-check': {
    'ping-hosts': {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
    'download-hosts': {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
    'check-interval': {
      value: 60,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'check-threshold': {
      value: 1,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    action: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['wifi', 'leds'],
    },
  },
  'open-flow': {
    controller: {
      type: 'string',
      value: '',
      error: false,
      required: true,
      format: 'cidr',
    },
    mode: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['pssl', 'ptcp', 'ssl', 'tcp'],
    },
    'ca-certificate': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    'ssl-certificate': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    'private-key': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
  },
  'data-plane': {
    'ingress-filters': {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
  },
  'wifi-steering': {
    mode: {
      value: [],
      type: 'multi',
      error: false,
      required: true,
      options: ['local', 'cloud'],
    },
    'assoc-steering': {
      type: 'bool',
      value: false,
      error: false,
    },
    'required-snr': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'required-probe-snr': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'required-roam-snr': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'load-kick-threshold': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'auto-channel': {
      type: 'bool',
      value: false,
      error: false,
    },
  },
  'quality-of-service': {
    'upload-rate': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
    'download-rate': {
      value: 0,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
  },
  'facebook-wifi': {
    'vendor-id': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    'gateway-id': {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
    secret: {
      type: 'string',
      value: '',
      error: false,
      required: true,
    },
  },
  'airtime-policies': {
    'dns-match': {
      value: [],
      type: 'multi-custom',
      error: false,
      required: true,
    },
    'dns-weight': {
      value: 256,
      type: 'int',
      error: false,
      required: true,
      minimum: 0,
    },
  },
};
