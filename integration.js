'use strict';

const fp = require('lodash/fp');

const validateOptions = require('./src/validateOptions');
const createRequestWithDefaults = require('./src/createRequestWithDefaults');
const isolateEndpoint = require('./src/isolateEndpoint');
const addToBlockOrAllowList = require('./src/addToBlockOrAllowList');
const checkAllowAndBlockListsForEntity = require('./src/checkAllowAndBlockListsForEntity');
const getEndpointsIsolation = require('./src/getEndpointsIsolation');

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

const onDetails = async (lookupObject, options, callback) => {
  Logger.debug({ lookupObject }, 'Lookup Object in onDetails');

  const isSHA256Hash = fp.flow(
    fp.get('entity.subtype'),
    fp.equals('SHA256')
  )(lookupObject);
  if (isSHA256Hash && options.checkBlockAllowLists) {
    try {
      lookupObject.data = await checkAllowAndBlockListsForEntity(
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
      lookupObject.data.details.endpoints = await getEndpointsIsolation(
        lookupObject,
        options,
        requestWithDefaults,
        Logger
      );
      
      const anyEndpointsAreIsolated = fp.flow(
        fp.get('data.details.endpoints'),
        fp.some(fp.get('isIsolated'))
      )(lookupObject);
        
      if (anyEndpointsAreIsolated) {
        lookupObject.data.summary = [
          ...fp.get('data.summary', lookupObject),
          'Isolated Endpoint Found'
        ];
      }
    } catch (error) {
      Logger.error(error, 'Error Checking Isolation Status in onDetails');
      callback(error, lookupObject.data);
    }
  }

  callback(null, lookupObject.data);
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
