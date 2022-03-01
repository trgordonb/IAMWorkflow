const { Filter } = require('adminjs')
  
const saveRecords = async ( records, resource) => {
    return Promise.all(
        records.map(async record => {
        try {
            return await resource.create(record);
        } catch (e) {
            console.error(e);
            return e;
        }
    })
)};
  
const postActionHandler = (handler) => async (request, response, context) => {
    if (request.method !== 'post') {
      return {};
    }
  
    return handler(request, response, context);
};
  
const getRecords = async (context) => {
    return context.resource.find(new Filter({}, context.resource), {
      limit: Number.MAX_SAFE_INTEGER,
    });
};
  
module.exports = {
  saveRecords, postActionHandler, getRecords
}