import React, { FC } from 'react';
import { flat } from 'adminjs';
import {
  FormGroup,
  Label,
  Table as AdminTable,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from '@adminjs/design-system';

const RecordDifference = ({ record, property }) => {
  const differences = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (flat.unflatten(record?.params ?? {}))?.[property.name] ?? {}
  );
  if (!differences) {
    return null;
  }
  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <AdminTable>
        <TableHead>
          <TableCell>Field</TableCell>
          <TableCell>Before</TableCell>
          <TableCell>After</TableCell>
        </TableHead>
        <TableBody>
          {Object.entries(
            differences 
          ).map(([propertyName, { before, after }]) => {
            return (
              <TableRow key={propertyName}>
                <TableCell width={1 / 3}>{propertyName}</TableCell>
                <TableCell color="red" width={1 / 3}>
                  {before ? JSON.stringify(before).replaceAll('"','') : 'undefined'}
                </TableCell>
                <TableCell color="green" width={1 / 3}>
                  {after ? JSON.stringify(after).replaceAll('"','') : 'undefined'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </AdminTable>
    </FormGroup>
  );
};

export default RecordDifference;
