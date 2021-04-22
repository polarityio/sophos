const fp = require('lodash/fp');

const getEndpointsIsolation = async (
  lookupObject,
  options,
  requestWithDefaults,
  Logger
) =>
  Promise.all(
    fp.map(async (endpoint) => {
      const isIsolated = fp.get(
        'body.enabled',
        await requestWithDefaults({
          method: 'GET',
          url: `${options.dataRegionUrl}/endpoint/v1/endpoints/${endpoint.id}/isolation`,
          options
        })
      );

      return { ...endpoint, isIsolated };
    }, fp.get('data.details.endpoints', lookupObject))
  );

module.exports = getEndpointsIsolation;
