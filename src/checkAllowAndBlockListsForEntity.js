const fp = require('lodash/fp');
const NodeCache = require('node-cache');

const allowAndBlockListsCache = new NodeCache({
  stdTTL: 300
});

const checkAllowAndBlockListsForEntity = async (
  lookupObject,
  options,
  requestWithDefaults,
  Logger
) => {
  const cachedBlockList = allowAndBlockListsCache.get('blockList');

  let blockList;
  if (fp.size(cachedBlockList)) {
    blockList = cachedBlockList;
  } else {
    blockList = fp.get(
      'body.items',
      await requestWithDefaults({
        method: 'GET',
        url: `${options.dataRegionUrl}/endpoint/v1/settings/blocked-items`,
        options
      })
    );

    if (blockList.length) {
      allowAndBlockListsCache.set(
        'blockList',
        blockList,
        options.allowBlockListCacheTime * 60
      );
    }
  }

  const cachedAllowList = allowAndBlockListsCache.get('allowList');

  let allowList;
  if (fp.size(cachedBlockList)) {
    allowList = cachedAllowList;
  } else {
    allowList = fp.get(
      'body.items',
      await requestWithDefaults({
        method: 'GET',
        url: `${options.dataRegionUrl}/endpoint/v1/settings/allowed-items`,
        options
      })
    );

    if (allowList.length) {
      allowAndBlockListsCache.set(
        'allowList',
        allowList,
        options.allowBlockListCacheTime * 60
      );
    }
  }

  const entityFoundInBlockList = fp.find(
    (item) => fp.get('properties.sha256', item) === fp.get('entity.value', lookupObject),
    blockList
  );

  const entityFoundInAllowList = fp.find(
    (item) => fp.get('properties.sha256', item) === fp.get('entity.value', lookupObject),
    allowList
  );

  return {
    ...lookupObject.data.details,
    foundSha256: entityFoundInBlockList || entityFoundInAllowList,
    blocked: !!entityFoundInBlockList,
    allowed: !!entityFoundInAllowList
  };
};

module.exports = checkAllowAndBlockListsForEntity;
