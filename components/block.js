polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  init() {
    this._super(...arguments);
  },
  actions: {
    
  }
});
