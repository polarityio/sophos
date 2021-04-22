polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  isolationComments: {},
  isolateMessage: '',
  isolateErrorMessage: '',
  isolateIsRunning: false,
  endpointServiceDetailsExpansionMap: {},
  init() {
    this._super(...arguments);
  },
  actions: {
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
      this.set(
        `details.endpoints.${index}.isolationComment`,
        e.target.value
      );
    },
    isolateEndpoint: function (index) {
      this.set('isolateMessage', '');
      this.set('isolateErrorMessage', '');
      this.set('isolateIsRunning', true);
      this.get('block').notifyPropertyChange('data');
      
      this
        .sendIntegrationMessage({
          action: 'isolateEndpoint',
          data: {
            endpoint: this.get('details.endpoints')[index]
          }
        })
        .then(({ message }) => {
          this.set(`details.endpoints.${index}.isIsolated`, true)
          this.set('isolateMessage', message);
        })
        .catch((err) => {
          this.set(
            'isolateErrorMessage',
            'Failed to Isolate Endpoint: ' +
              (err && (err.detail || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          this.set('isolateIsRunning', false);
          this.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            this.set('isolateMessage', '');
            this.set('isolateErrorMessage', '');
            this.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    }
  }
});
