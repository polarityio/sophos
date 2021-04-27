polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  summary: Ember.computed.alias('block.data.summary'),
  activeTab: 'addToBlocklist',
  allowingComment: '',
  blockingComment: '',
  message: '',
  errorMessage: '',
  isolateIsRunning: false,
  endpointServiceDetailsExpansionMap: {},
  init() {
    this._super(...arguments);
  },
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);
    },
    toggleServiceDetails: function (index) {
      const modifiedEndpointServiceDetailsExpansionMap = Object.assign(
        {},
        this.get('endpointServiceDetailsExpansionMap'),
        {
          [index]: !this.get('endpointServiceDetailsExpansionMap')[index]
        }
      );

      this.set(
        `endpointServiceDetailsExpansionMap`,
        modifiedEndpointServiceDetailsExpansionMap
      );
    },
    changeIsolationComment: function (index, e) {
      this.set(`details.endpoints.${index}.isolationComment`, e.target.value);
    },
    isolateEndpoint: function (index) {
      this.set('message', '');
      this.set('errorMessage', '');
      this.set('isolateIsRunning', true);
      this.get('block').notifyPropertyChange('data');

      this.sendIntegrationMessage({
        action: 'isolateEndpoint',
        data: {
          endpoint: this.get('details.endpoints')[index]
        }
      })
        .then(({ message }) => {
          this.set(`details.endpoints.${index}.isIsolated`, true);
          this.set('message', message);
        })
        .catch((err) => {
          this.set(
            'errorMessage',
            'Failed to Isolate Endpoint: ' +
              (err && (err.detail || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          this.set('isolateIsRunning', false);
          this.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            this.set('message', '');
            this.set('errorMessage', '');
            this.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    },
    addToBlockOrAllowList: function (shouldBlockEntity) {
      this.set('message', '');
      this.set('errorMessage', '');
      this.set('isBlockingOrAllowing', true);
      this.get('block').notifyPropertyChange('data');
      console.log('shouldBlockEntity');
      console.log(shouldBlockEntity);
      this.sendIntegrationMessage({
        action: 'addToBlockOrAllowList',
        data: {
          entity: this.get('block.entity'),
          blocked: this.get('details.blocked'),
          allowed: this.get('details.allowed'),
          foundSha256: this.get('details.foundSha256'),
          shouldBlockEntity,
          comment: shouldBlockEntity
            ? this.get('blockingComment')
            : this.get('allowingComment')
        }
      })
        .then(({ message, foundSha256 }) => {
          this.set('summary', [shouldBlockEntity ? 'In Blocklist' : 'In Allowlist']);
          this.set('details.foundSha256', foundSha256);
          this.set(`details.${shouldBlockEntity ? 'blocked' : 'allowed'}`, true);
          this.set(`details.${!shouldBlockEntity ? 'blocked' : 'allowed'}`, false);
          this.set('message', message);
          this.set(shouldBlockEntity ? 'blockingComment' : 'allowingComment', '');
        })
        .catch((err) => {
          this.set(
            'errorMessage',
            `Failed to ${shouldBlockEntity ? 'Block' : 'Allow'} Hash: ` +
              (err && (err.detail || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          this.set('isBlockingOrAllowing', false);
          this.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            this.set('message', '');
            this.set('errorMessage', '');
            this.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    }
  }
});
