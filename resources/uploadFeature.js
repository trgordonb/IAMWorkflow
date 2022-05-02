const uploadFeature = require('@adminjs/upload')

module.exports = {
    features: [uploadFeature({
        provider: { 
            aws: { 
                accessKeyId: 'AKIASBW4SP23LL6RA6PF',
                secretAccessKey: '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',
                region: 'us-east-1',
                bucket: 'iamlegacy',
                expires: 0
            }
        },
        properties: {
            key: 'fileUrl',
        },
    })],
}