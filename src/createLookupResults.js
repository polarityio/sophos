const fp = require('lodash/fp');

const createLookupResults = (foundEntities, options, Logger) =>
  fp.map(
    (foundEntity) =>
      foundEntity.isSha256 ?
        {
          entity: foundEntity.entity,
          data: {
            summary: ["Click to Search Allow/Block Lists"],
            details: {
              isSha256: true
            }
          }
        } : 
      fp.size(foundEntity.endpoints) ?
        {
          entity: foundEntity.entity,
          data: {
            summary: [
              `Health: ${fp.flow(
                fp.get('endpoints'),
                fp.map(fp.flow(fp.get('health.overall'), fp.capitalize)),
                fp.uniq,
                fp.join(', ')
              )(foundEntity)}`
            ],
            details: {
              endpoints: foundEntity.endpoints
            }
          }
        } :
        {
          entity: foundEntity.entity,
          data: null
        },
    foundEntities
  );


module.exports = createLookupResults;
