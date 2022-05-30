const AdminJS = require('adminjs')

const bundleComponents = () => {
  return {
    RECORD_DIFFERENCE: AdminJS.bundle('../../components/RecordDifference.jsx'),
    RECORD_LINK: AdminJS.bundle('../../components/RecordLink.jsx'),
  };
};

module.exports = bundleComponents