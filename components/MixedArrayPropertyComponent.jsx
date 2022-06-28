import React, { useMemo } from 'react'
import { BasePropertyComponent } from 'adminjs'
import { edit as ArrayEdit } from 'adminjs/src/frontend/components/property-type/array'
import MixedEdit from './MixedEdit'

const MixedArrayPropertyComponent  = (props) => {
  const { property: baseProperty, where } = props
  const property = useMemo(() => ({
    ...baseProperty,
    path: (baseProperty).path || baseProperty.propertyPath,
  }), [baseProperty])
  const testId = `property-${where}-${property.path}`
  if (baseProperty.isArray) {
    return (
      <ArrayEdit
        {...props}
        property={property}
        ItemComponent={MixedArrayPropertyComponent}
        testId={testId}
      />
    )
  }

  if (baseProperty.type === 'mixed') {
    return (
      <MixedEdit
        {...props}
        property={property}
        ItemComponent={BasePropertyComponent}
        testId={testId}
      />
    )
  }

  return (
    <></>
  )
}

export {
  MixedArrayPropertyComponent as default,
  MixedArrayPropertyComponent,
}
