'use strict';

const fp = require('lodash/fp');

const validateOptions = require('./src/validateOptions');
const createRequestWithDefaults = require('./src/createRequestWithDefaults');
const isolateEndpoint = require('./src/isolateEndpoint');
const addToBlockOrAllowList = require('./src/addToBlockOrAllowList');
const checkAllowAndBlockListsForEntity = require('./src/checkAllowAndBlockListsForEntity');

const { handleError } = require('./src/handleError');
const { getLookupResults } = require('./src/getLookupResults');

let Logger;
let requestWithDefaults;

const startup = (logger) => {
  Logger = logger;
  requestWithDefaults = createRequestWithDefaults(Logger);
};

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');

  let lookupResults;
  try {
    lookupResults = await getLookupResults(
      entities,
      options,
      requestWithDefaults,
      Logger
    );
  } catch (error) {
    Logger.error(error, 'Get Lookup Results Failed');
    return cb(handleError(error));
  }

  Logger.trace({ lookupResults }, 'Lookup Results');
  cb(null, lookupResults);
};

const onDetails = async (lookupObject, options, cb) => {
  Logger.debug({ lookupObject }, 'Lookup Object in onDetails');

  const isSHA256Hash = fp.flow(fp.get('entity.type'), fp.equals('SHA256'))(lookupObject)
  if (isSHA256Hash && options.checkBlockAllowLists) {
    try {
      lookupObject.data.details = await checkAllowAndBlockListsForEntity(
        lookupObject,
        options,
        requestWithDefaults,
        Logger
      );
    } catch (error) {
      Logger.error(error, 'Error with SHA256 in onDetails');
      callback(error, lookupObject.data);
    }
  }

  const endpoints = fp.get('data.details.endpoints', lookupObject);
  if (!isSHA256Hash && fp.size(endpoints) && options.checkIsolationStatus) {
    try {
      lookupObject.data.details.endpoints = await Promise.all(
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
        })
      );
    } catch (error) {
      Logger.error(error, 'Error Checking Isolation Status in onDetails');
      callback(error, lookupObject.data);
    }
  }

  cb(null, lookupObject.data);
};

const getOnMessage = {
  isolateEndpoint,
  addToBlockOrAllowList
};

const onMessage = ({ action, data: actionParams }, options, callback) =>
  getOnMessage[action](actionParams, options, requestWithDefaults, callback, Logger);

module.exports = {
  doLookup,
  startup,
  validateOptions,
  onDetails,
  onMessage
};
