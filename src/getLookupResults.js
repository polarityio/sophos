const fp = require('lodash/fp');
const NodeCache = require('node-cache');

const { splitOutIgnoredIps } = require('./dataTransformations');
const createLookupResults = require('./createLookupResults');

const getLookupResults = async (entities, options, requestWithDefaults, Logger) => {
  const { entitiesPartition, ignoredIpLookupResults } = splitOutIgnoredIps(entities);

  const foundEntities = await _getFoundEntities(
    entitiesPartition,
    options,
    requestWithDefaults,
    Logger
  );

  const lookupResults = createLookupResults(
    foundEntities,
    options,
    Logger
  );

  Logger.trace({ lookupResults, foundEntities }, 'Lookup Results');

  return lookupResults.concat(ignoredIpLookupResults);
};


const _getFoundEntities = async (
  entitiesPartition,
  options,
  requestWithDefaults,
  Logger
) =>
//TODO: add throttling later
  Promise.all(
    fp.map(async (entity) => {
      if (entity.isSHA256) return { entity, isSha256: true };

      return {
        entity,
        endpoints: fp.get(
          'body.items',
          await requestWithDefaults({
            method: 'GET',
            url: `${options.dataRegionUrl}/endpoint/v1/endpoints`,
            qs: {
              search: entity.value
            },
            options
          })
        )
      };
    }, entitiesPartition)
  );


module.exports = {
  getLookupResults
};
