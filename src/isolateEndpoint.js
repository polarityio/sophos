const fp = require('lodash/fp');

const isolateEndpoint = async (
  { endpoint },
  options,
  requestWithDefaults,
  callback,
  Logger
) => {
  try {
    const isolationUrl = `${options.dataRegionUrl}/endpoint/v1/endpoints/${endpoint.id}/isolation`;

    if (!options.checkIsolationStatus) {
      const isIsolated = fp.get(
        'body.enabled',
        await requestWithDefaults({ method: 'GET', url: isolationUrl, options })
      );

      if (isIsolated) return callback(null, { message: 'Endpoint is Already Isolated!' });
    }

    await requestWithDefaults({
      method: 'PATCH',
      url: isolationUrl,
      body: JSON.stringify({
        enabled: true,
        comment: endpoint.isolationComment
      }),
      options
    });

    return callback(null, { message: 'Endpoint Isolation Successful.' });
  } catch (error) {
    Logger.error(error, 'Error Isolating Endpoint');
    return callback({
      errors: [
        {
          err: error,
          detail:
            error.message === 'BadRequest'
              ? 'This Endpoint is either already isolated or currently being removed From isolation.'
              : error.message
        }
      ]
    });
  }
};

module.exports = isolateEndpoint;
