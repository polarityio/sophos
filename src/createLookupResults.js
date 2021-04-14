const fp = require('lodash/fp');

const createLookupResults = (foundEntities, options, Logger) => 
  fp.map((foundEntity) =>
    foundEntity.isSha256 ?
      {
        entity: foundEntity.entity,
        data: {
          summary: [],
          details: {
            isSha256: true
          }
        }
      } :
    fp.size(foundEntity.endpoints) ?
      {
        entity: foundEntity.entity,
        data: {
          summary: [],
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
