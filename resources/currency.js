const AdminJS = require('adminjs')
const mongoose = require('mongoose')

const CurrencyResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            before: async(request, context) => {
                const { query = {} } = request
                const { sortBy, direction, filters = {} } = AdminJS.flat.unflatten(query || {});
                return request
            }
        },
        edit: {
            showInDrawer: true
        },
        new: {
            showInDrawer: true,
            after: async(request, response, context) => {
                const { record, currentAdmin } = context
                let currencyModel = mongoose.connection.models['Currency']
                let currencyPairModel = mongoose.connection.models['CurrencyPair']
                let allCurrencies = await currencyModel.find()
                await Promise.all(allCurrencies.map(async (currency) => {
                    if (currency._id.toString() !== record.params._id) {
                        let newCurrencyPairRecord1 = {
                            name: `${currency.name}/${record.params.name}`,
                            quote: currency._id.toString(),
                            base: record.params._id,
                            defaultValue: 1
                        }
                        let newCurrencyPairRecord2 = {
                            name: `${record.params.name}/${currency.name}`,
                            quote: record.params._id,
                            base: currency._id.toString(),
                            defaultValue: 1
                        }
                        const newCurrencyPair1 = new currencyPairModel(newCurrencyPairRecord1)
                        const newCurrencyPair2 = new currencyPairModel(newCurrencyPairRecord2)
                        await newCurrencyPair1.save()
                        await newCurrencyPair2.save()
                    } else {
                        let newCurrencyPairRecord = {
                            name: `${currency.name}/${record.params.name}`,
                            quote: currency._id.toString(),
                            base: record.params._id,
                            defaultValue: 1
                        }
                        const newCurrencyPair = new currencyPairModel(newCurrencyPairRecord)
                        await newCurrencyPair.save()
                    }
                }))
                return request
            }
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = CurrencyResource