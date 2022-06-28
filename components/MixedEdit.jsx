import React from 'react'
import { Section, FormGroup, FormMessage, Box } from '@adminjs/design-system'

const convertToSubProperty = (property, subProperty) => {
  const [subPropertyPath] = subProperty.name.split('.').slice(-1)
  return {
    ...subProperty,
    path: [property.path, subPropertyPath].join('.'),
  }
}

const MixedEdit = (props) => {
  const { property, record, ItemComponent } = props
  const error = record.errors && record.errors[property.path]
  return (
    <FormGroup error={!!error}>
      <Section {...property.props}>
        <Box flex flexDirection={'row'}>
        {property.subProperties.filter(subProperty => !subProperty.isId).map((subProperty) => {
          const subPropertyWithPath = convertToSubProperty(property, subProperty)
          return (
            <Box flexGrow={1} mx={10} height={60}>
              <ItemComponent
                {...props}
                key={subPropertyWithPath.path}
                property={subPropertyWithPath}
              />
            </Box>    
          )
        })}
        </Box> 
      </Section>
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
  
}

export default MixedEdit
