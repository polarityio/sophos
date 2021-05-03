const fp = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const validateOptions = (options, callback) => {
  const stringOptionsErrorMessages = {
    dataRegionUrl: 'You must provide a valid Data Region Url from your Sophos Account',
    tenantId: 'You must provide a valid Tenant ID from your Sophos Account',
    clientId: 'You must provide a valid Client ID from your Sophos Account',
    clientSecret: 'You must provide a valid Client Secret from your Sophos Account'
  };

  const stringValidationErrors = _validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const urlError = fp.flow(fp.get('dataRegionUrl.value'), fp.endsWith('/'))(options)
    ? [{ key: 'dataRegionUrl', message: 'Your Data Region Url must not end with "/".' }]
    : [];

  const cacheTimeError =
    fp.get('allowBlockListCacheTime.value', options) <= 0
      ? [
          {
            key: 'allowBlockListCacheTime',
            message: 'Allow and Block List Cache Time must be greater than 0'
          }
        ]
      : [];

  callback(null, stringValidationErrors.concat(urlError).concat(cacheTimeError));
};

const _validateStringOptions = (stringOptionsErrorMessages, options, otherErrors = []) =>
  reduce((agg, message, optionName) => {
    const isString = typeof options[optionName].value === 'string';
    const isEmptyString = isString && fp.isEmpty(options[optionName].value);

    return !isString || isEmptyString
      ? agg.concat({
          key: optionName,
          message
        })
      : agg;
  }, otherErrors)(stringOptionsErrorMessages);


module.exports = validateOptions;
