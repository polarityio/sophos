const fp = require('lodash/fp');

const addToBlockOrAllowList = async (
  { entity, shouldBlockEntity, blocked, allowed, foundSha256, comment },
  options,
  requestWithDefaults,
  callback,
  Logger
) => {
  try {
    const listBaseUrl = `${options.dataRegionUrl}/endpoint/v1/settings`;

    if (blocked || allowed) {
      await requestWithDefaults({
        method: 'DELETE',
        url: `${listBaseUrl}/${!shouldBlockEntity ? 'blocked' : 'allowed'}-items/${foundSha256.id}`,
        options
      });
    }

    const _foundSha256 = fp.get(
      'body',
      await requestWithDefaults({
        method: 'POST',
        url: `${listBaseUrl}/${shouldBlockEntity ? 'blocked' : 'allowed'}-items`,
        body: {
          type: 'sha256',
          properties: {
            sha256: entity.value
          },
          comment
        },
        options
      })
    );

    return callback(null, {
      message: 'Added to List Successfully',
      foundSha256: _foundSha256
    });
  } catch (error) {
    Logger.error(error, 'Error Adding Entity to Allow or Block List');
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

module.exports = addToBlockOrAllowList;
