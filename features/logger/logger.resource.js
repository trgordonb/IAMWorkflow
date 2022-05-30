const bundleComponents = require('./bundle')
const getLogPropertyName  = require('./get-log-property-name')
const { RECORD_DIFFERENCE, RECORD_LINK } = bundleComponents();

const createLoggerResource = ({resource, featureOptions}) => {
  const { propertiesMapping = {}, resourceName } = featureOptions ?? {};

  return {
    resource,
    options: {
      id: resourceName,
      sort: {
        direction: 'desc',
        sortBy: getLogPropertyName('createdAt', propertiesMapping),
      },
      listProperties: [
        getLogPropertyName('user', propertiesMapping),
        getLogPropertyName('resource', propertiesMapping),
        getLogPropertyName('action', propertiesMapping),
        getLogPropertyName('createdAt', propertiesMapping),
      ],
      actions: {
        edit: { isAccessible: false },
        new: { isAccessible: false },
        delete: { isAccessible: false },
        show: {
          showInDrawer: true,
          containerWidth: '700px',
        },
      },
      properties: {
        _id: {
            isVisible: { list: false, filter: false },
        },
        [getLogPropertyName('difference', propertiesMapping)]: {
          components: {
            show: RECORD_DIFFERENCE,
          },
          position: 110,
        },
        [getLogPropertyName('recordId', propertiesMapping)]: {
          components: {
            list: RECORD_LINK,
            show: RECORD_LINK,
          },
        },
        [getLogPropertyName('recordTitle', propertiesMapping)]: {
            isVisible: false
        },
        [getLogPropertyName('updatedAt', propertiesMapping)]: {
          isVisible: false,
        },
      },
    },
  };
};

module.exports = createLoggerResource