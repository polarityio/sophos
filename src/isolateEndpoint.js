const isolateEndpoint = async (
  { endpoint, comment },
  options,
  requestWithDefaults,
  callback,
  Logger
) => {
  try {
    const isolationUrl = `${options.dataRegionUrl}/endpoint/v1/endpoints/${endpoint.id}/isolation`;
    
    const isolatedEndpoint = { ...endpoint, isIsolated: true };

    if (!options.checkIsolationStatus) {
      const isIsolated = fp.get(
        'body.enabled',
        await requestWithDefaults({ method: 'GET', url: isolationUrl, options })
      );

      if (isIsolated)
        return callback(null, {
          isolatedEndpoint,
          message: 'Endpoint is Already Isolated!'
        });
    }

    await requestWithDefaults({
      method: 'PATCH',
      url: isolationUrl,
      body: {
        enabled: true,
        comment
      },
      options
    });

    return callback(null, {
      isolatedEndpoint,
      message: 'Endpoint Isolation Successful.'
    });
  } catch (error) {
    Logger.error(error, 'Error Isolating Endpoint');
    return callback({
      errors: [
        {
          err: error,
          detail: error.message
        }
      ]
    });
  }
};

module.exports = isolateEndpoint;
