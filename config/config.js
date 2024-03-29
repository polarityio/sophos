module.exports = {
  name: 'Sophos',
  acronym: 'SO',
  description:
    'The Polarity Sophos integration allows Polarity to search Sophos to return found domains, urls, IPs, and SHA256 hashes.  The integration also allows you to isolate found endpoints, and add SHA256 hashes to your Block and Allow Lists.',
  entityTypes: ['domain', 'url', 'IPv4', 'IPv6', 'SHA256'],
  /*
  customTypes: [
    {
      key: 'hostname',
      // Replace this regex with a regex for your own hostnames
      regex: /\w{3,}\-\w{3,}/
    }
  ],
  */
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
    proxy: ""
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'dataRegionUrl',
      name: 'Data Region Url',
      description: 'The Data Region Url for your Tenant ID.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'tenantId',
      name: 'Tenant ID',
      description: 'The Tenant ID you wish to use in searching.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientId',
      name: 'Client ID',
      description:
        'The Client ID for your Sophos Credentials.  (accessible at https://central.sophos.com/manage/config/settings/credentials)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Client Secret',
      description: 'The Client Secret For your Sophos Credentials.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'allowBlockAllowIsolate',
      name: 'Allow Block Listing, Allow Listing, and Endpoint Isolation',
      description:
        'This allows you to add SHA256 hashes to Allow and Block lists, and Isolate found endpoints.',
      default: true,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'checkIsolationStatus',
      name: 'Check Isolation Status',
      description:
        'If unchecked we will not check to see if an Endpoint is already Isolated unless you attempt to Isolate an Endpoint. ' +
        'This reduces the amount of API calls and lessens your chances of hitting your API Limit.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'checkBlockAllowLists',
      name: 'Check SHA256 Hashes in Block and Allow Lists',
      description:
        'If unchecked we will not check to see if a SHA256 hash is already in an Allow/Block list. ' +
        'This reduces the amount of API calls and lessens your chances of hitting your API Limit.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'allowBlockListCacheTime',
      name: 'Allow and Block List Cache Time',
      description:
        'If a SHA256 hash is submitted to an Allow or Block List outside of this integration, ' +
        'this is the amount of time it will take before we register that update in our search. ' +
        'The longer this time, the less calls to the API are needed, lessening your chances of hitting your API Limit. ' +
        '(Unit is in Minutes)',
      default: 5,
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
