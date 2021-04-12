const fp = require('lodash/fp');

const { ENTITY_DISPLAY_TYPES } = require('./constants');

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
    options,
    entitiesPartition,
    foundEntities,
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
) => {
  const foundEntities = fp.getOr(
    [],
    'body.data',
    await requestWithDefaults({
      //TODO
    })
  );

  return fp.map((foundEntity) => {
    //TODO
  }, foundEntities);
};


module.exports = {
  getLookupResults
};
