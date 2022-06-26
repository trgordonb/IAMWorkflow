const PartyResource = {
    id: 'Party',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        name: {
            isVisible: true,
            posiiton: 1
        },
        type: {
            isVisible: true,
            position: 2
        },
        isFeeRecipient: {
            isVisible: true,
            position: 3
        },
        description: {
            isVisible: true,
            position: 4
        }
    },
    actions: {
        new: {
            showInDrawer: true
        },
        edit: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        },
        findbytype: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                const records = await resource.MongooseModel.find({
                    type: request.payload.type,
                })
                return records.length > 0 ? records: []
            }
        }
    }
}

module.exports = PartyResource