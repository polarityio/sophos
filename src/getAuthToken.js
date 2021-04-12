const NodeCache = require('node-cache');
const fp = require('lodash/fp');

const tokenCache = new NodeCache({
  stdTTL:  3500
});

const getAuthToken = async (options, requestWithDefaults) => {
  let sessionToken = tokenCache.get(`${options.clientId}${options.clientSecret}`);

  if (sessionToken) return sessionToken;

  const token = fp.get(
    'body.access_token',
    await requestWithDefaults({
      method: 'POST',
      url: 'https://id.sophos.com/api/v2/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'client_credentials',
        client_id: options.clientId,
        client_secret: options.clientSecret,
        scope: 'token'
      }
    })
  );

  if(!token)
    throw Error("No Auth Token Found")

  tokenCache.set(`${options.clientId}${options.clientSecret}`, token);

  return token;
}

module.exports = getAuthToken;