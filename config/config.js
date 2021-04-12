module.exports = {
  name: 'Sophos',
  acronym: 'SO',
  description: 'Polarity integration that connects to Sophos.',
  entityTypes: ['domain', 'IPv4'],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-pink',
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
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'client',
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
    }
  ]
};
