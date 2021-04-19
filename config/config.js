module.exports = {
  name: 'Sophos',
  acronym: 'SO',
  description: 'Polarity integration that connects to Sophos.',
  entityTypes: ['domain', 'url', 'string', 'IPv4', 'IPv6', 'SHA256'],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-pink',
  onDemandOnly: true,
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'trace' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'clientId',
      name: 'Client ID',
      description:
        'The Client ID for your Sophos Credentials.  (accessible at https://central.sophos.com/manage/config/settings/credentials)',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'clientSecret',
      name: 'Client Secret',
      description: 'The Client Secret For your Sopho Credentials.',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'tenantId',
      name: 'Tenant ID',
      description:
        'The Tenant ID you wish to use in searching. (Can be found by running "node getTenantIdAndDataRegion clientId=<your-client-id> clientSecret=<your-client-secret>") in your terminal',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'dataRegionUrl',
      name: 'Data Region Url',
      description:
        'The Data Region Url for your Tenant ID. (Can be found by running "node getTenantIdAndDataRegion clientId=<your-client-id> clientSecret=<your-client-secret>" in your terminal)',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'allowBlockAllowIsolate',
      name: 'Allow Block Listing, Allow Listing, and Endpoint Isolation',
      description:
        'This allows you to add SHA256 hashes to Allow and Block lists, and Isolate found endpoints.',
      default: true,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'checkBlockAllowLists',
      name: 'Check SHA256 Hashes in Block and Allow Lists',
      description:
        'If unchecked we will not check to see if a SHA256 hash is already in an Allow/Block list. ' +
        'This reduces the amount of API calls and lessens your chances of hitting your API Limit.',
      default: true,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'allowBlockListCacheTime',
      name: 'Allow and Block List Cache Time',
      description:
        'If a SHA256 hash is submitted to an Allow or Block List outside of this integration, ' +
        'this is the amount of time it will take before we register that update in our search. ' +
        '(Unit is in Minutes)',
      default: 5,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'checkIsolationStatus',
      name: 'Check Isolation Status',
      description:
        'If unchecked we will not check to see if an Endpoint is already Isolated unless you attempt to Isolate an Endpoint. ' +
        'This reduces the amount of API calls and lessens your chances of hitting your API Limit.',
      default: true,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
