const adminJs = require('adminjs')
const { buildFeature } = adminJs;
const { postActionHandler, getRecords, saveRecords } = require('./utils');
const { parse } = require('json2csv');
const moment = require('moment')
const csv = require('csvtojson');
const AccountPolicy = require('../../models/account-policy')
const Currency = require('../../models/currency.model')
const Custodian = require('../../models/custodian.model')
const Customer = require('../../models/customer-model')

const jsonExporter = (records) => {
  return JSON.stringify(records.map(r => r.params));
};

const jsonImporter = async (jsonString, resource) => {
  const records = JSON.parse(jsonString);
  return saveRecords(records, resource);
};

const csvExporter = async (records) => {
  let cleanRecords = records.map(r => r.params)
  await Promise.all(cleanRecords.map(async (record) => {
    delete record.__v;
    delete record._id;
    record.NAVDate = moment(record.NAVDate).format('YYYY-MM-DD')
    if (record.hasOwnProperty('accountnumber')) {
      let result = await AccountPolicy.findById(record.accountnumber)
      record.accountnumber = result.number
    }
    if (record.hasOwnProperty('currency')) {
      let result = await Currency.findById(record.currency)
      record.currency = result.name
    }
    if (record.hasOwnProperty('custodian')) {
      let result = await Custodian.findById(record.custodian)
      record.custodian = result.name
    }
    if (record.hasOwnProperty('customer')) {
      let result = await Customer.findById(record.customer)
      record.customer = result.clientId
    }
  }))
  const csvdata = parse(cleanRecords)
  return csvdata
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
  const parsedData = await parser(records);
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
