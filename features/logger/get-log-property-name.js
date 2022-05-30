const getLogPropertyName = (property, mapping = {}) => {
  if (!mapping[property]) return property;
  return mapping[property];
}

module.exports = getLogPropertyName