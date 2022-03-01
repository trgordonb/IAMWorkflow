const adminJs = require('adminjs')
const { buildFeature } = adminJs;
const { postActionHandler, getRecords, saveRecords } = require('./utils');
const { parse } = require('json2csv');
const csv = require('csvtojson');

const jsonExporter = (records) => {
  return JSON.stringify(records.map(r => r.params));
};

const jsonImporter = async (jsonString, resource) => {
  const records = JSON.parse(jsonString);
  return saveRecords(records, resource);
};

const csvExporter = (records) => {
  let cleanRecords = records.map(r => r.params)
  cleanRecords.forEach(record => {
    delete record.__v;
    delete record._id;
  })
  return parse(cleanRecords)
};

const csvImporter = async (csvString, resource) => {
  const records = await csv().fromString(csvString);
  return saveRecords(records, resource);
};

const Parsers = {
  json: { export: jsonExporter, import: jsonImporter },
  csv: { export: csvExporter, import: csvImporter },
};

const exportHandler = async (request, response, context) => {
  const parser = Parsers[request.query?.type ?? 'json'].export;
  const records = await getRecords(context);
  const parsedData = parser(records);
  return {
    exportedData: parsedData,
  };
};

const importHandler = async (request, response, context) => {
  return {};
};

const importExportFeature = () => {
  return buildFeature({
    actions: {
      export: {
        handler: postActionHandler(exportHandler),
        component: adminJs.bundle('./components/ExportComponent'),
        actionType: 'resource',
      },
      import: {
        handler: postActionHandler(importHandler),
        component: adminJs.bundle('./components/ImportComponent'),
        actionType: 'resource',
      },
    },
  });
};

module.exports = importExportFeature;
